/**
 * Transaction Manager (Dual-Space & Anti-Duplication Support)
 */

class TransactionManager {
  constructor(storageEngine) {
    this.storage = storageEngine;
  }

  create(data) {
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount greater than 0');
    }
    if (!data.title || !data.title.trim()) {
      throw new Error('Please enter a title for the transaction');
    }
    if (!data.categoryId) {
      throw new Error('Please select a category');
    }
    if (!data.date) {
      data.date = new Date().toISOString().slice(0, 10);
    }

    const activeSpace = data.space || this.storage.getActiveSpace();
    const currentUser = window.accessControl ? window.accessControl.getCurrentUser() : null;

    const tx = {
      title: data.title.trim(),
      amount: Math.round(amount * 100) / 100,
      type: data.type === 'income' ? 'income' : 'expense',
      categoryId: data.categoryId,
      date: data.date,
      space: activeSpace,
      addedBy: data.addedBy || (currentUser && currentUser.name ? currentUser.name.split(' ')[0] : 'Me'),
      paymentMethod: data.paymentMethod || 'UPI/Online',
      notes: (data.notes || '').trim()
    };

    return this.storage.addTransaction(tx);
  }

  update(id, data) {
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount greater than 0');
    }
    if (!data.title || !data.title.trim()) {
      throw new Error('Please enter a title for the transaction');
    }

    const tx = {
      title: data.title.trim(),
      amount: Math.round(amount * 100) / 100,
      type: data.type === 'income' ? 'income' : 'expense',
      categoryId: data.categoryId,
      date: data.date,
      space: data.space || this.storage.getActiveSpace(),
      paymentMethod: data.paymentMethod || 'UPI/Online',
      notes: (data.notes || '').trim()
    };

    return this.storage.updateTransaction(id, tx);
  }

  moveSpace(id, targetSpace) {
    return this.storage.moveTransactionSpace(id, targetSpace);
  }

  delete(id) {
    this.storage.deleteTransaction(id);
    return true;
  }

  getById(id) {
    const list = this.storage.getTransactions();
    return list.find(t => t.id === id) || null;
  }

  checkDuplicate(txData, excludeId = null) {
    return window.budgetEngine.findPotentialDuplicates(txData, excludeId);
  }

  filter(options = {}) {
    const activeSpace = options.space || this.storage.getActiveSpace();
    let list = this.storage.getTransactions(activeSpace);

    if (options.month) {
      list = list.filter(t => t.date && t.date.startsWith(options.month));
    }

    if (options.type && options.type !== 'all') {
      list = list.filter(t => t.type === options.type);
    }

    if (options.categoryId && options.categoryId !== 'all') {
      list = list.filter(t => t.categoryId === options.categoryId);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q)) ||
        (t.addedBy && t.addedBy.toLowerCase().includes(q))
      );
    }

    // Sort order: default date descending
    const sortBy = options.sortBy || 'date_desc';
    list.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    return list;
  }
}

window.transactionManager = new TransactionManager(window.storageEngine);
