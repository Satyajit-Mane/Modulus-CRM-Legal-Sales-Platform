/**
 * Modulus CRM - Filter Engines & Interactive Calendar
 * Repliq Multi-Select Portal Filter System + Two-Date Range Calendar Picker
 */

    // CUSTOM REPLIQ-STYLE DROPDOWN FILTER ENGINE (Light Theme, Minimal Line Arrow)
    const activeFilters = {
      prospects: {
        stage: new Set(),
        profession: new Set(),
        source: new Set(),
        interest: new Set(),
        salesperson: new Set(),
        city: new Set()
      },
      clients: {
        plan: new Set(),
        subType: new Set(),
        paymentStatus: new Set(),
        clientStatus: new Set(),
        am: new Set(),
        city: new Set()
      }
    };

    const dropdownDefs = {
      'p-stage': { title: 'Stage', target: 'prospects', key: 'stage', options: ['New Lead', 'Contacted', 'Demo Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'] },
      'p-profession': { title: 'Role', target: 'prospects', key: 'profession', options: ['Advocate', 'Law Firm', 'Legal Consultant', 'Corporate Legal Team', 'Other'] },
      'p-source': { title: 'Source', target: 'prospects', key: 'source', options: ['Website', 'Referral', 'LinkedIn', 'Social Media', 'Advertisement', 'Direct Enquiry'] },
      'p-interest': { title: 'Interest', target: 'prospects', key: 'interest', options: ['High', 'Medium', 'Low'] },
      'p-salesperson': { title: 'Sales Rep', target: 'prospects', key: 'salesperson', options: ['Satyajit Mane', 'David Kumar', 'Ananya Verma'] },
      'p-city': { title: 'City', target: 'prospects', key: 'city', options: ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad'] },

      'c-plan': { title: 'Plan', target: 'clients', key: 'plan', options: ['Standard', 'Premium', 'Enterprise'] },
      'c-subType': { title: 'Billing Cycle', target: 'clients', key: 'subType', options: ['Annual', 'Quarterly', 'Monthly'] },
      'c-payment': { title: 'Payment Status', target: 'clients', key: 'paymentStatus', options: ['Paid', 'Pending', 'Overdue'] },
      'c-status': { title: 'Account Status', target: 'clients', key: 'clientStatus', options: ['Active', 'At Risk', 'Grace Period', 'Cancelled'] },
      'c-am': { title: 'Account Manager', target: 'clients', key: 'am', options: ['Satyajit Mane', 'David Kumar'] },
      'c-city': { title: 'City', target: 'clients', key: 'city', options: ['New Delhi', 'Mumbai', 'Bengaluru'] }
    };

    let openDropdownId = null;
    // HOME DASHBOARD: TWO-DATE RANGE CALENDAR ENGINE & TIME RANGE HANDLERS
    const calendarState = {
      viewYear: 2026,
      viewMonth: 6, // 0-indexed: 6 is July
      startDate: new Date(2026, 6, 7),
      endDate: new Date(2026, 6, 14),
      tempStart: new Date(2026, 6, 7),
      tempEnd: new Date(2026, 6, 14),
      isSelecting: false
    };

    function toggleDateRangeCalendar(e) {
      if (e) e.stopPropagation();
      closeNotificationsPopover();
      const menu = document.getElementById('homeDateRangeCalendarMenu');
      if (!menu) return;
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        const rangeMenu = document.getElementById('homeRangeMenu');
        const chev = document.getElementById('homeRangeChevron');
        if (rangeMenu) rangeMenu.classList.add('hidden');
        if (chev) chev.classList.remove('rotate-180');
        calendarState.tempStart = new Date(calendarState.startDate);
        calendarState.tempEnd = new Date(calendarState.endDate);
        calendarState.viewYear = calendarState.startDate.getFullYear();
        calendarState.viewMonth = calendarState.startDate.getMonth();
        calendarState.isSelecting = false;
        renderCalendarGrid();
        menu.classList.remove('hidden');
        const dateChev = document.getElementById('homeDateRangeChevron');
        if (dateChev) dateChev.classList.add('rotate-180');
      } else {
        menu.classList.add('hidden');
        const dateChev = document.getElementById('homeDateRangeChevron');
        if (dateChev) dateChev.classList.remove('rotate-180');
      }
    }

    function closeDateRangeCalendar() {
      const menu = document.getElementById('homeDateRangeCalendarMenu');
      if (menu) menu.classList.add('hidden');
      const dateChev = document.getElementById('homeDateRangeChevron');
      if (dateChev) dateChev.classList.remove('rotate-180');
    }

    function changeCalendarMonth(delta) {
      calendarState.viewMonth += delta;
      if (calendarState.viewMonth < 0) {
        calendarState.viewMonth = 11;
        calendarState.viewYear -= 1;
      } else if (calendarState.viewMonth > 11) {
        calendarState.viewMonth = 0;
        calendarState.viewYear += 1;
      }
      renderCalendarGrid();
    }

    function formatDateRange(d1, d2) {
      if (!d1 && !d2) return 'Select date range';
      if (!d2) d2 = d1;
      const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m1 = monthNamesShort[d1.getMonth()];
      const day1 = d1.getDate();
      const y1 = d1.getFullYear();

      const m2 = monthNamesShort[d2.getMonth()];
      const day2 = d2.getDate();
      const y2 = d2.getFullYear();

      if (y1 === y2) {
        if (m1 === m2) {
          if (day1 === day2) {
            return `${m1} ${day1}, ${y1}`;
          }
          return `${m1} ${day1} – ${m2} ${day2}, ${y1}`;
        }
        return `${m1} ${day1} – ${m2} ${day2}, ${y1}`;
      }
      return `${m1} ${day1}, ${y1} – ${m2} ${day2}, ${y2}`;
    }

    function renderCalendarGrid() {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const lbl = document.getElementById('calendarMonthLabel');
      if (lbl) {
        lbl.innerText = `${monthNames[calendarState.viewMonth]} ${calendarState.viewYear}`;
      }

      const grid = document.getElementById('calendarDaysGrid');
      if (!grid) return;

      const hint = document.getElementById('calendarSelectionHint');
      if (hint) {
        if (calendarState.isSelecting) {
          hint.innerText = 'Now click an end date to complete range';
          hint.className = 'py-1 text-center text-[11px] text-[#0284C7] font-semibold bg-[#F0F9FF] rounded-md';
        } else if (calendarState.tempStart && calendarState.tempEnd) {
          hint.innerText = formatDateRange(calendarState.tempStart, calendarState.tempEnd);
          hint.className = 'py-1 text-center text-[11px] text-gray-700 font-medium';
        } else {
          hint.innerText = 'Select start date and end date';
          hint.className = 'py-1 text-center text-[11px] text-gray-500 font-medium';
        }
      }

      const year = calendarState.viewYear;
      const month = calendarState.viewMonth;

      const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const sTime = calendarState.tempStart ? new Date(calendarState.tempStart.getFullYear(), calendarState.tempStart.getMonth(), calendarState.tempStart.getDate()).getTime() : null;
      const eTime = calendarState.tempEnd ? new Date(calendarState.tempEnd.getFullYear(), calendarState.tempEnd.getMonth(), calendarState.tempEnd.getDate()).getTime() : null;

      let cellsHtml = '';
      for (let i = 0; i < firstDayIndex; i++) {
        cellsHtml += '<div class="h-8"></div>';
      }

      // Month days
      for (let day = 1; day <= daysInMonth; day++) {
        const thisDate = new Date(year, month, day);
        const thisTime = thisDate.getTime();

        const isStart = (sTime !== null && thisTime === sTime);
        const isEnd = (eTime !== null && thisTime === eTime);
        const inRange = (sTime !== null && eTime !== null && thisTime > sTime && thisTime < eTime);

        if (isStart && isEnd) {
          cellsHtml += `
            <div class="h-8 flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-7 rounded-lg bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        } else if (isStart && eTime !== null) {
          cellsHtml += `
            <div class="h-8 bg-[#F0F9FF] rounded-l-lg flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-7 rounded-lg bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        } else if (isEnd && sTime !== null) {
          cellsHtml += `
            <div class="h-8 bg-[#F0F9FF] rounded-r-lg flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-7 rounded-lg bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        } else if (isStart && eTime === null) {
          cellsHtml += `
            <div class="h-8 flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-7 rounded-lg bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-[#0284C7]/30 cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        } else if (inRange) {
          cellsHtml += `
            <div class="h-8 bg-[#F0F9FF] flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-full text-[#0284C7] font-semibold text-xs hover:bg-[#BAE6FD]/70 flex items-center justify-center cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        } else {
          cellsHtml += `
            <div class="h-8 flex items-center justify-center">
              <button onclick="onCalendarDayClick(${day})" class="h-7 w-7 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-xs flex items-center justify-center transition-colors cursor-pointer">
                ${day}
              </button>
            </div>
          `;
        }
      }

      grid.innerHTML = cellsHtml;
    }

    function onCalendarDayClick(day) {
      const clicked = new Date(calendarState.viewYear, calendarState.viewMonth, day);
      if (!calendarState.isSelecting) {
        calendarState.tempStart = clicked;
        calendarState.tempEnd = null;
        calendarState.isSelecting = true;
      } else {
        calendarState.isSelecting = false;
        if (clicked < calendarState.tempStart) {
          calendarState.tempEnd = new Date(calendarState.tempStart);
          calendarState.tempStart = clicked;
        } else {
          calendarState.tempEnd = clicked;
        }
      }
      renderCalendarGrid();
    }

    function confirmDateRangeCalendar() {
      if (!calendarState.tempStart) return;
      if (!calendarState.tempEnd) {
        calendarState.tempEnd = new Date(calendarState.tempStart);
      }
      calendarState.startDate = new Date(calendarState.tempStart);
      calendarState.endDate = new Date(calendarState.tempEnd);

      const str = formatDateRange(calendarState.startDate, calendarState.endDate);
      const label = document.getElementById('homeSelectedDateRangeLabel');
      if (label) label.innerText = str;

      closeDateRangeCalendar();
      updateDynamicMetricCards();
      triggerToast(`Date filter applied: ${str}`, 'Calendar Updated');
    }

    function applyDatePreset(preset) {
      if (preset === 'last7') {
        calendarState.tempStart = new Date(2026, 6, 7);
        calendarState.tempEnd = new Date(2026, 6, 14);
      } else if (preset === 'last14') {
        calendarState.tempStart = new Date(2026, 5, 30);
        calendarState.tempEnd = new Date(2026, 6, 14);
      } else if (preset === 'thisMonth') {
        calendarState.tempStart = new Date(2026, 6, 1);
        calendarState.tempEnd = new Date(2026, 6, 31);
      }
      calendarState.viewYear = calendarState.tempStart.getFullYear();
      calendarState.viewMonth = calendarState.tempStart.getMonth();
      calendarState.isSelecting = false;
      confirmDateRangeCalendar();
    }

    function toggleHomeRangeDropdown(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('homeRangeMenu');
      const chev = document.getElementById('homeRangeChevron');
      if (!menu) return;
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        closeDateRangeCalendar();
        menu.classList.remove('hidden');
        if (chev) chev.classList.add('rotate-180');
      } else {
        menu.classList.add('hidden');
        if (chev) chev.classList.remove('rotate-180');
      }
    }

    function selectHomeRange(rangeLabel) {
      const label = document.getElementById('homeSelectedRangeLabel');
      if (label) label.innerText = rangeLabel;
      const menu = document.getElementById('homeRangeMenu');
      const chev = document.getElementById('homeRangeChevron');
      if (menu) menu.classList.add('hidden');
      if (chev) chev.classList.remove('rotate-180');

      if (rangeLabel === 'Last 7 days') {
        calendarState.startDate = new Date(2026, 6, 7);
        calendarState.endDate = new Date(2026, 6, 14);
      } else if (rangeLabel === 'Last 30 days') {
        calendarState.startDate = new Date(2026, 5, 14);
        calendarState.endDate = new Date(2026, 6, 14);
      } else if (rangeLabel === 'This Quarter') {
        calendarState.startDate = new Date(2026, 3, 1);
        calendarState.endDate = new Date(2026, 5, 30);
      } else if (rangeLabel === 'Year to Date') {
        calendarState.startDate = new Date(2026, 0, 1);
        calendarState.endDate = new Date(2026, 6, 14);
      }

      const str = formatDateRange(calendarState.startDate, calendarState.endDate);
      const dateLabel = document.getElementById('homeSelectedDateRangeLabel');
      if (dateLabel) dateLabel.innerText = str;

      updateDynamicMetricCards();
      triggerToast(`Time range updated to ${rangeLabel} (${str})`, 'Overview Filter');
    }

    // Close Home Range Menu & Date Range Calendar on window click
    window.addEventListener('click', function(e) {
      const wrap = document.getElementById('homeRangeDropdownWrap');
      if (wrap && !wrap.contains(e.target)) {
        const menu = document.getElementById('homeRangeMenu');
        const chev = document.getElementById('homeRangeChevron');
        if (menu) menu.classList.add('hidden');
        if (chev) chev.classList.remove('rotate-180');
      }

      const calWrap = document.getElementById('homeDateRangePickerWrap');
      if (calWrap && !calWrap.contains(e.target)) {
        closeDateRangeCalendar();
      }
    });

function renderCustomDropdowns() {
      // 1. Render all trigger buttons
      Object.keys(dropdownDefs).forEach(id => {
        const def = dropdownDefs[id];
        const container = document.getElementById(`cdd-${id}`);
        if (!container) return;

        const selectedSet = activeFilters[def.target][def.key];
        const count = selectedSet.size;
        const isActive = count > 0;
        const isOpen = openDropdownId === id;

        let displayLabel = def.title;
        if (count === 1) {
          displayLabel = Array.from(selectedSet)[0];
        } else if (count > 1) {
          displayLabel = `${count} Selected`;
        }

        container.innerHTML = `
          <button 
            id="cdd-btn-${id}"
            type="button" 
            onclick="toggleCustomDropdown('${id}', event)"
            class="h-9 px-3.5 rounded-xl border text-xs font-medium inline-flex items-center justify-between gap-2 transition-all cursor-pointer select-none whitespace-nowrap shadow-2xs hover:shadow-xs ${
              isActive 
                ? 'bg-[#F0F9FF] border-[#0284C7] text-[#0284C7] font-semibold' 
                : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-gray-700'
            }"
          >
            <span>${displayLabel}</span>
            <span class="w-5 h-5 rounded-full ${isActive ? 'bg-[#E0F2FE] text-[#0284C7]' : 'bg-gray-100/90 text-gray-600'} flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} shadow-2xs">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
          </button>
        `;
      });

      // 2. Render floating portal on document.body to avoid parent overflow clipping
      let portal = document.getElementById('cdd-floating-portal');
      if (!portal) {
        portal = document.createElement('div');
        portal.id = 'cdd-floating-portal';
        portal.className = 'fixed z-[9999]';
        document.body.appendChild(portal);
      }

      if (!openDropdownId || !dropdownDefs[openDropdownId]) {
        portal.innerHTML = '';
        portal.classList.add('hidden');
        return;
      }

      const id = openDropdownId;
      const def = dropdownDefs[id];
      const btn = document.getElementById(`cdd-btn-${id}`);
      if (!btn) {
        portal.innerHTML = '';
        portal.classList.add('hidden');
        return;
      }

      const rect = btn.getBoundingClientRect();
      const selectedSet = activeFilters[def.target][def.key];
      const count = selectedSet.size;

      portal.classList.remove('hidden');
      portal.style.top = `${rect.bottom + 6}px`;
      portal.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 240))}px`;

      portal.innerHTML = `
        <div class="motion-popover-enter w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1" onclick="event.stopPropagation()">
          <div class="px-3 py-1.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>${def.title}</span>
            ${count > 0 ? `<button onclick="clearSingleFilter('${id}')" class="text-[#0284C7] hover:underline normal-case font-medium cursor-pointer">Reset</button>` : ''}
          </div>
          <div class="max-h-56 overflow-y-auto custom-dropdown-scroll py-1">
            ${def.options.map(opt => {
              const isSelected = selectedSet.has(opt);
              return `
                <div 
                  onclick="toggleFilterOption('${id}', '${opt}')"
                  class="flex items-center gap-2 px-2.5 py-1.5 mx-1 rounded-md cursor-pointer text-xs transition-colors select-none ${
                    isSelected ? 'bg-sky-50 text-[#0284C7] font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }"
                >
                  <span class="size-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-slate-300 bg-white'
                  }">
                    ${isSelected ? '<svg class="size-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : ''}
                  </span>
                  <span class="truncate">${opt}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    function toggleCustomDropdown(id, e) {
      if (e) e.stopPropagation();
      openDropdownId = openDropdownId === id ? null : id;
      renderCustomDropdowns();
    }

    function toggleFilterOption(id, option) {
      const def = dropdownDefs[id];
      const selectedSet = activeFilters[def.target][def.key];
      if (selectedSet.has(option)) selectedSet.delete(option);
      else selectedSet.add(option);

      renderCustomDropdowns();
      if (def.target === 'prospects') applyProspectFilters();
      else applyClientFilters();
    }

    function clearSingleFilter(id) {
      const def = dropdownDefs[id];
      activeFilters[def.target][def.key].clear();
      renderCustomDropdowns();
      if (def.target === 'prospects') applyProspectFilters();
      else applyClientFilters();
    }
