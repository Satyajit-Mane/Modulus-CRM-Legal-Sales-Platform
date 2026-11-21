/**
 * Modulus CRM - State Management
 * Persistent reactive store backed by localStorage with fallback to default datasets
 */

const STORAGE_KEY = 'MODULUS_CRM_STATE_V1';

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.prospects) && Array.isArray(parsed.clients)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load CRM state from localStorage:', e);
  }
  return null;
}

const savedData = loadPersistedState();

const crmState = {
  activeScreen: 'dashboard',
  searchQuery: '',
  activeFollowupTab: 'all',
  activeMeetingTab: 'all',
  meetingsViewMode: 'list',
  calendarDate: new Date(2026, 6, 14),
  calendarSubView: 'week',
  selectedProspectIds: new Set(),
  activeProspectId: null,
  activeClientId: null,
  completingFollowupId: null,
  editingProspectId: null,
  editingClientId: null,
  editingFollowupId: null,
  editingMeetingId: null,

  userProfile: savedData?.userProfile || JSON.parse(JSON.stringify(initialUserProfile)),
  prospects: savedData?.prospects || JSON.parse(JSON.stringify(initialProspects)),
  clients: savedData?.clients || JSON.parse(JSON.stringify(initialClients)),
  followups: savedData?.followups || JSON.parse(JSON.stringify(initialFollowups)),
  meetings: savedData?.meetings || JSON.parse(JSON.stringify(initialMeetings))
};

/**
 * Accessor Helpers
 */
function getProspect(id) {
  return crmState.prospects.find(p => p.id === id);
}

function getClient(id) {
  return crmState.clients.find(c => c.id === id);
}

function getFollowup(id) {
  return crmState.followups.find(f => f.id === id);
}

function getMeeting(id) {
  return crmState.meetings.find(m => m.id === id);
}

/**
 * Persists current state to localStorage
 */
function saveState() {
  try {
    const dataToSave = {
      userProfile: crmState.userProfile,
      prospects: crmState.prospects,
      clients: crmState.clients,
      followups: crmState.followups,
      meetings: crmState.meetings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('Could not save CRM state to localStorage:', e);
  }
}

/**
 * Resets application data to initial seeds
 */
function resetStateToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  crmState.userProfile = JSON.parse(JSON.stringify(initialUserProfile));
  crmState.prospects = JSON.parse(JSON.stringify(initialProspects));
  crmState.clients = JSON.parse(JSON.stringify(initialClients));
  crmState.followups = JSON.parse(JSON.stringify(initialFollowups));
  crmState.meetings = JSON.parse(JSON.stringify(initialMeetings));
  saveState();
  if (typeof initApp === 'function') initApp();
  if (typeof triggerToast === 'function') triggerToast('Reset to default CRM data', 'System');
}
