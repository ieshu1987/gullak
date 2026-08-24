/**
 * Application Entry Point & Global Event Bindings (Dual-Space & Anti-Duplication Support)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize and render UI
  window.uiRenderer.render();

  // Space Switcher Buttons
  const btnSpaceHousehold = document.getElementById('space-pill-household');
  const btnSpacePersonal = document.getElementById('space-pill-personal');

  if (btnSpaceHousehold) {
    btnSpaceHousehold.addEventListener('click', () => {
      window.uiRenderer.switchSpace('household');
    });
  }

  if (btnSpacePersonal) {
    btnSpacePersonal.addEventListener('click', () => {
      window.uiRenderer.switchSpace('personal');
    });
  }

  // Bottom Navigation Switcher
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) {
        window.uiRenderer.switchView(view);
      }
    });
  });

  // FAB Add Transaction Button
  const fabBtn = document.getElementById('btn-fab-add');
  if (fabBtn) {
    fabBtn.addEventListener('click', () => {
      window.uiRenderer.openTransactionModal();
    });
  }

  // Header Settings Button
  const quickSettingsBtn = document.getElementById('btn-quick-settings');
  if (quickSettingsBtn) {
    quickSettingsBtn.addEventListener('click', () => {
      window.uiRenderer.switchView('settings');
    });
  }

  // Header Notification Bell
  const notifBtn = document.getElementById('btn-header-notif');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.uiRenderer.switchView('settings');
      window.uiRenderer.showToast('Review pending user access requests below', 'info');
    });
  }

  // Header Month Selector Button
  const monthPickerBtn = document.getElementById('btn-open-month-picker');
  if (monthPickerBtn) {
    monthPickerBtn.addEventListener('click', () => {
      window.uiRenderer.openMonthSelector();
    });
  }

  // Modal Close Buttons
  const btnCloseTx = document.getElementById('btn-close-tx-modal');
  if (btnCloseTx) {
    btnCloseTx.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-transaction');
    });
  }

  const btnCloseMonth = document.getElementById('btn-close-month-modal');
  if (btnCloseMonth) {
    btnCloseMonth.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-month-selector');
    });
  }

  const btnCloseWa = document.getElementById('btn-close-wa-modal');
  if (btnCloseWa) {
    btnCloseWa.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-whatsapp-customizer');
    });
  }

  const btnClosePlan = document.getElementById('btn-close-plan-modal');
  if (btnClosePlan) {
    btnClosePlan.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-planned-item');
    });
  }

  const btnCloseWaPlan = document.getElementById('btn-close-wa-plan-modal');
  if (btnCloseWaPlan) {
    btnCloseWaPlan.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-whatsapp-planned');
    });
  }

  const btnCloseDup = document.getElementById('btn-close-dup-modal');
  if (btnCloseDup) {
    btnCloseDup.addEventListener('click', () => {
      window.uiRenderer.closeModal('modal-duplicate-alert');
    });
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // Transaction Modal Type Buttons (Expense / Income)
  const txExpenseBtn = document.getElementById('tx-type-expense');
  const txIncomeBtn = document.getElementById('tx-type-income');

  if (txExpenseBtn) {
    txExpenseBtn.addEventListener('click', () => {
      window.uiRenderer.setTransactionType('expense');
    });
  }

  if (txIncomeBtn) {
    txIncomeBtn.addEventListener('click', () => {
      window.uiRenderer.setTransactionType('income');
    });
  }

  // Magic UPI / Bank SMS Auto-Fill Accordion
  const toggleUpiBtn = document.getElementById('toggle-upi-paste');
  const upiPasteSection = document.getElementById('upi-paste-section');
  const upiPasteArrow = document.getElementById('upi-paste-arrow');
  const upiSmsInput = document.getElementById('upi-sms-input');
  const btnParseSms = document.getElementById('btn-parse-sms');
  const btnPasteClipboard = document.getElementById('btn-paste-clipboard');

  if (toggleUpiBtn && upiPasteSection) {
    toggleUpiBtn.addEventListener('click', () => {
      const isVisible = upiPasteSection.style.display === 'flex';
      upiPasteSection.style.display = isVisible ? 'none' : 'flex';
      if (upiPasteArrow) upiPasteArrow.textContent = isVisible ? 'Paste SMS ▾' : 'Hide ▴';
    });
  }

  function applyParsedSMS(text) {
    const parsed = window.uiRenderer.parseUPIOrBankSMS(text);
    if (parsed) {
      window.uiRenderer.setTransactionType(parsed.type);

      const amtInput = document.getElementById('tx-input-amount');
      const titleInput = document.getElementById('tx-input-title');
      const catSelect = document.getElementById('tx-input-category');
      const methodSelect = document.getElementById('tx-input-method');
      const notesInput = document.getElementById('tx-input-notes');

      if (parsed.amount && amtInput) amtInput.value = parsed.amount;
      if (parsed.title && titleInput) titleInput.value = parsed.title;
      if (parsed.paymentMethod && methodSelect) methodSelect.value = parsed.paymentMethod;
      if (parsed.notes && notesInput) notesInput.value = parsed.notes;

      if (parsed.categoryId && catSelect) {
        catSelect.value = parsed.categoryId;
      }

      window.uiRenderer.showToast('🪄 Details auto-filled from SMS!', 'success');
      upiPasteSection.style.display = 'none';
      if (upiPasteArrow) upiPasteArrow.textContent = 'Paste SMS ▾';
      if (upiSmsInput) upiSmsInput.value = '';
    } else {
      window.uiRenderer.showToast('Could not extract amount. Please check the SMS text.', 'error');
    }
  }

  if (btnParseSms && upiSmsInput) {
    btnParseSms.addEventListener('click', () => {
      applyParsedSMS(upiSmsInput.value);
    });
  }

  // 1-Tap Clipboard reader
  if (btnPasteClipboard) {
    btnPasteClipboard.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            if (upiSmsInput) upiSmsInput.value = text;
            applyParsedSMS(text);
          } else {
            window.uiRenderer.showToast('Clipboard is empty. Copy an SMS first.', 'error');
          }
        } else {
          window.uiRenderer.showToast('Clipboard access not supported in this browser. Please paste manually.', 'info');
        }
      } catch (err) {
        window.uiRenderer.showToast('Clipboard permission needed. Tap text box and paste.', 'info');
      }
    });
  }

  // Quick Amount Chips
  document.querySelectorAll('.quick-amt-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const addVal = parseFloat(chip.getAttribute('data-add')) || 0;
      const amtInput = document.getElementById('tx-input-amount');
      if (amtInput) {
        const current = parseFloat(amtInput.value) || 0;
        amtInput.value = (current + addVal).toFixed(2);
      }
    });
  });

  // 🧠 Predictive Auto-Suggest on Title Input
  const txTitleInput = document.getElementById('tx-input-title');
  const suggestionsBox = document.getElementById('tx-suggestions-list');

  if (txTitleInput && suggestionsBox) {
    txTitleInput.addEventListener('input', () => {
      const q = txTitleInput.value.trim();
      const activeSpace = window.storageEngine.getActiveSpace();

      if (q.length < 2) {
        suggestionsBox.style.display = 'none';
        return;
      }

      const matches = window.habitEngine ? window.habitEngine.getSuggestions(q, activeSpace) : [];
      if (matches.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
      }

      const settings = window.storageEngine.getSettings();
      const curr = settings.currency || '₹';

      let html = '';
      matches.forEach(m => {
        html += `
          <div class="suggestion-item" data-title="${m.title}" data-amt="${m.amount}" data-cat="${m.categoryId}" data-method="${m.paymentMethod || 'UPI/Online'}">
            <div>
              <div class="suggestion-title">${m.title}</div>
              <div class="suggestion-meta">${m.categoryId} • ${m.paymentMethod || 'UPI/Online'}</div>
            </div>
            <div class="suggestion-amount">${curr}${m.amount}</div>
          </div>
        `;
      });

      suggestionsBox.innerHTML = html;
      suggestionsBox.style.display = 'flex';

      suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          txTitleInput.value = item.getAttribute('data-title');
          const amtInput = document.getElementById('tx-input-amount');
          const methodSelect = document.getElementById('tx-input-method');
          if (amtInput) amtInput.value = item.getAttribute('data-amt');
          if (methodSelect) methodSelect.value = item.getAttribute('data-method');

          const catId = item.getAttribute('data-cat');
          if (catId) {
            window.uiRenderer.populateCategorySelect('expense', catId);
          }

          suggestionsBox.style.display = 'none';
          window.uiRenderer.showToast(`Auto-filled: ${item.getAttribute('data-title')}`, 'info');
        });
      });
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!txTitleInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  }

  // Dashboard Recurring Bill "+ Log Now" Button Handler
  document.addEventListener('click', (e) => {
    const logBillBtn = e.target.closest('.btn-quick-log-bill');
    if (logBillBtn) {
      const title = logBillBtn.getAttribute('data-title');
      const amount = logBillBtn.getAttribute('data-amt');
      const catId = logBillBtn.getAttribute('data-cat');
      const method = logBillBtn.getAttribute('data-method');

      window.uiRenderer.openTransactionModal();

      setTimeout(() => {
        const titleInput = document.getElementById('tx-input-title');
        const amountInput = document.getElementById('tx-input-amount');
        const methodSelect = document.getElementById('tx-input-method');
        if (titleInput) titleInput.value = title;
        if (amountInput) amountInput.value = amount;
        if (methodSelect) methodSelect.value = method;
        if (catId) window.uiRenderer.populateCategorySelect('expense', catId);
      }, 50);
    }
  });

  // Transaction Form Submit (with Anti-Duplication Detection)
  const txForm = document.getElementById('form-transaction');
  if (txForm) {
    txForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const type = document.getElementById('tx-hidden-type').value;
      const amount = document.getElementById('tx-input-amount').value;
      const title = document.getElementById('tx-input-title').value;
      const categoryId = document.getElementById('tx-input-category').value;
      const date = document.getElementById('tx-input-date').value;
      const space = document.getElementById('tx-input-space').value;
      const paymentMethod = document.getElementById('tx-input-method').value;
      const notes = document.getElementById('tx-input-notes').value;

      const txPayload = { type, amount, title, categoryId, date, space, paymentMethod, notes };

      const saveAction = () => {
        try {
          if (window.uiRenderer.currentEditingTxId) {
            window.transactionManager.update(window.uiRenderer.currentEditingTxId, txPayload);
            window.uiRenderer.showToast('Transaction updated successfully', 'success');
          } else {
            window.transactionManager.create(txPayload);
            window.uiRenderer.showToast('Transaction added successfully', 'success');
          }

          window.uiRenderer.closeModal('modal-transaction');
          window.uiRenderer.render();
        } catch (err) {
          window.uiRenderer.showToast(err.message || 'Error saving transaction', 'error');
        }
      };

      // Anti-Duplication Check for new transactions
      if (!window.uiRenderer.currentEditingTxId) {
        const duplicateTx = window.transactionManager.checkDuplicate(txPayload);
        if (duplicateTx) {
          window.uiRenderer.showDuplicateAlert(duplicateTx, saveAction);
          return;
        }
      }

      saveAction();
    });
  }

  // Planned Item Form Submit
  const planForm = document.getElementById('form-planned-item');
  if (planForm) {
    planForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('plan-input-title').value;
      const estimatedAmount = document.getElementById('plan-input-amount').value;
      const priority = document.getElementById('plan-input-priority').value;
      const categoryId = document.getElementById('plan-input-category').value;
      const dueDate = document.getElementById('plan-input-duedate').value;
      const space = document.getElementById('plan-input-space').value;
      const notes = document.getElementById('plan-input-notes').value;

      const planPayload = { title, estimatedAmount, priority, categoryId, dueDate, space, notes };

      try {
        if (window.uiRenderer.currentEditingPlanId) {
          window.plannedEngine.updateItem(window.uiRenderer.currentEditingPlanId, planPayload);
          window.uiRenderer.showToast('Planned item updated', 'success');
        } else {
          window.plannedEngine.addItem(planPayload);
          window.uiRenderer.showToast('Planned item added to list', 'success');
        }

        window.uiRenderer.closeModal('modal-planned-item');
        const settings = window.storageEngine.getSettings();
        window.uiRenderer.renderPlanned(settings.currency || '$');
      } catch (err) {
        window.uiRenderer.showToast(err.message || 'Error saving planned item', 'error');
      }
    });
  }

  // Delete Transaction Button
  const btnDeleteTx = document.getElementById('btn-tx-delete');
  if (btnDeleteTx) {
    btnDeleteTx.addEventListener('click', () => {
      if (window.uiRenderer.currentEditingTxId) {
        if (confirm('Delete this transaction?')) {
          window.transactionManager.delete(window.uiRenderer.currentEditingTxId);
          window.uiRenderer.closeModal('modal-transaction');
          window.uiRenderer.showToast('Transaction deleted', 'info');
          window.uiRenderer.render();
        }
      }
    });
  }

  // Search & Filter listeners on Transactions tab
  const txSearchInput = document.getElementById('tx-search-input');
  const txTypeFilter = document.getElementById('tx-type-filter');
  const txCatFilter = document.getElementById('tx-cat-filter');
  const txSortFilter = document.getElementById('tx-sort-filter');

  if (txSearchInput) {
    txSearchInput.addEventListener('input', () => {
      const settings = window.storageEngine.getSettings();
      window.uiRenderer.renderTransactions(settings.currency || '$');
    });
  }

  [txTypeFilter, txCatFilter, txSortFilter].forEach(filterEl => {
    if (filterEl) {
      filterEl.addEventListener('change', () => {
        const settings = window.storageEngine.getSettings();
        window.uiRenderer.renderTransactions(settings.currency || '$');
      });
    }
  });

  // Register Service Worker for PWA / Offline capability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Budget Tracker Service Worker registered'))
      .catch(err => console.log('Service Worker registration skipped:', err));
  }
});
