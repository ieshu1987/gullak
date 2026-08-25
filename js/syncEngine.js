/**
 * Ultra-Light Real-Time Multi-Device Sync & Live Roster Engine for Gullak
 * Connects family devices seamlessly over the web using zero-config real-time SSE relay.
 */

const SYNC_STORAGE_KEYS = {
  ROOM_CODE: 'hb_sync_room_code',
  ROOM_PIN: 'hb_sync_room_pin',
  LAST_SYNC: 'hb_last_sync_timestamp',
  ROOM_MEMBERS: 'hb_room_members',
  DEVICE_ID: 'hb_device_id'
};

class CloudSyncEngine {
  constructor() {
    this.roomCode = localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE) || 'SHIKHAR-HOME';
    this.roomPin = localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_PIN) || '1234';
    
    // Unique identifier for this specific phone/device
    let devId = localStorage.getItem(SYNC_STORAGE_KEYS.DEVICE_ID);
    if (!devId) {
      devId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem(SYNC_STORAGE_KEYS.DEVICE_ID, devId);
    }
    this.deviceId = devId;

    this.eventSource = null;
    this.heartbeatTimer = null;
    this.isBroadcasting = false;

    this.init();
  }

  init() {
    if (!localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE)) {
      localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_CODE, 'SHIKHAR-HOME');
      localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_PIN, '1234');
    }

    // Initialize local members roster
    const currentMembers = this.getRoomMembers();
    const user = window.accessControl ? window.accessControl.getCurrentUser() : null;

    if (currentMembers.length === 0 && user && user.name) {
      this.saveRoomMembers([
        {
          id: user.id || 'user-admin',
          name: user.name,
          contact: user.contact || 'Device Owner',
          contactType: user.contactType || 'email',
          role: user.role || 'admin',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        }
      ]);
    }

    // Connect real-time web stream
    this.connectRealtimeStream();

    // Broadcast presence on startup after slight delay for other modules to initialize
    setTimeout(() => {
      this.broadcastPresence({ isReply: false });
    }, 800);

    // Heartbeat every 60 seconds (ultra lightweight, no CPU strain)
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.broadcastPresence({ isReply: true });
    }, 60000);
  }

  getTopic() {
    const code = (this.roomCode || 'SHIKHAR-HOME').trim().toUpperCase();
    const pin = (this.roomPin || '1234').trim();
    // Deterministic URL-safe topic
    let hash = 0;
    const str = `${code}__${pin}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return `gullak_${code.replace(/[^A-Z0-9]/gi, '').toLowerCase()}_${Math.abs(hash).toString(36)}`;
  }

  connectRealtimeStream() {
    if (this.eventSource) {
      try { this.eventSource.close(); } catch (e) {}
      this.eventSource = null;
    }

    const topic = this.getTopic();
    try {
      this.eventSource = new EventSource(`https://ntfy.sh/${topic}/sse`);
      
      this.eventSource.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw && raw.message) {
            const payload = JSON.parse(raw.message);
            // Ignore messages from this own phone
            if (payload.deviceId === this.deviceId) return;
            this.handleIncomingSync(payload);
          }
        } catch (err) {
          // Ignore unparseable or ping frames
        }
      };

      this.eventSource.onerror = () => {
        // EventSource auto-reconnects in background without freezing
      };
    } catch (e) {
      console.warn('Realtime sync connection info:', e);
    }
  }

  handleIncomingSync(payload) {
    if (!payload) return;
    let needsRerender = false;

    // 1. Sync Remote Member into Local Roster
    if (payload.user && payload.user.name) {
      let members = this.getRoomMembers();
      const existingIdx = members.findIndex(m => 
        (payload.user.id && m.id === payload.user.id) ||
        (payload.user.contact && m.contact === payload.user.contact) ||
        m.name.toLowerCase().trim() === payload.user.name.toLowerCase().trim()
      );

      const remoteMember = {
        id: payload.user.id || 'user-' + Date.now(),
        name: payload.user.name,
        contact: payload.user.contact || 'Verified User',
        contactType: payload.user.contactType || 'email',
        role: payload.user.role || 'member',
        joinedAt: payload.user.joinedAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        members[existingIdx] = { ...members[existingIdx], ...remoteMember };
      } else {
        members.push(remoteMember);
      }

      this.saveRoomMembers(members);
      needsRerender = true;

      // If this was an initial announcement (not a reply), send back our presence
      if (!payload.isReply) {
        this.broadcastPresence({ isReply: true });
      }
    }

    // 2. Sync Shared Household Transactions
    if (payload.householdTransactions && Array.isArray(payload.householdTransactions)) {
      if (window.storageEngine && typeof window.storageEngine.mergeHouseholdTransactions === 'function') {
        const added = window.storageEngine.mergeHouseholdTransactions(payload.householdTransactions);
        if (added > 0) {
          needsRerender = true;
        }
      }
    }

    // Update UI smoothly
    if (needsRerender && window.uiRenderer) {
      if (window.uiRenderer.currentView === 'settings') {
        const settings = window.storageEngine ? window.storageEngine.getSettings() : {};
        window.uiRenderer.renderSettings(settings);
      } else {
        window.uiRenderer.render();
      }
    }
  }

  async broadcastPresence(options = {}) {
    if (this.isBroadcasting) return;
    this.isBroadcasting = true;

    try {
      const user = window.accessControl ? window.accessControl.getCurrentUser() : null;
      if (!user || !user.name) {
        this.isBroadcasting = false;
        return;
      }

      // Keep self active in local roster
      let members = this.getRoomMembers();
      const selfIdx = members.findIndex(m => 
        (user.id && m.id === user.id) || 
        m.name.toLowerCase().trim() === user.name.toLowerCase().trim()
      );

      const selfEntry = {
        id: user.id || 'user-' + Date.now(),
        name: user.name,
        contact: user.contact || '',
        contactType: user.contactType || 'email',
        role: user.role || 'member',
        joinedAt: user.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      if (selfIdx !== -1) {
        members[selfIdx] = { ...members[selfIdx], ...selfEntry };
      } else {
        members.unshift(selfEntry);
      }
      this.saveRoomMembers(members);

      // Publish to cloud room topic
      const topic = this.getTopic();
      const householdTx = (window.storageEngine ? window.storageEngine.getTransactions('household') : []).slice(0, 80);

      const payload = {
        deviceId: this.deviceId,
        isReply: !!options.isReply,
        user: selfEntry,
        householdTransactions: householdTx,
        timestamp: Date.now()
      };

      await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      // offline silent fallback
    } finally {
      this.isBroadcasting = false;
    }
  }

  async connectRoom(roomCode, roomPin = '1234') {
    const cleanCode = (roomCode || '').trim().toUpperCase();
    if (!cleanCode) {
      throw new Error('Please enter a valid Household Room Code');
    }

    localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_CODE, cleanCode);
    localStorage.setItem(SYNC_STORAGE_KEYS.ROOM_PIN, roomPin.trim());
    localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    this.roomCode = cleanCode;
    this.roomPin = roomPin.trim();

    this.connectRealtimeStream();
    await this.broadcastPresence({ isReply: false });
    return true;
  }

  getRoomDetails() {
    return {
      roomCode: localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_CODE) || 'SHIKHAR-HOME',
      roomPin: localStorage.getItem(SYNC_STORAGE_KEYS.ROOM_PIN) || '1234',
      lastSync: localStorage.getItem(SYNC_STORAGE_KEYS.LAST_SYNC) || null,
      status: 'connected'
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
}

window.syncEngine = new CloudSyncEngine();
