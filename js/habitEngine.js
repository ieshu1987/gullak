/**
 * Habit Learning & Predictive Auto-Suggest Engine for Gullak
 * Analyzes transaction patterns to provide 1-tap favorites, predictive auto-completion, and recurring bill prompts.
 */

class HabitEngine {
  constructor(storageEngine) {
    this.storage = storageEngine || (typeof window !== 'undefined' ? window.storageEngine : null);
  }

  getStorage() {
    return this.storage || window.storageEngine;
  }

  /**
   * Builds frequency & pattern map from transaction history
   */
  getHabitMap(space = null) {
    const storage = this.getStorage();
    if (!storage) return [];

    const activeSpace = space || storage.getActiveSpace();
    const transactions = storage.getTransactions(activeSpace) || [];

    const map = {};

    transactions.forEach(t => {
      const key = (t.title || '').trim().toLowerCase();
      if (!key) return;

      if (!map[key]) {
        map[key] = {
          title: t.title.trim(),
          count: 0,
          amounts: {},
          categories: {},
          paymentMethods: {},
          lastLoggedDate: t.date,
          type: t.type || 'expense',
          space: t.space || activeSpace
        };
      }

      map[key].count += 1;
      map[key].amounts[t.amount] = (map[key].amounts[t.amount] || 0) + 1;
      map[key].categories[t.categoryId] = (map[key].categories[t.categoryId] || 0) + 1;
      map[key].paymentMethods[t.paymentMethod || 'UPI/Online'] = (map[key].paymentMethods[t.paymentMethod || 'UPI/Online'] || 0) + 1;

      if (new Date(t.date) > new Date(map[key].lastLoggedDate)) {
        map[key].lastLoggedDate = t.date;
        map[key].title = t.title.trim();
      }
    });

    // Resolve most frequent values for each item
    const resolved = Object.values(map).map(item => {
      const bestAmount = Object.entries(item.amounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
      const bestCategory = Object.entries(item.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'groceries';
      const bestMethod = Object.entries(item.paymentMethods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'UPI/Online';

      return {
        title: item.title,
        count: item.count,
        amount: parseFloat(bestAmount),
        categoryId: bestCategory,
        paymentMethod: bestMethod,
        type: item.type,
        space: item.space,
        lastLoggedDate: item.lastLoggedDate
      };
    });

    return resolved;
  }

  /**
   * Returns top frequent items for 1-tap quick logging
   */
  getFrequentFavorites(limit = 4, space = null) {
    try {
      const habits = this.getHabitMap(space);
      habits.sort((a, b) => b.count - a.count);

      const list = habits.slice(0, limit);
      if (list.length === 0) {
        return [
          { title: 'Milk & Dairy', amount: 60, categoryId: 'groceries', paymentMethod: 'UPI/Online', type: 'expense' },
          { title: 'Morning Coffee', amount: 40, categoryId: 'personal', paymentMethod: 'UPI/Online', type: 'expense' },
          { title: 'Fresh Fruits', amount: 150, categoryId: 'groceries', paymentMethod: 'UPI/Online', type: 'expense' },
          { title: 'Auto / Metro Commute', amount: 80, categoryId: 'transport', paymentMethod: 'UPI/Online', type: 'expense' }
        ];
      }
      return list;
    } catch (e) {
      console.warn('Error loading frequent favorites:', e);
      return [];
    }
  }

  /**
   * Predictive Suggestions as user types in Title field
   */
  getSuggestions(query, space = null) {
    if (!query || !query.trim()) return [];
    try {
      const q = query.toLowerCase().trim();
      const habits = this.getHabitMap(space);

      const matches = habits.filter(h => h.title.toLowerCase().includes(q));
      matches.sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(q);
        const bStarts = b.title.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return b.count - a.count;
      });

      return matches.slice(0, 5);
    } catch (e) {
      console.warn('Error getting suggestions:', e);
      return [];
    }
  }

  /**
   * Proactive Recurring Monthly Bill Reminders
   */
  getPendingRecurringBills(currentMonthStr, space = null) {
    const storage = this.getStorage();
    if (!storage) return [];

    try {
      const activeSpace = space || storage.getActiveSpace();
      const transactions = storage.getTransactions(activeSpace) || [];
      const currentTx = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr));

      const currentTitles = new Set(currentTx.map(t => (t.title || '').toLowerCase().trim()));

      const pastTx = transactions.filter(t => t.date && !t.date.startsWith(currentMonthStr));
      const pastRecurring = {};

      pastTx.forEach(t => {
        if (t.type !== 'expense') return;
        const title = (t.title || '').trim();
        const lower = title.toLowerCase();
        if (/rent|wifi|broadband|electricity|bill|sip|investment|maintenance|subscription|netflix|prime|gas/i.test(lower)) {
          if (!pastRecurring[lower]) {
            pastRecurring[lower] = {
              title: title,
              amount: t.amount,
              categoryId: t.categoryId,
              paymentMethod: t.paymentMethod,
              space: t.space
            };
          }
        }
      });

      const pendingReminders = [];
      Object.keys(pastRecurring).forEach(lowerKey => {
        if (!currentTitles.has(lowerKey)) {
          pendingReminders.push(pastRecurring[lowerKey]);
        }
      });

      return pendingReminders.slice(0, 2);
    } catch (e) {
      console.warn('Error getting pending recurring bills:', e);
      return [];
    }
  }
}

window.habitEngine = new HabitEngine(window.storageEngine);
