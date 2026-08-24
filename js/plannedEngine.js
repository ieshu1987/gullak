/**
 * Planned Items & Household Wishlist Engine for Gullak
 * Handles upcoming bills, household wishlists, 1-tap conversion to transactions, and WhatsApp checklist sharing.
 */

const PLANNED_STORAGE_KEY = 'hb_planned_items';

function generateSamplePlannedItems() {
  return [
    {
      id: 'plan-1',
      title: 'Family Health Insurance Renewal',
      estimatedAmount: 14500,
      priority: 'urgent', // 'urgent' | 'normal' | 'someday'
      status: 'pending', // 'pending' | 'completed'
      dueDate: new Date(Date.now() + 12 * 86400000).toISOString().slice(0, 10),
      categoryId: 'healthcare',
      space: 'household',
      notes: 'Annual policy renewal premium',
      createdAt: new Date().toISOString()
    },
    {
      id: 'plan-2',
      title: 'Fresh Fruits & Weekly Veggies',
      estimatedAmount: 850,
      priority: 'urgent',
      status: 'pending',
      dueDate: new Date().toISOString().slice(0, 10),
      categoryId: 'groceries',
      space: 'household',
      notes: 'Bananas, apples, vegetables for the week',
      createdAt: new Date().toISOString()
    },
    {
      id: 'plan-3',
      title: 'Living Room Ergonomic Rug',
      estimatedAmount: 3200,
      priority: 'normal',
      status: 'pending',
      dueDate: '',
      categoryId: 'housing',
      space: 'household',
      notes: 'Neutral beige rug for hall',
      createdAt: new Date().toISOString()
    },
    {
      id: 'plan-4',
      title: 'Espresso Coffee Machine',
      estimatedAmount: 8500,
      priority: 'someday',
      status: 'pending',
      dueDate: '',
      categoryId: 'personal',
      space: 'personal',
      notes: 'For weekend brewing',
      createdAt: new Date().toISOString()
    }
  ];
}

class PlannedEngine {
  constructor(storageEngine) {
    this.storage = storageEngine || (typeof window !== 'undefined' ? window.storageEngine : null);
    this.init();
  }

  getStorage() {
    return this.storage || window.storageEngine;
  }

  init() {
    if (!localStorage.getItem(PLANNED_STORAGE_KEY)) {
      localStorage.setItem(PLANNED_STORAGE_KEY, JSON.stringify(generateSamplePlannedItems()));
    }
  }

  getAll(space = null) {
    try {
      const data = localStorage.getItem(PLANNED_STORAGE_KEY);
      let list = data ? JSON.parse(data) : [];
      const storage = this.getStorage();
      const activeSpace = space || (storage ? storage.getActiveSpace() : 'household');
      return list.filter(item => (item.space || 'household') === activeSpace);
    } catch (e) {
      console.error('Error loading planned items:', e);
      return [];
    }
  }

  saveAll(items) {
    localStorage.setItem(PLANNED_STORAGE_KEY, JSON.stringify(items));
  }

  addItem(data) {
    const rawList = this.getAllRaw();
    const storage = this.getStorage();
    const activeSpace = data.space || (storage ? storage.getActiveSpace() : 'household');

    const newItem = {
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: (data.title || '').trim(),
      estimatedAmount: parseFloat(data.estimatedAmount) || 0,
      priority: data.priority || 'normal',
      status: 'pending',
      dueDate: data.dueDate || '',
      categoryId: data.categoryId || 'groceries',
      space: activeSpace,
      notes: (data.notes || '').trim(),
      createdAt: new Date().toISOString()
    };

    if (!newItem.title) {
      throw new Error('Please enter a title for the planned item');
    }

    rawList.unshift(newItem);
    this.saveAll(rawList);
    return newItem;
  }

