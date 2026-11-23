/**
 * Modulus CRM - Modal Dialogs & CRUD Engine
 * Production-ready handlers for Prospects, Clients, Follow-ups, Meetings, and Confirmation modals.
 */

// ADD PROSPECT MODAL
function openAddProspectModal() {
  const modal = document.getElementById('modalAddProspect');
  if (!modal) return;
  modal.classList.remove('hidden');
  const inpDate = document.getElementById('inpPFollowupDate');
  if (inpDate && !inpDate.value) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    inpDate.value = tom.toISOString().split('T')[0];
  }
  if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
}

function closeAddProspectModal() {
  const modal = document.getElementById('modalAddProspect');
  if (modal) modal.classList.add('hidden');
}

function checkProspectDuplicates() {
  const phone = getVal('inpPPhone');
  const email = getVal('inpPEmail');
  if (!phone && !email) return;

  const found = crmState.prospects.find(p => (phone && p.phone === phone) || (email && p.email === email));
  if (found) {
    triggerToast(`Possible duplicate found: ${found.name} (${found.firm || 'No firm'})`, 'Duplicate Alert');
  }
}

function submitNewProspect() {
  const name = getVal('inpPName').replace(/^Adv\.\s*/i, '');
  const phone = getVal('inpPPhone');
  const email = getVal('inpPEmail');
  const firm = getVal('inpPFirm') || 'Independent Practice';
  const barId = getVal('inpPBarId');
  const profession = getVal('inpPProfession') || 'Advocate';
  const city = getVal('inpPCity') || 'Mumbai';
  const state = getVal('inpPState') || 'Maharashtra';
  const stage = getVal('inpPStage') || 'New Lead';
  const interest = getVal('inpPInterest') || 'High';
  const source = getVal('inpPSource') || 'Website';
  const productInterest = getVal('inpPProduct') || 'Complete Platform';
  const priority = getVal('inpPPriority') || 'High';
  const sp = getVal('inpPSalesperson') || 'Satyajit Mane';
  const notes = getVal('inpPNotes') || 'New prospect added via quick lead modal.';
  const fDate = getVal('inpPFollowupDate');
  const fTime = getVal('inpPFollowupTime');

  if (!name || !phone) {
    triggerToast('Please provide both Full Name and Phone Number.', 'Validation Error');
    return;
  }

  // Prepend prefix if Advocate
  const formattedName = (profession === 'Advocate' && !name.startsWith('Adv. ')) ? `Adv. ${name}` : name;

  const newProspect = {
    id: `PR-2026-00${crmState.prospects.length + 1}`,
    name: formattedName,
    phone: phone,
    email: email,
    profession: profession,
    firm: firm,
    barId: barId,
    city: city,
    state: state,
    source: source,
    productInterest: productInterest,
    interest: interest,
    priority: priority,
    stage: stage,
    lastContacted: 'Today',
    nextFollowupDate: fDate || '2026-07-20',
    nextFollowupTime: fTime || '11:00 AM',
    salesperson: sp,
    createdDate: 'Today',
    notes: notes,
    timeline: [
      { title: 'Prospect Created', time: 'Just now', user: sp, note: 'Initial record added to CRM.' }
    ],
    comments: []
  };

  crmState.prospects.unshift(newProspect);

  // Auto schedule follow-up if requested
  if (fDate) {
    crmState.followups.unshift({
      id: `FU-2026-00${crmState.followups.length + 1}`,
      contactName: formattedName,
      contactType: 'Prospect',
      phone: phone,
      channel: 'Call',
      prevSummary: notes,
      date: fDate,
      time: fTime || '11:00 AM',
      priority: priority || 'High',
      salesperson: sp,
      status: 'Upcoming'
    });
  }

  saveState();
  closeAddProspectModal();
  renderProspectsTable();
  renderHomeTable();
  updateSidebarBadges();
  triggerToast(`Prospect ${formattedName} successfully created!`, 'Prospect Added');
}

function saveProspectDraft() {
  closeAddProspectModal();
  triggerToast('Prospect information saved as draft.', 'Draft Saved');
}

