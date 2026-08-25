/**
 * Storage & State Engine for Gullak (Household Budget Tracker)
 * Default Currency: Indian Rupee (₹ / INR)
 */

const STORAGE_KEYS = {
  TRANSACTIONS: 'hb_transactions',
  CATEGORIES: 'hb_categories',
  SETTINGS: 'hb_settings',
  ACTIVE_SPACE: 'hb_active_space'
};

const DEFAULT_CATEGORIES = [
  // Expense Categories
  { id: 'groceries', name: 'Groceries & Food', percentage: 25, color: '#10B981', icon: 'shopping-bag', type: 'expense', space: 'all' },
  { id: 'housing', name: 'Housing & Utilities', percentage: 30, color: '#6366F1', icon: 'home', type: 'expense', space: 'household' },
  { id: 'investments', name: 'Investments & Savings', percentage: 20, color: '#0EA5E9', icon: 'trending-up', type: 'expense', space: 'all' },
  { id: 'transport', name: 'Transportation & Fuel', percentage: 10, color: '#F59E0B', icon: 'truck', type: 'expense', space: 'all' },
  { id: 'healthcare', name: 'Healthcare & Medical', percentage: 5, color: '#EC4899', icon: 'activity', type: 'expense', space: 'all' },
  { id: 'personal', name: 'Personal & Leisure', percentage: 10, color: '#8B5CF6', icon: 'smile', type: 'expense', space: 'personal' },
  // Income Categories
  { id: 'salary', name: 'Salary / Wages', percentage: 0, color: '#059669', icon: 'briefcase', type: 'income', space: 'all' },
  { id: 'freelance', name: 'Freelance / Business', percentage: 0, color: '#2563EB', icon: 'zap', type: 'income', space: 'all' },
  { id: 'returns', name: 'Investment Returns', percentage: 0, color: '#D97706', icon: 'dollar-sign', type: 'income', space: 'all' },
  { id: 'other_income', name: 'Other Income', percentage: 0, color: '#7C3AED', icon: 'plus-circle', type: 'income', space: 'all' }
];

const DEFAULT_SETTINGS = {
  currency: '₹',
  currencyCode: 'INR',
  theme: 'dark',
  monthFilter: new Date().toISOString().slice(0, 7),
  budgetMode: 'percentage',
  alertThreshold: 90
};

function generateSampleTransactions() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return [
    {
      id: 'tx-1',
      title: 'Monthly Salary Credit',
      amount: 75000,
      type: 'income',
      categoryId: 'salary',
      date: `${year}-${month}-01`,
      paymentMethod: 'Bank Transfer',
      notes: 'Primary household income',
      space: 'household',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-2',
      title: 'Freelance Consulting',
      amount: 15000,
      type: 'income',
      categoryId: 'freelance',
      date: `${year}-${month}-05`,
      paymentMethod: 'UPI/Online',
      notes: 'Weekend client project',
      space: 'personal',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-3',
      title: 'Apartment Rent & Society Maintenance',
      amount: 22000,
      type: 'expense',
      categoryId: 'housing',
      date: `${year}-${month}-02`,
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly rent transfer',
      space: 'household',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-4',
      title: 'Nifty Index Fund SIP',
      amount: 15000,
      type: 'expense',
      categoryId: 'investments',
      date: `${year}-${month}-04`,
      paymentMethod: 'Bank Auto-Debit',
      notes: 'Automated mutual fund SIP',
      space: 'household',
      addedBy: 'Spouse'
    },
    {
      id: 'tx-5',
      title: 'DMart Supermarket Monthly Restock',
      amount: 5800,
      type: 'expense',
      categoryId: 'groceries',
      date: `${year}-${month}-06`,
      paymentMethod: 'Credit Card',
      notes: 'Pantry staples, rice, oil, pulses',
      space: 'household',
      addedBy: 'Spouse'
    },
    {
      id: 'tx-6',
      title: 'Electricity Bill (BESCOM/MSEB)',
      amount: 1850,
      type: 'expense',
      categoryId: 'housing',
      date: `${year}-${month}-08`,
      paymentMethod: 'UPI/Online',
      notes: 'Electricity bill payment',
      space: 'household',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-7',
      title: 'Car Petrol Refuel',
      amount: 2500,
      type: 'expense',
      categoryId: 'transport',
      date: `${year}-${month}-10`,
      paymentMethod: 'UPI/Online',
      notes: 'Full tank petrol',
      space: 'household',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-8',
      title: 'Weekend Cafe & Book',
      amount: 450,
      type: 'expense',
      categoryId: 'personal',
      date: `${year}-${month}-12`,
      paymentMethod: 'UPI/Online',
      notes: 'Cold brew and croissant',
      space: 'personal',
      addedBy: 'Shikhar'
    },
    {
      id: 'tx-9',
      title: 'Apollo Pharmacy Medicines',
      amount: 720,
      type: 'expense',
      categoryId: 'healthcare',
      date: `${year}-${month}-14`,
      paymentMethod: 'UPI/Online',
      notes: 'Vitamins and essentials',
      space: 'household',
      addedBy: 'Spouse'
    },
    {
      id: 'tx-10',
      title: 'Family Dinner (Swiggy / Dining Out)',
      amount: 1450,
      type: 'expense',
      categoryId: 'personal',
      date: `${year}-${month}-15`,
      paymentMethod: 'UPI/Online',
      notes: 'Weekend dinner',
      space: 'household',
      addedBy: 'Shikhar'
    }
  ];
}

