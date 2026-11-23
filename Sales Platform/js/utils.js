/**
 * Modulus CRM - Utility Helpers
 * Badges, Pill Renderers, SVG Sparklines, Initials, CSV Exporters, Sanitization, and Toast Notifications
 */

/**
 * Escapes HTML characters to prevent XSS injection
 * @param {string|number|null|undefined} str 
 * @returns {string}
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Standard debounce utility for high-frequency input events
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait = 150) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Safe DOM element value getter
 * @param {string} id 
 * @returns {string}
 */
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/**
 * Safe DOM element value setter
 * @param {string} id 
 * @param {any} val 
 */
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.value = (val !== null && val !== undefined) ? val : '';
    if (typeof syncCustomSelect === 'function') {
      syncCustomSelect(id);
    }
  }
}

/**
 * Safe DOM element text setter
 * @param {string} id 
 * @param {any} txt 
 */
function setTxt(id, txt) {
  const el = document.getElementById(id);
  if (el) el.innerText = txt;
}

/**
 * Returns clean upper-case initials for a contact name
 * @param {string} name 
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return 'LC';
  const clean = name.replace(/^Adv\.\s*/i, '');
  const parts = clean.split(' ').filter(Boolean);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
}

/**
 * Resolves Bar Council ID for a contact across Prospects and Clients
 * @param {string} name 
 * @returns {string}
 */
function getContactBarId(name) {
  if (!name || typeof crmState === 'undefined') return 'Unenrolled';
  const cleanName = name.replace(/^Adv\.\s*/i, '').trim();
  const p = crmState.prospects?.find(x => x.name.replace(/^Adv\.\s*/i, '').trim() === cleanName);
  if (p && p.barId) return p.barId;
  const c = crmState.clients?.find(x => x.name.replace(/^Adv\.\s*/i, '').trim() === cleanName);
  if (c && c.barId) return c.barId;
  return 'Unenrolled';
}

/**
 * DRY Avatar Renderer
 * @param {string} name 
 * @param {string} type 
 * @param {string} sizeClass 
 * @param {string} textClass 
 * @returns {string}
 */
function renderAvatar(name, type = 'Prospect', sizeClass = 'w-7 h-7', textClass = 'text-[10px]') {
  const isProspect = (type === 'Prospect');
  const theme = isProspect 
    ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]/80' 
    : 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  return `<div class="${sizeClass} rounded-full ${theme} border flex items-center justify-center font-bold ${textClass} shrink-0 select-none shadow-2xs">${getInitials(name)}</div>`;
}

/**
 * Standardized Stage Pill Renderer
 * @param {string} stage 
 * @returns {string}
 */
