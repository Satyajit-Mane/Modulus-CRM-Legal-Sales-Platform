/**
 * Modulus CRM - Table Rendering & Bulk Operations
 * Home Dashboard, Prospects, Clients, Follow-ups, and Meetings
 */

    function renderHomeTable() {
      const tbody = document.getElementById('homeTableBody');
      if (!tbody) return;
      const q = (crmState.searchQuery || '').toLowerCase();
      const list = crmState.prospects.filter(p => !q || p.name.toLowerCase().includes(q) || p.firm.toLowerCase().includes(q));
      const recent8 = list.slice(0, 8);

      const summaryEl = document.getElementById('homeProspectsSummary');
      if (summaryEl) summaryEl.innerText = `Showing ${recent8.length} recent prospects`;

      updateDynamicMetricCards();

      if (recent8.length === 0) {
        tbody.innerHTML = renderTableEmptyState(8, 'No prospects found', 'No prospects match your search query.', 'crmState.searchQuery=""; const inp = document.getElementById("topUniversalSearchInput"); if(inp) inp.value=""; renderHomeTable();');
        return;
      }

      tbody.innerHTML = recent8.map((p, idx) => `
        <tr style="--row-index: ${idx};" class="motion-row-enter h-12 hover:bg-gray-50/80 transition-colors cursor-pointer" onclick="openProspectDrawer('${p.id}')">
          <td class="w-10 px-4 text-center" onclick="event.stopPropagation()">
            <input type="checkbox" class="rounded text-[#0284C7] table-checkbox cursor-pointer">
          </td>
          <td class="py-2 px-3 whitespace-nowrap">
            <div class="flex items-center gap-2.5 whitespace-nowrap">
              <div class="w-7 h-7 rounded-full bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/80 flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-2xs">
                ${getInitials(p.name)}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-xs text-[#111827] leading-tight whitespace-nowrap">${escapeHTML(p.name)}</span>
                <span class="text-[10px] text-gray-400 font-mono leading-tight whitespace-nowrap">${escapeHTML(p.barId || 'Unenrolled')}</span>
              </div>
            </div>
          </td>
          <td class="py-2 px-3 text-xs text-gray-600 max-w-[220px] truncate">${escapeHTML(p.notes)}</td>
          <td class="py-2 px-3 font-mono tabular-nums text-xs text-gray-500 whitespace-nowrap">${escapeHTML(p.createdDate)}</td>
          <td class="py-2 px-3 whitespace-nowrap">${renderStagePill(p.stage)}</td>
          <td class="py-2 px-3 text-gray-900 font-medium text-xs whitespace-nowrap">${escapeHTML(p.firm)}</td>
          <td class="py-2 px-3 whitespace-nowrap">${renderInterestPill(p.interest)}</td>
          <td class="py-2 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <div class="inline-flex items-center justify-end gap-1 text-gray-400">
              <button onclick="openEditProspect('${p.id}')" class="action-icon-btn btn-action-neutral" title="Edit Prospect">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button onclick="confirmDeleteProspect('${p.id}')" class="action-icon-btn btn-action-danger" title="Delete Prospect">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
    // MODULE ONE: PROSPECTS DATA TABLE & FILTERS
    function renderProspectsTable() {
      const tbody = document.getElementById('prospectsTableBody');
      const search = (document.getElementById('prospectSearchInput')?.value || '').toLowerCase();
      const fStages = activeFilters.prospects.stage;
      const fProfs = activeFilters.prospects.profession;
      const fSources = activeFilters.prospects.source;
      const fInterests = activeFilters.prospects.interest;
      const fSPs = activeFilters.prospects.salesperson;
      const fCities = activeFilters.prospects.city;

      const filtered = crmState.prospects.filter(p => {
        const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.phone.includes(search) || p.email.toLowerCase().includes(search) || p.firm.toLowerCase().includes(search);
        const matchesStage = fStages.size === 0 || fStages.has(p.stage);
        const matchesProf = fProfs.size === 0 || fProfs.has(p.profession);
        const matchesSrc = fSources.size === 0 || fSources.has(p.source);
        const matchesInt = fInterests.size === 0 || fInterests.has(p.interest);
        const matchesSP = fSPs.size === 0 || fSPs.has(p.salesperson);
        const matchesCity = fCities.size === 0 || fCities.has(p.city);
        return matchesSearch && matchesStage && matchesProf && matchesSrc && matchesInt && matchesSP && matchesCity;
      });

      document.getElementById('prospectPaginationInfo').innerText = `Showing 1 to ${filtered.length} of ${filtered.length} prospects`;

      if (filtered.length === 0) {
        tbody.innerHTML = renderTableEmptyState(15, 'No prospects match your criteria', 'Try adjusting your search terms or clearing active filters.', 'clearProspectFilters()');
        return;
      }

      tbody.innerHTML = filtered.map((p, idx) => {
        const isChecked = crmState.selectedProspectIds.has(p.id);
        return `
          <tr style="--row-index: ${idx};" class="motion-row-enter h-12 hover:bg-gray-50/80 transition-colors cursor-pointer" onclick="openProspectDrawer('${p.id}')">
            <td class="w-10 px-4 text-center" onclick="event.stopPropagation()">
              <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleProspectSelection('${p.id}', this.checked)" class="rounded text-[#0284C7] table-checkbox cursor-pointer">
            </td>
            <td class="py-2 px-3 whitespace-nowrap">
              <div class="flex items-center gap-2.5 whitespace-nowrap">
                <div class="w-7 h-7 rounded-full bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/80 flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-2xs">
                  ${getInitials(p.name)}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-semibold text-xs text-[#111827] leading-tight whitespace-nowrap">${escapeHTML(p.name)}</span>
                  <span class="text-[10px] text-gray-400 font-mono leading-tight whitespace-nowrap">${escapeHTML(p.barId || 'Unenrolled')}</span>
                </div>
              </div>
            </td>
            <td class="py-2 px-3 font-mono tabular-nums text-[11px] text-gray-600 whitespace-nowrap">${escapeHTML(p.phone)}</td>
            <td class="py-2 px-3 text-gray-600 text-xs truncate max-w-[140px]" title="${escapeHTML(p.email)}">${escapeHTML(p.email)}</td>
            <td class="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">${escapeHTML(p.profession)}</td>
            <td class="py-2 px-3 text-gray-900 font-medium text-xs whitespace-nowrap">${escapeHTML(p.firm)}</td>
            <td class="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">${escapeHTML(p.city)}</td>
            <td class="py-2 px-3 text-gray-500 text-xs whitespace-nowrap">${escapeHTML(p.source)}</td>
            <td class="py-2 px-3 whitespace-nowrap">${renderInterestPill(p.interest)}</td>
            <td class="py-2 px-3 whitespace-nowrap">${renderStagePill(p.stage)}</td>
            <td class="py-2 px-3 font-mono tabular-nums text-gray-400 text-xs whitespace-nowrap">${escapeHTML(p.lastContacted)}</td>
            <td class="py-2 px-3 text-xs whitespace-nowrap">
              <span class="font-mono tabular-nums font-medium text-gray-800">${escapeHTML(p.nextFollowupDate)}</span> <span class="text-[10px] text-gray-400 font-mono tabular-nums">· ${escapeHTML(p.nextFollowupTime)}</span>
            </td>
            <td class="py-2 px-3 text-gray-700 text-xs whitespace-nowrap">${escapeHTML(p.salesperson)}</td>
            <td class="py-2 px-3 font-mono tabular-nums text-gray-400 text-xs whitespace-nowrap">${escapeHTML(p.createdDate)}</td>
            <td class="py-2 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
              <div class="inline-flex items-center justify-end gap-1 text-gray-400">
                <button onclick="openEditProspect('${p.id}')" class="action-icon-btn btn-action-neutral" title="Edit Prospect">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onclick="confirmDeleteProspect('${p.id}')" class="action-icon-btn btn-action-danger" title="Delete Prospect">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
                <div class="relative inline-block text-left">
                  <button onclick="toggleActionMenu('menu-p-${p.id}')" class="action-icon-btn btn-action-neutral" title="More Options">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </button>
                  <div id="menu-p-${p.id}" class="origin-top-right absolute right-0 mt-1 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 hidden text-xs text-left">
                    <div class="py-1">
                      <button onclick="openFollowupFor('${p.id}', 'Prospect'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Add Follow-up</button>
                      <button onclick="openMeetingFor('${p.id}', 'Prospect'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Schedule Meeting</button>
                    </div>
                    <div class="py-1">
                      <button onclick="openConvertModal('${p.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 font-semibold cursor-pointer">Convert to Client</button>
                      <button onclick="quickChangeProspectStage('${p.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Change Stage</button>
                      <button onclick="markProspectLost('${p.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-rose-600 cursor-pointer">Mark as Lost</button>
                    </div>
                    <div class="py-1">
                      <button onclick="archiveProspect('${p.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-500 cursor-pointer">Archive</button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function applyProspectFilters() {
      renderProspectsTable();
      const search = (document.getElementById('prospectSearchInput')?.value || '').trim();
      const hasActive = search || Object.values(activeFilters.prospects).some(s => s.size > 0);
      const clearBtn = document.getElementById('btnClearProspectFilters');
      if (clearBtn) clearBtn.classList.toggle('hidden', !hasActive);
      const searchClearBtn = document.getElementById('prospectSearchClearBtn');
      if (searchClearBtn) searchClearBtn.classList.toggle('hidden', search.length === 0);
    }

    function clearProspectSearch() {
      const inp = document.getElementById('prospectSearchInput');
      if (inp) {
        inp.value = '';
        inp.focus();
      }
      applyProspectFilters();
    }

    function clearProspectFilters() {
      document.getElementById('prospectSearchInput').value = '';
      Object.keys(activeFilters.prospects).forEach(k => activeFilters.prospects[k].clear());
      renderCustomDropdowns();
      renderProspectsTable();
      const clearBtn = document.getElementById('btnClearProspectFilters');
      if (clearBtn) clearBtn.classList.add('hidden');
      const searchClearBtn = document.getElementById('prospectSearchClearBtn');
      if (searchClearBtn) searchClearBtn.classList.add('hidden');
      triggerToast('All prospect filters cleared', 'Filters Reset');
    }


function exportProspectsCSV() {
  const headers = ["Prospect ID", "Full Name", "Phone", "Email", "Role / Profession", "Firm", "City", "Source", "Interest", "Stage", "Date Added"];
  const rows = crmState.prospects.map(p => [
    p.id, p.name, p.phone, p.email, p.profession, p.firm, p.city, p.source, p.interest, p.stage, p.createdDate
  ]);
  exportToCSV(`Sales_CRM_Prospects_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
  triggerToast('Prospects CSV exported successfully!', 'Export Complete');
}

function exportClientsCSV() {
  const headers = ["Client ID", "Firm / Client Name", "Phone", "Email", "Profession", "Firm", "City", "Plan", "Billing Cycle", "Amount", "Renewal Date", "Payment Status", "Account Manager"];
  const rows = crmState.clients.map(c => [
    c.id, c.name, c.phone, c.email, c.profession, c.firm, c.city, c.plan, c.subType, c.amount, c.renewalDate, c.paymentStatus, c.am
  ]);
  exportToCSV(`Sales_CRM_Clients_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
  triggerToast('Clients CSV exported successfully!', 'Export Complete');
}

    function toggleTableSelectAll(containerId, checked) {
      const container = document.getElementById(containerId);
      if (container) {
        const boxes = container.querySelectorAll('tbody input[type="checkbox"]');
        boxes.forEach(b => { b.checked = checked; });
      }
    }

    function toggleSelectAllProspects(checked) {
      if (checked) {
        crmState.prospects.forEach(p => crmState.selectedProspectIds.add(p.id));
      } else {
        crmState.selectedProspectIds.clear();
      }
      updateProspectBulkBar();
      renderProspectsTable();
    }

    function toggleProspectSelection(id, checked) {
      if (checked) crmState.selectedProspectIds.add(id);
      else crmState.selectedProspectIds.delete(id);
      updateProspectBulkBar();
    }

    function updateProspectBulkBar() {
      const bar = document.getElementById('prospectsBulkBar');
      const count = crmState.selectedProspectIds.size;
      document.getElementById('prospectSelectedCount').innerText = count;
      if (count > 0) bar.classList.remove('hidden');
      else bar.classList.add('hidden');
    }

    function clearProspectSelection() {
      crmState.selectedProspectIds.clear();
      updateProspectBulkBar();
      renderProspectsTable();
    }

    function bulkAssignSalesperson() {
      const count = crmState.selectedProspectIds.size;
      crmState.prospects.forEach(p => {
        if (crmState.selectedProspectIds.has(p.id)) p.salesperson = 'Satyajit Mane';
      });
      saveState();
      triggerToast(`${count} prospects reassigned to Satyajit Mane`, 'Bulk Assigned');
      clearProspectSelection();
    }

    function bulkArchiveProspects() {
      const count = crmState.selectedProspectIds.size;
      crmState.prospects = crmState.prospects.filter(p => !crmState.selectedProspectIds.has(p.id));
      saveState();
      triggerToast(`${count} prospects archived`, 'Bulk Archived');
      clearProspectSelection();
      updateSidebarBadges();
    }

    function renderClientsTable() {
      const tbody = document.getElementById('clientsTableBody');
      const search = (document.getElementById('clientSearchInput')?.value || '').toLowerCase();
      const fPlans = activeFilters.clients.plan;
      const fTypes = activeFilters.clients.subType;
      const fPays = activeFilters.clients.paymentStatus;
      const fStatuses = activeFilters.clients.clientStatus;
      const fAMs = activeFilters.clients.am;
      const fCities = activeFilters.clients.city;

      const filtered = crmState.clients.filter(c => {
        const matchesSearch = !search || c.name.toLowerCase().includes(search) || c.firm.toLowerCase().includes(search) || c.phone.includes(search) || c.email.toLowerCase().includes(search);
        const matchesPlan = fPlans.size === 0 || fPlans.has(c.plan);
        const matchesType = fTypes.size === 0 || fTypes.has(c.subType);
        const matchesPay = fPays.size === 0 || fPays.has(c.paymentStatus);
        const matchesStatus = fStatuses.size === 0 || fStatuses.has(c.clientStatus);
        const matchesAM = fAMs.size === 0 || fAMs.has(c.am);
        const matchesCity = fCities.size === 0 || fCities.has(c.city);
        return matchesSearch && matchesPlan && matchesType && matchesPay && matchesStatus && matchesAM && matchesCity;
      });

      document.getElementById('clientPaginationInfo').innerText = `Showing 1 to ${filtered.length} of ${filtered.length} active accounts`;

      if (filtered.length === 0) {
        tbody.innerHTML = renderTableEmptyState(16, 'No clients match your criteria', 'Try adjusting your search terms or clearing active filters.', 'clearClientFilters()');
        return;
      }

      tbody.innerHTML = filtered.map((c, idx) => `
        <tr style="--row-index: ${idx};" class="motion-row-enter h-12 hover:bg-gray-50/80 transition-colors cursor-pointer" onclick="openClientDrawer('${c.id}')">
          <td class="w-10 px-4 text-center" onclick="event.stopPropagation()"><input type="checkbox" class="rounded text-[#0284C7] table-checkbox cursor-pointer"></td>
          <td class="py-2 px-3 whitespace-nowrap">
            <div class="flex items-center gap-2.5 whitespace-nowrap">
              <div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-2xs">
                ${getInitials(c.name)}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-xs text-[#111827] leading-tight whitespace-nowrap">${escapeHTML(c.name)}</span>
                <span class="text-[10px] text-gray-400 font-mono leading-tight whitespace-nowrap">${escapeHTML(c.barId || 'Unenrolled')}</span>
              </div>
            </div>
          </td>
          <td class="py-2 px-3 font-mono tabular-nums text-[11px] text-gray-600 whitespace-nowrap">${escapeHTML(c.phone)}</td>
          <td class="py-2 px-3 text-gray-600 text-xs truncate max-w-[140px]" title="${escapeHTML(c.email)}">${escapeHTML(c.email)}</td>
          <td class="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">${escapeHTML(c.profession)}</td>
          <td class="py-2 px-3 font-semibold text-xs text-gray-900 whitespace-nowrap">${escapeHTML(c.firm)}</td>
          <td class="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">${escapeHTML(c.city)}</td>
          <td class="py-2 px-3 whitespace-nowrap"><span class="inline-flex items-center whitespace-nowrap px-2.5 py-0.5 text-[11px] font-semibold bg-[#F0F9FF] text-[#0284C7] rounded-full border border-[#0284C7]/20 shadow-2xs">${escapeHTML(c.plan)}</span></td>
          <td class="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">${escapeHTML(c.subType)}</td>
          <td class="py-2 px-3 font-mono tabular-nums font-semibold text-xs text-gray-900 whitespace-nowrap">${escapeHTML(c.amount)}</td>
          <td class="py-2 px-3 font-mono tabular-nums text-gray-400 text-xs whitespace-nowrap">${escapeHTML(c.startDate)}</td>
          <td class="py-2 px-3 font-mono tabular-nums font-medium text-xs text-gray-800 whitespace-nowrap">${escapeHTML(c.renewalDate)}</td>
          <td class="py-2 px-3">${renderPaymentStatusBadge(c.paymentStatus)}</td>
          <td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold ${c.clientStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' : 'bg-rose-50 text-rose-700 border-rose-200/70'} rounded-full border shadow-2xs"><span class="w-1.5 h-1.5 rounded-full ${c.clientStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>${escapeHTML(c.clientStatus)}</span></td>
          <td class="py-2 px-3 text-gray-700 text-xs whitespace-nowrap">${escapeHTML(c.am)}</td>
          <td class="py-2 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <div class="inline-flex items-center justify-end gap-1 text-gray-400">
              <button onclick="openEditClient('${c.id}')" class="action-icon-btn btn-action-neutral" title="Edit Client">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button onclick="confirmDeleteClient('${c.id}')" class="action-icon-btn btn-action-danger" title="Delete Client">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              <div class="relative inline-block text-left">
                <button onclick="toggleActionMenu('menu-c-${c.id}')" class="action-icon-btn btn-action-neutral" title="More Options">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </button>
                <div id="menu-c-${c.id}" class="origin-top-right absolute right-0 mt-1 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 hidden text-xs text-left">
                  <div class="py-1">
                    <button onclick="openEditClient('${c.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Upgrade Plan</button>
                    <button onclick="renewClientSubscription('${c.id}'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-emerald-600 font-medium cursor-pointer">Renew Subscription</button>
                    <button onclick="triggerToast('Payment receipt recorded in history.', 'Payment Saved'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Record Payment</button>
                  </div>
                  <div class="py-1">
                    <button onclick="openFollowupFor('${c.id}', 'Client'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Add Follow-up</button>
                    <button onclick="openMeetingFor('${c.id}', 'Client'); hideAllActionMenus();" class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer">Schedule Meeting</button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');
    }

    function applyClientFilters() {
      renderClientsTable();
      const search = (document.getElementById('clientSearchInput')?.value || '').trim();
      const hasActive = search || Object.values(activeFilters.clients).some(s => s.size > 0);
      const clearBtn = document.getElementById('btnClearClientFilters');
      if (clearBtn) clearBtn.classList.toggle('hidden', !hasActive);
      const searchClearBtn = document.getElementById('clientSearchClearBtn');
      if (searchClearBtn) searchClearBtn.classList.toggle('hidden', search.length === 0);
    }

    function clearClientSearch() {
      const inp = document.getElementById('clientSearchInput');
      if (inp) {
        inp.value = '';
        inp.focus();
      }
      applyClientFilters();
    }

    function clearClientFilters() {
      document.getElementById('clientSearchInput').value = '';
      Object.keys(activeFilters.clients).forEach(k => activeFilters.clients[k].clear());
      renderCustomDropdowns();
      renderClientsTable();
      const clearBtn = document.getElementById('btnClearClientFilters');
      if (clearBtn) clearBtn.classList.add('hidden');
      const searchClearBtn = document.getElementById('clientSearchClearBtn');
      if (searchClearBtn) searchClearBtn.classList.add('hidden');
      triggerToast('All client filters cleared', 'Filters Reset');
    }


    function renderFollowupsTable() {
      updateFollowupTabCounts();
      const tbody = document.getElementById('followupsTableBody');
      const tab = crmState.activeFollowupTab;

      let list = crmState.followups;
      if (tab === 'today') list = list.filter(f => f.status === 'Today');
      else if (tab === 'upcoming') list = list.filter(f => f.status === 'Upcoming');
      else if (tab === 'overdue') list = list.filter(f => f.status === 'Overdue');
      else if (tab === 'completed') list = list.filter(f => f.status === 'Completed');
      else if (tab === 'cancelled') list = list.filter(f => f.status === 'Cancelled');

      const pInfo = document.getElementById('followupPaginationInfo');
      if (pInfo) {
        pInfo.innerText = `Showing 1 to ${list.length} of ${list.length} scheduled follow-ups`;
      }

      if (list.length === 0) {
        tbody.innerHTML = renderTableEmptyState(12, 'No follow-ups found', 'No follow-up tasks match this view.', 'switchFollowupTab("all")');
        return;
      }

      tbody.innerHTML = list.map((f, idx) => `
        <tr style="--row-index: ${idx};" class="motion-row-enter h-12 hover:bg-gray-50/80 transition-colors">
          <td class="w-10 px-4 text-center" onclick="event.stopPropagation()"><input type="checkbox" class="rounded text-[#0284C7] table-checkbox cursor-pointer"></td>
          <td class="py-2 px-3 whitespace-nowrap">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full ${f.contactType === 'Prospect' ? 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/80' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'} flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-2xs">
                ${getInitials(f.contactName)}
              </div>
              <div class="flex flex-col min-w-0">
                <div class="font-semibold text-xs text-[#111827] leading-tight whitespace-nowrap">${escapeHTML(f.contactName)}</div>
                <div class="text-[10px] text-gray-400 font-mono leading-tight whitespace-nowrap">${escapeHTML(getContactBarId(f.contactName))}</div>
              </div>
            </div>
          </td>
          <td class="py-2 px-3 whitespace-nowrap"><span class="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-2xs whitespace-nowrap inline-flex items-center ${f.contactType === 'Prospect' ? 'bg-blue-50 text-blue-700 border-blue-200/70' : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'}"><span class="w-1.5 h-1.5 rounded-full ${f.contactType === 'Prospect' ? 'bg-blue-500' : 'bg-emerald-500'} mr-1.5 shrink-0"></span>${(f.contactType === 'Active Client' || f.contactType === 'Active' || f.contactType === 'Client') ? 'Client' : f.contactType}</span></td>
          <td class="py-2 px-3 font-mono tabular-nums text-[11px] text-gray-600 whitespace-nowrap">${escapeHTML(f.phone)}</td>
          <td class="py-2 px-3 text-xs text-gray-700 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5">
              ${getChannelIcon(f.channel)}
              <span>${escapeHTML(f.channel)}</span>
            </span>
          </td>
          <td class="py-2 px-3 text-xs text-gray-600 max-w-[240px] truncate" title="${escapeHTML(f.prevSummary)}">${escapeHTML(f.prevSummary)}</td>
          <td class="py-2 px-3 font-mono tabular-nums text-xs font-medium text-gray-900 whitespace-nowrap">${escapeHTML(f.date)}</td>
          <td class="py-2 px-3 font-mono tabular-nums text-[11px] text-gray-500 whitespace-nowrap">${escapeHTML(f.time)}</td>
          <td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-2xs ${f.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border-rose-200/70' : (f.priority === 'High' ? 'bg-amber-50 text-amber-800 border-amber-200/70' : 'bg-slate-50 text-slate-700 border-slate-200/80')}"><span class="w-1.5 h-1.5 rounded-full ${f.priority === 'Urgent' ? 'bg-rose-500' : (f.priority === 'High' ? 'bg-amber-500' : 'bg-slate-400')}"></span>${escapeHTML(f.priority)}</span></td>
          <td class="py-2 px-3 text-xs text-gray-700 whitespace-nowrap">${escapeHTML(f.salesperson)}</td>
          <td class="py-2 px-3">${renderFollowupStatusBadge(f.status)}</td>
          <td class="py-2 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <div class="inline-flex items-center justify-end gap-1 text-gray-400">
              ${f.status !== 'Completed' ? `
                <button onclick="openCompleteFollowupModal('${f.id}')" class="action-icon-btn text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Complete Follow-up">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </button>
              ` : ''}
              <button onclick="openEditFollowup('${f.id}')" class="action-icon-btn btn-action-neutral" title="Edit Follow-up">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button onclick="confirmDeleteFollowup('${f.id}')" class="action-icon-btn btn-action-danger" title="Delete Follow-up">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    function switchFollowupTab(tab) {
      crmState.activeFollowupTab = tab;
      ['all', 'today', 'upcoming', 'overdue', 'completed', 'cancelled'].forEach(t => {
        document.getElementById(`fuTab-${t}`).classList.remove('active');
      });
      document.getElementById(`fuTab-${tab}`).classList.add('active');
      renderFollowupsTable();
    }


    function renderMeetingsTable() {
      updateMeetingTabCounts();
      const tbody = document.getElementById('meetingsTableBody');
      const tab = crmState.activeMeetingTab;

      let list = crmState.meetings;
      if (tab === 'upcoming') list = list.filter(m => m.status === 'Upcoming');
      else if (tab === 'today') list = list.filter(m => m.status === 'Today');
      else if (tab === 'completed') list = list.filter(m => m.status === 'Completed');
      else if (tab === 'cancelled') list = list.filter(m => m.status === 'Cancelled');

      const pInfo = document.getElementById('meetingPaginationInfo');
      if (pInfo) {
        pInfo.innerText = `Showing 1 to ${list.length} of ${list.length} meetings and demos`;
      }

      if (list.length === 0) {
        tbody.innerHTML = renderTableEmptyState(14, 'No meetings scheduled', 'No client demos or meetings match this view.', 'switchMeetingTab("all")');
        renderMeetingsCalendar();
        return;
      }

      tbody.innerHTML = list.map((m, idx) => `
        <tr style="--row-index: ${idx};" class="motion-row-enter h-12 hover:bg-gray-50/80 transition-colors">
          <td class="w-10 px-4 text-center" onclick="event.stopPropagation()"><input type="checkbox" class="rounded text-[#0284C7] table-checkbox cursor-pointer"></td>
          <td class="py-2 px-3 font-semibold text-xs text-[#111827] max-w-[200px] truncate">${escapeHTML(m.title)}</td>
          <td class="py-2 px-3 whitespace-nowrap">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full ${m.contactType === 'Prospect' ? 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/80' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'} flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-2xs">
                ${getInitials(m.contactName)}
              </div>
              <div class="flex flex-col min-w-0">
                <div class="font-semibold text-xs text-[#111827] leading-tight whitespace-nowrap">${escapeHTML(m.contactName)}</div>
                <div class="text-[10px] text-gray-400 font-mono leading-tight whitespace-nowrap">${escapeHTML(getContactBarId(m.contactName))}</div>
              </div>
            </div>
          </td>
          <td class="py-2 px-3 whitespace-nowrap"><span class="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-2xs whitespace-nowrap inline-flex items-center ${m.contactType === 'Prospect' ? 'bg-blue-50 text-blue-700 border-blue-200/70' : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'}"><span class="w-1.5 h-1.5 rounded-full ${m.contactType === 'Prospect' ? 'bg-blue-500' : 'bg-emerald-500'} mr-1.5 shrink-0"></span>${(m.contactType === 'Active Client' || m.contactType === 'Active' || m.contactType === 'Client') ? 'Client' : escapeHTML(m.contactType)}</span></td>
          <td class="py-2 px-3 font-mono tabular-nums text-[11px] text-gray-600 whitespace-nowrap">${escapeHTML(m.phone)}</td>
          <td class="py-2 px-3 text-gray-600 text-xs truncate max-w-[130px]" title="${escapeHTML(m.email)}">${escapeHTML(m.email)}</td>
          <td class="py-2 px-3 text-gray-700 text-xs">${escapeHTML(m.meetingType)}</td>
          <td class="py-2 px-3 font-mono tabular-nums font-medium text-xs text-gray-900 whitespace-nowrap">${escapeHTML(m.date)}</td>
          <td class="py-2 px-3 font-mono tabular-nums text-gray-600 text-xs whitespace-nowrap">${escapeHTML(m.startTime)} – ${escapeHTML(m.endTime)}</td>
          <td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-2xs ${m.mode === 'Online' ? 'bg-sky-50 text-sky-700 border-sky-200/70' : 'bg-amber-50 text-amber-800 border-amber-200/70'}"><span class="w-1.5 h-1.5 rounded-full ${m.mode === 'Online' ? 'bg-sky-500' : 'bg-amber-500'}"></span>${escapeHTML(m.mode)}</span></td>
          <td class="py-2 px-3 text-xs text-gray-500 truncate max-w-[150px]" title="${escapeHTML(m.link)}">${escapeHTML(m.link)}</td>
          <td class="py-2 px-3 text-gray-700 text-xs whitespace-nowrap">${escapeHTML(m.salesperson)}</td>
          <td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-2xs ${m.status === 'Completed' ? 'bg-slate-100 text-slate-600 border-slate-200/80' : (m.status === 'Today' ? 'bg-amber-50 text-amber-800 border-amber-200/70' : 'bg-indigo-50 text-indigo-700 border-indigo-200/80')}"><span class="w-1.5 h-1.5 rounded-full ${m.status === 'Completed' ? 'bg-slate-400' : (m.status === 'Today' ? 'bg-amber-500' : 'bg-indigo-500')}"></span>${m.status === 'Completed' ? 'Done' : m.status}</span></td>
          <td class="py-2 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <div class="inline-flex items-center justify-end gap-1 text-gray-400">
              ${m.status !== 'Completed' ? `
                <button onclick="markMeetingCompleted('${m.id}')" class="action-icon-btn text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Complete Meeting">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </button>
              ` : ''}
              <button onclick="openEditMeeting('${m.id}')" class="action-icon-btn btn-action-neutral" title="Edit Meeting">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button onclick="confirmDeleteMeeting('${m.id}')" class="action-icon-btn btn-action-danger" title="Delete Meeting">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      renderMeetingsCalendar();
    }

    function prevMeetingPeriod() {
      if (crmState.calendarSubView === 'week') {
        crmState.calendarDate.setDate(crmState.calendarDate.getDate() - 7);
      } else {
        crmState.calendarDate.setMonth(crmState.calendarDate.getMonth() - 1);
      }
      renderMeetingsCalendar();
    }

    function nextMeetingPeriod() {
      if (crmState.calendarSubView === 'week') {
        crmState.calendarDate.setDate(crmState.calendarDate.getDate() + 7);
      } else {
        crmState.calendarDate.setMonth(crmState.calendarDate.getMonth() + 1);
      }
      renderMeetingsCalendar();
    }

    function todayMeetingPeriod() {
      crmState.calendarDate = new Date(2026, 6, 14);
      renderMeetingsCalendar();
    }

    function setCalendarSubView(view) {
      crmState.calendarSubView = view;
      const btnWeek = document.getElementById('btnCalWeek');
      const btnMonth = document.getElementById('btnCalMonth');
      if (btnWeek && btnMonth) {
        if (view === 'week') {
          btnWeek.className = 'h-7 px-3 rounded-lg text-xs font-semibold bg-white text-gray-900 shadow-2xs transition-all cursor-pointer';
          btnMonth.className = 'h-7 px-3 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-all cursor-pointer';
        } else {
          btnMonth.className = 'h-7 px-3 rounded-lg text-xs font-semibold bg-white text-gray-900 shadow-2xs transition-all cursor-pointer';
          btnWeek.className = 'h-7 px-3 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-all cursor-pointer';
        }
      }
      renderMeetingsCalendar();
    }

    function renderMeetingsCalendar() {
      const grid = document.getElementById('meetingsCalendarGrid');
      const label = document.getElementById('calPeriodLabel');
      const summary = document.getElementById('calMeetingsSummaryText');
      if (!grid || !label) return;

      // Filter by activeMeetingTab
      let filtered = crmState.meetings;
      const tab = crmState.activeMeetingTab || 'all';
      if (tab === 'upcoming') filtered = filtered.filter(m => m.status === 'Upcoming');
      else if (tab === 'today') filtered = filtered.filter(m => m.status === 'Today');
      else if (tab === 'completed') filtered = filtered.filter(m => m.status === 'Completed');
      else if (tab === 'cancelled') filtered = filtered.filter(m => m.status === 'Cancelled');

      if (crmState.calendarSubView === 'month') {
        renderMonthCalendar(grid, label, summary, filtered);
      } else {
        renderWeekCalendar(grid, label, summary, filtered);
      }
    }

    function renderWeekCalendar(grid, label, summary, filtered) {
      const base = new Date(crmState.calendarDate);
      const day = base.getDay(); // 0 is Sunday, 1 is Monday...
      const diffToMon = (day === 0 ? -6 : 1) - day;
      const monday = new Date(base);
      monday.setDate(base.getDate() + diffToMon);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const mShort = monday.toLocaleString('en-US', { month: 'short' });
      const sShort = sunday.toLocaleString('en-US', { month: 'short' });
      label.innerText = (mShort === sShort)
        ? `${mShort} ${monday.getDate()} – ${sunday.getDate()}, ${sunday.getFullYear()}`
        : `${mShort} ${monday.getDate()} – ${sShort} ${sunday.getDate()}, ${sunday.getFullYear()}`;

      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const days = [];
      let weekMeetingsCount = 0;
      let onlineCount = 0;
      let inPersonCount = 0;

      for (let i = 0; i < 7; i++) {
        const cur = new Date(monday);
        cur.setDate(monday.getDate() + i);
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        const iso = `${yyyy}-${mm}-${dd}`;
        const isToday = (iso === '2026-07-14');

        const dayMeetings = filtered.filter(m => m.date === iso);
        weekMeetingsCount += dayMeetings.length;
        dayMeetings.forEach(m => {
          if (m.mode === 'Online') onlineCount++;
          else inPersonCount++;
        });

        days.push({
          name: dayNames[i],
          dateNumber: cur.getDate(),
          monthShort: cur.toLocaleString('en-US', { month: 'short' }),
          iso: iso,
          isToday: isToday,
          meetings: dayMeetings
        });
      }

      if (summary) {
        summary.innerText = `${weekMeetingsCount} meeting${weekMeetingsCount === 1 ? '' : 's'} scheduled this week (${onlineCount} online, ${inPersonCount} in-person)`;
      }

      grid.className = 'grid grid-cols-7 gap-2.5 h-full min-h-[460px] min-w-[980px]';
      grid.innerHTML = days.map(d => `
        <div class="flex flex-col h-full rounded-xl ${d.isToday ? 'bg-[#F0F9FF]/40 border-2 border-[#0284C7] shadow-xs' : 'bg-gray-50/70 border border-gray-200/80'} p-2 transition-all">
          <div class="flex items-center justify-between pb-2 mb-2 border-b ${d.isToday ? 'border-sky-200' : 'border-gray-200/90'} shrink-0">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs ${d.isToday ? 'text-[#0284C7]' : 'text-gray-800'}">${d.name}</span>
              <span class="text-xs ${d.isToday ? 'font-bold text-[#0284C7]' : 'text-gray-500 font-medium'}">${d.dateNumber}</span>
              ${d.isToday ? '<span class="text-[10px] font-semibold bg-[#0284C7] text-white px-2 py-0.5 rounded-full">Today</span>' : ''}
            </div>
            <button onclick="openAddMeetingModal('', 'Prospect', '${d.iso}')" class="w-5 h-5 rounded-md hover:bg-gray-200/80 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer" title="Schedule meeting on ${d.monthShort} ${d.dateNumber}">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>

          <div class="space-y-2 flex-1 flex flex-col overflow-y-auto">
            ${d.meetings.length > 0 ? d.meetings.map(m => `
              <div class="calendar-meeting-card p-2.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs group flex flex-col gap-1.5 cursor-pointer" onclick="openEditMeeting('${m.id}')" title="Click to view & edit details">
                <!-- Line 1: Status at Top -->
                <div class="flex items-center justify-start">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs ${m.status === 'Today' ? 'bg-amber-50 text-amber-700 border-amber-200/80' : (m.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80' : 'bg-slate-100 text-slate-600 border-slate-200/80')}">
                    <span class="w-1.5 h-1.5 rounded-full ${m.status === 'Today' ? 'bg-amber-500' : (m.status === 'Upcoming' ? 'bg-indigo-500' : 'bg-gray-400')} mr-1.5 shrink-0"></span>
                    ${m.status === 'Completed' ? 'Done' : m.status}
                  </span>
                </div>
                
                <!-- Line 2: Meeting Type in a single line at the bottom of Status -->
                <div class="flex items-center justify-start">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap border shadow-2xs ${m.meetingType === 'Product Demo' ? 'bg-sky-50 text-[#0284C7] border-sky-200/70' : 'bg-violet-50 text-violet-700 border-violet-200/70'}">${escapeHTML(m.meetingType)}</span>
                </div>
                
                <!-- Line 3: Title in a single line -->
                <div class="font-bold text-xs text-[#111827] truncate whitespace-nowrap group-hover:text-[#0284C7] transition-colors leading-normal" title="${escapeHTML(m.title)}">${escapeHTML(m.title)}</div>
                
                <!-- Line 4: Contact Name in a single line -->
                <div class="text-[11px] text-gray-600 truncate whitespace-nowrap" title="${escapeHTML(m.contactName)}">${escapeHTML(m.contactName)}</div>
                
                <!-- Line 5: Time & Mode in a single line -->
                <div class="flex items-center justify-between pt-1.5 border-t border-gray-100 text-[10px] text-gray-500 whitespace-nowrap">
                  <span class="font-mono font-semibold text-gray-800">${escapeHTML(m.startTime)}</span>
                  <span class="inline-flex items-center gap-1 font-medium text-gray-500">
                    ${m.mode === 'Online' ? '<svg class="w-3 h-3 text-[#0284C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>' : '<svg class="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'}
                    <span>${escapeHTML(m.mode)}</span>
                  </span>
                </div>
              </div>
            `).join('') : `
              <div class="flex-1 flex flex-col items-center justify-center p-3 text-center border border-dashed border-gray-200/80 rounded-xl hover:border-gray-300 hover:bg-gray-100/50 transition-colors cursor-pointer min-h-[140px]" onclick="openAddMeetingModal('', 'Prospect', '${d.iso}')" title="Click to schedule meeting on ${d.monthShort} ${d.dateNumber}">
                <span class="text-[11px] text-gray-400 font-medium">No meetings</span>
              </div>
            `}
          </div>
        </div>
      `).join('');
    }

    function renderMonthCalendar(grid, label, summary, filtered) {
      const year = crmState.calendarDate.getFullYear();
      const month = crmState.calendarDate.getMonth();
      const monthName = crmState.calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      label.innerText = monthName;

      const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      let monthMeetingsCount = 0;
      const cells = [];
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        cells.push({ dayNumber: prevMonthDays - i, isCurrentMonth: false, iso: '' });
      }
      for (let i = 1; i <= daysInMonth; i++) {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(i).padStart(2, '0');
        const iso = `${year}-${mm}-${dd}`;
        const isToday = (iso === '2026-07-14');
        const dayMeetings = filtered.filter(m => m.date === iso);
        monthMeetingsCount += dayMeetings.length;
        cells.push({ dayNumber: i, isCurrentMonth: true, iso: iso, isToday: isToday, meetings: dayMeetings });
      }
      const remaining = (7 - (cells.length % 7)) % 7;
      for (let i = 1; i <= remaining; i++) {
        cells.push({ dayNumber: i, isCurrentMonth: false, iso: '' });
      }

      if (summary) {
        summary.innerText = `${monthMeetingsCount} meeting${monthMeetingsCount === 1 ? '' : 's'} scheduled in ${monthName}`;
      }

      grid.className = 'flex flex-col h-full min-h-[460px] border border-gray-200/90 rounded-xl overflow-hidden bg-white shadow-2xs';
      grid.innerHTML = `
        <div class="grid grid-cols-7 bg-gray-50/90 border-b border-gray-200 text-center py-2 text-[11px] font-bold text-gray-600 select-none">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="grid grid-cols-7 flex-1 divide-x divide-y divide-gray-100">
          ${cells.map(c => {
            if (!c.isCurrentMonth) {
              return `<div class="bg-gray-50/40 p-1.5 text-gray-300 text-[11px] font-mono min-h-[80px]">${c.dayNumber}</div>`;
            }
            return `
              <div class="p-1.5 sm:p-2 min-h-[80px] flex flex-col transition-colors hover:bg-gray-50/80 cursor-pointer ${c.isToday ? 'bg-[#F0F9FF]/30' : ''}" onclick="openAddMeetingModal('', 'Prospect', '${c.iso}')" title="Click to schedule meeting on ${monthName} ${c.dayNumber}">
                <div class="flex items-center justify-between pb-1">
                  <span class="text-xs font-semibold ${c.isToday ? 'w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold text-[11px]' : 'text-gray-700'}">${c.dayNumber}</span>
                  ${c.isToday ? '<span class="text-[10px] font-semibold text-[#0284C7]">Today</span>' : ''}
                </div>
                <div class="space-y-1 flex-1 overflow-y-auto" onclick="event.stopPropagation()">
                  ${c.meetings.map(m => `
                    <div onclick="openEditMeeting('${m.id}')" class="px-1.5 py-1 rounded-md text-[10.5px] truncate font-medium cursor-pointer shadow-2xs border ${m.meetingType === 'Product Demo' ? 'bg-sky-50 text-[#0284C7] border-sky-200 hover:border-[#0284C7]' : 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-600'} transition-all" title="${escapeHTML(m.title)} (${escapeHTML(m.startTime)})">
                      <span class="font-mono text-[9.5px] font-semibold">${escapeHTML(m.startTime.split(' ')[0])}</span> · ${escapeHTML(m.contactName)}
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function setMeetingsViewMode(mode) {
      crmState.meetingsViewMode = mode;
      const btnList = document.getElementById('btnMeetingsListView');
      const btnCal = document.getElementById('btnMeetingsCalView');
      const contList = document.getElementById('meetingsListContainer');
      const contCal = document.getElementById('meetingsCalendarContainer');

      if (mode === 'list') {
        btnList.className = 'h-8 px-3 rounded-lg bg-white shadow-2xs font-semibold text-gray-900 transition-all cursor-pointer';
        btnCal.className = 'h-8 px-3 rounded-lg text-gray-600 font-medium hover:text-gray-900 transition-all cursor-pointer';
        contList.classList.remove('hidden');
        contCal.classList.add('hidden');
        renderMeetingsTable();
      } else {
        btnCal.className = 'h-8 px-3 rounded-lg bg-white shadow-2xs font-semibold text-gray-900 transition-all cursor-pointer';
        btnList.className = 'h-8 px-3 rounded-lg text-gray-600 font-medium hover:text-gray-900 transition-all cursor-pointer';
        contList.classList.add('hidden');
        contCal.classList.remove('hidden');
        renderMeetingsCalendar();
      }
    }

    function switchMeetingTab(tab) {
      crmState.activeMeetingTab = tab;
      ['all', 'upcoming', 'today', 'completed', 'cancelled'].forEach(t => {
        document.getElementById(`mtTab-${t}`).classList.remove('active');
      });
      document.getElementById(`mtTab-${tab}`).classList.add('active');
      renderMeetingsTable();
      renderMeetingsCalendar();
    }

    // Dropdown Action Menus
    function toggleActionMenu(menuId) {
      hideAllActionMenus(menuId);
      const menu = document.getElementById(menuId);
      if (menu) menu.classList.toggle('hidden');
    }

    function hideAllActionMenus(exceptId = '') {
      document.querySelectorAll('[id^="menu-"]').forEach(el => {
        if (el.id !== exceptId) el.classList.add('hidden');
      });
    }