  getAllRaw() {
    try {
      const data = localStorage.getItem(PLANNED_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  updateItem(id, data) {
    const rawList = this.getAllRaw();
    const idx = rawList.findIndex(i => i.id === id);
    if (idx !== -1) {
      rawList[idx] = { ...rawList[idx], ...data, updatedAt: new Date().toISOString() };
      this.saveAll(rawList);
      return rawList[idx];
    }
    return null;
  }

  deleteItem(id) {
    let rawList = this.getAllRaw();
    rawList = rawList.filter(i => i.id !== id);
    this.saveAll(rawList);
  }

  toggleStatus(id) {
    const rawList = this.getAllRaw();
    const item = rawList.find(i => i.id === id);
    if (item) {
      item.status = item.status === 'completed' ? 'pending' : 'completed';
      if (item.status === 'completed') {
        item.completedAt = new Date().toISOString();
      }
      this.saveAll(rawList);
      return item;
    }
    return null;
  }

  /**
   * 1-Tap Convert Planned Item into an Active Transaction
   */
  convertToTransaction(id, actualAmount = null) {
    const rawList = this.getAllRaw();
    const item = rawList.find(i => i.id === id);
    if (!item) throw new Error('Item not found');

    const finalAmount = actualAmount !== null ? parseFloat(actualAmount) : (item.estimatedAmount || 0);

    // Create real transaction
    const tx = window.transactionManager.create({
      title: item.title,
      amount: finalAmount > 0 ? finalAmount : 1,
      type: 'expense',
      categoryId: item.categoryId || 'groceries',
      date: new Date().toISOString().slice(0, 10),
      space: item.space || 'household',
      paymentMethod: 'UPI/Online',
      notes: `Converted from planned list${item.notes ? ` (${item.notes})` : ''}`
    });

    // Mark planned item as completed
    item.status = 'completed';
    item.completedAt = new Date().toISOString();
    item.convertedTxId = tx.id;
    this.saveAll(rawList);

    return tx;
  }

  getSummary(space = null) {
    const items = this.getAll(space);
    const pending = items.filter(i => i.status === 'pending');
    const urgent = pending.filter(i => i.priority === 'urgent');
    const normal = pending.filter(i => i.priority === 'normal');
    const someday = pending.filter(i => i.priority === 'someday');
    const completed = items.filter(i => i.status === 'completed');

    const totalPendingAmount = pending.reduce((sum, i) => sum + (Number(i.estimatedAmount) || 0), 0);

    return {
      totalCount: items.length,
      pendingCount: pending.length,
      urgent,
      normal,
      someday,
      completed,
      totalPendingAmount
    };
  }

  /**
   * Format Checklist for WhatsApp Sharing
   */
  buildWhatsAppChecklist(space = null) {
    const storage = this.getStorage();
    const activeSpace = space || (storage ? storage.getActiveSpace() : 'household');
    const summary = this.getSummary(activeSpace);
    const settings = storage ? storage.getSettings() : { currency: '₹' };
    const currency = settings.currency || '₹';
    const spaceName = activeSpace === 'personal' ? '👤 Personal Wishlist' : '🏠 Household Shopping & Planned Bills';

    let text = `📋 *${spaceName}*\n`;
    text += `💰 *Pending Budget Total:* ${currency}${summary.totalPendingAmount.toLocaleString()}\n\n`;

    if (summary.urgent.length > 0) {
      text += `🔴 *NEED NOW / URGENT:*\n`;
      summary.urgent.forEach(item => {
        const amt = item.estimatedAmount > 0 ? ` (${currency}${item.estimatedAmount.toLocaleString()})` : '';
        const due = item.dueDate ? ` [Due: ${item.dueDate}]` : '';
        text += `• ⬜ ${item.title}${amt}${due}\n`;
      });
      text += `\n`;
    }

    if (summary.normal.length > 0) {
      text += `🟡 *PLANNED / CAN WAIT:*\n`;
      summary.normal.forEach(item => {
        const amt = item.estimatedAmount > 0 ? ` (${currency}${item.estimatedAmount.toLocaleString()})` : '';
        text += `• ⬜ ${item.title}${amt}\n`;
      });
      text += `\n`;
    }

    if (summary.someday.length > 0) {
      text += `💡 *WISHLIST / SOMEDAY:*\n`;
      summary.someday.forEach(item => {
        const amt = item.estimatedAmount > 0 ? ` (${currency}${item.estimatedAmount.toLocaleString()})` : '';
        text += `• 💭 ${item.title}${amt}\n`;
      });
      text += `\n`;
    }

    text += `📱 _Generated via Gullak App_`;
    return text;
  }
}

window.plannedEngine = new PlannedEngine(window.storageEngine);