function renderStagePill(stage) {
  const map = {
    'New Lead': { cls: 'bg-slate-50 text-slate-700 border-slate-200/80', dot: 'bg-slate-400' },
    'Contacted': { cls: 'bg-blue-50 text-blue-700 border-blue-200/70', dot: 'bg-blue-500' },
    'Demo Scheduled': { cls: 'bg-lime-50 text-lime-800 border-lime-300/80', dot: 'bg-lime-500' },
    'Demo Completed': { cls: 'bg-sky-50 text-sky-700 border-sky-200/70', dot: 'bg-sky-500' },
    'Proposal Sent': { cls: 'bg-cyan-50 text-cyan-700 border-cyan-200/70', dot: 'bg-cyan-500' },
    'Negotiation': { cls: 'bg-amber-50 text-amber-800 border-amber-200/70', dot: 'bg-amber-500' },
    'Converted': { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/70', dot: 'bg-emerald-500' },
    'Lost': { cls: 'bg-rose-50 text-rose-700 border-rose-200/70', dot: 'bg-rose-500' }
  };
  const meta = map[stage] || { cls: 'bg-slate-50 text-slate-700 border-slate-200/80', dot: 'bg-slate-400' };
  return `<span class="inline-flex items-center whitespace-nowrap text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${meta.cls} shadow-2xs"><span class="w-1.5 h-1.5 rounded-full ${meta.dot} mr-1.5 shrink-0"></span>${escapeHTML(stage)}</span>`;
}

/**
 * Standardized Interest Level Pill Renderer
 * @param {string} level 
 * @returns {string}
 */
function renderInterestPill(level) {
  if (level === 'High') {
    return '<span class="inline-flex items-center whitespace-nowrap text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0"></span>High Interest</span>';
  } else if (level === 'Medium') {
    return '<span class="inline-flex items-center whitespace-nowrap text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0"></span>Medium</span>';
  } else {
    return '<span class="inline-flex items-center whitespace-nowrap text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5 shrink-0"></span>Low</span>';
  }
}

/**
 * Standardized Payment Status Badge Renderer
 * @param {string} status 
 * @returns {string}
 */
function renderPaymentStatusBadge(status) {
  if (status === 'Paid') {
    return `
      <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
        <svg class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>Paid</span>
      </span>
    `;
  } else {
    return `
      <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs">
        <svg class="w-3 h-3 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>${escapeHTML(status)}</span>
      </span>
    `;
  }
}

/**
 * Standardized Follow-up Status Badge Renderer
 * @param {string} status 
 * @returns {string}
 */
function renderFollowupStatusBadge(status) {
  if (status === 'Overdue') {
    return '<span class="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 rounded-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 shrink-0"></span>Overdue</span>';
  } else if (status === 'Today') {
    return '<span class="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0"></span>Today</span>';
  } else if (status === 'Completed' || status === 'Done' || status === 'Logged') {
    return '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-full shadow-2xs"><svg class="w-3 h-3 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>Done</span>';
  } else {
    return '<span class="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 shrink-0"></span>Upcoming</span>';
  }
}

/**
 * Synchronizes Follow-up tab counts
 */
function updateFollowupTabCounts() {
  if (!crmState || !crmState.followups) return;
  const allCount = crmState.followups.length;
  const todayCount = crmState.followups.filter(f => f.status === 'Today').length;
  const upcomingCount = crmState.followups.filter(f => f.status === 'Upcoming').length;
  const overdueCount = crmState.followups.filter(f => f.status === 'Overdue').length;
  const compCount = crmState.followups.filter(f => f.status === 'Completed').length;
  const cancCount = crmState.followups.filter(f => f.status === 'Cancelled').length;

  setTxt('fuCnt-all', allCount);
  setTxt('fuCnt-today', todayCount);
  setTxt('fuCnt-upcoming', upcomingCount);
  setTxt('fuCnt-overdue', overdueCount);
  setTxt('fuCnt-completed', compCount);
  setTxt('fuCnt-cancelled', cancCount);
}

/**
 * Synchronizes Meeting tab counts
 */
function updateMeetingTabCounts() {
  if (!crmState || !crmState.meetings) return;
  const allCount = crmState.meetings.length;
  const upcomingCount = crmState.meetings.filter(m => m.status === 'Upcoming').length;
  const todayCount = crmState.meetings.filter(m => m.status === 'Today').length;
  const compCount = crmState.meetings.filter(m => m.status === 'Completed').length;
  const cancCount = crmState.meetings.filter(m => m.status === 'Cancelled').length;

  setTxt('mtCnt-all', allCount);
  setTxt('mtCnt-upcoming', upcomingCount);
  setTxt('mtCnt-today', todayCount);
  setTxt('mtCnt-completed', compCount);
  setTxt('mtCnt-cancelled', cancCount);
}

/**
 * Returns channel SVG icon
 * @param {string} channel 
 * @returns {string}
 */
function getChannelIcon(channel) {
  if (channel === 'Call') {
    return '<svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>';
  } else if (channel === 'WhatsApp') {
    return '<svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
  } else {
    return '<svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>';
  }
}

/**
 * Generates dynamic SVG matrix/dotted sparkline
 * @param {number} metricValue 
 * @param {number[]} basePattern 
 * @param {string} color 
 * @param {number} deltaBoost 
 * @returns {string}
 */
function generateDottedChartSVG(metricValue, basePattern, color, deltaBoost) {
  const cols = 12;
  let circles = '';
  for (let c = 0; c < cols; c++) {
    const cx = (4.0 + c * 6.5).toFixed(1);
    const baseH = basePattern[c] || 2;
    let dynAdd = 0;
    if (deltaBoost > 0) {
      if (c >= 8) {
        dynAdd = Math.min(3, Math.floor((deltaBoost + (c % 2)) / 2));
      } else if (c >= 4) {
        dynAdd = Math.min(2, Math.floor((deltaBoost + (c % 3)) / 3));
      } else {
        dynAdd = Math.min(1, Math.floor(deltaBoost / 4));
      }
    }
    const valMod = ((metricValue + c * 3) % 7 === 0) ? 1 : 0;
    let height = Math.min(6, Math.max(1, baseH + dynAdd + valMod));

    if (c === 10) height = Math.min(6, Math.max(height, 5));
    if (c === 11) height = Math.min(6, Math.max(height, 4));

    for (let r = 0; r < height; r++) {
      const cy = (33.0 - r * 6.0).toFixed(1);
      circles += `<circle cx="${cx}" cy="${cy}" r="1.85" fill="${color}"/>`;
    }
  }
  return `<svg width="78" height="36" viewBox="0 0 78 36" fill="none" class="shrink-0 select-none">${circles}</svg>`;
}

/**
 * Generic CSV Exporter
 * @param {string} filename 
 * @param {string[]} headers 
 * @param {Array<Array<string|number>>} rows 
 */
function exportToCSV(filename, headers, rows) {
  let csv = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(val => `"${String(val !== undefined && val !== null ? val : '').replace(/"/g, '""')}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Dispatches animated toast notifications
 * @param {string} body 
 * @param {string} title 
 */
function triggerToast(body, title = 'Notice') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'motion-toast-enter p-3 rounded-xl shadow-lg bg-white border border-[#E5E7EB] flex items-center gap-2.5 max-w-sm pointer-events-auto text-xs';
  toast.innerHTML = `
    <span class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
    </span>
    <div>
      <strong class="font-bold text-[#111827] block">${escapeHTML(title)}</strong>
      <span class="text-gray-500">${escapeHTML(body)}</span>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('motion-toast-enter');
    toast.classList.add('motion-toast-exit');
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

/**
 * Standardized Empty State Row Renderer for Tables
 * @param {number} colSpan 
 * @param {string} message 
 * @param {string} [subtext] 
 * @param {string} [resetFn] 
 * @returns {string}
 */
function renderTableEmptyState(colSpan, message, subtext, resetFn) {
  return `
    <tr>
      <td colspan="${colSpan}" class="py-12 px-4 text-center">
        <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div class="w-10 h-10 rounded-full bg-gray-100/90 flex items-center justify-center text-gray-400 mb-2.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <p class="text-xs font-semibold text-gray-900">${escapeHTML(message)}</p>
          <p class="text-[11px] text-gray-500 mt-0.5 leading-normal">${escapeHTML(subtext || 'Try adjusting your search query or filter criteria.')}</p>
          ${resetFn ? `<button onclick="${resetFn}" class="mt-3 px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 text-xs font-medium text-gray-700 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer">Reset Filters</button>` : ''}
        </div>
      </td>
    </tr>
  `;
}
