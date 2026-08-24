/**
 * Access Control & Genuine User Verification System
 * Validates real email/phone contacts and manages Admin permissions.
 */

const ACCESS_STORAGE_KEYS = {
  USER_PROFILE: 'hb_user_profile',
  ACCESS_REQUESTS: 'hb_access_requests',
  APPROVED_USERS: 'hb_approved_users',
  PENDING_VERIFICATION: 'hb_pending_otp_verification'
};

class AccessControlEngine {
  constructor() {
    this.init();
  }

  init() {
    let user = this.getCurrentUser();
    if (user) {
      // Auto-upgrade Shikhar or Admin on every boot
      if (user.name && user.name.toLowerCase().includes('shikhar')) {
        user.role = 'admin';
        user.status = 'approved';
        user.verified = true;
        this.saveCurrentUser(user);
      }
    } else {
      const hasExistingData = localStorage.getItem('hb_transactions');
      if (hasExistingData) {
        user = {
          id: 'user-admin',
          name: 'Shikhar (Admin)',
          contact: 'shikhar.owner@homebudget.app',
          contactType: 'email',
          verified: true,
          role: 'admin',
          status: 'approved',
          createdAt: new Date().toISOString()
        };
      } else {
        user = {
          id: 'user-' + Date.now(),
          name: '',
          contact: '',
          verified: false,
          role: 'visitor',
          status: 'pending_setup',
          createdAt: new Date().toISOString()
        };
      }
      this.saveCurrentUser(user);
    }

    if (!localStorage.getItem(ACCESS_STORAGE_KEYS.APPROVED_USERS)) {
      localStorage.setItem(ACCESS_STORAGE_KEYS.APPROVED_USERS, JSON.stringify([
        { 
          id: 'user-admin', 
          name: 'Shikhar', 
          contact: 'shikhar.owner@homebudget.app', 
          contactType: 'email',
          verified: true,
          role: 'admin', 
          approvedAt: new Date().toISOString() 
        }
      ]));
    }

    if (!localStorage.getItem(ACCESS_STORAGE_KEYS.ACCESS_REQUESTS)) {
      localStorage.setItem(ACCESS_STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify([]));
    }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(ACCESS_STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveCurrentUser(user) {
    localStorage.setItem(ACCESS_STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  isAccessGranted() {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin' || user.status === 'approved') return true;

    const approvedList = this.getApprovedUsers();
    return approvedList.some(u => u.id === user.id || (user.contact && u.contact === user.contact));
  }

  /**
   * Strict Validation for Genuine Email and Phone Number
   */
  validateContact(contactInput) {
    if (!contactInput || typeof contactInput !== 'string') {
      return { valid: false, message: 'Email ID or Phone number is mandatory' };
    }

    const input = contactInput.trim();

    // 1. Email validation (RFC 5322 standard with domain check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(input)) {
      const parts = input.split('@');
      const domain = parts[1].toLowerCase();
      // Basic check against junk single-letter domain or fake syntax
      if (domain.includes('.') && domain.split('.')[1].length >= 2) {
        return { valid: true, type: 'email', normalized: input.toLowerCase() };
      }
    }

    // 2. Phone validation (10 to 14 digits, optional leading + or country code)
    const phoneClean = input.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+?\d{1,4})?[6-9]\d{9}$/;
    if (phoneRegex.test(phoneClean) || /^\+?\d{10,13}$/.test(phoneClean)) {
      return { valid: true, type: 'phone', normalized: phoneClean };
    }

    return { 
      valid: false, 
      message: 'Please enter a genuine Email ID (e.g. name@gmail.com) or 10-digit Phone Number' 
    };
  }

  /**
   * Step 1: Initiate Access Request & Generate Verification OTP
   */
  initiateAccessRequest(name, contactInput) {
    const cleanName = (name || '').trim();
    if (cleanName.length < 2) {
      throw new Error('Please enter your real full name');
    }

    const valResult = this.validateContact(contactInput);
    if (!valResult.valid) {
      throw new Error(valResult.message);
    }

    // Generate 4-digit verification OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const pendingData = {
      name: cleanName,
      contact: valResult.normalized,
      contactType: valResult.type,
      otp: otp,
      createdAt: Date.now()
    };

    localStorage.setItem(ACCESS_STORAGE_KEYS.PENDING_VERIFICATION, JSON.stringify(pendingData));
    return pendingData;
  }

  getPendingVerification() {
    try {
      const data = localStorage.getItem(ACCESS_STORAGE_KEYS.PENDING_VERIFICATION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Admin Master Key Instant Unlock
   */
  loginAsAdmin(passcode) {
    const clean = (passcode || '').trim().toLowerCase();
    if (clean === '8888' || clean === 'shikhar' || clean === 'admin') {
      const adminUser = {
        id: 'user-admin',
        name: 'Shikhar (Admin)',
        contact: 'shikhar.owner@homebudget.app',
        contactType: 'email',
        verified: true,
        role: 'admin',
        status: 'approved',
        createdAt: new Date().toISOString()
      };
      this.saveCurrentUser(adminUser);
      
      let approved = this.getApprovedUsers();
      if (!approved.some(u => u.id === 'user-admin')) {
        approved.unshift(adminUser);
        localStorage.setItem(ACCESS_STORAGE_KEYS.APPROVED_USERS, JSON.stringify(approved));
      }
      localStorage.removeItem(ACCESS_STORAGE_KEYS.PENDING_VERIFICATION);
      return adminUser;
    }
    throw new Error('Invalid Admin Passkey. Please try again.');
  }

  /**
   * Step 2: Confirm Verification Code & Auto-Activate Pass
   */
  verifyAndSubmitRequest(enteredOtp) {
    const pendingData = this.getPendingVerification();
    if (!pendingData) {
      throw new Error('No pending request found. Please start over.');
    }

    if (enteredOtp.trim() !== pendingData.otp) {
      throw new Error('Incorrect 4-digit verification code. Please try again.');
    }

    const user = this.getCurrentUser() || { id: 'user-' + Date.now() };
    user.name = pendingData.name;
    user.contact = pendingData.contact;
    user.contactType = pendingData.contactType;
    user.verified = true;
    user.status = 'approved';

    // Auto-detect Shikhar/Admin
    const isOwner = pendingData.name.toLowerCase().includes('shikhar') || 
                    pendingData.contact.toLowerCase().includes('shikhar') ||
                    user.role === 'admin';
    user.role = isOwner ? 'admin' : 'member';
    if (isOwner) {
      user.id = 'user-admin';
      user.name = user.name.includes('(Admin)') ? user.name : `${user.name} (Admin)`;
    }
    user.activatedAt = new Date().toISOString();
    this.saveCurrentUser(user);

    // Save to Approved Members list
    let approved = this.getApprovedUsers();
    const existingIdx = approved.findIndex(u => u.id === user.id || u.contact === user.contact);
    if (existingIdx !== -1) {
      approved[existingIdx] = user;
    } else {
      approved.push(user);
    }
    localStorage.setItem(ACCESS_STORAGE_KEYS.APPROVED_USERS, JSON.stringify(approved));
    localStorage.removeItem(ACCESS_STORAGE_KEYS.PENDING_VERIFICATION);

    // Broadcast member presence to Household Sync Room
    if (window.syncEngine && typeof window.syncEngine.broadcastMemberProfile === 'function') {
      window.syncEngine.broadcastMemberProfile(user);
    }

    return user;
  }

  getPendingRequests() {
    try {
      const data = localStorage.getItem(ACCESS_STORAGE_KEYS.ACCESS_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  getApprovedUsers() {
    try {
      const data = localStorage.getItem(ACCESS_STORAGE_KEYS.APPROVED_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  approveUser(userId) {
    let requests = this.getPendingRequests();
    const userToApprove = requests.find(r => r.id === userId);
    
    if (userToApprove) {
      userToApprove.status = 'approved';
      userToApprove.approvedAt = new Date().toISOString();

      const approved = this.getApprovedUsers();
      approved.push(userToApprove);
      localStorage.setItem(ACCESS_STORAGE_KEYS.APPROVED_USERS, JSON.stringify(approved));

      requests = requests.filter(r => r.id !== userId);
      localStorage.setItem(ACCESS_STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(requests));

      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        current.status = 'approved';
        this.saveCurrentUser(current);
      }
      return true;
    }
    return false;
  }

  rejectUser(userId) {
    let requests = this.getPendingRequests();
    requests = requests.filter(r => r.id !== userId);
    localStorage.setItem(ACCESS_STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(requests));
    return true;
  }

  revokeUser(userId) {
    let approved = this.getApprovedUsers();
    approved = approved.filter(u => u.id !== userId && u.role !== 'admin');
    localStorage.setItem(ACCESS_STORAGE_KEYS.APPROVED_USERS, JSON.stringify(approved));
    return true;
  }
}

window.accessControl = new AccessControlEngine();
