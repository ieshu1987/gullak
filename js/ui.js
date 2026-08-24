/**
 * UI Renderer & View Controller for Household Budget Tracker
 * Features: Dual-Space Budgeting, Planned Items Hub, WhatsApp Checklist Sharing, and Verified Access Control.
 */

// SVG Icons
const ICONS = {
  'home': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  'user': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'shopping-bag': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  'truck': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>',
  'activity': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  'smile': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>',
  'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  'zap': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  'dollar-sign': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  'plus-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
  'pie-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  'sliders': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>',
  'list': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
  'settings': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  'arrow-up-right': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
  'arrow-down-left': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="17" x2="7" y1="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>',
  'trash': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  'check': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  'whatsapp': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>',
  'repeat': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  'shield-check': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  'calendar-check': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>'
};

function getIcon(name) {
  return ICONS[name] || ICONS['dollar-sign'];
}

function formatMoney(amount, currency = '$') {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return '';
  const [y, m] = monthStr.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

class UIRenderer {
  constructor() {
    this.currentView = 'dashboard';
    this.selectedMonth = new Date().toISOString().slice(0, 7);
    this.currentEditingTxId = null;
    this.currentEditingPlanId = null;
    this.plannedFilter = 'all';
    this.init();
  }

  init() {
    const settings = window.storageEngine.getSettings();
    this.selectedMonth = settings.monthFilter || new Date().toISOString().slice(0, 7);
    this.applyTheme(settings.theme || 'dark');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconSvg = ICONS['check'];
    if (type === 'error') iconSvg = ICONS['alert-circle'];
    if (type === 'info') iconSvg = ICONS['dollar-sign'];

    toast.innerHTML = `<span>${iconSvg}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  switchSpace(spaceName) {
    const space = window.storageEngine.setActiveSpace(spaceName);
    this.updateSpaceSwitcherUI(space);
    this.showToast(`Switched to ${space === 'personal' ? '👤 Personal Space' : '🏠 Joint Household Space'}`, 'info');
    this.render();
  }

  updateSpaceSwitcherUI(activeSpace) {
    const btnHousehold = document.getElementById('space-pill-household');
    const btnPersonal = document.getElementById('space-pill-personal');
    if (btnHousehold && btnPersonal) {
      if (activeSpace === 'personal') {
        btnPersonal.classList.add('active');
        btnHousehold.classList.remove('active');
      } else {
        btnHousehold.classList.add('active');
        btnPersonal.classList.remove('active');
      }
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) targetSection.classList.add('active');

    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    // 0. Check Local App PIN Lock
    if (!this.checkAppPinLock()) {
      return;
    }

    // 1. Check Access Control
    if (window.accessControl && !window.accessControl.isAccessGranted()) {
      this.renderAccessGateScreen();
      return;
    } else {
      const gateEl = document.getElementById('access-gate-screen');
      if (gateEl) gateEl.style.display = 'none';
      const appWrapper = document.getElementById('app-main-wrapper');
      if (appWrapper) appWrapper.style.display = 'flex';
    }

    const settings = window.storageEngine.getSettings();
    const currency = settings.currency || '$';
    const activeSpace = window.storageEngine.getActiveSpace();
    this.updateSpaceSwitcherUI(activeSpace);

    // Update Notification Bell for Admin
    const notifBtn = document.getElementById('btn-header-notif');
    const notifCount = document.getElementById('header-notif-count');
    if (notifBtn && notifCount) {
      const isAdmin = window.accessControl ? window.accessControl.isAdmin() : false;
      const pending = window.accessControl ? window.accessControl.getPendingRequests() : [];
      if (isAdmin && pending.length > 0) {
        notifBtn.style.display = 'flex';
        notifCount.textContent = pending.length;
      } else {
        notifBtn.style.display = 'none';
      }
    }

    const overview = window.budgetEngine.getMonthOverview(this.selectedMonth, activeSpace);

    // Update month selector button
    const periodBtn = document.getElementById('current-period-label');
    if (periodBtn) {
      periodBtn.innerHTML = `${formatMonthLabel(this.selectedMonth)} &nbsp;▾`;
    }

    if (this.currentView === 'dashboard') {
      this.renderDashboard(overview, currency);
    } else if (this.currentView === 'budget') {
      this.renderBudgetAllocation(overview, currency);
    } else if (this.currentView === 'planned') {
      this.renderPlanned(currency);
    } else if (this.currentView === 'transactions') {
      this.renderTransactions(currency);
    } else if (this.currentView === 'analytics') {
      this.renderAnalytics(overview, currency);
    } else if (this.currentView === 'settings') {
      this.renderSettings(settings);
    }
  }

  /**
   * Render Access Gate Screen with Strict Genuine Email/Phone Verification & Privacy Trust Badge
   */
  renderAccessGateScreen() {
    const gateEl = document.getElementById('access-gate-screen');
    const appWrapper = document.getElementById('app-main-wrapper');
    if (appWrapper) appWrapper.style.display = 'none';
    if (!gateEl) return;

    gateEl.style.display = 'flex';
    const user = window.accessControl.getCurrentUser();
    const pendingVerification = window.accessControl.getPendingVerification();
    const isPendingApproval = user && user.status === 'pending';

    if (isPendingApproval) {
      const waMsg = `Hi Shikhar, I have claimed my Early Access Pass for Gullak (Name: ${user.name}, Contact: ${user.contact}). Please activate my invite key!`;
      const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;

      gateEl.innerHTML = `
        <div class="card" style="text-align: center; padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; max-width: 380px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); color: var(--accent-warning); display: flex; align-items: center; justify-content: center;">
            ${ICONS['shield-check']}
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.25rem;">Validating Invite Pass</h2>
          <p style="color: var(--text-secondary); font-size: 0.86rem; line-height: 1.5;">
            Hi <strong>${user.name}</strong>, your contact (<strong>${user.contact}</strong>) has been verified. Your early access invite pass is waiting for key activation from the administrator (<strong>Shikhar</strong>).
          </p>
          
          <a href="${waLink}" target="_blank" class="btn-primary" style="background: #25D366; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ${ICONS['whatsapp']} Activate Pass on WhatsApp
          </a>

          <button class="btn-secondary" id="btn-refresh-gate-status" style="width: 100%;">🔄 Check Activation & Enter</button>

          <!-- 100% Private Trust Badge -->
          <div class="privacy-trust-badge" style="margin-top: 6px;">
            <div class="privacy-badge-header">
              ${ICONS['shield-check']} <span>100% Private & Zero Cloud Tracking</span>
            </div>
            <p>Your financial data never leaves your device. All transactions and budgets are stored exclusively in your browser's offline storage.</p>
          </div>
        </div>
      `;
      document.getElementById('btn-refresh-gate-status')?.addEventListener('click', () => {
        if (window.accessControl.isAccessGranted()) {
          this.showToast('Invite Activated! Welcome to Gullak.', 'success');
          this.render();
        } else {
          this.showToast('Invite pass is still awaiting activation.', 'info');
        }
      });
    } else if (pendingVerification) {
      // Step 2: 4-Digit Verification Handshake
      gateEl.innerHTML = `
        <div class="card" style="padding: 28px 20px; display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 380px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); display: flex; align-items: center; justify-content: center; color: #fff;">
              ${ICONS['shield-check']}
            </div>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.15rem;">Validate Contact</h2>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Step 2: Invite Security Handshake</span>
            </div>
          </div>

          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid var(--accent-warning); border-radius: var(--radius-md); padding: 12px; font-size: 0.84rem; line-height: 1.5;">
            To confirm <strong>${pendingVerification.contact}</strong> is authentic, enter your 4-digit activation PIN:
            <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--accent-warning); text-align: center; margin: 8px 0; letter-spacing: 0.25em;">
              ${pendingVerification.otp}
            </div>
          </div>

          <form id="form-verify-otp" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Enter 4-Digit Code</label>
              <input type="text" id="gate-input-otp" class="input-field" placeholder="• • • •" maxlength="4" style="text-align: center; font-size: 1.4rem; font-weight: 800; letter-spacing: 0.3em;" required>
            </div>
            <button type="submit" class="btn-primary">Submit Invite Pass ➔</button>
            <button type="button" class="btn-secondary" id="btn-cancel-otp">← Change Contact Details</button>
          </form>
        </div>
      `;

      document.getElementById('form-verify-otp')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const otp = document.getElementById('gate-input-otp').value;
        try {
          window.accessControl.verifyAndSubmitRequest(otp);
          this.showToast('Invite Pass Activated! Welcome to Gullak.', 'success');
          this.render();
        } catch (err) {
          this.showToast(err.message || 'Incorrect verification code', 'error');
        }
      });

      document.getElementById('btn-cancel-otp')?.addEventListener('click', () => {
        localStorage.removeItem('hb_pending_otp_verification');
        this.renderAccessGateScreen();
      });

    } else {
      // Step 1: Initial Request Form with Mandatory Genuine Email/Phone + Trust Badge
      gateEl.innerHTML = `
        <div class="card" style="padding: 28px 20px; display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 380px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); display: flex; align-items: center; justify-content: center; color: #fff;">
              ${ICONS['shield-check']}
            </div>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.15rem;">Gullak Early Access</h2>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Collaborative Household & Personal Budget</span>
            </div>
          </div>

          <!-- 100% Private Trust Badge -->
          <div class="privacy-trust-badge">
            <div class="privacy-badge-header">
              ${ICONS['shield-check']} <span>100% Private & Zero Cloud Tracking</span>
            </div>
            <p>Your financial data never leaves your device. All transactions and budgets are stored exclusively in your browser's secure offline storage. Neither the developer nor any third party can ever see your numbers.</p>
          </div>

          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">
            To activate your personal or household invite, please register your name and genuine contact:
          </p>

          <form id="form-request-access" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Your Real Name *</label>
              <input type="text" id="gate-input-name" class="input-field" placeholder="e.g. Priya Sharma" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email ID or 10-Digit Mobile *</label>
              <input type="text" id="gate-input-contact" class="input-field" placeholder="e.g. priya@gmail.com / 9876543210" required>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 6px;">Claim Early Access Pass ➔</button>
            <button type="button" class="btn-secondary" id="btn-show-admin-login" style="margin-top: 4px; font-size: 0.8rem; opacity: 0.85;">🔑 Admin / Creator Login</button>
          </form>
        </div>
      `;

      document.getElementById('btn-show-admin-login')?.addEventListener('click', () => {
        const pass = prompt('Enter Admin Master Passkey (or 8888):');
        if (pass) {
          try {
            window.accessControl.loginAsAdmin(pass);
            this.showToast('Welcome back, Admin Shikhar!', 'success');
            this.render();
          } catch (err) {
            this.showToast(err.message || 'Invalid passcode', 'error');
          }
        }
      });

      document.getElementById('form-request-access')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('gate-input-name').value;
        const contact = document.getElementById('gate-input-contact').value;
        try {
          window.accessControl.initiateAccessRequest(name, contact);
          this.renderAccessGateScreen();
        } catch (err) {
          this.showToast(err.message || 'Please provide a valid contact', 'error');
        }
      });
    }
  }

  /**
   * Open WhatsApp Planned Checklist Drawer
   */
  openWhatsAppPlannedDrawer() {
    const activeSpace = window.storageEngine.getActiveSpace();
    const text = window.plannedEngine.buildWhatsAppChecklist(activeSpace);
    const modal = document.getElementById('modal-whatsapp-planned');
    if (!modal) return;

    const previewBox = document.getElementById('wa-planned-preview-text');
    if (previewBox) previewBox.value = text;

    modal.classList.add('open');

    const btnSend = document.getElementById('btn-wa-send-planned');
    if (btnSend) {
      btnSend.onclick = () => {
        const finalText = document.getElementById('wa-planned-preview-text')?.value || '';
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(finalText)}`;
        window.open(whatsappUrl, '_blank');
        this.closeModal('modal-whatsapp-planned');
      };
    }

    const btnCopy = document.getElementById('btn-wa-copy-planned');
    if (btnCopy) {
      btnCopy.onclick = () => {
        const finalText = document.getElementById('wa-planned-preview-text')?.value || '';
        navigator.clipboard.writeText(finalText).then(() => {
          this.showToast('Planned checklist copied to clipboard!', 'success');
        });
      };
    }
  }

  /**
   * Render Planned Items & Household Wishlist Screen
   */
  renderPlanned(currency) {
    const container = document.getElementById('view-planned');
    if (!container) return;

    const activeSpace = window.storageEngine.getActiveSpace();
    const isPersonal = activeSpace === 'personal';
    const summary = window.plannedEngine.getSummary(activeSpace);
    const allItems = window.plannedEngine.getAll(activeSpace);

    let filteredItems = allItems;
    if (this.plannedFilter === 'urgent') {
      filteredItems = allItems.filter(i => i.status === 'pending' && i.priority === 'urgent');
    } else if (this.plannedFilter === 'normal') {
      filteredItems = allItems.filter(i => i.status === 'pending' && i.priority === 'normal');
    } else if (this.plannedFilter === 'someday') {
      filteredItems = allItems.filter(i => i.status === 'pending' && i.priority === 'someday');
    } else if (this.plannedFilter === 'completed') {
      filteredItems = allItems.filter(i => i.status === 'completed');
    }

    const categories = window.storageEngine.getCategories();
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

    let itemsHtml = '';
    if (filteredItems.length === 0) {
      itemsHtml = `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS['calendar-check']}</div>
          <p>No planned items found in this filter.</p>
          <button class="chip-btn" id="btn-add-plan-empty">+ Add Planned Item</button>
        </div>
      `;
    } else {
      filteredItems.forEach(item => {
        const cat = catMap[item.categoryId] || { name: 'General', color: '#64748b', icon: 'dollar-sign' };
        const isCompleted = item.status === 'completed';

        let priorityBadge = '<span class="status-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">🔴 Need Now</span>';
        if (item.priority === 'normal') {
          priorityBadge = '<span class="status-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">🟡 Can Wait</span>';
        } else if (item.priority === 'someday') {
          priorityBadge = '<span class="status-badge" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa;">💡 Wishlist</span>';
        }

        itemsHtml += `
          <div class="planned-item-card ${isCompleted ? 'completed' : ''}" data-planid="${item.id}">
            <div class="plan-top-row">
              <div style="display: flex; align-items: flex-start; gap: 10px; min-width: 0;">
                <button class="btn-toggle-plan" data-planid="${item.id}" title="${isCompleted ? 'Mark Pending' : 'Mark Bought / Paid'}">
                  ${isCompleted ? ICONS['check'] : ''}
                </button>
                <div style="min-width: 0;">
                  <div class="plan-title ${isCompleted ? 'completed-text' : ''}">${item.title}</div>
                  <div class="plan-subtitle">
                    <span>${cat.name}</span>
                    ${item.dueDate ? `• <span>Due: ${item.dueDate}</span>` : ''}
                    ${item.notes ? `• <span>${item.notes}</span>` : ''}
                  </div>
                </div>
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                <div class="plan-amount">${formatMoney(item.estimatedAmount, currency)}</div>
                ${priorityBadge}
              </div>
            </div>

            <div class="plan-action-row">
              ${!isCompleted ? `
                <button class="chip-btn btn-convert-expense" data-planid="${item.id}" style="background: var(--accent-success); color: #ffffff; border: none; font-size: 0.74rem;">
                  ✓ Mark Paid / Add to Expense
                </button>
              ` : `
                <span style="font-size: 0.72rem; color: var(--accent-success); font-weight: 600;">✓ Converted to Expense</span>
              `}
              <div style="display: flex; gap: 6px; margin-left: auto;">
                <button class="btn-icon btn-edit-plan" data-planid="${item.id}" style="width: 28px; height: 28px;" title="Edit">✏️</button>
                <button class="btn-icon btn-delete-plan" data-planid="${item.id}" style="width: 28px; height: 28px; color: var(--accent-danger);" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    let html = `
      <!-- Planned Summary Header Card -->
      <div class="hero-card" style="padding: 18px 20px;">
        <div class="hero-label">
          <span>${isPersonal ? '👤 Personal Wishlist & Bills' : '🏠 Household Planned Commitments'}</span>
          <span class="status-badge safe">${summary.pendingCount} Pending</span>
        </div>
        <div class="hero-balance" style="font-size: 1.8rem; margin: 6px 0 12px 0;">
          ${formatMoney(summary.totalPendingAmount, currency)}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-primary" id="btn-open-add-plan" style="padding: 10px; font-size: 0.88rem;">
            + Add Planned Item
          </button>
          <button class="btn-secondary" id="btn-share-planned-wa" style="padding: 10px; font-size: 0.88rem; display: flex; align-items: center; gap: 6px; color: #25D366; border-color: rgba(37, 211, 102, 0.4);">
            ${ICONS['whatsapp']} Share List
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="chips-row" style="overflow-x: auto; padding-bottom: 4px;">
        <button class="chip-btn ${this.plannedFilter === 'all' ? 'active' : ''}" data-pfilter="all">All (${allItems.length})</button>
        <button class="chip-btn ${this.plannedFilter === 'urgent' ? 'active' : ''}" data-pfilter="urgent">🔴 Need Now (${summary.urgent.length})</button>
        <button class="chip-btn ${this.plannedFilter === 'normal' ? 'active' : ''}" data-pfilter="normal">🟡 Can Wait (${summary.normal.length})</button>
        <button class="chip-btn ${this.plannedFilter === 'someday' ? 'active' : ''}" data-pfilter="someday">💡 Wishlist (${summary.someday.length})</button>
        <button class="chip-btn ${this.plannedFilter === 'completed' ? 'active' : ''}" data-pfilter="completed">✓ Bought (${summary.completed.length})</button>
      </div>

      <!-- Planned Items Feed -->
      <div class="planned-items-list">
        ${itemsHtml}
      </div>
    `;

    container.innerHTML = html;

    // Attach Event Handlers
    document.getElementById('btn-open-add-plan')?.addEventListener('click', () => this.openPlannedModal());
    document.getElementById('btn-add-plan-empty')?.addEventListener('click', () => this.openPlannedModal());
    document.getElementById('btn-share-planned-wa')?.addEventListener('click', () => this.openWhatsAppPlannedDrawer());

    container.querySelectorAll('[data-pfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.plannedFilter = btn.getAttribute('data-pfilter');
        this.renderPlanned(currency);
      });
    });

    container.querySelectorAll('.btn-toggle-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-planid');
        window.plannedEngine.toggleStatus(id);
        this.renderPlanned(currency);
      });
    });

    container.querySelectorAll('.btn-convert-expense').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-planid');
        try {
          const tx = window.plannedEngine.convertToTransaction(id);
          this.showToast(`Converted to Expense: "${tx.title}" (${formatMoney(tx.amount, currency)})`, 'success');
          this.render();
        } catch (err) {
          this.showToast(err.message || 'Error converting item', 'error');
        }
      });
    });

    container.querySelectorAll('.btn-edit-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-planid');
        this.openPlannedModal(id);
      });
    });

    container.querySelectorAll('.btn-delete-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-planid');
        if (confirm('Delete this planned item?')) {
          window.plannedEngine.deleteItem(id);
          this.showToast('Planned item deleted', 'info');
          this.renderPlanned(currency);
        }
      });
    });
  }

  /**
   * Open Add/Edit Planned Item Modal Drawer
   */
  openPlannedModal(planId = null) {
    this.currentEditingPlanId = planId;
    const modal = document.getElementById('modal-planned-item');
    const modalTitle = document.getElementById('modal-plan-title');
    const titleInput = document.getElementById('plan-input-title');
    const amountInput = document.getElementById('plan-input-amount');
    const prioritySelect = document.getElementById('plan-input-priority');
    const categorySelect = document.getElementById('plan-input-category');
    const dueDateInput = document.getElementById('plan-input-duedate');
    const spaceSelect = document.getElementById('plan-input-space');
    const notesInput = document.getElementById('plan-input-notes');

    const activeSpace = window.storageEngine.getActiveSpace();

    // Populate categories
    const categories = window.storageEngine.getCategories().filter(c => c.type === 'expense');
    if (categorySelect) {
      categorySelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    if (planId) {
      const items = window.plannedEngine.getAllRaw();
      const item = items.find(i => i.id === planId);
      if (!item) return;

      if (modalTitle) modalTitle.textContent = 'Edit Planned Item';
      if (titleInput) titleInput.value = item.title || '';
      if (amountInput) amountInput.value = item.estimatedAmount || '';
      if (prioritySelect) prioritySelect.value = item.priority || 'normal';
      if (categorySelect) categorySelect.value = item.categoryId || 'groceries';
      if (dueDateInput) dueDateInput.value = item.dueDate || '';
      if (spaceSelect) spaceSelect.value = item.space || 'household';
      if (notesInput) notesInput.value = item.notes || '';
    } else {
      if (modalTitle) modalTitle.textContent = 'Add Planned Item / Bill';
      if (titleInput) titleInput.value = '';
      if (amountInput) amountInput.value = '';
      if (prioritySelect) prioritySelect.value = 'urgent';
      if (categorySelect) categorySelect.value = 'groceries';
      if (dueDateInput) dueDateInput.value = '';
      if (spaceSelect) spaceSelect.value = activeSpace;
      if (notesInput) notesInput.value = '';
    }

    if (modal) modal.classList.add('open');
  }

  /**
   * Render Dashboard View with Planned Widget
   */
  renderDashboard(data, currency) {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    let healthClass = 'good';
    let healthText = 'Healthy Cashflow';
    if (data.healthScore < 50) {
      healthClass = 'danger';
      healthText = 'Budget Exceeded';
    } else if (data.healthScore < 80) {
      healthClass = 'warning';
      healthText = 'Caution / Tight';
    }

    const isPersonal = data.space === 'personal';
    const planSummary = (window.plannedEngine && typeof window.plannedEngine.getSummary === 'function') 
      ? window.plannedEngine.getSummary(data.space) 
      : { pendingCount: 0, totalPendingAmount: 0 };

    let html = `
      <!-- Hero Balance Card -->
      <div class="hero-card">
        <div class="hero-label">
          <span>${isPersonal ? '👤 My Net Savings' : '🏠 Joint Household Savings'}</span>
          <span class="health-pill ${healthClass}">● ${healthText}</span>
        </div>
        <div class="hero-balance">
          ${data.netSavings >= 0 ? '+' : '-'}${formatMoney(Math.abs(data.netSavings), currency)}
        </div>
        <div class="hero-stats-grid">
          <div class="stat-item">
            <span class="stat-item-label text-success">
              ${ICONS['arrow-down-left']} Total Income
            </span>
            <span class="stat-item-value income">${formatMoney(data.totalIncome, currency)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-item-label text-danger">
              ${ICONS['arrow-up-right']} Total Expenses
            </span>
            <span class="stat-item-value expense">${formatMoney(data.totalExpense, currency)}</span>
          </div>
        </div>

        <!-- Share on WhatsApp Action -->
        <button class="btn-whatsapp-share" id="btn-share-whatsapp" style="margin-top: 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: #ffffff; border: none; border-radius: var(--radius-md); padding: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
          ${ICONS['whatsapp']} Share ${isPersonal ? 'Personal' : 'Household'} Summary on WhatsApp
        </button>
      </div>

      <!-- Quick Glance: Planned Items & Upcoming Bills -->
      <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%); border-color: rgba(14, 165, 233, 0.35); cursor: pointer;" id="card-dashboard-planned-link">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: rgba(14, 165, 233, 0.2); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
              ${ICONS['calendar-check']}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">🗓️ Upcoming & Planned</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${planSummary.pendingCount} items pending</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1rem; color: var(--accent-primary);">${formatMoney(planSummary.totalPendingAmount, currency)}</div>
            <span style="font-size: 0.72rem; color: var(--accent-primary);">View List &rarr;</span>
          </div>
        </div>
      </div>

      ${(() => {
        const recurring = window.habitEngine ? window.habitEngine.getPendingRecurringBills(this.selectedMonth, data.space) : [];
        if (recurring.length === 0) return '';
        const rec = recurring[0];
        return `
          <!-- Smart Recurring Bill Reminder Prompt -->
          <div class="card" style="background: rgba(245, 158, 11, 0.08); border: 1px dashed var(--accent-warning); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-warning);">💡 Recurring Bill Reminder</div>
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-top: 1px;">
                ${rec.title} (${formatMoney(rec.amount, currency)})
              </div>
            </div>
            <button class="chip-btn btn-quick-log-bill" data-title="${rec.title}" data-amt="${rec.amount}" data-cat="${rec.categoryId}" data-method="${rec.paymentMethod || 'UPI/Online'}" style="background: var(--accent-warning); color: #0f172a; font-weight: 700; border: none;">
              + Log Now
            </button>
          </div>
        `;
      })()}

      <!-- Household Budget Division & Allocation Progress -->
      <div>
        <div class="section-header">
          <h2 class="section-title">${ICONS['pie-chart']} Category Budgets</h2>
          <span class="section-action" id="btn-goto-allocations">Adjust Splits &rarr;</span>
        </div>
        <div class="budget-category-list">
    `;

    if (data.categoryBudgets.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS['pie-chart']}</div>
          <p>No expense categories configured for this space.</p>
        </div>
      `;
    } else {
      data.categoryBudgets.forEach(cat => {
        const percentClamped = Math.min(100, Math.round(cat.percentUsed));
        let barColor = cat.color || 'var(--accent-primary)';
        let statusLabel = `${Math.round(cat.percentUsed)}% used`;

        if (cat.status === 'exceeded') {
          barColor = 'var(--accent-danger)';
          statusLabel = 'Exceeded!';
        } else if (cat.status === 'danger' || cat.status === 'warning') {
          barColor = 'var(--accent-warning)';
        }

        html += `
          <div class="budget-category-item" data-catid="${cat.id}">
            <div class="cat-top-row">
              <div class="cat-info">
                <div class="cat-icon-box" style="background-color: ${cat.color}22; color: ${cat.color};">
                  ${getIcon(cat.icon)}
                </div>
                <div>
                  <div class="cat-name">${cat.name}</div>
                  <div class="cat-target-badge">Target: <strong>${cat.percentage}%</strong> of Income</div>
                </div>
              </div>
              <div class="cat-spending-text">
                <div class="cat-spent-amount">${formatMoney(cat.spent, currency)}</div>
                <div class="cat-budget-cap">of ${formatMoney(cat.targetBudget, currency)} cap</div>
              </div>
            </div>

            <div class="progress-track">
              <div class="progress-fill" style="width: ${percentClamped}%; background-color: ${barColor};"></div>
            </div>

            <div class="cat-bottom-row">
              <span class="status-badge ${cat.status}">${statusLabel}</span>
              <span>
                ${cat.remaining >= 0 ? `${formatMoney(cat.remaining, currency)} left` : `${formatMoney(Math.abs(cat.remaining), currency)} over`}
              </span>
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>

      <!-- Recent Transactions -->
      <div>
        <div class="section-header">
          <h2 class="section-title">${ICONS['list']} Recent Activity (${isPersonal ? 'Personal' : 'Household'})</h2>
          <span class="section-action" id="btn-goto-transactions">View All &rarr;</span>
        </div>
        <div class="transaction-list">
    `;

    if (data.recentTransactions.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS['list']}</div>
          <p>No transactions logged in ${isPersonal ? 'Personal' : 'Household'} space this month.</p>
          <button class="chip-btn" id="btn-quick-add-empty">+ Add First Entry</button>
        </div>
      `;
    } else {
      const categories = window.storageEngine.getCategories();
      const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

      data.recentTransactions.forEach(tx => {
        const cat = catMap[tx.categoryId] || { name: 'General', color: '#64748b', icon: 'dollar-sign' };
        const isIncome = tx.type === 'income';

        html += `
          <div class="transaction-item" data-txid="${tx.id}">
            <div class="tx-left">
              <div class="tx-icon-wrap" style="background-color: ${cat.color}22; color: ${cat.color};">
                ${getIcon(cat.icon)}
              </div>
              <div class="tx-meta">
                <div class="tx-title">${tx.title}</div>
                <div class="tx-subtitle">
                  <span>${cat.name}</span> • <span>${tx.date}</span> • <span class="tag-added-by">👤 ${tx.addedBy || 'Me'}</span>
                </div>
              </div>
            </div>
            <div class="tx-right">
              <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
                ${isIncome ? '+' : '-'}${formatMoney(tx.amount, currency)}
              </div>
              <span class="tx-method-badge">${tx.paymentMethod || 'Cash'}</span>
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Navigation Triggers
    document.getElementById('card-dashboard-planned-link')?.addEventListener('click', () => this.switchView('planned'));
    document.getElementById('btn-share-whatsapp')?.addEventListener('click', () => this.openWhatsAppShareDrawer());
    document.getElementById('btn-goto-allocations')?.addEventListener('click', () => this.switchView('budget'));
    document.getElementById('btn-goto-transactions')?.addEventListener('click', () => this.switchView('transactions'));
    document.getElementById('btn-quick-add-empty')?.addEventListener('click', () => this.openTransactionModal());

    container.querySelectorAll('.transaction-item').forEach(el => {
      el.addEventListener('click', () => {
        const txId = el.getAttribute('data-txid');
        this.openTransactionModal(txId);
      });
    });
  }

  /**
   * Open WhatsApp Share Customizer Drawer
   */
  openWhatsAppShareDrawer() {
    const settings = window.storageEngine.getSettings();
    const currency = settings.currency || '$';
    const activeSpace = window.storageEngine.getActiveSpace();
    const data = window.budgetEngine.getMonthOverview(this.selectedMonth, activeSpace);
    const modal = document.getElementById('modal-whatsapp-customizer');
    if (!modal) return;

    const spaceName = activeSpace === 'personal' ? '👤 My Personal Space' : '🏠 Joint Household';

    const updatePreview = () => {
      const incTotals = document.getElementById('wa-opt-totals')?.checked ?? true;
      const incCategories = document.getElementById('wa-opt-categories')?.checked ?? true;
      const incTransactions = document.getElementById('wa-opt-transactions')?.checked ?? false;

      let text = `📊 *Budget Summary - ${spaceName} (${formatMonthLabel(this.selectedMonth)})*\n\n`;

      if (incTotals) {
        text += `💰 *Total Income:* ${formatMoney(data.totalIncome, currency)}\n`;
        text += `💸 *Total Expenses:* ${formatMoney(data.totalExpense, currency)}\n`;
        text += `🏦 *Net Savings:* ${data.netSavings >= 0 ? '+' : '-'}${formatMoney(Math.abs(data.netSavings), currency)} (${Math.round(data.savingsRate)}% rate)\n\n`;
      }

      if (incCategories) {
        text += `*Category Breakdown:*\n`;
        data.categoryBudgets.forEach(cat => {
          text += `• ${cat.name}: ${formatMoney(cat.spent, currency)} / ${formatMoney(cat.targetBudget, currency)} (${Math.round(cat.percentUsed)}%)\n`;
        });
        text += `\n`;
      }

      if (incTransactions && data.recentTransactions.length > 0) {
        text += `*Recent Log:*\n`;
        data.recentTransactions.slice(0, 5).forEach(tx => {
          text += `• ${tx.date.slice(5)}: ${tx.title} - ${formatMoney(tx.amount, currency)} (${tx.addedBy || 'Me'})\n`;
        });
        text += `\n`;
      }

      text += `📱 _Sent via HomeBudget App_`;

      const previewBox = document.getElementById('wa-preview-text');
      if (previewBox) previewBox.value = text;
    };

    ['wa-opt-totals', 'wa-opt-categories', 'wa-opt-transactions'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updatePreview);
    });

    updatePreview();
    modal.classList.add('open');

    const btnSend = document.getElementById('btn-wa-confirm-send');
    if (btnSend) {
      btnSend.onclick = () => {
        const text = document.getElementById('wa-preview-text')?.value || '';
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        this.closeModal('modal-whatsapp-customizer');
      };
    }

    const btnCopy = document.getElementById('btn-wa-copy-text');
    if (btnCopy) {
      btnCopy.onclick = () => {
        const text = document.getElementById('wa-preview-text')?.value || '';
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Formatted summary copied to clipboard!', 'success');
        });
      };
    }
  }

  /**
   * Parse incoming Bank SMS or UPI receipt text
   */
  parseUPIOrBankSMS(smsText) {
    if (!smsText || !smsText.trim()) return null;
    const text = smsText.trim();

    let amount = null;
    const amtRegex = /(?:Rs\.?|INR|debited by|paid|vpa)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i;
    const amtMatch = text.match(amtRegex);
    if (amtMatch && amtMatch[1]) {
      amount = parseFloat(amtMatch[1].replace(/,/g, ''));
    } else {
      const numMatch = text.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
      if (numMatch) amount = parseFloat(numMatch[1]);
    }

    let type = 'expense';
    if (/credited|received|deposited|refund/i.test(text)) {
      type = 'income';
    }

    let merchant = 'UPI Payment';
    const merchantPatterns = [
      /(?:to|at|info:)\s*([A-Za-z0-9\s&'-]{3,25})(?:\s+on|\s+ref|\s+via|\.|$)/i,
      /(?:VPA|UPI)\s*([A-Za-z0-9._-]+@[A-Za-z0-9]+)/i
    ];

    for (const pat of merchantPatterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        merchant = match[1].trim();
        break;
      }
    }

    let categoryId = 'groceries';
    const lowerText = text.toLowerCase();

    if (/swiggy|zomato|blinkit|zepto|instamart|dmart|grocery|supermarket|bigbasket|nature's basket|food|restaurant|cafe|starbucks|mcdonalds|kfc|dominos|pizza|bakery/i.test(lowerText)) {
      categoryId = 'groceries';
    } else if (/uber|ola|rapido|fuel|petrol|diesel|hpcl|bpcl|indianoil|shell|metro|toll|fastag|parking/i.test(lowerText)) {
      categoryId = 'transport';
    } else if (/rent|landlord|electricity|bescom|mseb|tneb|power|water|gas|indane|hp gas|broadband|wifi|airtel|jio|act fibernet|maintenance/i.test(lowerText)) {
      categoryId = 'housing';
    } else if (/zerodha|groww|sip|mutual fund|stocks|indmoney|etmoney|upstox|ppf|nps|fd|fixed deposit|crypto|investment/i.test(lowerText)) {
      categoryId = 'investments';
    } else if (/pharmacy|apollo|1mg|netmeds|medplus|hospital|clinic|doctor|dental|lab|diagnostic|health/i.test(lowerText)) {
      categoryId = 'healthcare';
    } else if (/pvr|inox|cinema|movie|bookmyshow|netflix|prime|hotstar|spotify|shopping|myntra|amazon|flipkart|zara|h&m/i.test(lowerText)) {
      categoryId = 'personal';
    } else if (type === 'income') {
      if (/salary|wages|payroll/i.test(lowerText)) categoryId = 'salary';
      else if (/dividend|interest|returns/i.test(lowerText)) categoryId = 'returns';
      else categoryId = 'other_income';
    }

    return {
      amount,
      title: merchant,
      type,
      categoryId,
      paymentMethod: 'UPI/Online',
      notes: 'Imported from UPI/SMS'
    };
  }

  /**
   * Render Budget Allocation View
   */
  renderBudgetAllocation(data, currency) {
    const container = document.getElementById('view-budget');
    if (!container) return;

    const activeSpace = window.storageEngine.getActiveSpace();
    const categories = window.storageEngine.getCategories().filter(c => {
      if (c.type !== 'expense') return false;
      if (activeSpace === 'personal') return c.space === 'personal' || c.space === 'all';
      return c.space === 'household' || c.space === 'all';
    });

    const totalAllocated = categories.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);

    let allocStatusClass = 'text-success';
    let allocMsg = '100% Balanced Allocation';
    if (totalAllocated < 100) {
      allocStatusClass = 'text-warning';
      allocMsg = `${100 - totalAllocated}% Unallocated`;
    } else if (totalAllocated > 100) {
      allocStatusClass = 'text-danger';
      allocMsg = `${totalAllocated - 100}% Over-allocated!`;
    }

    let html = `
      <div class="total-allocation-bar">
        <div class="alloc-header">
          <span>${activeSpace === 'personal' ? '👤 Personal Budget Division' : '🏠 Household Budget Division'}</span>
          <span class="alloc-percentage-tag ${allocStatusClass}" id="total-alloc-display">${totalAllocated}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" id="total-alloc-bar" style="width: ${Math.min(100, totalAllocated)}%; background: ${totalAllocated === 100 ? 'var(--accent-success)' : (totalAllocated > 100 ? 'var(--accent-danger)' : 'var(--accent-warning)')};"></div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-secondary);" id="alloc-msg-display">${allocMsg} (Based on monthly income: <strong>${formatMoney(data.totalIncome, currency)}</strong>)</span>
      </div>

      <!-- Quick Preset Rules -->
      <div>
        <div class="section-header">
          <h2 class="section-title">${ICONS['zap']} Quick Presets</h2>
        </div>
        <div class="preset-grid">
    `;

    Object.entries(PRESET_TEMPLATES).forEach(([key, preset]) => {
      html += `
        <div class="preset-card" data-preset="${key}">
          <div class="preset-title">
            <span>${preset.name}</span>
            <button class="chip-btn" style="padding: 2px 8px; font-size: 0.7rem;">Apply</button>
          </div>
          <p class="preset-desc">${preset.description}</p>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <!-- Sliders for Each Category -->
      <div>
        <div class="section-header">
          <h2 class="section-title">${ICONS['sliders']} Category Splits</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;" id="sliders-container">
    `;

    categories.forEach(cat => {
      const estimatedAmt = data.totalIncome > 0 ? (cat.percentage / 100) * data.totalIncome : 0;
      html += `
        <div class="slider-group" data-catid="${cat.id}">
          <div class="slider-top">
            <div class="cat-info">
              <div class="cat-icon-box" style="background-color: ${cat.color}22; color: ${cat.color};">
                ${getIcon(cat.icon)}
              </div>
              <div>
                <div class="cat-name">${cat.name}</div>
                <div style="font-size: 0.74rem; color: var(--text-muted);">
                  Estimated: <span class="cat-est-amt" data-catid="${cat.id}">${formatMoney(estimatedAmt, currency)}</span>/mo
                </div>
              </div>
            </div>
            <div class="slider-val-badge">
              <span class="slider-pct-num" data-catid="${cat.id}">${cat.percentage}</span>%
            </div>
          </div>
          <input 
            type="range" 
            class="range-slider alloc-slider" 
            data-catid="${cat.id}" 
            min="0" 
            max="100" 
            step="1" 
            value="${cat.percentage}"
          >
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    const sliders = container.querySelectorAll('.alloc-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const catId = e.target.getAttribute('data-catid');
        const val = parseInt(e.target.value) || 0;

        const badge = container.querySelector(`.slider-pct-num[data-catid="${catId}"]`);
        if (badge) badge.textContent = val;

        const estBadge = container.querySelector(`.cat-est-amt[data-catid="${catId}"]`);
        if (estBadge) {
          const est = data.totalIncome > 0 ? (val / 100) * data.totalIncome : 0;
          estBadge.textContent = formatMoney(est, currency);
        }

        let currentTotal = 0;
        const allocationMap = {};
        sliders.forEach(s => {
          const cId = s.getAttribute('data-catid');
          const v = parseInt(s.value) || 0;
          currentTotal += v;
          allocationMap[cId] = v;
        });

        const totalDisplay = document.getElementById('total-alloc-display');
        const totalBar = document.getElementById('total-alloc-bar');
        const msgDisplay = document.getElementById('alloc-msg-display');

        if (totalDisplay) {
          totalDisplay.textContent = `${currentTotal}%`;
          totalDisplay.className = `alloc-percentage-tag ${currentTotal === 100 ? 'text-success' : (currentTotal > 100 ? 'text-danger' : 'text-warning')}`;
        }
        if (totalBar) {
          totalBar.style.width = `${Math.min(100, currentTotal)}%`;
          totalBar.style.background = currentTotal === 100 ? 'var(--accent-success)' : (currentTotal > 100 ? 'var(--accent-danger)' : 'var(--accent-warning)');
        }
        if (msgDisplay) {
          let msg = `${currentTotal}% Allocated`;
          if (currentTotal === 100) msg = '100% Balanced Allocation';
          else if (currentTotal < 100) msg = `${100 - currentTotal}% Unallocated`;
          else msg = `${currentTotal - 100}% Over-allocated!`;
          msgDisplay.innerHTML = `${msg} (Based on monthly income: <strong>${formatMoney(data.totalIncome, currency)}</strong>)`;
        }

        window.budgetEngine.updateAllocations(allocationMap);
      });
    });

    container.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const presetKey = card.getAttribute('data-preset');
        window.budgetEngine.applyPreset(presetKey);
        this.showToast(`Applied preset: ${PRESET_TEMPLATES[presetKey].name}`, 'success');
        this.renderBudgetAllocation(window.budgetEngine.getMonthOverview(this.selectedMonth), currency);
      });
    });
  }

  /**
   * Render Transactions Screen
   */
  renderTransactions(currency) {
    const container = document.getElementById('view-transactions');
    if (!container) return;

    const categories = window.storageEngine.getCategories();
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

    const searchInput = document.getElementById('tx-search-input');
    const typeFilter = document.getElementById('tx-type-filter');
    const catFilter = document.getElementById('tx-cat-filter');
    const sortFilter = document.getElementById('tx-sort-filter');

    const searchVal = searchInput ? searchInput.value : '';
    const typeVal = typeFilter ? typeFilter.value : 'all';
    const catVal = catFilter ? catFilter.value : 'all';
    const sortVal = sortFilter ? sortFilter.value : 'date_desc';

    const transactions = window.transactionManager.filter({
      month: this.selectedMonth,
      search: searchVal,
      type: typeVal,
      categoryId: catVal,
      sortBy: sortVal
    });

    let listHtml = '';
    const activeSpace = window.storageEngine.getActiveSpace();

    if (transactions.length === 0) {
      listHtml = `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS['list']}</div>
          <p>No transactions found in ${activeSpace === 'personal' ? 'Personal' : 'Household'} space.</p>
          <button class="chip-btn" id="btn-add-tx-from-filter">+ Add Transaction</button>
        </div>
      `;
    } else {
      transactions.forEach(tx => {
        const cat = catMap[tx.categoryId] || { name: 'General', color: '#64748b', icon: 'dollar-sign' };
        const isIncome = tx.type === 'income';
        const targetSpace = (tx.space === 'personal') ? 'household' : 'personal';

        listHtml += `
          <div class="transaction-item" data-txid="${tx.id}">
            <div class="tx-left">
              <div class="tx-icon-wrap" style="background-color: ${cat.color}22; color: ${cat.color};">
                ${getIcon(cat.icon)}
              </div>
              <div class="tx-meta">
                <div class="tx-title">${tx.title}</div>
                <div class="tx-subtitle">
                  <span>${cat.name}</span> • <span>${tx.date}</span> • <span class="tag-added-by">👤 ${tx.addedBy || 'Me'}</span>
                </div>
              </div>
            </div>
            <div class="tx-right">
              <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
                ${isIncome ? '+' : '-'}${formatMoney(tx.amount, currency)}
              </div>
              <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                <span class="tx-method-badge">${tx.paymentMethod || 'Cash'}</span>
                <button class="btn-quick-move" data-txid="${tx.id}" data-target="${targetSpace}" title="Move to ${targetSpace === 'personal' ? 'Personal' : 'Household'} Space" style="background: none; border: none; cursor: pointer; color: var(--accent-primary); padding: 2px;">
                  ${ICONS['repeat']}
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    if (catFilter && catFilter.children.length <= 1) {
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.type === 'income' ? '▲' : '▼'} ${c.name}`;
        catFilter.appendChild(opt);
      });
    }

    const txListContainer = document.getElementById('tx-full-list');
    if (txListContainer) {
      txListContainer.innerHTML = listHtml;

      txListContainer.querySelectorAll('.transaction-item').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.btn-quick-move')) return;
          const txId = el.getAttribute('data-txid');
          this.openTransactionModal(txId);
        });
      });

      txListContainer.querySelectorAll('.btn-quick-move').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const txId = btn.getAttribute('data-txid');
          const target = btn.getAttribute('data-target');
          window.transactionManager.moveSpace(txId, target);
          this.showToast(`Moved to ${target === 'personal' ? '👤 Personal' : '🏠 Household'} Space!`, 'success');
          this.render();
        });
      });

      document.getElementById('btn-add-tx-from-filter')?.addEventListener('click', () => this.openTransactionModal());
    }
  }

  /**
   * Render Analytics & Charts
   */
  renderAnalytics(data, currency) {
    const container = document.getElementById('view-analytics');
    if (!container) return;

    const spentCategories = data.categoryBudgets.filter(c => c.spent > 0);
    const totalSpent = data.totalExpense;

    let chartSvgHtml = '';
    let legendHtml = '';

    if (totalSpent === 0) {
      chartSvgHtml = `
        <svg class="chart-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg-tertiary)" stroke-width="20" />
        </svg>
        <div class="donut-center-text">
          <span class="donut-center-val">${formatMoney(0, currency)}</span>
          <span class="donut-center-sub">No Expenses</span>
        </div>
      `;
      legendHtml = `<div style="grid-column: span 2; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No spending logged in this space yet.</div>`;
    } else {
      const radius = 38;
      const circumference = 2 * Math.PI * radius;
      let accumulatedPercent = 0;

      let circles = '';
      spentCategories.forEach(cat => {
        const share = (cat.spent / totalSpent);
        const strokeLength = share * circumference;
        const strokeGap = circumference - strokeLength;
        const offset = -accumulatedPercent * circumference;
        accumulatedPercent += share;

        circles += `
          <circle 
            class="donut-segment" 
            cx="50" cy="50" r="${radius}" 
            stroke="${cat.color}" 
            stroke-dasharray="${strokeLength} ${strokeGap}" 
            stroke-dashoffset="${offset}"
          />
        `;

        legendHtml += `
          <div class="legend-item">
            <div class="legend-dot" style="background-color: ${cat.color};"></div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${cat.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${formatMoney(cat.spent, currency)} (${Math.round(share * 100)}%)</div>
            </div>
          </div>
        `;
      });

      chartSvgHtml = `
        <svg class="chart-svg" viewBox="0 0 100 100">
          ${circles}
        </svg>
        <div class="donut-center-text">
          <span class="donut-center-val">${formatMoney(totalSpent, currency)}</span>
          <span class="donut-center-sub">Spent</span>
        </div>
      `;
    }

    let html = `
      <div class="card">
        <h3 class="section-title" style="margin-bottom: 8px;">${ICONS['pie-chart']} ${data.space === 'personal' ? 'Personal' : 'Household'} Spending Breakdown</h3>
        <div class="chart-container">
          ${chartSvgHtml}
        </div>
        <div class="chart-legend">
          ${legendHtml}
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
        <h3 class="section-title">${ICONS['activity']} Cash Flow & Savings Health</h3>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.88rem; color: var(--text-secondary);">Savings Rate</span>
          <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: ${data.savingsRate >= 20 ? 'var(--accent-success)' : (data.savingsRate > 0 ? 'var(--accent-warning)' : 'var(--accent-danger)')};">
            ${Math.round(data.savingsRate)}%
          </span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${Math.max(0, Math.min(100, data.savingsRate))}%; background: var(--accent-success);"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
          <span style="font-size: 0.88rem; color: var(--text-secondary);">Financial Health Score</span>
          <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--accent-primary);">
            ${data.healthScore}/100
          </span>
        </div>
      </div>

      <div class="card">
        <h3 class="section-title" style="margin-bottom: 14px;">${ICONS['trending-up']} Budget vs. Actual</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
    `;

    data.categoryBudgets.forEach(cat => {
      html += `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600;">
            <span>${cat.name}</span>
            <span>${formatMoney(cat.spent, currency)} / ${formatMoney(cat.targetBudget, currency)}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${Math.min(100, cat.percentUsed)}%; background-color: ${cat.color};"></div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Render Settings & Admin Approvals Panel
   */
  renderSettings(settings) {
    const container = document.getElementById('view-settings');
    if (!container) return;

    const currencies = [
      { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
      { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
      { code: 'EUR', symbol: '€', name: 'Euro (€)' },
      { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
      { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' }
    ];

    let currencyOptions = currencies.map(c => 
      `<option value="${c.symbol}" ${settings.currency === c.symbol ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    const roomMembers = window.syncEngine ? window.syncEngine.getRoomMembers() : [];
    const approvedUsers = window.accessControl ? window.accessControl.getApprovedUsers() : [];

    // Merge members list
    const memberMap = {};
    [...roomMembers, ...approvedUsers].forEach(u => {
      if (u && u.name) {
        const key = u.name.toLowerCase().trim();
        memberMap[key] = {
          name: u.name,
          contact: u.contact || '',
          role: u.role || 'member',
          status: 'active'
        };
      }
    });
    const allMembersList = Object.values(memberMap);

    let membersListHtml = allMembersList.map(u => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: var(--bg-tertiary); border-radius: var(--radius-md); font-size: 0.84rem;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
            ${(u.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              ${u.name} ${u.role === 'admin' ? '<span class="status-badge safe" style="font-size: 0.65rem;">Admin</span>' : '<span class="status-badge safe" style="font-size: 0.65rem;">Member</span>'}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${u.contact || 'Verified User'}</div>
          </div>
        </div>
        <span style="font-size: 0.72rem; color: var(--accent-success); font-weight: 600;">● Active</span>
      </div>
    `).join('');

    const membersSectionHtml = `
      <!-- Active Household Members Roster -->
      <div class="card" style="border-color: rgba(245, 158, 11, 0.35); display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="section-title" style="font-size: 0.95rem;">${ICONS['user']} 👥 Active App Users (${allMembersList.length})</span>
          <span class="status-badge safe">✓ Live Roster</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${membersListHtml}
        </div>
      </div>
    `;

    const roomDetails = window.syncEngine ? window.syncEngine.getRoomDetails() : { roomCode: 'SHIKHAR-HOME', status: 'connected' };
    const isRoomActive = !!roomDetails.roomCode;

    const cloudSyncSectionHtml = `
      <!-- Joint Family Cloud Sync -->
      <div class="card" style="border-color: rgba(99, 102, 241, 0.4); display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="section-title" style="font-size: 0.95rem;">${ICONS['repeat']} Joint Family Cloud Sync</span>
          <span class="status-badge ${isRoomActive ? 'safe' : 'warning'}">${isRoomActive ? '🟢 Connected' : '⚪ Standalone'}</span>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">
          Syncs <strong>🏠 Household Space</strong> in real-time across your and your spouse's phones. Personal budgets stay strictly private.
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="form-group">
            <label class="form-label" style="font-size: 0.74rem;">Household Room Code</label>
            <input type="text" id="sync-input-room" class="input-field" value="${roomDetails.roomCode || 'SHIKHAR-HOME'}" placeholder="e.g. SHIKHAR-HOME" style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size: 0.74rem;">Family Sync PIN</label>
            <input type="password" id="sync-input-pin" class="input-field" value="${roomDetails.roomPin || '1234'}" placeholder="4-digit PIN">
          </div>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <button class="btn-primary" id="btn-sync-connect" style="font-size: 0.84rem; padding: 10px;">
              ${isRoomActive ? '🔄 Update Room' : '🔗 Connect Household Room'}
            </button>
            <button class="btn-secondary" id="btn-sync-copy-code" style="font-size: 0.84rem; padding: 10px;" title="Copy Code to Share with Family">
              📋 Share Code
            </button>
          </div>
        </div>
      </div>
    `;

    let html = `
      <div class="settings-group">
        ${cloudSyncSectionHtml}
        ${membersSectionHtml}

        <!-- Currency -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Currency</span>
            <span class="setting-desc">Primary currency symbol for display</span>
          </div>
          <select id="settings-currency-select" class="select-field" style="width: auto; padding: 6px 10px;">
            ${currencyOptions}
          </select>
        </div>

        <!-- Theme -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Theme</span>
            <span class="setting-desc">Dark Slate (recommended) / Crisp Light</span>
          </div>
          <select id="settings-theme-select" class="select-field" style="width: auto; padding: 6px 10px;">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark Slate</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Crisp Light</option>
          </select>
        </div>

        <!-- 🔒 4-Digit Local App PIN Lock -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">🔒 4-Digit Passcode Lock</span>
            <span class="setting-desc">${settings.appPin ? 'PIN Lock is active on app startup' : 'Protect your budget with a 4-digit PIN'}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            ${settings.appPin ? `
              <button class="btn-secondary" id="btn-change-pin" style="padding: 6px 10px; font-size: 0.8rem;">Change</button>
              <button class="btn-danger-outline" id="btn-disable-pin" style="padding: 6px 10px; font-size: 0.8rem;">Disable</button>
            ` : `
              <button class="btn-primary" id="btn-enable-pin" style="padding: 6px 12px; font-size: 0.8rem;">Set PIN</button>
            `}
          </div>
        </div>

        <!-- Share on WhatsApp -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Custom WhatsApp Share</span>
            <span class="setting-desc">Configure & send budget report to family</span>
          </div>
          <button class="btn-secondary" id="btn-settings-share-wa" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; color: #25D366; border-color: rgba(37, 211, 102, 0.4);">
            ${ICONS['whatsapp']} WhatsApp
          </button>
        </div>

        <!-- 🛡️ Privacy & Data Ownership Section -->
        <div style="margin-top: 14px;">
          <div class="privacy-trust-badge" style="margin-bottom: 12px;">
            <div class="privacy-badge-header">
              ${ICONS['shield-check']} <span>Zero Cloud Tracking · 100% Local-First</span>
            </div>
            <p>Your financial data never leaves your device. All transactions, budgets, and habits are stored exclusively in your browser's offline storage. Neither the developer nor any third party can ever see your numbers.</p>
          </div>
        </div>

        <!-- Export CSV & Backup JSON -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Export Transactions</span>
            <span class="setting-desc">Download records as CSV spreadsheet</span>
          </div>
          <button class="btn-secondary" id="btn-export-csv" style="padding: 6px 12px; font-size: 0.8rem;">Export CSV</button>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Backup & Restore</span>
            <span class="setting-desc">Download complete JSON backup or restore</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn-secondary" id="btn-backup-json" style="padding: 6px 12px; font-size: 0.8rem;">Backup</button>
            <label class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; cursor: pointer;">
              Restore
              <input type="file" id="input-restore-json" accept=".json" style="display: none;">
            </label>
          </div>
        </div>

        <!-- Reset Sample Data -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-title">Household Sample Data</span>
            <span class="setting-desc">Reload demo transactions and categories</span>
          </div>
          <button class="btn-secondary" id="btn-load-sample" style="padding: 6px 12px; font-size: 0.8rem;">Reload Demo</button>
        </div>

        <!-- Clear All -->
        <div class="setting-row" style="border-color: rgba(239, 68, 68, 0.3);">
          <div class="setting-info">
            <span class="setting-title text-danger">Wipe All Local Data</span>
            <span class="setting-desc">Purge all records from this device in 1 click</span>
          </div>
          <button class="btn-danger-outline" id="btn-wipe-data" style="padding: 6px 12px; font-size: 0.8rem;">Wipe Data</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Handlers
    document.getElementById('btn-settings-share-wa')?.addEventListener('click', () => this.openWhatsAppShareDrawer());

    document.getElementById('btn-sync-connect')?.addEventListener('click', async () => {
      const code = document.getElementById('sync-input-room')?.value || '';
      const pin = document.getElementById('sync-input-pin')?.value || '';
      try {
        await window.syncEngine.connectRoom(code, pin);
        this.showToast(`Household Room "${code.toUpperCase()}" Connected!`, 'success');
        this.renderSettings(settings);
      } catch (err) {
        this.showToast(err.message || 'Error connecting room', 'error');
      }
    });

    document.getElementById('btn-sync-copy-code')?.addEventListener('click', () => {
      const code = document.getElementById('sync-input-room')?.value || 'SHIKHAR-HOME';
      const shareMsg = `Join our Joint Household Budget on HomeBudget! Room Code: ${code.toUpperCase()}`;
      navigator.clipboard.writeText(shareMsg).then(() => {
        this.showToast('Household Room Code copied to clipboard!', 'success');
      });
    });

    container.querySelectorAll('.btn-approve-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        window.accessControl.approveUser(uid);
        this.showToast('User approved successfully!', 'success');
        this.renderSettings(settings);
      });
    });

    container.querySelectorAll('.btn-reject-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        window.accessControl.rejectUser(uid);
        this.showToast('Request rejected', 'info');
        this.renderSettings(settings);
      });
    });

    container.querySelectorAll('.btn-revoke-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        if (confirm('Revoke access for this user?')) {
          window.accessControl.revokeUser(uid);
          this.showToast('Access revoked', 'info');
          this.renderSettings(settings);
        }
      });
    });

    document.getElementById('settings-currency-select')?.addEventListener('change', (e) => {
      window.storageEngine.saveSettings({ currency: e.target.value });
      this.showToast('Currency updated', 'success');
      this.render();
    });

    document.getElementById('settings-theme-select')?.addEventListener('change', (e) => {
      const theme = e.target.value;
      window.storageEngine.saveSettings({ theme });
      this.applyTheme(theme);
      this.showToast(`Theme switched to ${theme}`, 'info');
    });

    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      const csv = window.storageEngine.exportToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `household_budget_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('CSV downloaded successfully', 'success');
    });

    document.getElementById('btn-backup-json')?.addEventListener('click', () => {
      const data = window.storageEngine.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Backup JSON downloaded', 'success');
    });

    document.getElementById('input-restore-json')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (window.storageEngine.importData(parsed)) {
            this.showToast('Data restored successfully!', 'success');
            this.render();
          } else {
            this.showToast('Invalid backup file', 'error');
          }
        } catch (err) {
          this.showToast('Error reading backup file', 'error');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-load-sample')?.addEventListener('click', () => {
      if (confirm('Reload household demo data? Current data will be replaced.')) {
        window.storageEngine.resetToSample();
        this.showToast('Demo data reloaded', 'success');
        this.render();
      }
    });

    document.getElementById('btn-enable-pin')?.addEventListener('click', () => {
      this.promptSetPin();
    });

    document.getElementById('btn-change-pin')?.addEventListener('click', () => {
      this.promptSetPin();
    });

    document.getElementById('btn-disable-pin')?.addEventListener('click', () => {
      if (confirm('Disable 4-digit App PIN passcode?')) {
        window.storageEngine.saveSettings({ appPin: null });
        sessionStorage.removeItem('hb_pin_unlocked');
        this.showToast('App PIN lock disabled', 'info');
        this.renderSettings(window.storageEngine.getSettings());
      }
    });

    document.getElementById('btn-wipe-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to wipe all transaction records?')) {
        window.storageEngine.clearAllData();
        this.showToast('All transaction records cleared', 'info');
        this.render();
      }
    });
  }

  /**
   * Open Add/Edit Transaction Modal
   */
  openTransactionModal(txId = null) {
    this.currentEditingTxId = txId;
    const modalBackdrop = document.getElementById('modal-transaction');
    const modalTitle = document.getElementById('modal-tx-title');
    const titleInput = document.getElementById('tx-input-title');
    const amountInput = document.getElementById('tx-input-amount');
    const dateInput = document.getElementById('tx-input-date');
    const methodSelect = document.getElementById('tx-input-method');
    const notesInput = document.getElementById('tx-input-notes');
    const btnDelete = document.getElementById('btn-tx-delete');
    const currencyTag = document.getElementById('modal-currency-tag');
    const spaceSelect = document.getElementById('tx-input-space');

    const settings = window.storageEngine.getSettings();
    if (currencyTag) currencyTag.textContent = settings.currency || '$';

    let currentType = 'expense';
    const activeSpace = window.storageEngine.getActiveSpace();

    if (txId) {
      const tx = window.transactionManager.getById(txId);
      if (!tx) return;

      if (modalTitle) modalTitle.textContent = 'Edit Transaction';
      currentType = tx.type;
      if (titleInput) titleInput.value = tx.title || '';
      if (amountInput) amountInput.value = tx.amount || '';
      if (dateInput) dateInput.value = tx.date || new Date().toISOString().slice(0, 10);
      if (notesInput) notesInput.value = tx.notes || '';
      if (methodSelect) methodSelect.value = tx.paymentMethod || 'UPI/Online';
      if (spaceSelect) spaceSelect.value = tx.space || 'household';
      if (btnDelete) btnDelete.classList.remove('hidden');
    } else {
      if (modalTitle) modalTitle.textContent = 'Add Transaction';
      if (titleInput) titleInput.value = '';
      if (amountInput) amountInput.value = '';
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      if (notesInput) notesInput.value = '';
      if (methodSelect) methodSelect.value = 'UPI/Online';
      if (spaceSelect) spaceSelect.value = activeSpace;
      if (btnDelete) btnDelete.classList.add('hidden');
    }

    this.setTransactionType(currentType);
    this.populateCategorySelect(currentType, txId ? window.transactionManager.getById(txId)?.categoryId : null);

    // Render Frequent Favorites Chips
    const favWrap = document.getElementById('quick-favorites-bar-wrap');
    const favContainer = document.getElementById('quick-favorites-chips');
    const suggestionsList = document.getElementById('tx-suggestions-list');
    if (suggestionsList) suggestionsList.style.display = 'none';

    if (favContainer && favWrap) {
      if (txId) {
        favWrap.style.display = 'none';
      } else {
        favWrap.style.display = 'flex';
        const favorites = window.habitEngine ? window.habitEngine.getFrequentFavorites(4, activeSpace) : [];
        let favHtml = '';
        favorites.forEach(f => {
          favHtml += `
            <button type="button" class="favorite-chip" data-title="${f.title}" data-amt="${f.amount}" data-cat="${f.categoryId}" data-method="${f.paymentMethod || 'UPI/Online'}">
              <span>${f.title}</span> <span class="favorite-chip-amt">${settings.currency || '₹'}${f.amount}</span>
            </button>
          `;
        });
        favContainer.innerHTML = favHtml;

        favContainer.querySelectorAll('.favorite-chip').forEach(btn => {
          btn.onclick = () => {
            if (titleInput) titleInput.value = btn.getAttribute('data-title');
            if (amountInput) amountInput.value = btn.getAttribute('data-amt');
            if (methodSelect) methodSelect.value = btn.getAttribute('data-method');
            const catId = btn.getAttribute('data-cat');
            if (catId) this.populateCategorySelect('expense', catId);
            this.showToast(`Auto-filled: ${btn.getAttribute('data-title')}`, 'info');
          };
        });
      }
    }

    if (modalBackdrop) modalBackdrop.classList.add('open');
  }

  setTransactionType(type) {
    const typeIncomeBtn = document.getElementById('tx-type-income');
    const typeExpenseBtn = document.getElementById('tx-type-expense');
    const hiddenType = document.getElementById('tx-hidden-type');

    if (hiddenType) hiddenType.value = type;

    if (type === 'income') {
      typeIncomeBtn?.classList.add('income-active');
      typeExpenseBtn?.classList.remove('expense-active');
    } else {
      typeExpenseBtn?.classList.add('expense-active');
      typeIncomeBtn?.classList.remove('income-active');
    }

    this.populateCategorySelect(type);
  }

  populateCategorySelect(type, selectedCatId = null) {
    const catSelect = document.getElementById('tx-input-category');
    if (!catSelect) return;

    const categories = window.storageEngine.getCategories().filter(c => c.type === type);
    catSelect.innerHTML = '';

    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} ${c.type === 'expense' ? `(${c.percentage}%)` : ''}`;
      if (selectedCatId && selectedCatId === c.id) {
        opt.selected = true;
      }
      catSelect.appendChild(opt);
    });
  }

  /**
   * Show Duplicate Alert Dialog
   */
  showDuplicateAlert(duplicateTx, onConfirmAdd) {
    const modal = document.getElementById('modal-duplicate-alert');
    const descEl = document.getElementById('dup-alert-desc');
    const btnAddAnyway = document.getElementById('btn-dup-add-anyway');
    const btnViewExisting = document.getElementById('btn-dup-view-existing');
    const settings = window.storageEngine.getSettings();

    if (descEl) {
      descEl.innerHTML = `
        A similar transaction of <strong>${formatMoney(duplicateTx.amount, settings.currency)}</strong> for "<strong>${duplicateTx.title}</strong>" was already logged on <strong>${duplicateTx.date}</strong> by <strong>${duplicateTx.addedBy || 'Me'}</strong>.
      `;
    }

    if (btnAddAnyway) {
      btnAddAnyway.onclick = () => {
        this.closeModal('modal-duplicate-alert');
        onConfirmAdd();
      };
    }

    if (btnViewExisting) {
      btnViewExisting.onclick = () => {
        this.closeModal('modal-duplicate-alert');
        this.openTransactionModal(duplicateTx.id);
      };
    }

    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  openMonthSelector() {
    const modal = document.getElementById('modal-month-selector');
    const list = document.getElementById('month-selector-list');
    if (!modal || !list) return;

    const months = window.budgetEngine.getAvailableMonths();
    let html = '';

    months.forEach(m => {
      const isSelected = m === this.selectedMonth;
      html += `
        <div class="transaction-item ${isSelected ? 'selected' : ''}" data-month="${m}" style="${isSelected ? 'border-color: var(--accent-primary); background: var(--bg-card-hover);' : ''}">
          <div style="font-weight: 700; font-size: 1rem;">${formatMonthLabel(m)}</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${m}</span>
        </div>
      `;
    });

    list.innerHTML = html;

    list.querySelectorAll('.transaction-item').forEach(item => {
      item.addEventListener('click', () => {
        const month = item.getAttribute('data-month');
        this.selectedMonth = month;
        window.storageEngine.saveSettings({ monthFilter: month });
        this.closeModal('modal-month-selector');
        this.render();
      });
    });

    modal.classList.add('open');
  }

  promptSetPin() {
    const pin = prompt('Enter a 4-digit security PIN for Gullak:');
    if (!pin) return;
    const cleanPin = pin.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      alert('PIN must be exactly 4 numeric digits (e.g. 1234)');
      return;
    }
    window.storageEngine.saveSettings({ appPin: cleanPin });
    sessionStorage.setItem('hb_pin_unlocked', 'true');
    this.showToast('4-Digit App PIN set successfully!', 'success');
    this.renderSettings(window.storageEngine.getSettings());
  }

  checkAppPinLock() {
    const settings = window.storageEngine.getSettings();
    if (!settings.appPin) {
      this.hidePinLockScreen();
      return true;
    }

    const isUnlocked = sessionStorage.getItem('hb_pin_unlocked') === 'true';
    if (isUnlocked) {
      this.hidePinLockScreen();
      return true;
    }

    this.showPinLockScreen(settings.appPin, () => {
      sessionStorage.setItem('hb_pin_unlocked', 'true');
      this.hidePinLockScreen();
      this.render();
    });
    return false;
  }

  showPinLockScreen(targetPin, onSuccess) {
    const screen = document.getElementById('pin-lock-screen');
    if (!screen) return;

    screen.style.display = 'flex';
    let enteredPin = '';

    const updateDots = () => {
      const dots = screen.querySelectorAll('.pin-dot');
      dots.forEach((dot, idx) => {
        if (idx < enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled', 'error');
        }
      });
    };

    updateDots();

    const handleKey = (key) => {
      if (enteredPin.length < 4) {
        enteredPin += key;
        updateDots();

        if (enteredPin.length === 4) {
          if (enteredPin === targetPin) {
            this.showToast('Unlocked!', 'success');
            onSuccess();
          } else {
            // Shake and error
            const dots = screen.querySelectorAll('.pin-dot');
            dots.forEach(d => d.classList.add('error'));
            const container = screen.querySelector('.pin-lock-container');
            container?.classList.add('pin-shake');
            setTimeout(() => {
              container?.classList.remove('pin-shake');
              enteredPin = '';
              updateDots();
            }, 500);
          }
        }
      }
    };

    // Attach keypad keys
    const keypad = document.getElementById('pin-keypad-grid');
    if (keypad) {
      keypad.onclick = (e) => {
        const keyBtn = e.target.closest('.pin-key');
        if (!keyBtn) return;
        const digit = keyBtn.getAttribute('data-key');
        if (digit !== null) {
          handleKey(digit);
        } else if (keyBtn.id === 'btn-pin-backspace') {
          if (enteredPin.length > 0) {
            enteredPin = enteredPin.slice(0, -1);
            updateDots();
          }
        } else if (keyBtn.id === 'btn-pin-clear') {
          enteredPin = '';
          updateDots();
        }
      };
    }
  }

  hidePinLockScreen() {
    const screen = document.getElementById('pin-lock-screen');
    if (screen) screen.style.display = 'none';
  }
}

window.uiRenderer = new UIRenderer();
