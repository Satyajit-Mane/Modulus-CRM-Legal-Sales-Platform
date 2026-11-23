/**
 * Modulus CRM - Universal Custom Select Engine
 * Replaces native OS dropdown popups with custom floating menus matching the "Last 7 days" design.
 */

let activeCustomSelectId = null;

function safeEscapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initCustomSelects() {
  const selects = document.querySelectorAll('select:not([data-no-custom])');
  selects.forEach(sel => enhanceSelectElement(sel));
}

function enhanceSelectElement(select) {
  if (!select || select.dataset.customEnhanced === 'true') return;
  select.dataset.customEnhanced = 'true';

  const selectId = select.id;
  if (!selectId) return;

  const parent = select.parentElement;
  if (!parent) return;

  // Hide native select from display
  select.style.display = 'none';

  // Remove existing static chevron if present
  const fakeChevron = parent.querySelector('.pointer-events-none');
  if (fakeChevron) fakeChevron.remove();

  // Reset parent wrapper styling completely so the button handles border and background cleanly
  parent.className = 'custom-select-wrapper relative w-full';

  // Determine initial selected text
  const selectedOpt = select.options[select.selectedIndex] || select.options[0];
  const initialText = selectedOpt ? selectedOpt.text : 'Select...';

  // Create custom button trigger matching "Last 7 days" styling
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = `cst-btn-${selectId}`;
  btn.className = 'custom-select-btn h-9 w-full px-3.5 bg-white border border-[#E5E7EB] hover:border-gray-300 text-gray-800 text-xs font-medium rounded-xl inline-flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs select-none';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', select.getAttribute('aria-label') || initialText);
  btn.innerHTML = `
    <span id="cst-lbl-${selectId}" class="custom-select-label truncate text-left flex-1">${safeEscapeHTML(initialText)}</span>
    <span id="cst-chv-${selectId}" class="custom-select-chevron w-5 h-5 rounded-full bg-gray-100/90 flex items-center justify-center shrink-0 text-gray-600 transition-transform duration-200 shadow-2xs">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
      </svg>
    </span>
  `;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCustomSelectMenu(selectId);
  });

  parent.appendChild(btn);

  // Observe option changes (e.g. innerHTML changes when populating dynamically)
  const observer = new MutationObserver(() => {
    syncCustomSelect(selectId);
  });
  observer.observe(select, { childList: true, subtree: true });
}

function toggleCustomSelectMenu(selectId) {
  if (activeCustomSelectId === selectId) {
    closeCustomSelectMenu();
    return;
  }
  openCustomSelectMenu(selectId);
}

function openCustomSelectMenu(selectId) {
  closeCustomSelectMenu(); // Close any currently open menu

  const select = document.getElementById(selectId);
  const btn = document.getElementById(`cst-btn-${selectId}`);
  const chevron = document.getElementById(`cst-chv-${selectId}`);
  if (!select || !btn) return;

  activeCustomSelectId = selectId;
  btn.setAttribute('aria-expanded', 'true');
  if (chevron) chevron.classList.add('rotate-180');

  let portal = document.getElementById('customSelectPortal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'customSelectPortal';
    portal.className = 'fixed z-[10001]';
    document.body.appendChild(portal);
  }

  const rect = btn.getBoundingClientRect();
  const options = Array.from(select.options);
  const selectedVal = select.value;

  // Calculate menu positioning (flip upward if close to viewport bottom)
  const spaceBelow = window.innerHeight - rect.bottom - 12;
  const spaceAbove = rect.top - 12;
  let top = rect.bottom + 4;
  let maxH = 240;

  if (spaceBelow < 180 && spaceAbove > spaceBelow) {
    // Open upward
    maxH = Math.min(spaceAbove, 260);
    top = Math.max(8, rect.top - maxH - 4);
  } else {
    // Open downward
    maxH = Math.min(spaceBelow, 260);
    top = rect.bottom + 4;
  }

  portal.style.top = `${top}px`;
  portal.style.left = `${rect.left}px`;
  portal.style.width = `${rect.width}px`;
  portal.classList.remove('hidden');

  const menu = document.createElement('div');
  menu.className = 'custom-select-menu w-full bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-1.5 custom-dropdown-scroll animate-fadeIn';
  menu.style.maxHeight = `${maxH}px`;
  menu.setAttribute('role', 'listbox');
  menu.onclick = (e) => e.stopPropagation();

  options.forEach((opt, idx) => {
    const isSelected = opt.value === selectedVal;
    const item = document.createElement('div');
    item.className = `px-3.5 py-2 text-xs text-gray-700 hover:bg-[#F0F9FF]/70 hover:text-[#0284C7] cursor-pointer font-medium transition-colors select-none ${
      isSelected ? 'bg-[#F0F9FF] text-[#0284C7] font-semibold' : ''
    }`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    item.textContent = opt.text;
    item.title = opt.text;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCustomOptionByIndex(selectId, idx);
    });
    menu.appendChild(item);
  });

  portal.innerHTML = '';
  portal.appendChild(menu);

  // Auto-scroll to selected option if not visible
  const selectedElem = menu.querySelector('.bg-\\[\\#F0F9FF\\]');
  if (selectedElem) {
    requestAnimationFrame(() => {
      selectedElem.scrollIntoView({ block: 'nearest' });
    });
  }
}

