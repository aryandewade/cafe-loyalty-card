/* ==========================================================================
   ATELIER SPECIALTY COFFEE & ROASTERY — THEME-MATCHED DATE PICKER
   Aesthetic: Warm Minimalist Luxury, Cormorant Garamond, Terracotta & Gold Accents
   Purpose: Replaces dull native OS browser datepicker with a bespoke tactile calendar
   ========================================================================== */

(function () {
  'use strict';

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Helper: Format YYYY-MM-DD to human readable (e.g., "14 Oct 1998")
  function formatDisplayDate(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length !== 3) return isoString;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return isoString;
    return `${day} ${MONTH_SHORT[month] || ''} ${year}`;
  }

  // Helper: Pad number
  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  class AtelierDatePicker {
    constructor(targetInput, options = {}) {
      this.input = typeof targetInput === 'string' ? document.getElementById(targetInput) : targetInput;
      if (!this.input) return;

      this.options = Object.assign({
        maxDate: new Date(), // Default max date: today (for DOB)
        minYear: 1930,
        maxYear: new Date().getFullYear(),
        defaultYear: 1998, // Sensible starting year for adults if empty
        placeholder: 'Select Date of Birth',
        onSelect: null
      }, options);

      // Parse existing value or fallback
      const initialIso = this.input.value || '';
      let initialDate = initialIso ? new Date(initialIso) : null;
      if (initialDate && isNaN(initialDate.getTime())) initialDate = null;

      const now = new Date();
      this.selectedDate = initialDate ? new Date(initialDate) : null;
      this.viewYear = initialDate ? initialDate.getFullYear() : (this.options.defaultYear || 1998);
      this.viewMonth = initialDate ? initialDate.getMonth() : 0; // January

      this.isOpen = false;
      this.viewMode = 'days'; // 'days' or 'years'
      this.container = null;
      this.trigger = null;
      this.popover = null;

      this.init();
    }

    init() {
      // Hide original input but keep it in DOM for form submission / IDs
      this.input.style.display = 'none';
      this.input.setAttribute('aria-hidden', 'true');
      this.input.setAttribute('tabindex', '-1');

      // Create Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'atelier-datepicker-wrapper' + (this.options.inline ? ' is-inline' : '');

      if (!this.options.inline) {
        // Create Trigger Button for Popover Mode
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'atelier-datepicker-trigger';
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-expanded', 'false');

        const initialFormatted = this.selectedDate
          ? formatDisplayDate(`${this.selectedDate.getFullYear()}-${pad(this.selectedDate.getMonth() + 1)}-${pad(this.selectedDate.getDate())}`)
          : '';

        trigger.innerHTML = `
          <span class="atelier-dp-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3" ry="3"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <circle cx="12" cy="15" r="1.5" fill="currentColor"></circle>
            </svg>
          </span>
          <span class="atelier-dp-label ${initialFormatted ? 'has-value' : ''}">
            ${initialFormatted || this.options.placeholder}
          </span>
          <span class="atelier-dp-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        `;

        wrapper.appendChild(trigger);
        this.trigger = trigger;
        this.labelEl = trigger.querySelector('.atelier-dp-label');

        this.trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (this.isOpen && !this.wrapper.contains(e.target)) {
            this.close();
          }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.close();
            this.trigger.focus();
          }
        });
      } else {
        // Inline Mode: Optional selected date indicator banner
        const statusBanner = document.createElement('div');
        statusBanner.className = 'atelier-dp-inline-status';
        const initialFormatted = this.selectedDate
          ? formatDisplayDate(`${this.selectedDate.getFullYear()}-${pad(this.selectedDate.getMonth() + 1)}-${pad(this.selectedDate.getDate())}`)
          : '';
        statusBanner.innerHTML = `
          <span class="inline-status-title">Selected Date:</span>
          <span class="inline-status-value ${initialFormatted ? 'has-value' : ''}">
            ${initialFormatted || 'None selected'}
          </span>
        `;
        wrapper.appendChild(statusBanner);
        this.labelEl = statusBanner.querySelector('.inline-status-value');
      }

      this.input.parentNode.insertBefore(wrapper, this.input.nextSibling);
      this.wrapper = wrapper;

      // Popover / Calendar Container
      this.popover = document.createElement('div');
      this.popover.className = 'atelier-calendar-popover' + (this.options.inline ? ' is-inline is-open' : '');
      this.popover.setAttribute('role', 'dialog');
      this.popover.setAttribute('aria-modal', 'true');
      this.wrapper.appendChild(this.popover);

      if (this.options.inline) {
        this.isOpen = true;
        this.render();
      }
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      // Close any other open datepickers
      document.querySelectorAll('.atelier-calendar-popover.is-open').forEach(el => {
        el.classList.remove('is-open');
      });
      document.querySelectorAll('.atelier-datepicker-trigger.is-active').forEach(el => {
        el.classList.remove('is-active');
        el.setAttribute('aria-expanded', 'false');
      });

      // Align view with current selection if available
      if (this.selectedDate) {
        this.viewYear = this.selectedDate.getFullYear();
        this.viewMonth = this.selectedDate.getMonth();
      }

      this.viewMode = 'days';
      this.render();
      this.popover.classList.add('is-open');
      this.trigger.classList.add('is-active');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.isOpen = true;

      if (window.AtelierAudio?.playCandyClick) {
        window.AtelierAudio.playCandyClick();
      }
    }

    close() {
      if (!this.isOpen) return;
      this.popover.classList.remove('is-open');
      this.trigger.classList.remove('is-active');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
    }

    render() {
      if (this.viewMode === 'years') {
        this.renderYearsView();
      } else {
        this.renderDaysView();
      }
    }

    renderDaysView() {
      const year = this.viewYear;
      const month = this.viewMonth;
      const today = new Date();
      const maxDate = this.options.maxDate || today;

      // First day of month & total days
      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      // Options for Year Dropdown
      let yearOptions = '';
      for (let y = this.options.maxYear; y >= this.options.minYear; y--) {
        yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
      }

      // Options for Month Dropdown
      let monthOptions = '';
      MONTH_NAMES.forEach((m, idx) => {
        monthOptions += `<option value="${idx}" ${idx === month ? 'selected' : ''}>${m}</option>`;
      });

      let daysHtml = '';

      // Previous month trailing days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        daysHtml += `<div class="calendar-day is-muted" aria-hidden="true">${d}</div>`;
      }

      // Active month days
      for (let d = 1; d <= totalDays; d++) {
        const cellDate = new Date(year, month, d);
        const isFuture = maxDate && cellDate > maxDate;
        const isSelected = this.selectedDate &&
          this.selectedDate.getFullYear() === year &&
          this.selectedDate.getMonth() === month &&
          this.selectedDate.getDate() === d;
        const isToday = today.getFullYear() === year &&
          today.getMonth() === month &&
          today.getDate() === d;

        let classes = ['calendar-day'];
        if (isSelected) classes.push('is-selected');
        if (isToday) classes.push('is-today');
        if (isFuture) classes.push('is-disabled');

        daysHtml += `
          <button type="button" 
            class="${classes.join(' ')}" 
            data-day="${d}"
            ${isFuture ? 'disabled aria-disabled="true"' : ''}
            title="${d} ${MONTH_NAMES[month]} ${year}">
            <span>${d}</span>
          </button>
        `;
      }

      // Trailing days for neat 7-column grid
      const totalCells = firstDayIndex + totalDays;
      const remaining = (7 - (totalCells % 7)) % 7;
      for (let i = 1; i <= remaining; i++) {
        daysHtml += `<div class="calendar-day is-muted" aria-hidden="true">${i}</div>`;
      }

      this.popover.innerHTML = `
        <div class="atelier-calendar-inner">
          <!-- CALENDAR HEADER -->
          <div class="calendar-header">
            <button type="button" class="calendar-nav-btn" id="dp-prev-month" title="Previous month" aria-label="Previous month">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="calendar-select-group">
              <select class="calendar-select calendar-select-month" id="dp-month-select" aria-label="Select month">
                ${monthOptions}
              </select>
              <select class="calendar-select calendar-select-year" id="dp-year-select" aria-label="Select year">
                ${yearOptions}
              </select>
            </div>

            <button type="button" class="calendar-nav-btn" id="dp-next-month" title="Next month" aria-label="Next month">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- WEEKDAYS ROW -->
          <div class="calendar-weekdays">
            ${DAY_NAMES.map(day => `<span>${day}</span>`).join('')}
          </div>

          <!-- DAYS GRID -->
          <div class="calendar-grid">
            ${daysHtml}
          </div>

          <!-- FOOTER / PERK PROMISE -->
          <div class="calendar-footer">
            <div class="calendar-perk-badge">
              <span>🎂</span>
              <span>Unlocks Birthday Reserve Coffee Perk</span>
            </div>
            <div class="calendar-actions">
              <button type="button" class="calendar-action-btn" id="dp-clear-btn">Clear</button>
              <button type="button" class="calendar-action-btn calendar-action-primary" id="dp-done-btn">Done</button>
            </div>
          </div>
        </div>
      `;

      this.bindDaysEvents();
    }

    bindDaysEvents() {
      // Prev Month
      this.popover.querySelector('#dp-prev-month')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.viewMonth === 0) {
          this.viewMonth = 11;
          this.viewYear--;
        } else {
          this.viewMonth--;
        }
        if (window.AtelierAudio?.playCandyClick) window.AtelierAudio.playCandyClick();
        this.render();
      });

      // Next Month
      this.popover.querySelector('#dp-next-month')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.viewMonth === 11) {
          this.viewMonth = 0;
          this.viewYear++;
        } else {
          this.viewMonth++;
        }
        if (window.AtelierAudio?.playCandyClick) window.AtelierAudio.playCandyClick();
        this.render();
      });

      // Month Select Dropdown
      this.popover.querySelector('#dp-month-select')?.addEventListener('change', (e) => {
        this.viewMonth = parseInt(e.target.value, 10);
        this.render();
      });

      // Year Select Dropdown
      this.popover.querySelector('#dp-year-select')?.addEventListener('change', (e) => {
        this.viewYear = parseInt(e.target.value, 10);
        this.render();
      });

      // Day Click
      this.popover.querySelectorAll('.calendar-day:not(.is-disabled):not(.is-muted)').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const day = parseInt(btn.getAttribute('data-day'), 10);
          this.selectDate(this.viewYear, this.viewMonth, day);
        });
      });

      // Clear Button
      this.popover.querySelector('#dp-clear-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearDate();
      });

      // Done Button
      this.popover.querySelector('#dp-done-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }

    selectDate(year, month, day) {
      this.selectedDate = new Date(year, month, day);
      const isoString = `${year}-${pad(month + 1)}-${pad(day)}`;

      // Update native/hidden input
      this.input.value = isoString;
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));

      // Update trigger label
      const formatted = formatDisplayDate(isoString);
      this.labelEl.textContent = formatted;
      this.labelEl.classList.add('has-value');

      if (window.AtelierAudio?.playCandyClick) {
        window.AtelierAudio.playCandyClick();
      }

      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(isoString, this.selectedDate);
      }

      // Close popover smoothly after selection (popover mode only)
      if (!this.options.inline) {
        setTimeout(() => {
          this.close();
        }, 150);
      } else {
        this.render();
      }
    }

    clearDate() {
      this.selectedDate = null;
      this.input.value = '';
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));

      this.labelEl.textContent = this.options.placeholder;
      this.labelEl.classList.remove('has-value');

      this.render();
    }

    // Set value programmatically
    setValue(isoString) {
      if (!isoString) {
        this.clearDate();
        return;
      }
      const parts = isoString.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        this.selectedDate = new Date(y, m, d);
        this.viewYear = y;
        this.viewMonth = m;
        this.input.value = isoString;
        const formatted = formatDisplayDate(isoString);
        this.labelEl.textContent = formatted;
        this.labelEl.classList.add('has-value');
      }
    }
  }

  // Global helper to attach datepicker to any input
  window.attachAtelierDatePicker = function (target, options) {
    return new AtelierDatePicker(target, options);
  };

  // Auto-init helper for inputs with data-datepicker or specific IDs
  window.initAllAtelierDatePickers = function (root = document) {
    const inputs = root.querySelectorAll('input[type="date"], input[data-datepicker="true"]');
    inputs.forEach(input => {
      if (!input.dataset.datepickerInitialized) {
        input.dataset.datepickerInitialized = 'true';
        window.attachAtelierDatePicker(input);
      }
    });
  };

  window.AtelierDatePickerClass = AtelierDatePicker;

})();
