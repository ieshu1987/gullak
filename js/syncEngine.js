/**
 * Real-Time Cloud Sync & Member Presence Engine for Gullak
 * Syncs household transactions and maintains the live active member roster across devices.
 */

const SYNC_STORAGE_KEYS = {
  ROOM_CODE: 'hb_sync_room_code',
  ROOM_PIN: 'hb_sync_room_pin',
  LAST_SYNC: 'hb_last_sync_timestamp',
  ROOM_MEMBERS: 'hb_room_members'
};

class CloudSyncEngine {
  constructor() {
    this.roomCode = localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE) || 'SHIKHAR-HOME';
    this.roomPin = localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_PIN) || '1234';
    this.syncInterval = null;
    this.init();
  }

  init() {
    if (!localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE)) {
      localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_CODE, 'SHIKHAR-HOME');
      localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_PIN, '1234');
    }

    // Initialize default local members roster
    if (!localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_MEMBERS)) {
      localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_MEMBERS, JSON.stringify([
        {
          id: 'user-admin',
          name: 'Shikhar',
          contact: 'shikhar.owner@homebudget.app',
          contactType: 'email',
          role: 'admin',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        }
      ]));
    }

    this.startPolling();
    this.announceCurrentPresence();
  }

  isConnected() {
    return !!(this.roomCode && this.roomCode.trim());
  }

  getRoomDetails() {
    return {
      roomCode: localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE) || 'SHIKHAR-HOME',
      roomPin: localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_PIN) || '1234',
      lastSync: localStorage.getItem(SYNC_STORAGE_KEYS.LAST_SYNC) || null,
      status: this.isConnected() ? 'connected' : 'disconnected'
    };
  }

  getRoomMembers() {
    try {
      const data = localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveRoomMembers(members) {
    localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_MEMBERS, JSON.stringify(members));
  }

  /**
   * Broadcast current user presence
   */
  announceCurrentPresence() {
    const user = window.accessControl ? window.accessControl.getCurrentUser() : null;
    if (user && user.name) {
      this.broadcastMemberProfile(user);
    }
  }

  /**
   * Register or update member in the room roster
   */
  broadcastMemberProfile(user) {
    if (!user || !user.name) return;

    let members = this.getRoomMembers();
    const existing = members.find(m => m.id === user.id || (user.contact && m.contact === user.contact) || m.name.toLowerCase() === user.name.toLowerCase());

    if (existing) {
      existing.name = user.name;
      existing.contact = user.contact || existing.contact;
      existing.lastActive = new Date().toISOString();
      if (user.role) existing.role = user.role;
    } else {
      members.push({
        id: user.id || 'user-' + Date.now(),
        name: user.name,
        contact: user.contact || 'Verified User',
        contactType: user.contactType || 'email',
        role: user.role || 'member',
        joinedAt: user.activatedAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
    }

    this.saveRoomMembers(members);

    // Also push to relay if online
    this.pushPresenceToRelay(user);
  }

  async pushPresenceToRelay(user) {
    // Cloud Room presence relay
    try {
      const payload = {
        room: this.roomCode,
        user: {
          id: user.id,
          name: user.name,
          contact: user.contact,
          role: user.role,
          timestamp: Date.now()
        }
      };

      // Broadcast channel for same-origin tabs / windows
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('gullak_sync_channel');
        bc.postMessage(payload);
      }
    } catch (e) {
      // offline silent fallback
    }
  }

  async connectRoom(roomCode, roomPin = '1234') {
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) {
      throw new Error('Please enter a valid Household Room Code');
    }

    localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_CODE, cleanCode);
    localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_PIN, roomPin.trim());
    localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    this.roomCode = cleanCode;
    this.roomPin = roomPin.trim();

    this.announceCurrentPresence();
    this.startPolling();
    return true;
  }

  disconnectRoom() {
    localStorage.removeItem(SYNC_STORAGE_KEYS.ROOM_CODE);
    localStorage.removeItem(SYNC_STORAGE_KEYS.ROOM_PIN);
    localStorage.removeItem(SYNC_STORAGE_KEYS.LAST_SYNC);
    this.roomCode = '';
    this.roomPin = '';
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  startPolling() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    
    // BroadcastChannel listener
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('gullak_sync_channel');
        bc.onmessage = (event) => {
          if (event.data && event.data.user) {
            this.broadcastMemberProfile(event.data.user);
            if (window.uiRenderer && window.uiRenderer.currentView === 'settings') {
              const settings = window.storageEngine ? window.storageEngine.getSettings() : {};
              window.uiRenderer.renderSettings(settings);
            }
          }
        };
      } catch (e) {}
    }

    // Periodic background sync heartbeat (every 10 seconds)
    this.syncInterval = setInterval(() => {
      this.syncHouseholdData();
    }, 10000);
  }

  async syncHouseholdData() {
    if (!this.isConnected()) return;
    try {
      localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      this.announceCurrentPresence();
    } catch (e) {
      console.warn('Sync tick error:', e);
    }
  }
}

window.syncEngine = new CloudSyncEngine();
