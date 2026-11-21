/**
 * Modulus CRM - Slide-out Details Drawers
 * Prospect Details Drawer (5 Tabs) & Client Details Drawer (7 Tabs)
 */

function openProspectDrawer(id) {
  const p = getProspect(id);
  if (!p) return;
  crmState.activeProspectId = id;

  setTxt('dpAvatar', getInitials(p.name));
  setTxt('dpName', p.name);
  const dpSb = document.getElementById('dpStageBadge');
  if (dpSb) {
    dpSb.outerHTML = `<span id="dpStageBadge">${renderStagePill(p.stage)}</span>`;
  }
  setTxt('dpFirmAndBar', `${p.firm} · Bar ID: ${p.barId || 'Unenrolled'}`);
  setTxt('dpPhoneText', p.phone);
  setTxt('dpEmailText', p.email);

  setTxt('dpSalesperson', p.salesperson);
  setTxt('dpInterest', p.interest);
  setTxt('dpSource', p.source);
  setTxt('dpProduct', p.productInterest);
  setTxt('dpProfession', p.profession);
  setTxt('dpFirm', p.firm);
  setTxt('dpBar', p.barId || 'Unenrolled');
  setTxt('dpCity', `${p.city}, ${p.state || 'India'}`);
  setTxt('dpNotes', `"${p.notes}"`);

  // Timeline render
  const tl = document.getElementById('dpTimelineList');
  if (tl) {
    tl.innerHTML = (p.timeline || []).map(t => `
      <div class="relative text-xs">
        <div class="font-bold text-[#111827]">${escapeHTML(t.title)}</div>
        <div class="text-[11px] text-gray-500 mt-0.5">${escapeHTML(t.time)} · <strong>${escapeHTML(t.user)}</strong></div>
        <div class="text-gray-600 mt-1">${escapeHTML(t.note)}</div>
      </div>
    `).join('') || '<div class="text-xs text-gray-400">No activity logged yet.</div>';
  }

  // Follow-ups render
  const pFollowups = crmState.followups.filter(f => f.contactName === p.name);
  const fuList = document.getElementById('dpFollowupsList');
  if (fuList) {
    fuList.innerHTML = pFollowups.map(f => `
      <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
        <div>
          <div class="font-semibold text-gray-900">${escapeHTML(f.channel)} · ${escapeHTML(f.date)} ${escapeHTML(f.time)}</div>
          <div class="text-[11px] text-gray-500">${escapeHTML(f.prevSummary)}</div>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded ${f.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}">${escapeHTML(f.status)}</span>
      </div>
    `).join('') || '<div class="text-xs text-gray-400">No follow-ups recorded.</div>';
  }

  // Meetings render
  const pMeetings = crmState.meetings.filter(m => m.contactName === p.name);
  const mtList = document.getElementById('dpMeetingsList');
  if (mtList) {
    mtList.innerHTML = pMeetings.map(m => `
      <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="font-semibold text-gray-900">${escapeHTML(m.title)}</div>
        <div class="text-[11px] text-gray-500 mt-0.5">${escapeHTML(m.date)} at ${escapeHTML(m.startTime)} · Mode: ${escapeHTML(m.mode)}</div>
      </div>
    `).join('') || '<div class="text-xs text-gray-400">No meetings scheduled.</div>';
  }

  // Comments render
  renderProspectComments(p);

  switchDpTab('overview');
  document.getElementById('drawerProspectBackdrop').classList.remove('hidden');
  document.getElementById('drawerProspectDetails').classList.remove('translate-x-full');
}

function closeProspectDrawer() {
  const backdrop = document.getElementById('drawerProspectBackdrop');
  const details = document.getElementById('drawerProspectDetails');
  if (backdrop) backdrop.classList.add('hidden');
  if (details) details.classList.add('translate-x-full');
  crmState.activeProspectId = null;
}

function switchDpTab(tab) {
  ['overview', 'timeline', 'followups', 'meetings', 'comments'].forEach(t => {
    const tabEl = document.getElementById(`dpTab-${t}`);
    const contentEl = document.getElementById(`dpContent-${t}`);
    if (tabEl) tabEl.classList.remove('active');
    if (contentEl) contentEl.classList.add('hidden');
  });
  const activeTab = document.getElementById(`dpTab-${tab}`);
  const activeContent = document.getElementById(`dpContent-${tab}`);
  if (activeTab) activeTab.classList.add('active');
  if (activeContent) activeContent.classList.remove('hidden');
}

function renderProspectComments(p) {
  const cList = document.getElementById('dpCommentsList');
  if (!cList) return;
  cList.innerHTML = (p.comments || []).map(c => `
    <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
      <div class="flex items-center justify-between text-[10px] text-gray-400">
        <span class="font-semibold text-gray-700">${escapeHTML(c.user)}</span>
        <span>${escapeHTML(c.time)}</span>
      </div>
      <div class="mt-1 text-gray-800">${escapeHTML(c.text)}</div>
    </div>
  `).join('') || '<div class="text-xs text-gray-400">No internal notes written yet.</div>';
}

