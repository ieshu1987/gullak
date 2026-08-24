/**
 * Budget Calculation Engine (Dual-Space & Anti-Duplication Enabled)
 */

const PRESET_TEMPLATES = {
  balanced: {
    name: 'Balanced Household (Recommended)',
    description: 'A standard household split prioritizing balanced living, food, and long-term wealth.',
    allocations: {
      groceries: 25,
      housing: 30,
      investments: 20,
      transport: 10,
      healthcare: 5,
      personal: 10
    }
  },
  rule503020: {
    name: '50/30/20 Classic Rule',
    description: '50% Needs (Groceries, Housing, Transport, Health), 30% Wants, 20% Investments & Savings.',
    allocations: {
      housing: 25,
      groceries: 15,
      transport: 5,
      healthcare: 5,
      personal: 30,
      investments: 20
    }
  },
  aggressiveSavings: {
    name: 'Aggressive Wealth Builder',
    description: 'Maximizes investments and savings (35%) while maintaining disciplined household costs.',
    allocations: {
      investments: 35,
      housing: 25,
      groceries: 20,
      transport: 8,
      healthcare: 4,
      personal: 8
    }
  },
  frugal: {
    name: 'Essential & Lean Living',
    description: 'Minimizes discretionary expenses to focus heavily on debt reduction and emergency funds.',
    allocations: {
      housing: 35,
      groceries: 25,
      investments: 25,
      transport: 7,
      healthcare: 5,
      personal: 3
    }
  }
};

class BudgetEngine {
  constructor(storageEngine) {
    this.storage = storageEngine;
  }

  /**
   * Computes financial overview for a specific month and space
   */
  getMonthOverview(monthStr, space = null) {
    const activeSpace = space || this.storage.getActiveSpace();
    const transactions = this.storage.getTransactions(activeSpace);
    const categories = this.storage.getCategories();
    const settings = this.storage.getSettings();

    // Filter transactions for specified month
    const monthTx = transactions.filter(t => t.date && t.date.startsWith(monthStr));

    let totalIncome = 0;
    let totalExpense = 0;

    const categorySpendMap = {};
    const categoryIncomeMap = {};

    categories.forEach(c => {
      categorySpendMap[c.id] = 0;
      categoryIncomeMap[c.id] = 0;
    });

    monthTx.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
        categoryIncomeMap[t.categoryId] = (categoryIncomeMap[t.categoryId] || 0) + amt;
      } else if (t.type === 'expense') {
        totalExpense += amt;
        categorySpendMap[t.categoryId] = (categorySpendMap[t.categoryId] || 0) + amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Filter expense categories applicable to current space
    const expenseCategories = categories.filter(c => {
      if (c.type !== 'expense') return false;
      if (activeSpace === 'personal') return c.space === 'personal' || c.space === 'all';
      return c.space === 'household' || c.space === 'all';
    });

    const totalAllocatedPercentage = expenseCategories.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);

    const categoryBudgets = expenseCategories.map(cat => {
      const pct = Number(cat.percentage) || 0;
      const targetBudget = totalIncome > 0 ? (pct / 100) * totalIncome : 0;
      const spent = categorySpendMap[cat.id] || 0;
      const remaining = targetBudget - spent;
      const percentUsed = targetBudget > 0 ? (spent / targetBudget) * 100 : (spent > 0 ? 100 : 0);
      const shareOfTotalExpense = totalExpense > 0 ? (spent / totalExpense) * 100 : 0;

      let status = 'safe';
      if (percentUsed >= 100) {
        status = 'exceeded';
      } else if (percentUsed >= (settings.alertThreshold || 90)) {
        status = 'danger';
      } else if (percentUsed >= 75) {
        status = 'warning';
      }

      return {
        ...cat,
        targetBudget,
        spent,
        remaining,
        percentUsed,
        shareOfTotalExpense,
        status
      };
    });

    // Health Score
    let healthScore = 100;
    if (totalIncome > 0) {
      const expenseRatio = (totalExpense / totalIncome) * 100;
      if (expenseRatio > 100) {
        healthScore = Math.max(10, 100 - (expenseRatio - 100) * 2);
      } else {
        healthScore = Math.min(100, Math.round(100 - (expenseRatio * 0.5)));
      }
    } else if (totalExpense > 0) {
      healthScore = 40;
    }

    return {
      month: monthStr,
      space: activeSpace,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      healthScore,
      totalAllocatedPercentage,
      categoryBudgets,
      recentTransactions: monthTx.slice(0, 10),
      allMonthTransactions: monthTx,
      currency: settings.currency || '$'
    };
  }

  /**
   * Smart Anti-Duplication Detection
   * Looks for existing transactions in the same space within 48h with similar amount / merchant
   */
  findPotentialDuplicates(txData, excludeId = null) {
    const activeSpace = txData.space || this.storage.getActiveSpace();
    const transactions = this.storage.getTransactions(activeSpace);
    const newAmt = parseFloat(txData.amount);
    const newDate = new Date(txData.date || new Date().toISOString().slice(0, 10));
    const newTitle = (txData.title || '').toLowerCase().trim();

    return transactions.find(t => {
      if (excludeId && t.id === excludeId) return false;
      if (t.type !== txData.type) return false;

      const tAmt = parseFloat(t.amount);
      const tDate = new Date(t.date);
      const dayDiff = Math.abs((newDate - tDate) / (1000 * 60 * 60 * 24));

      // Check within 48 hours window
      if (dayDiff <= 2) {
        // Condition 1: Exact same amount
        if (Math.abs(tAmt - newAmt) < 0.01) {
          // If title also contains similar text OR same category
          if (t.categoryId === txData.categoryId || t.title.toLowerCase().includes(newTitle) || newTitle.includes(t.title.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  applyPreset(presetKey) {
    const template = PRESET_TEMPLATES[presetKey];
    if (!template) return false;

    const categories = this.storage.getCategories();
    categories.forEach(cat => {
      if (cat.type === 'expense' && template.allocations[cat.id] !== undefined) {
        cat.percentage = template.allocations[cat.id];
      }
    });

    this.storage.saveCategories(categories);
    return true;
  }

  updateAllocations(allocationMap) {
    const categories = this.storage.getCategories();
    categories.forEach(cat => {
      if (cat.type === 'expense' && allocationMap[cat.id] !== undefined) {
        cat.percentage = Number(allocationMap[cat.id]) || 0;
      }
    });
    this.storage.saveCategories(categories);
    return categories;
  }

  getAvailableMonths() {
    const transactions = this.storage.getTransactions();
    const months = new Set();
    const currentMonth = new Date().toISOString().slice(0, 7);
    months.add(currentMonth);

    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        months.add(t.date.slice(0, 7));
      }
    });

    return Array.from(months).sort().reverse();
  }
}

window.budgetEngine = new BudgetEngine(window.storageEngine);