function selectCustomOptionByIndex(selectId, optIndex) {
  const select = document.getElementById(selectId);
  if (!select || !select.options[optIndex]) return;

  select.selectedIndex = optIndex;

  // Update label
  syncCustomSelect(selectId);

  // Dispatch change event
  const changeEvent = new Event('change', { bubbles: true });
  select.dispatchEvent(changeEvent);

  // If inline onchange exists
  if (typeof select.onchange === 'function') {
    select.onchange(changeEvent);
  }

  closeCustomSelectMenu();
}

function selectCustomOption(selectId, optValue) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.value = optValue;

  // Update label
  syncCustomSelect(selectId);

  // Dispatch change event
  const changeEvent = new Event('change', { bubbles: true });
  select.dispatchEvent(changeEvent);

  // If inline onchange exists
  if (typeof select.onchange === 'function') {
    select.onchange(changeEvent);
  }

  closeCustomSelectMenu();
}

function syncCustomSelect(selectId) {
  const select = document.getElementById(selectId);
  const label = document.getElementById(`cst-lbl-${selectId}`);
  if (!select || !label) return;

  const selectedOpt = select.options[select.selectedIndex];
  if (selectedOpt) {
    label.innerText = selectedOpt.text;
  } else if (select.options.length > 0) {
    label.innerText = select.options[0].text;
  } else {
    label.innerText = 'Select...';
  }
}

function syncAllCustomSelects() {
  document.querySelectorAll('select[data-custom-enhanced="true"]').forEach(sel => {
    syncCustomSelect(sel.id);
  });
}

function closeCustomSelectMenu() {
  if (!activeCustomSelectId) return;

  const btn = document.getElementById(`cst-btn-${activeCustomSelectId}`);
  if (btn) btn.setAttribute('aria-expanded', 'false');

  const chevron = document.getElementById(`cst-chv-${activeCustomSelectId}`);
  if (chevron) chevron.classList.remove('rotate-180');

  const portal = document.getElementById('customSelectPortal');
  if (portal) {
    portal.innerHTML = '';
    portal.classList.add('hidden');
  }

  activeCustomSelectId = null;
}

// Global window event listeners
window.addEventListener('click', function(e) {
  if (activeCustomSelectId) {
    const btn = document.getElementById(`cst-btn-${activeCustomSelectId}`);
    const portal = document.getElementById('customSelectPortal');
    if ((btn && !btn.contains(e.target)) && (portal && !portal.contains(e.target))) {
      closeCustomSelectMenu();
    }
  }
});

window.addEventListener('keydown', function(e) {
  if (!activeCustomSelectId) return;

  if (e.key === 'Escape') {
    closeCustomSelectMenu();
    return;
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const select = document.getElementById(activeCustomSelectId);
    if (!select || select.options.length === 0) return;
    let nextIdx = select.selectedIndex + (e.key === 'ArrowDown' ? 1 : -1);
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= select.options.length) nextIdx = select.options.length - 1;
    selectCustomOptionByIndex(activeCustomSelectId, nextIdx);
    openCustomSelectMenu(activeCustomSelectId);
  } else if (e.key === 'Enter') {
    closeCustomSelectMenu();
  }
});

// Close custom select menu when window or modal background scrolls,
// BUT NEVER close when scrolling the options inside the dropdown menu itself
window.addEventListener('scroll', function(e) {
  if (!activeCustomSelectId) return;
  const portal = document.getElementById('customSelectPortal');
  if (portal && (portal === e.target || portal.contains(e.target))) {
    // Scrolling inside the custom dropdown options list
    return;
  }
  closeCustomSelectMenu();
}, true);

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}