class StorageEngine {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } else {
      // Force default to INR ₹ if still set to $
      const currentSettings = this.getSettings();
      if (currentSettings.currency === '$') {
        currentSettings.currency = '₹';
        currentSettings.currencyCode = 'INR';
        this.saveSettings(currentSettings);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_SPACE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SPACE, 'household');
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(generateSampleTransactions()));
    }
  }

  getActiveSpace() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SPACE) || 'household';
  }

  setActiveSpace(spaceName) {
    const space = spaceName === 'personal' ? 'personal' : 'household';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SPACE, space);
    return space;
  }

  getTransactions(filterSpace = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      let list = data ? JSON.parse(data) : [];
      if (filterSpace) {
        list = list.filter(t => (t.space || 'household') === filterSpace);
      }
      return list;
    } catch (e) {
      console.error('Error loading transactions:', e);
      return [];
    }
  }

  saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  mergeHouseholdTransactions(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return 0;
    const current = this.getTransactions();
    const existingMap = new Map();
    current.forEach(t => existingMap.set(t.id, t));

    let addedCount = 0;
    remoteList.forEach(rt => {
      if (rt && rt.id && rt.space === 'household') {
        if (!existingMap.has(rt.id)) {
          current.push(rt);
          existingMap.set(rt.id, rt);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      current.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      this.saveTransactions(current);
    }
    return addedCount;
  }

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const activeSpace = this.getActiveSpace();
    const currentUser = window.accessControl ? window.accessControl.getCurrentUser() : null;

    const newTx = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      space: transaction.space || activeSpace,
      addedBy: transaction.addedBy || (currentUser ? currentUser.name.split(' ')[0] : 'Me'),
      ...transaction
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);

    // Notify sync if household space
    if (newTx.space === 'household' && window.syncEngine && typeof window.syncEngine.broadcastPresence === 'function') {
      window.syncEngine.broadcastPresence({ isReply: true });
    }

    return newTx;
  }

  updateTransaction(id, updatedData) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedData, updatedAt: new Date().toISOString() };
      this.saveTransactions(transactions);

      if (transactions[index].space === 'household' && window.syncEngine && typeof window.syncEngine.broadcastPresence === 'function') {
        window.syncEngine.broadcastPresence({ isReply: true });
      }

      return transactions[index];
    }
    return null;
  }

  moveTransactionSpace(id, targetSpace) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index].space = targetSpace;
      transactions[index].updatedAt = new Date().toISOString();
      this.saveTransactions(transactions);
      return transactions[index];
    }
    return null;
  }

  deleteTransaction(id) {
    let transactions = this.getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(transactions);
  }

  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  }

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  exportAllData() {
    return {
      version: '4.0',
      appName: 'Gullak',
      exportDate: new Date().toISOString(),
      activeSpace: this.getActiveSpace(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      settings: this.getSettings()
    };
  }

  exportToCSV() {
    const transactions = this.getTransactions();
    const categories = this.getCategories();
    const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

    const headers = ['ID', 'Date', 'Space', 'Added By', 'Type', 'Category', 'Title', 'Amount (INR)', 'Payment Method', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.space || 'household',
      `"${(t.addedBy || '').replace(/"/g, '""')}"`,
      t.type,
      `"${(catMap[t.categoryId] || t.categoryId || '').replace(/"/g, '""')}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  importData(jsonData) {
    try {
      if (jsonData.transactions && Array.isArray(jsonData.transactions)) {
        this.saveTransactions(jsonData.transactions);
      }
      if (jsonData.categories && Array.isArray(jsonData.categories)) {
        this.saveCategories(jsonData.categories);
      }
      if (jsonData.settings) {
        this.saveSettings(jsonData.settings);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  resetToSample() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(generateSampleTransactions()));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SPACE, 'household');
  }

  clearAllData() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
}

window.storageEngine = new StorageEngine();
