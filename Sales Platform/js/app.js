/**
 * Modulus CRM - Main Application Controller
 * Routing, Universal Search, Notifications, Event Listeners & Bootstrap
 */

    // NAVIGATION ROUTER & ACTIVE INDICATOR
    function navigateScreen(screenId) {
      crmState.activeScreen = screenId;

      // Update Sidebar Nav Highlighting (Active blue tint, inactive grayed out)
      const navIds = ['dashboard', 'prospects', 'clients', 'followups', 'meetings'];
      navIds.forEach(id => {
        const btn = document.getElementById('nav-' + id);
        if (btn) {
          btn.blur();
          if (id === screenId) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
      if (document.activeElement && document.activeElement.classList.contains('sidebar-nav-item')) {
        document.activeElement.blur();
      }
      ['view-dashboard', 'view-prospects', 'view-clients', 'view-followups', 'view-meetings'].forEach(v => {
        const el = document.getElementById(v);
        if (el) {
          el.classList.add('hidden');
          el.classList.remove('motion-view-enter');
        }
      });
      const target = document.getElementById('view-' + screenId);
      if (target) {
        target.classList.remove('hidden');
        void target.offsetWidth;
        target.classList.add('motion-view-enter');
      }

      // Update Top Header: Exact Sidebar Symbol + Section Name (No Chevron)
      const sectionMeta = {
        'dashboard': {
          title: 'Overview',
          icon: '<svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>'
        },
        'prospects': {
          title: 'Prospects',
          icon: '<svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
        },
        'clients': {
          title: 'Clients',
          icon: '<svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
        },
        'followups': {
          title: 'Follow-ups',
          icon: '<svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        },
        'meetings': {
          title: 'Meetings',
          icon: '<svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
        }
      };

      const meta = sectionMeta[screenId] || sectionMeta['dashboard'];
      const iconEl = document.getElementById('headerSectionIcon');
      const titleEl = document.getElementById('headerSectionTitle');
      if (iconEl && meta) iconEl.innerHTML = meta.icon;
      if (titleEl && meta) titleEl.innerText = meta.title;
      updateSidebarBadges();
      if (screenId === 'dashboard') renderHomeTable();
      else if (screenId === 'prospects') renderProspectsTable();
      else if (screenId === 'clients') renderClientsTable();
      else if (screenId === 'followups') renderFollowupsTable();
      else if (screenId === 'meetings') {
        renderMeetingsTable();
        if (crmState.meetingsViewMode === 'calendar') {
          setMeetingsViewMode('calendar');
        } else {
          setMeetingsViewMode('list');
        }
      }
      if (window.innerWidth < 768) {
        const sb = document.getElementById('sidebarNav');
        if (sb && !sb.classList.contains('-translate-x-full')) {
          sb.classList.add('-translate-x-full');
          document.getElementById('mobileSidebarBackdrop').classList.add('hidden');
        }
      }

      const mw = document.getElementById('mainWorkspaceBody');
      if (mw) mw.scrollTop = 0;
    }

    function updateDynamicMetricCards() {
      if (!document.getElementById("stat-outreach-val")) return;

      const pCount = crmState.prospects.length;
      const cCount = crmState.clients.length;
      const fCount = crmState.followups.length;
      const mCount = crmState.meetings.length;

      // Card 1: Outreach
      const delivered = Math.max(12, (pCount * 9) + (cCount * 4) - 2);
      const drafted = Math.round(delivered * 0.62);
      const outreachDelta = (pCount - 6) + (cCount - 4);
      const outreachTrend = Math.min(48, Math.max(5, Math.round(17 + outreachDelta * 2.5)));

      const elOutreachVal = document.getElementById("stat-outreach-val");
      const elOutreachTrend = document.getElementById("stat-outreach-trend");
      const elOutreachSub = document.getElementById("stat-outreach-sub");
      const elChartOutreach = document.getElementById("chart-outreach");

      if (elOutreachVal) elOutreachVal.innerText = delivered;
      if (elOutreachTrend) {
        elOutreachTrend.innerHTML = `<svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg> ${outreachTrend}%`;
      }
      if (elOutreachSub) elOutreachSub.innerText = `${drafted} Drafted · ${delivered} Delivered`;
      if (elChartOutreach) {
        const baseOutreachPattern = [2, 3, 3, 4, 3, 2, 2, 3, 4, 5, 6, 4];
        elChartOutreach.innerHTML = generateDottedChartSVG(delivered, baseOutreachPattern, "#0284C7", Math.max(0, outreachDelta));
      }

      // Card 2: Activities
      const totalActivities = Math.max(8, (fCount * 3) + (pCount * 2) - 2);
      const actOpened = Math.round(totalActivities * 0.52);
      const actReplied = totalActivities - actOpened;
      const actDelta = (fCount - 5) + Math.floor((pCount - 6) / 2);
      const actTrend = Math.min(35, Math.max(2, Math.round(5 + actDelta * 1.8)));

      const elActivitiesVal = document.getElementById("stat-activities-val");
      const elActivitiesTrend = document.getElementById("stat-activities-trend");
      const elActivitiesSub = document.getElementById("stat-activities-sub");
      const elChartActivities = document.getElementById("chart-activities");

      if (elActivitiesVal) elActivitiesVal.innerText = totalActivities;
      if (elActivitiesTrend) {
        elActivitiesTrend.innerHTML = `<svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg> ${actTrend}%`;
      }
      if (elActivitiesSub) elActivitiesSub.innerText = `${actOpened} Opened · ${actReplied} Replied`;
      if (elChartActivities) {
        const baseActivitiesPattern = [3, 2, 2, 3, 4, 2, 3, 3, 5, 4, 6, 5];
        elChartActivities.innerHTML = generateDottedChartSVG(totalActivities, baseActivitiesPattern, "#10B981", Math.max(0, actDelta));
      }

      // Card 3: Conversations
      const convBooked = mCount + 4;
      const convDue = crmState.followups.filter(f => f.status === "Overdue" || f.status === "Today").length;
      const convDelta = (mCount - 3) + Math.floor((cCount - 4) / 2);
      const convTrend = Math.min(30, Math.max(1, Math.round(1 + convDelta * 2.2)));

      const elConvVal = document.getElementById("stat-conversations-val");
      const elConvTrend = document.getElementById("stat-conversations-trend");
      const elConvSub = document.getElementById("stat-conversations-sub");
      const elChartConv = document.getElementById("chart-conversations");

      if (elConvVal) elConvVal.innerText = convBooked;
      if (elConvTrend) {
        elConvTrend.innerHTML = `<svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg> ${convTrend}%`;
      }
      if (elConvSub) elConvSub.innerText = `${convBooked} Booked · ${convDue} Due`;
      if (elChartConv) {
        const baseConvPattern = [2, 2, 3, 4, 3, 2, 3, 4, 5, 4, 6, 6];
        elChartConv.innerHTML = generateDottedChartSVG(convBooked, baseConvPattern, "#0284C7", Math.max(0, convDelta));
      }
    }

    function updateSidebarBadges() {
      const dueCount = crmState.followups.filter(f => f.status === "Overdue" || f.status === "Today").length;

      const fBadge = document.getElementById("sidebarBadgeFollowups");
      if (fBadge) fBadge.innerText = dueCount;

      updateDynamicMetricCards();
    }

    // SIDEBAR TOGGLING (Consistent Pinned 240px vs Collapsed Icon Rail 68px)
    let isSidebarPinned = true;

    
    

    function toggleSidebarSticky(e) {
      if (e) e.stopPropagation();
      if (window.innerWidth < 768) {
        toggleMobileSidebar();
        return;
      }

      isSidebarPinned = !isSidebarPinned;
      const container = document.getElementById("sidebarContainer");
      const topBtnIcon = document.getElementById("topSidebarToggleIcon");

      if (isSidebarPinned) {
        container.classList.remove("sidebar-rail");
        container.classList.add("sidebar-pinned");
        if (topBtnIcon) topBtnIcon.classList.remove("rotate-180");
      } else {
        container.classList.remove("sidebar-pinned");
        container.classList.add("sidebar-rail");
        if (topBtnIcon) topBtnIcon.classList.add("rotate-180");
      }
    }

    function toggleSidebar() {
      toggleSidebarSticky();
    }

    function toggleMobileSidebar() {
      const sb = document.getElementById("sidebarNav");
      const backdrop = document.getElementById("mobileSidebarBackdrop");
      sb.classList.toggle("-translate-x-full");
      backdrop.classList.toggle("hidden");
    }


    // TOP UNIVERSAL SEARCH & QUICK-JUMP COMMAND PALETTE
    function openUniversalSearchDropdown() {
      const input = document.getElementById('topUniversalSearchInput');
      const val = input ? input.value : '';
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (clearBtn) {
        if (val && val.length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
      const query = val.trim();
      if (!query) {
        closeUniversalSearchDropdown();
        return;
      }
      renderUniversalSearchResults(query);
      const dropdown = document.getElementById('universalSearchResults');
      if (dropdown) dropdown.classList.remove('hidden');
    }

    function closeUniversalSearchDropdown() {
      const dropdown = document.getElementById('universalSearchResults');
      if (dropdown) dropdown.classList.add('hidden');
    }

    function clearUniversalSearch(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      const input = document.getElementById('topUniversalSearchInput');
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (clearBtn) {
        clearBtn.classList.add('hidden');
      }
      closeUniversalSearchDropdown();
    }

    function handleUniversalSearch(val) {
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (clearBtn) {
        if (val && val.length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
      const q = (val || '').trim();
      if (!q) {
        closeUniversalSearchDropdown();
        return;
      }
      renderUniversalSearchResults(q);
      const dropdown = document.getElementById('universalSearchResults');
      if (dropdown) dropdown.classList.remove('hidden');
    }

    function handleUniversalSearchKeydown(e) {
      if (e.key === 'Escape') {
        clearUniversalSearch(e);
        e.target.blur();
      }
    }

    function renderUniversalSearchResults(query) {
      const container = document.getElementById('universalSearchResults');
      if (!container) return;

      const q = (query || '').trim().toLowerCase();

      if (!q) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
      }
      const matchedProspects = crmState.prospects.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.firm.toLowerCase().includes(q) || 
        p.phone.includes(q) || 
        p.email.toLowerCase().includes(q) ||
        p.stage.toLowerCase().includes(q)
      );
      const matchedClients = crmState.clients.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.firm.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        c.plan.toLowerCase().includes(q)
      );
      const matchedMeetings = crmState.meetings.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.contactName.toLowerCase().includes(q)
      );
      const matchedFollowups = crmState.followups.filter(f => 
        f.contactName.toLowerCase().includes(q) || 
        f.prevSummary.toLowerCase().includes(q)
      );

      const totalMatches = matchedProspects.length + matchedClients.length + matchedMeetings.length + matchedFollowups.length;

      if (totalMatches === 0) {
        container.innerHTML = `
          <div class="py-6 text-center text-gray-400">
            <svg class="w-6 h-6 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <p class="text-xs font-medium">No results found for "${escapeHTML(query)}"</p>
            <p class="text-[10px] text-gray-400 mt-0.5">Try searching by contact name, company, phone, or email</p>
          </div>
        `;
        return;
      }

      let html = `<div class="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider select-none">Found ${totalMatches} matching records</div>`;

      if (matchedProspects.length > 0) {
        html += `<div class="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prospects</div>`;
        matchedProspects.slice(0, 3).forEach(p => {
          html += `
            <div onclick="universalOpenProspect('${p.id}')" class="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-xs">
              <div class="flex items-center gap-2 overflow-hidden">
                <div class="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/80 flex items-center justify-center font-bold text-[9px] shrink-0 select-none">
                  ${getInitials(p.name)}
                </div>
                <div class="truncate">
                  <div class="font-semibold text-gray-900 truncate">${escapeHTML(p.name)}</div>
                  <div class="text-[10px] text-gray-400 truncate">${escapeHTML(p.firm)} · ${escapeHTML(p.city)}</div>
                </div>
              </div>
              <span class="inline-flex items-center whitespace-nowrap text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 shrink-0 ml-2">${escapeHTML(p.stage)}</span>
            </div>
          `;
        });
      }

      if (matchedClients.length > 0) {
        html += `<div class="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Clients</div>`;
        matchedClients.slice(0, 3).forEach(c => {
          html += `
            <div onclick="universalOpenClient('${c.id}')" class="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-xs">
              <div class="flex items-center gap-2 overflow-hidden">
                <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center font-bold text-[9px] shrink-0 select-none">
                  ${getInitials(c.name)}
                </div>
                <div class="truncate">
                  <div class="font-semibold text-gray-900 truncate">${escapeHTML(c.name)}</div>
                  <div class="text-[10px] text-gray-400 truncate">${escapeHTML(c.firm)} · ${escapeHTML(c.city)}</div>
                </div>
              </div>
              <span class="inline-flex items-center whitespace-nowrap text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0284C7] shrink-0 ml-2">${escapeHTML(c.plan)}</span>
            </div>
          `;
        });
      }

      if (matchedMeetings.length > 0) {
        html += `<div class="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Meetings</div>`;
        matchedMeetings.slice(0, 2).forEach(m => {
          html += `
            <div onclick="universalNavigate('meetings')" class="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-xs">
              <div class="flex items-center gap-2 overflow-hidden">
                <span class="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </span>
                <div class="truncate">
                  <div class="font-semibold text-gray-900 truncate">${escapeHTML(m.title)}</div>
                  <div class="text-[10px] text-gray-400 truncate">${escapeHTML(m.contactName)} · ${escapeHTML(m.date)}</div>
                </div>
              </div>
              <span class="text-[10px] text-gray-500 shrink-0 ml-2">${escapeHTML(m.time)}</span>
            </div>
          `;
        });
      }

      if (matchedFollowups.length > 0) {
        html += `<div class="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Follow-ups</div>`;
        matchedFollowups.slice(0, 2).forEach(f => {
          html += `
            <div onclick="universalNavigate('followups')" class="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-xs">
              <div class="flex items-center gap-2 overflow-hidden">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <div class="truncate">
                  <div class="font-semibold text-gray-900 truncate">${escapeHTML(f.contactName)}</div>
                  <div class="text-[10px] text-gray-400 truncate">${escapeHTML(f.prevSummary || f.channel)}</div>
                </div>
              </div>
              <span class="text-[10px] font-medium text-amber-700 shrink-0 ml-2">${escapeHTML(f.status)}</span>
            </div>
          `;
        });
      }

      container.innerHTML = html;
    }

    function universalNavigate(screenId) {
      closeUniversalSearchDropdown();
      navigateScreen(screenId);
      const inp = document.getElementById('topUniversalSearchInput');
      if (inp) { inp.value = ''; inp.blur(); }
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (clearBtn) clearBtn.classList.add('hidden');
    }

    function universalOpenProspect(prospectId) {
      closeUniversalSearchDropdown();
      navigateScreen('prospects');
      setTimeout(() => openProspectDrawer(prospectId), 100);
      const inp = document.getElementById('topUniversalSearchInput');
      if (inp) { inp.value = ''; inp.blur(); }
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (clearBtn) clearBtn.classList.add('hidden');
    }

    function universalOpenClient(clientId) {
      closeUniversalSearchDropdown();
      navigateScreen('clients');
      setTimeout(() => openClientDrawer(clientId), 100);
      const inp = document.getElementById('topUniversalSearchInput');
      if (inp) { inp.value = ''; inp.blur(); }
      const clearBtn = document.getElementById('topUniversalSearchClearBtn');
      if (clearBtn) clearBtn.classList.add('hidden');
    }

    // Notifications popover
    function toggleNotificationsPopover(e) {
      if (e) e.stopPropagation();
      const el = document.getElementById('headerNotificationsMenu');
      if (!el) return;
      const isHidden = el.classList.contains('hidden');
      if (isHidden) {
        closeDateRangeCalendar();
        const rangeMenu = document.getElementById('homeRangeMenu');
        const chev = document.getElementById('homeRangeChevron');
        if (rangeMenu) rangeMenu.classList.add('hidden');
        if (chev) chev.classList.remove('rotate-180');
        const searchRes = document.getElementById('universalSearchResults');
        if (searchRes) searchRes.classList.add('hidden');
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    function closeNotificationsPopover() {
      const el = document.getElementById('headerNotificationsMenu');
      if (el) el.classList.add('hidden');
    }


// GLOBAL SHORTCUTS & OVERLAY DISMISSAL
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
    e.preventDefault();
    toggleSidebarSticky();
    return;
  }
  if (e.key === 'Escape') {
    // 1. Custom filter dropdown
    if (openDropdownId) {
      openDropdownId = null;
      renderCustomDropdowns();
      return;
    }
    // 2. Date range calendar
    const cal = document.getElementById('homeDateRangeCalendarMenu');
    if (cal && !cal.classList.contains('hidden')) {
      closeDateRangeCalendar();
      return;
    }
    // 3. Notifications menu
    const notif = document.getElementById('headerNotificationsMenu');
    if (notif && !notif.classList.contains('hidden')) {
      closeNotificationsPopover();
      return;
    }
    // 4. Universal search dropdown
    const searchDrop = document.getElementById('universalSearchResults');
    if (searchDrop && !searchDrop.classList.contains('hidden')) {
      closeUniversalSearchDropdown();
      return;
    }
    // 5. Confirmation modal
    const confModal = document.getElementById('modalConfirmation');
    if (confModal && !confModal.classList.contains('hidden')) {
      closeConfirmModal();
      return;
    }
    // 6. Any other open modal (topmost)
    const modals = [
      { id: 'modalAddProspect', close: closeAddProspectModal },
      { id: 'modalAddClient', close: closeAddClientModal },
      { id: 'modalAddFollowup', close: closeAddFollowupModal },
      { id: 'modalCompleteFollowup', close: closeCompleteFollowupModal },
      { id: 'modalAddMeeting', close: closeAddMeetingModal },
      { id: 'modalConvertProspect', close: closeConvertModal },
      { id: 'modalUserProfile', close: closeUserProfileModal },
      { id: 'modalEditProspect', close: closeEditProspectModal },
      { id: 'modalEditClient', close: closeEditClientModal },
      { id: 'modalEditFollowup', close: closeEditFollowupModal },
      { id: 'modalEditMeeting', close: closeEditMeetingModal }
    ];
    for (const m of modals) {
      const el = document.getElementById(m.id);
      if (el && !el.classList.contains('hidden')) {
        m.close();
        return;
      }
    }
    // 7. Any open side drawer
    const prosDrawer = document.getElementById('drawerProspectDetails');
    if (prosDrawer && !prosDrawer.classList.contains('translate-x-full')) {
      closeProspectDrawer();
      return;
    }
    const cliDrawer = document.getElementById('drawerClientDetails');
    if (cliDrawer && !cliDrawer.classList.contains('translate-x-full')) {
      closeClientDrawer();
      return;
    }
  }
});

// Global Window click to dismiss popovers, menus, and dropdowns
window.addEventListener('click', function(e) {
  hideAllActionMenus();
  closeNotificationsPopover();

  if (openDropdownId) {
    openDropdownId = null;
    renderCustomDropdowns();
  }

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

// Backdrop click handlers for dialog modals
function setupModalBackdropDismiss() {
  document.querySelectorAll('[id^="modal"]').forEach(modalEl => {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) {
        modalEl.classList.add('hidden');
        if (modalEl.id === 'modalConfirmation') pendingConfirmationAction = null;
      }
    });
  });
}

/**
 * Bootstrap CRM Application
 */
function initApp() {
  setupModalBackdropDismiss();
  renderCustomDropdowns();
  if (typeof initCustomSelects === 'function') initCustomSelects();
  renderHomeTable();
  renderProspectsTable();
  renderClientsTable();
  renderFollowupsTable();
  renderMeetingsTable();
  updateSidebarBadges();
  updateDynamicMetricCards();

  // Initialize user profile in DOM
  const u = crmState.userProfile;
  if (u) {
    const profName = document.getElementById('sidebarUserName');
    if (profName) profName.innerText = u.name;
    const profRole = document.getElementById('sidebarUserRole');
    if (profRole) profRole.innerText = u.role;
    const profAvatar = document.getElementById('sidebarUserAvatar');
    if (profAvatar) profAvatar.innerText = u.avatarInitials;
    const homeGreeting = document.getElementById('homeWelcomeTitle');
    if (homeGreeting) homeGreeting.innerText = `Welcome back, ${u.name.split(' ')[0] || u.name}`;
  }
}

document.addEventListener('DOMContentLoaded', initApp);