function submitProspectComment() {
  const val = getVal('dpNewCommentInput');
  if (!val) return;
  const p = getProspect(crmState.activeProspectId);
  if (!p) return;

  if (!p.comments) p.comments = [];
  p.comments.unshift({ user: crmState.userProfile?.name || 'Satyajit Mane', time: 'Just now', text: val });
  setVal('dpNewCommentInput', '');
  saveState();
  renderProspectComments(p);
  triggerToast('Internal comment added!', 'Note Posted');
}

function openClientDrawer(id) {
  const c = getClient(id);
  if (!c) return;
  crmState.activeClientId = id;

  setTxt('dcAvatar', getInitials(c.firm || c.name));
  setTxt('dcFirm', c.firm);
  setTxt('dcAdvocate', `${c.name} · Plan: ${c.plan}`);
  setTxt('dcAM', c.am);
  setTxt('dcRenewal', c.renewalDate);
  setTxt('dcAmount', c.amount);
  setTxt('dcSeats', `${c.seats} Seats`);
  setTxt('dcPhone', c.phone);
  setTxt('dcEmail', c.email);
  setTxt('dcCity', c.city);

  setTxt('dcSubPlanName', c.plan);
  setTxt('dcSubStart', c.startDate || 'Jul 15, 2025');
  setTxt('dcSubRenew', c.renewalDate);

  if (document.getElementById('dcPhoneRibbon')) setTxt('dcPhoneRibbon', c.phone);
  if (document.getElementById('dcEmailRibbon')) setTxt('dcEmailRibbon', c.email);
  if (document.getElementById('dcStatusBadge')) {
    const isActive = (c.clientStatus === 'Active');
    const el = document.getElementById('dcStatusBadge');
    el.className = `text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs inline-flex items-center gap-1.5 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' : 'bg-rose-50 text-rose-700 border-rose-200/70'}`;
    el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}"></span>${escapeHTML(c.clientStatus || 'Active')}`;
  }

  switchDcTab('overview');
  document.getElementById('drawerClientBackdrop').classList.remove('hidden');
  document.getElementById('drawerClientDetails').classList.remove('translate-x-full');
}

function closeClientDrawer() {
  const backdrop = document.getElementById('drawerClientBackdrop');
  const details = document.getElementById('drawerClientDetails');
  if (backdrop) backdrop.classList.add('hidden');
  if (details) details.classList.add('translate-x-full');
  crmState.activeClientId = null;
}

function switchDcTab(tab) {
  ['overview', 'subscription', 'payments', 'timeline', 'followups', 'meetings', 'comments'].forEach(t => {
    const tabEl = document.getElementById(`dcTab-${t}`);
    const contentEl = document.getElementById(`dcContent-${t}`);
    if (tabEl) tabEl.classList.remove('active');
    if (contentEl) contentEl.classList.add('hidden');
  });
  const activeTab = document.getElementById(`dcTab-${tab}`);
  const activeContent = document.getElementById(`dcContent-${tab}`);
  if (activeTab) activeTab.classList.add('active');
  if (activeContent) activeContent.classList.remove('hidden');
}

// DRAWER ACTION SHORTCUTS (Canonical implementation)
function openFollowupFromProspect() {
  const p = getProspect(crmState.activeProspectId);
  if (p) openFollowupFor(p.name, 'Prospect', p.phone);
}

function openMeetingFromProspect() {
  const p = getProspect(crmState.activeProspectId);
  if (p) openMeetingFor(p.name, 'Prospect', p.phone, p.email);
}

function openConvertFromProspect() {
  if (crmState.activeProspectId) openConvertModal(crmState.activeProspectId);
}

function openFollowupFromClient() {
  const c = getClient(crmState.activeClientId);
  if (c) openFollowupFor(c.name, 'Client', c.phone);
}

function openMeetingFromClient() {
  const c = getClient(crmState.activeClientId);
  if (c) openMeetingFor(c.name, 'Client', c.phone, c.email);
}

function openEditProspectFromDrawer() {
  if (crmState.activeProspectId) openEditProspect(crmState.activeProspectId);
}

function confirmDeleteProspectFromDrawer() {
  if (crmState.activeProspectId) confirmDeleteProspect(crmState.activeProspectId);
}

function openEditClientFromDrawer() {
  if (crmState.activeClientId) openEditClient(crmState.activeClientId);
}

function confirmDeleteClientFromDrawer() {
  if (crmState.activeClientId) confirmDeleteClient(crmState.activeClientId);
}