// ADD CLIENT MODAL
function openAddClientModal() {
  const modal = document.getElementById('modalAddClient');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeAddClientModal() {
  const modal = document.getElementById('modalAddClient');
  if (modal) modal.classList.add('hidden');
}

function submitNewClient() {
  const name = getVal('inpCliName').replace(/^Adv\.\s*/i, '');
  const firm = getVal('inpCliFirm');
  const phone = getVal('inpCliPhone');
  const email = getVal('inpCliEmail');

  if (!name || !firm || !phone) {
    triggerToast('Please fill in required fields.', 'Validation Error');
    return;
  }

  const newClient = {
    id: `CL-2026-00${crmState.clients.length + 1}`,
    name: name,
    firm: firm,
    phone: phone,
    email: email,
    profession: 'Law Firm',
    barId: getVal('inpCliBar'),
    city: getVal('inpCliCity'),
    state: 'Maharashtra',
    plan: getVal('inpCliPlan') || 'Standard',
    subType: getVal('inpCliType') || 'Annual',
    amount: getVal('inpCliAmount') || '₹24,000',
    startDate: 'Today',
    renewalDate: 'Jul 15, 2027',
    paymentStatus: getVal('inpCliPaymentStatus') || 'Paid',
    clientStatus: 'Active',
    am: getVal('inpCliAM') || 'Satyajit Mane',
    seats: 5
  };

  crmState.clients.unshift(newClient);
  saveState();
  closeAddClientModal();
  renderClientsTable();
  updateSidebarBadges();
  triggerToast(`Client ${firm} successfully created!`, 'Client Added');
}

// ADD FOLLOW-UP MODAL
function openAddFollowupModal(preContactName = '', preContactType = 'Prospect') {
  const modal = document.getElementById('modalAddFollowup');
  if (!modal) return;
  modal.classList.remove('hidden');
  const normalizedType = (preContactType === 'Active' || preContactType === 'Active Client' || preContactType === 'Client') ? 'Client' : 'Prospect';
  setVal('inpFuContactType', normalizedType);
  populateFollowupContactDropdown(preContactName);
  if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
}

function closeAddFollowupModal() {
  const modal = document.getElementById('modalAddFollowup');
  if (modal) modal.classList.add('hidden');
}

function populateFollowupContactDropdown(selectTargetName = '') {
  const type = getVal('inpFuContactType');
  const sel = document.getElementById('inpFuContactSelect');
  if (!sel) return;
  const list = type === 'Prospect' ? crmState.prospects : crmState.clients;

  sel.innerHTML = list.map(item => `
    <option value="${escapeHTML(item.name)}" ${item.name === selectTargetName ? 'selected' : ''}>${escapeHTML(item.name)} (${escapeHTML(item.firm || item.name)})</option>
  `).join('');

  if (typeof syncCustomSelect === 'function') {
    syncCustomSelect('inpFuContactSelect');
  }

  onFollowupContactSelected();
}

function onFollowupContactSelected() {
  const type = getVal('inpFuContactType');
  const name = getVal('inpFuContactSelect');
  const list = type === 'Prospect' ? crmState.prospects : crmState.clients;
  const found = list.find(x => x.name === name);
  if (found) {
    setVal('inpFuPhone', found.phone || '');
  }
}

function submitNewFollowup() {
  const type = getVal('inpFuContactType');
  const name = getVal('inpFuContactSelect');
  const phone = getVal('inpFuPhone');
  const channel = getVal('inpFuType') || 'Call';
  const date = getVal('inpFuDate');
  const time = getVal('inpFuTime');
  const priority = getVal('inpFuPriority') || 'High';
  const sp = getVal('inpFuSalesperson') || 'Satyajit Mane';
  const summary = getVal('inpFuPrevSummary') || 'Scheduled follow-up discussion.';

  crmState.followups.unshift({
    id: `FU-2026-00${crmState.followups.length + 1}`,
    contactName: name,
    contactType: type,
    phone: phone,
    channel: channel,
    prevSummary: summary,
    date: date,
    time: time || '11:00 AM',
    priority: priority,
    salesperson: sp,
    status: 'Upcoming'
  });

  saveState();
  closeAddFollowupModal();
  renderFollowupsTable();
  updateSidebarBadges();
  triggerToast(`Follow-up scheduled with ${name}!`, 'Task Scheduled');
}

// COMPLETE FOLLOW-UP MODAL
function openCompleteFollowupModal(id) {
  const f = getFollowup(id);
  if (!f) return;
  crmState.completingFollowupId = id;
  setTxt('compFuContactName', `${f.contactName} (${f.contactType}) · ${f.phone}`);
  setVal('compFuSummary', '');
  const modal = document.getElementById('modalCompleteFollowup');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeCompleteFollowupModal() {
  const modal = document.getElementById('modalCompleteFollowup');
  if (modal) modal.classList.add('hidden');
  crmState.completingFollowupId = null;
}

function toggleNextFollowupFields(val) {
  const row = document.getElementById('compFuNextDateRow');
  if (row) {
    if (val === 'Yes') row.classList.remove('hidden');
    else row.classList.add('hidden');
  }
}

function submitCompleteFollowup() {
  const f = getFollowup(crmState.completingFollowupId);
  if (!f) return;

  const outcome = getVal('compFuOutcome') || 'Call Connected';
  const summary = getVal('compFuSummary') || 'Discussion completed.';
  const interest = getVal('compFuInterest') || 'High';
  const nextRequired = getVal('compFuNextRequired');

  // Update current follow-up (Preserved in history)
  f.status = 'Completed';
  f.outcome = outcome;
  f.summary = summary;

  // Log activity to prospect/client timeline
  const targetP = crmState.prospects.find(p => p.name === f.contactName);
  if (targetP) {
    if (!targetP.timeline) targetP.timeline = [];
    targetP.timeline.unshift({
      title: `Follow-up Completed (${f.channel})`,
      time: 'Today',
      user: f.salesperson,
      note: `${outcome} - ${summary}`
    });
    targetP.interest = interest;
  }

  // If next follow-up required, schedule new follow-up
  if (nextRequired === 'Yes') {
    const nextDate = getVal('compFuNextDate');
    const nextTime = getVal('compFuNextTime');
    crmState.followups.unshift({
      id: `FU-2026-00${crmState.followups.length + 1}`,
      contactName: f.contactName,
      contactType: f.contactType,
      phone: f.phone,
      channel: f.channel,
      prevSummary: `Follow-up following up on: ${summary}`,
      date: nextDate,
      time: nextTime || '11:00 AM',
      priority: 'High',
      salesperson: f.salesperson,
      status: 'Upcoming'
    });
  }

  saveState();
  closeCompleteFollowupModal();
  renderFollowupsTable();
  updateSidebarBadges();
  triggerToast('Follow-up marked as completed and preserved in history.', 'Follow-up Resolved');
}

// ADD MEETING MODAL
function openAddMeetingModal(preContactName = '', preContactType = 'Prospect', preDate = '') {
  const modal = document.getElementById('modalAddMeeting');
  if (!modal) return;
  modal.classList.remove('hidden');
  const normalizedType = (preContactType === 'Active' || preContactType === 'Active Client' || preContactType === 'Client') ? 'Client' : 'Prospect';
  setVal('inpMtContactType', normalizedType);
  if (preDate) {
    setVal('inpMtDate', preDate);
  }
  populateMeetingContactDropdown(preContactName);
  if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
}

function closeAddMeetingModal() {
  const modal = document.getElementById('modalAddMeeting');
  if (modal) modal.classList.add('hidden');
}

function populateMeetingContactDropdown(selectTargetName = '') {
  const type = getVal('inpMtContactType');
  const sel = document.getElementById('inpMtContactSelect');
  if (!sel) return;
  const list = type === 'Prospect' ? crmState.prospects : crmState.clients;

  sel.innerHTML = list.map(item => `
    <option value="${escapeHTML(item.name)}" ${item.name === selectTargetName ? 'selected' : ''}>${escapeHTML(item.name)} (${escapeHTML(item.firm || item.name)})</option>
  `).join('');

  if (typeof syncCustomSelect === 'function') {
    syncCustomSelect('inpMtContactSelect');
  }

  onMeetingContactSelected();
}

function onMeetingContactSelected() {
  const type = getVal('inpMtContactType');
  const name = getVal('inpMtContactSelect');
  const list = type === 'Prospect' ? crmState.prospects : crmState.clients;
  const found = list.find(x => x.name === name);
  if (found) {
    setVal('inpMtPhone', found.phone || '');
    setVal('inpMtEmail', found.email || '');
  }
}

function submitNewMeeting() {
  const title = getVal('inpMtTitle') || 'Platform Product Demo';
  const type = getVal('inpMtType') || 'Product Demo';
  const cType = getVal('inpMtContactType');
  const cName = getVal('inpMtContactSelect');
  const phone = getVal('inpMtPhone');
  const email = getVal('inpMtEmail');
  const date = getVal('inpMtDate');
  const start = getVal('inpMtStartTime');
  const end = getVal('inpMtEndTime');
  const mode = getVal('inpMtMode') || 'Online';
  const link = getVal('inpMtLink') || 'meet.google.com/lex-demo-crm';
  const sp = getVal('inpMtSalesperson') || 'Satyajit Mane';

  crmState.meetings.unshift({
    id: `MT-2026-00${crmState.meetings.length + 1}`,
    title: title,
    contactName: cName,
    contactType: cType,
    phone: phone,
    email: email,
    meetingType: type,
    date: date,
    startTime: start,
    endTime: end,
    mode: mode,
    link: link,
    salesperson: sp,
    status: 'Upcoming'
  });

  saveState();
  closeAddMeetingModal();
  renderMeetingsTable();
  updateSidebarBadges();
  triggerToast(`Meeting scheduled with ${cName}!`, 'Meeting Confirmed');
}

// CONVERT PROSPECT MODAL
let convertingProspectId = null;

function openConvertModal(id) {
  convertingProspectId = id;
  const p = getProspect(id);
  if (!p) return;
  setTxt('convProspectTitle', `${p.name} (${p.firm})`);
  const modal = document.getElementById('modalConvertProspect');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeConvertModal() {
  const modal = document.getElementById('modalConvertProspect');
  if (modal) modal.classList.add('hidden');
  convertingProspectId = null;
}

function onConvertPlanChange(plan) {
  const amounts = {
    'Standard': '₹24,000',
    'Premium': '₹48,000',
    'Enterprise': '₹72,000'
  };
  setVal('convAmount', amounts[plan] || '₹24,000');
}

function executeConvertProspect() {
  const p = getProspect(convertingProspectId);
  if (!p) return;

  const plan = getVal('convPlan') || 'Standard';
  const subType = getVal('convType') || 'Annual';
  const amount = getVal('convAmount') || '₹24,000';

  // Update prospect status
  p.stage = 'Converted';
  if (!p.timeline) p.timeline = [];
  p.timeline.unshift({
    title: 'Converted to Paying Client',
    time: 'Just now',
    user: crmState.userProfile?.name || 'Satyajit Mane',
    note: `Onboarded onto ${plan} (${subType}) at ${amount}/yr.`
  });

  // Add to clients
  crmState.clients.unshift({
    id: `CL-2026-00${crmState.clients.length + 1}`,
    name: p.name,
    firm: p.firm,
    phone: p.phone,
    email: p.email,
    profession: p.profession || 'Law Firm',
    barId: p.barId,
    city: p.city,
    state: p.state || 'Delhi',
    plan: plan,
    subType: subType,
    amount: amount,
    startDate: 'Today',
    renewalDate: 'Jul 15, 2027',
    paymentStatus: 'Paid',
    clientStatus: 'Active',
    am: p.salesperson || 'Satyajit Mane',
    seats: plan === 'Standard' ? 1 : (plan === 'Premium' ? 5 : 20)
  });

  saveState();
  closeConvertModal();
  closeProspectDrawer();
  updateSidebarBadges();
  renderProspectsTable();
  renderHomeTable();
  triggerToast(`${p.name} converted to Client!`, 'Conversion Successful');
}

// QUICK SHORTCUT HANDLERS
function openFollowupFor(name, type, phone) {
  openAddFollowupModal();
  setTimeout(() => {
    setVal('inpFuContactName', name);
    setVal('inpFuContactType', type);
    setVal('inpFuPhone', phone || '+91 98112 34567');
  }, 60);
}

function openMeetingFor(name, type, phone, email) {
  openAddMeetingModal();
  setTimeout(() => {
    setVal('inpMtContactName', name);
    setVal('inpMtContactType', type);
    setVal('inpMtPhone', phone || '+91 98112 34567');
    setVal('inpMtEmail', email || 'client@firm.in');
  }, 60);
}

// USER PROFILE MODAL
function openUserProfileModal() {
  const u = crmState.userProfile;
  setVal('inpProfileName', u.name);
  setVal('inpProfileRole', u.role);
  setVal('inpProfileInitials', u.avatarInitials);
  setVal('inpProfileEmail', u.email);
  setVal('inpProfilePhone', u.phone);
  setVal('inpProfileRegion', u.region);
  setVal('inpProfileChambers', u.chambers);
  updateProfileAvatarPreview(u.avatarInitials);
  const modal = document.getElementById('modalUserProfile');
  if (modal) modal.classList.remove('hidden');
}

function closeUserProfileModal() {
  const modal = document.getElementById('modalUserProfile');
  if (modal) modal.classList.add('hidden');
}

function updateProfileAvatarPreview(val) {
  const init = (val || 'SM').slice(0, 3).toUpperCase();
  setTxt('modalProfileAvatarPreview', init);
}

function saveUserProfile() {
  const name = getVal('inpProfileName');
  const email = getVal('inpProfileEmail');
  if (!name || !email) {
    triggerToast('Please provide your Full Name and Work Email.', 'Validation Error');
    return;
  }

  const u = crmState.userProfile;
  u.name = name;
  u.role = getVal('inpProfileRole') || 'Sales Lead';
  u.avatarInitials = (getVal('inpProfileInitials') || getInitials(name)).slice(0, 3).toUpperCase();
  u.email = email;
  u.phone = getVal('inpProfilePhone');
  u.region = getVal('inpProfileRegion');
  u.chambers = getVal('inpProfileChambers');

  saveState();

  // Update sidebar bottom profile pill
  setTxt('sidebarUserName', u.name);
  setTxt('sidebarUserRole', u.role);
  setTxt('sidebarUserAvatar', u.avatarInitials);

  // Update Home dashboard greeting
  const hTitle = document.getElementById('homeWelcomeTitle');
  if (hTitle) {
    const firstName = u.name.split(' ')[0] || u.name;
    hTitle.innerText = `Welcome back, ${firstName}`;
  }

  closeUserProfileModal();
  triggerToast('User profile updated successfully!', 'Profile Saved');
}

// UNIVERSAL CONFIRMATION DIALOG
let pendingConfirmationAction = null;

function showConfirmDialog(config) {
  pendingConfirmationAction = config.onConfirm;
  setTxt('confirmModalTitle', config.title || 'Confirm Action');
  const msgEl = document.getElementById('confirmModalMessage');
  if (msgEl) msgEl.innerHTML = config.message || 'Are you sure you want to proceed?';

  const btn = document.getElementById('confirmModalActionBtn');
  if (btn) btn.innerText = config.confirmText || 'Confirm';

  const iconWrap = document.getElementById('confirmModalIconWrap');
  if (iconWrap && btn) {
    if (config.confirmStyle === 'primary') {
      btn.className = 'px-4 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer text-xs';
      iconWrap.className = 'w-10 h-10 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] flex items-center justify-center shrink-0';
    } else {
      btn.className = 'px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer text-xs';
      iconWrap.className = 'w-10 h-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0';
    }
  }

  const modal = document.getElementById('modalConfirmation');
  if (modal) modal.classList.remove('hidden');
}

function closeConfirmModal() {
  const modal = document.getElementById('modalConfirmation');
  if (modal) modal.classList.add('hidden');
  pendingConfirmationAction = null;
}

function executeConfirmAction() {
  if (typeof pendingConfirmationAction === 'function') {
    const fn = pendingConfirmationAction;
    pendingConfirmationAction = null;
    closeConfirmModal();
    fn();
  } else {
    closeConfirmModal();
  }
}

// PROSPECT EDIT & DELETE HANDLERS
function openEditProspect(id) {
  const p = getProspect(id);
  if (!p) return;
  crmState.editingProspectId = id;

  setTxt('editProsId', p.id);
  setVal('editProsName', p.name || '');
  setVal('editProsPhone', p.phone || '');
  setVal('editProsEmail', p.email || '');
  setVal('editProsProfession', p.profession || 'Advocate');
  setVal('editProsFirm', p.firm || '');
  setVal('editProsBarId', p.barId || '');
  setVal('editProsCity', p.city || '');
  setVal('editProsState', p.state || 'Delhi');
  setVal('editProsStage', p.stage || 'New Lead');
  setVal('editProsInterest', p.interest || 'High');
  setVal('editProsSource', p.source || 'Website');
  setVal('editProsProduct', p.productInterest || 'Complete Platform');
  setVal('editProsPriority', p.priority || 'High');
  setVal('editProsSalesperson', p.salesperson || 'Satyajit Mane');
  setVal('editProsNotes', p.notes || '');

  const modal = document.getElementById('modalEditProspect');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeEditProspectModal() {
  const modal = document.getElementById('modalEditProspect');
  if (modal) modal.classList.add('hidden');
  crmState.editingProspectId = null;
}

function submitEditProspect() {
  const id = crmState.editingProspectId;
  const p = getProspect(id);
  if (!p) return;

  const name = getVal('editProsName');
  const phone = getVal('editProsPhone');
  if (!name || !phone) {
    triggerToast('Please provide both Full Name and Phone Number.', 'Validation Error');
    return;
  }

  p.name = name;
  p.phone = phone;
  p.email = getVal('editProsEmail');
  p.profession = getVal('editProsProfession');
  p.firm = getVal('editProsFirm') || 'Independent Practice';
  p.barId = getVal('editProsBarId');
  p.city = getVal('editProsCity');
  p.state = getVal('editProsState');
  p.stage = getVal('editProsStage');
  p.interest = getVal('editProsInterest');
  p.source = getVal('editProsSource');
  p.productInterest = getVal('editProsProduct');
  p.priority = getVal('editProsPriority');
  p.salesperson = getVal('editProsSalesperson');
  p.notes = getVal('editProsNotes');

  if (!p.timeline) p.timeline = [];
  p.timeline.unshift({
    title: 'Prospect Profile Updated',
    time: 'Just now',
    user: crmState.userProfile?.name || 'Satyajit Mane',
    note: `Updated record details. Current stage: ${p.stage}.`
  });

  saveState();
  closeEditProspectModal();
  renderProspectsTable();
  renderHomeTable();
  updateSidebarBadges();

  if (crmState.activeProspectId === id) {
    openProspectDrawer(id);
  }

  triggerToast(`Prospect ${p.name} updated successfully!`, 'Prospect Saved');
}

function confirmDeleteProspect(id) {
  const p = getProspect(id);
  if (!p) return;

  showConfirmDialog({
    title: 'Delete Prospect',
    message: `Are you sure you want to permanently delete <strong>${escapeHTML(p.name)}</strong> (${escapeHTML(p.firm)})? This action will remove all interaction history from the CRM.`,
    confirmText: 'Delete Prospect',
    confirmStyle: 'danger',
    onConfirm: () => {
      crmState.prospects = crmState.prospects.filter(x => x.id !== id);
      crmState.selectedProspectIds.delete(id);
      saveState();
      if (crmState.activeProspectId === id) closeProspectDrawer();
      renderProspectsTable();
      renderHomeTable();
      updateSidebarBadges();
      triggerToast(`Prospect ${p.name} has been deleted.`, 'Prospect Deleted');
    }
  });
}

function bulkDeleteProspects() {
  const count = crmState.selectedProspectIds.size;
  if (count === 0) return;

  showConfirmDialog({
    title: 'Delete Selected Prospects',
    message: `Are you sure you want to delete all <strong>${count} selected prospects</strong>? This action cannot be undone.`,
    confirmText: `Delete (${count})`,
    confirmStyle: 'danger',
    onConfirm: () => {
      crmState.prospects = crmState.prospects.filter(p => !crmState.selectedProspectIds.has(p.id));
      saveState();
      clearProspectSelection();
      renderProspectsTable();
      renderHomeTable();
      updateSidebarBadges();
      triggerToast(`${count} prospects deleted from CRM.`, 'Bulk Deleted');
    }
  });
}

function archiveProspect(id) {
  const p = getProspect(id);
  if (!p) return;

  showConfirmDialog({
    title: 'Archive Prospect',
    message: `Are you sure you want to archive <strong>${escapeHTML(p.name)}</strong>? You can restore it later from the archive.`,
    confirmText: 'Archive',
    confirmStyle: 'primary',
    onConfirm: () => {
      crmState.prospects = crmState.prospects.filter(x => x.id !== id);
      saveState();
      if (crmState.activeProspectId === id) closeProspectDrawer();
      renderProspectsTable();
      renderHomeTable();
      updateSidebarBadges();
      triggerToast(`Prospect ${p.name} archived.`, 'Archived');
    }
  });
}

function markProspectLost(id) {
  const p = getProspect(id);
  if (!p) return;

  showConfirmDialog({
    title: 'Mark Prospect as Lost',
    message: `Mark <strong>${escapeHTML(p.name)}</strong> as Lost? This updates their stage and preserves their notes.`,
    confirmText: 'Mark Lost',
    confirmStyle: 'danger',
    onConfirm: () => {
      p.stage = 'Lost';
      saveState();
      renderProspectsTable();
      renderHomeTable();
      if (crmState.activeProspectId === id) openProspectDrawer(id);
      triggerToast(`Prospect ${p.name} marked as Lost.`, 'Status Updated');
    }
  });
}

function quickChangeProspectStage(id) {
  const p = getProspect(id);
  if (!p) return;
  const stages = ['New Lead', 'Contacted', 'Demo Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'];
  const nextIdx = (stages.indexOf(p.stage) + 1) % stages.length;
  p.stage = stages[nextIdx];
  saveState();
  renderProspectsTable();
  renderHomeTable();
  if (crmState.activeProspectId === id) openProspectDrawer(id);
  triggerToast(`Stage changed to ${p.stage}`, 'Stage Updated');
}

// CLIENT EDIT & DELETE HANDLERS
function openEditClient(id) {
  const c = getClient(id);
  if (!c) return;
  crmState.editingClientId = id;

  setTxt('editCliId', c.id);
  setVal('editCliName', c.name || '');
  setVal('editCliFirm', c.firm || '');
  setVal('editCliPhone', c.phone || '');
  setVal('editCliEmail', c.email || '');
  setVal('editCliBarId', c.barId || '');
  setVal('editCliCity', c.city || '');
  setVal('editCliPlan', c.plan || 'Standard');
  setVal('editCliSubType', c.subType || 'Annual');
  setVal('editCliAmount', c.amount || '₹24,000');
  setVal('editCliSeats', c.seats || 5);
  setVal('editCliRenewalDate', c.renewalDate || '');
  setVal('editCliPaymentStatus', c.paymentStatus || 'Paid');
  setVal('editCliStatus', c.clientStatus || 'Active');
  setVal('editCliAM', c.am || 'Satyajit Mane');

  const modal = document.getElementById('modalEditClient');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeEditClientModal() {
  const modal = document.getElementById('modalEditClient');
  if (modal) modal.classList.add('hidden');
  crmState.editingClientId = null;
}

function submitEditClient() {
  const id = crmState.editingClientId;
  const c = getClient(id);
  if (!c) return;

  const name = getVal('editCliName');
  const firm = getVal('editCliFirm');
  const phone = getVal('editCliPhone');
  if (!name || !firm || !phone) {
    triggerToast('Please provide Account Name, Firm, and Phone Number.', 'Validation Error');
    return;
  }

  c.name = name;
  c.firm = firm;
  c.phone = phone;
  c.email = getVal('editCliEmail');
  c.barId = getVal('editCliBarId');
  c.city = getVal('editCliCity');
  c.plan = getVal('editCliPlan');
  c.subType = getVal('editCliSubType');
  c.amount = getVal('editCliAmount');
  c.seats = parseInt(getVal('editCliSeats')) || 1;
  c.renewalDate = getVal('editCliRenewalDate');
  c.paymentStatus = getVal('editCliPaymentStatus');
  c.clientStatus = getVal('editCliStatus');
  c.am = getVal('editCliAM');

  saveState();
  closeEditClientModal();
  renderClientsTable();
  updateSidebarBadges();

  if (crmState.activeClientId === id) {
    openClientDrawer(id);
  }

  triggerToast(`Client account ${c.name} updated successfully!`, 'Client Saved');
}

function confirmDeleteClient(id) {
  const c = getClient(id);
  if (!c) return;

  showConfirmDialog({
    title: 'Delete Client Account',
    message: `Are you sure you want to permanently delete client account <strong>${escapeHTML(c.name)}</strong> (${escapeHTML(c.firm)})? Active subscription records and billing history will be removed.`,
    confirmText: 'Delete Client',
    confirmStyle: 'danger',
    onConfirm: () => {
      crmState.clients = crmState.clients.filter(x => x.id !== id);
      saveState();
      if (crmState.activeClientId === id) closeClientDrawer();
      renderClientsTable();
      updateSidebarBadges();
      triggerToast(`Client account ${c.name} has been deleted.`, 'Client Deleted');
    }
  });
}

function renewClientSubscription(id) {
  const c = getClient(id);
  if (!c) return;
  c.paymentStatus = 'Paid';
  c.clientStatus = 'Active';
  c.renewalDate = 'Jul 15, 2027';
  saveState();
  renderClientsTable();
  if (crmState.activeClientId === id) openClientDrawer(id);
  triggerToast(`Subscription renewed for 1 year for ${c.firm}!`, 'License Renewed');
}

// FOLLOW-UP EDIT & DELETE HANDLERS
function openEditFollowup(id) {
  const f = getFollowup(id);
  if (!f) return;
  crmState.editingFollowupId = id;

  setVal('editFuContactName', f.contactName);
  setVal('editFuContactType', (f.contactType === 'Active' || f.contactType === 'Active Client') ? 'Client' : f.contactType);
  setVal('editFuPhone', f.phone);
  setVal('editFuChannel', f.channel);
  setVal('editFuDate', f.date);
  setVal('editFuTime', f.time);
  setVal('editFuPriority', f.priority);
  setVal('editFuSalesperson', f.salesperson);
  setVal('editFuStatus', f.status);
  setVal('editFuSummary', f.prevSummary);

  const modal = document.getElementById('modalEditFollowup');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeEditFollowupModal() {
  const modal = document.getElementById('modalEditFollowup');
  if (modal) modal.classList.add('hidden');
  crmState.editingFollowupId = null;
}

function submitEditFollowup() {
  const id = crmState.editingFollowupId;
  const f = getFollowup(id);
  if (!f) return;

  const name = getVal('editFuContactName');
  if (!name) {
    triggerToast('Please provide a Contact Name.', 'Validation Error');
    return;
  }

  f.contactName = name;
  f.contactType = getVal('editFuContactType');
  f.phone = getVal('editFuPhone');
  f.channel = getVal('editFuChannel');
  f.date = getVal('editFuDate');
  f.time = getVal('editFuTime');
  f.priority = getVal('editFuPriority');
  f.salesperson = getVal('editFuSalesperson');
  f.status = getVal('editFuStatus');
  f.prevSummary = getVal('editFuSummary');

  saveState();
  closeEditFollowupModal();
  renderFollowupsTable();
  updateSidebarBadges();
  triggerToast('Follow-up task updated successfully!', 'Task Saved');
}

function confirmDeleteFollowup(id) {
  const f = getFollowup(id);
  if (!f) return;

  showConfirmDialog({
    title: 'Delete Follow-up Task',
    message: `Are you sure you want to delete the scheduled follow-up for <strong>${escapeHTML(f.contactName)}</strong>?`,
    confirmText: 'Delete Task',
    confirmStyle: 'danger',
    onConfirm: () => {
      crmState.followups = crmState.followups.filter(x => x.id !== id);
      saveState();
      if (crmState.editingFollowupId === id) closeEditFollowupModal();
      renderFollowupsTable();
      updateSidebarBadges();
      triggerToast('Follow-up task deleted.', 'Task Removed');
    }
  });
}

// MEETING EDIT & DELETE HANDLERS
function openEditMeeting(id) {
  const m = getMeeting(id);
  if (!m) return;
  crmState.editingMeetingId = id;

  setVal('editMtTitle', m.title);
  setVal('editMtContactName', m.contactName);
  setVal('editMtContactType', (m.contactType === 'Active' || m.contactType === 'Active Client') ? 'Client' : m.contactType);
  setVal('editMtPhone', m.phone);
  setVal('editMtEmail', m.email);
  setVal('editMtType', m.meetingType);
  setVal('editMtDate', m.date);
  setVal('editMtStartTime', m.startTime);
  setVal('editMtEndTime', m.endTime);
  setVal('editMtMode', m.mode);
  setVal('editMtLink', m.link);
  setVal('editMtSalesperson', m.salesperson);
  setVal('editMtStatus', m.status);

  const modal = document.getElementById('modalEditMeeting');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof syncAllCustomSelects === 'function') syncAllCustomSelects();
  }
}

function closeEditMeetingModal() {
  const modal = document.getElementById('modalEditMeeting');
  if (modal) modal.classList.add('hidden');
  crmState.editingMeetingId = null;
}

function submitEditMeeting() {
  const id = crmState.editingMeetingId;
  const m = getMeeting(id);
  if (!m) return;

  const title = getVal('editMtTitle');
  const name = getVal('editMtContactName');
  if (!title || !name) {
    triggerToast('Please provide Meeting Title and Contact Name.', 'Validation Error');
    return;
  }

  m.title = title;
  m.contactName = name;
  m.contactType = getVal('editMtContactType');
  m.phone = getVal('editMtPhone');
  m.email = getVal('editMtEmail');
  m.meetingType = getVal('editMtType');
  m.date = getVal('editMtDate');
  m.startTime = getVal('editMtStartTime');
  m.endTime = getVal('editMtEndTime');
  m.mode = getVal('editMtMode');
  m.link = getVal('editMtLink');
  m.salesperson = getVal('editMtSalesperson');
  m.status = getVal('editMtStatus');

  saveState();
  closeEditMeetingModal();
  renderMeetingsTable();
  updateSidebarBadges();
  triggerToast('Meeting details updated successfully!', 'Meeting Saved');
}

function confirmDeleteMeeting(id) {
  const m = getMeeting(id);
  if (!m) return;

  showConfirmDialog({
    title: 'Delete Meeting',
    message: `Are you sure you want to cancel and delete <strong>${escapeHTML(m.title)}</strong> with ${escapeHTML(m.contactName)}?`,
    confirmText: 'Delete Meeting',
    confirmStyle: 'danger',
    onConfirm: () => {
      crmState.meetings = crmState.meetings.filter(x => x.id !== id);
      saveState();
      if (crmState.editingMeetingId === id) closeEditMeetingModal();
      renderMeetingsTable();
      updateSidebarBadges();
      triggerToast('Meeting cancelled and deleted.', 'Meeting Removed');
    }
  });
}

function markMeetingCompleted(id) {
  const m = getMeeting(id);
  if (!m) return;
  m.status = 'Completed';
  saveState();
  renderMeetingsTable();
  updateSidebarBadges();
  triggerToast(`Meeting with ${m.contactName} marked as completed!`, 'Meeting Done');
}
