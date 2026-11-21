# Legal Sales CRM: Master Prototype & Interaction Specification

## 1. Executive Summary & Prototyping Objective

This specification documents the architecture and interaction model of the **Legal Sales CRM (`LexisCRM`) Master Desktop Prototype**. 

Rather than presenting isolated dashboard mockups, the prototype operates as a unified, reactive B2B SaaS application. It binds all 10 primary navigation pillars, connects all 6 core sales user journeys, and implements comprehensive micro-interaction states (Default, Hover, Active, Loading, Empty, Validation/Error, Success) across every workflow.

---

## 2. Primary Navigation Architecture

The desktop application features a persistent **240px Left Sidebar** and a **56px Top Header** with synchronous breadcrumbs and instant state updates:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [🔴 🟡 🟢]  ⚖️ LexisCRM (Delhi High Court & NCR)     [🔍 Global Omnisearch ⌘K]  [SJ] │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ OVERVIEW     │ Breadcrumb: Prospects / Adv. Rajesh Sharma (P-101)  ·  [Live CRM Sync]  │
│ 📊 Dashboard ├─────────────────────────────────────────────────────────────────────────┤
│              │                                                                         │
│ PIPELINE     │                                                                         │
│ 👥 Prospects │                   ACTIVE VIEWPORT (MAIN STAGE)                          │
│ 🏢 Clients ▾ │                                                                         │
│  · Active    │      - Dynamic Module Views (Dashboard, Tables, 360° Profiles)          │
│  · At-Risk   │      - Contextual Slide-over Peek Drawer (600px)                        │
│  · Inactive  │      - Modals & Multi-Step Wizards                                      │
│              │      - Floating Bottom Bulk Action Toolbar                              │
│ OPERATIONS   │                                                                         │
│ ⏰ Follow-ups│                                                                         │
│ 💳 Plans     │                                                                         │
│              │                                                                         │
│ ADMIN        │                                                                         │
│ 📈 Reports   │                                                                         │
│ 👔 Team      │                                                                         │
│ ⚙️ Settings   │                                                                         │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Complete Navigation Map

| Nav Identifier | View Label | Route State | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| `nav-dashboard` | **Dashboard** | `dashboard` | Executive KPI cards, 8-stage pipeline funnel, Today's SLA follow-ups table, rep daily snapshots. |
| `nav-prospects` | **Prospects** | `prospects` | 44px high-density data table, duplicate contact detection, slide-over peek drawer, floating bulk bar. |
| `nav-clients-active` | **Active Clients** | `clients-active` | Live paying client roster, plan tiers, license seats, GST invoice downloads, account health score. |
| `nav-clients-at-risk` | **At-Risk Clients** | `clients-at-risk` | Churn early warning console (usage drop > 60%, failed auto-debits, expiry < 14 days). |
| `nav-clients-inactive` | **Inactive Clients** | `clients-inactive` | Win-back retention archive, 7 legal churn root causes, 1-click client reactivation flow. |
| `nav-followups` | **Follow-ups** | `followups` | Central task management, SLA breach alerts, List/Calendar/Kanban views, Compound Resolution Loop. |
| `nav-plans` | **Plans & Subscriptions** | `plans` | Starter Solo (₹8k), Chamber Pro (₹24k), Enterprise Suite (₹72k) catalog cards and seat ledgers. |
| `nav-reports` | **Reports & Analytics** | `reports` | 4 analytical dashboards (Sales Velocity, Lead Ingestion, Team Leaderboard, Subscription ARR). |
| `nav-team` | **Team Management** | `team` | Sales rep directory, role assignment, monthly quota attainment %, deactivation lead safeguards. |
| `nav-settings` | **Settings** | `settings` | 8 configuration panels (RBAC permissions, Bar Council regex rules, SLA escalation, notification digests). |

---

## 3. Connected User Journeys (End-to-End)

The prototype connects all 6 required user journeys into complete, stateful feedback loops. The top-right **Run Journey** menu provides single-click automated triggers for rapid stakeholder walkthroughs.

### Journey 1: Add Prospect
```
Dashboard / Prospects ➔ "+ Add Prospect" ➔ Enter Advocate Credentials ➔ Live Duplicate Check ➔ "Save Prospect" ➔ Prospect 360° Profile
```
1. **Trigger**: Rep clicks `+ Add Prospect` from the Dashboard or Prospects toolbar.
2. **Input Fields**:
   - Advocate Full Name, Bar Council Enrollment ID (e.g., `D/1982/2012`), Direct Phone, Email, Profession, Firm/Chamber Name, City, Practice Court Jurisdiction.
   - Lead Acquisition Source, Priority Level (Low, Medium, High, Urgent), Assigned Sales Rep, Initial Discovery Notes, Follow-up SLA Date/Time.
3. **Live Validation & Duplicate Detection**:
   - Entering an existing phone or Bar Council ID triggers an inline amber alert banner: *"Duplicate Contact Detected: An advocate with this phone or enrollment ID already exists in the CRM roster."*
4. **State Mutation**:
   - Pushes the new prospect into `crmState.prospects`.
   - Increments the sidebar counter badge.
   - Generates an initial "Lead Created" timeline event.
   - Automatically navigates to the newly created **Prospect 360° Profile** with a green success toast.

---

### Journey 2: Manage Prospect
```
Prospects Table ➔ Click Row (Peek Drawer) / "View Profile" ➔ Log Activity (9 Fields) ➔ Add Internal Comment ➔ Update Stage Dropdown ➔ Schedule Follow-up
```
1. **Inspection**:
   - Clicking any advocate row opens the **600px Slide-over Peek Drawer**, displaying Bar Council credentials, direct contact chips (`tel:` and `mailto:`), recent activities, and quick actions without navigating away from the table.
   - Clicking `Full Profile ↗` transitions into the dedicated **Prospect 360° Profile**.
2. **Log Activity**:
   - Rep clicks `📞 Log Activity` to launch the 9-field modal (Activity Type, Date/Time, Outcome, Interest Level, Discussion Notes, Stage Update, Next Date).
   - Submitting prepends the activity directly to the chronological timeline and updates the prospect's `lastContact` timestamp.
3. **Add Internal Comment**:
   - Rep enters notes into the private internal comment composer (*"Advocate requested formal pricing for 5 Chamber seats..."*).
   - Clicking `Post Internal Note` creates a highlighted amber note visible strictly to internal CRM team members.
4. **Update Stage**:
   - Selecting a new stage (e.g., *Negotiation*) from the header dropdown immediately mutates the record, logs an audit milestone, and updates the funnel.
5. **Schedule Follow-up**:
   - Rep clicks `⏰ Schedule Follow-up` to book an upcoming task with priority and agenda notes.

---

### Journey 3: Convert Prospect to Client (Guided 6-Step Wizard)
```
Prospect 360° / Peek Drawer ➔ "Convert to Client ↗" ➔ 6-Step Wizard ➔ State Mutation to CLIENT_ACTIVE ➔ Zero-Data-Loss History Preservation ➔ Client 360° Profile
```
1. **Step 1 (Review)**: Reviews advocate name, Bar Council verification badge (`D/1982/2012`), and firm hierarchy.
2. **Step 2 (Confirm Contacts)**: Confirms official billing phone, accounts email, and optional GSTIN (`07AAAAA0000A1Z5`).
3. **Step 3 (Select Plan)**: Selects between *Starter Solo* (₹8k), *Professional Chamber Pro* (₹24k), or *Enterprise Suite* (₹72k).
4. **Step 4 (Configure Terms)**:
   - Sets billing cadence (*Annual Prepaid 10% Off* vs *Monthly*), adjusts licensed seat count with live price calculation, and sets payment status (`PAID` vs `PENDING`).
5. **Step 5 (Assign Account Manager)**: Selects dedicated AM (Sarah Jenkins, David Kumar, Priya Nair).
6. **Step 6 (Confirmation & Celebration)**: Displays celebration confetti icon and conversion summary.
7. **System Execution**:
   - Removes record from active prospect list and appends to `crmState.clients` with status `ACTIVE`.
   - **Zero-Data-Loss Guarantee**: Preserves 100% of pre-conversion demo recordings, calls, and internal notes.
   - Stamps conversion date and generates first invoice (`INV-2026-001`).
   - Automatically navigates to the **Client 360° Profile** with celebratory toast.

---

### Journey 4: Manage Active Client
```
Active Clients ➔ Select Client ➔ Client 360° Profile ➔ Subscription Tab ➔ Change / Upgrade Plan ➔ Record Payment ➔ Schedule Check-in
```
1. **Access**: Rep opens `Active Clients` and selects a firm (e.g., *Justice Chambers & Co.*).
2. **Subscription Audit**: Views active tier, allocated seats, contract ARR, renewal countdown, and health score (`96/100`).
3. **Change / Upgrade Plan**: Rep adjusts seat count or triggers an upgrade to Enterprise with pro-rated billing calculation.
4. **Record Payment**: Opens payment dialog to record offline bank NEFT/RTGS transaction reference numbers, updating invoice ledger to `PAID`.
5. **Customer Success Check-in**: Rep clicks `+ Add Check-in` to schedule periodic satisfaction reviews.

---

### Journey 5: Manage Inactive Client & Churn Win-Back
```
Inactive Clients Archive ➔ Select Firm ➔ Review Churn Root Cause ➔ Add Retention Note ➔ "Reactivate Client ⚡" ➔ Offer Win-Back Incentive ➔ Mutate to Active
```
1. **Audit Churn Context**: Rep navigates to `Inactive Clients` and reviews churned firms (e.g., *K&S Advocates*, Churn Reason: *Court Recess Budget Cuts*).
2. **Retention Intervention**: Rep adds an internal comment regarding partner willingness to re-subscribe once the court term resumes.
3. **Reactivation Wizard**:
   - Rep clicks `Reactivate Client ⚡` to launch the win-back modal.
   - Selects retention incentive (*15% Court Recess Discount*, *Waived Reconnection Fee*, *Free +2 Associate Seats*).
4. **Execution**:
   - Mutates client status back to `ACTIVE`, updates renewal date by +1 year, increments active client KPI counter, removes account from inactive archive, and transitions to the active roster with a green success toast.

---

### Journey 6: Complete Follow-up (Compound Resolution Loop)
```
Follow-up Central ➔ Select Task ➔ "Complete Task ✓" ➔ Compound Resolution Modal ➔ Record Outcome Notes ➔ Auto-Schedule Next Follow-up ➔ Audit Timeline
```
1. **Task Selection**: Rep navigates to `Follow-ups` and reviews tasks due today.
2. **Compound Resolution Modal**:
   - **Non-Destructive Guarantee**: Completing a task **never deletes the record**.
   - Prompts rep: *"What happened during this follow-up?"* and *"Resolution Outcome"*.
   - Prompts: *"Is another follow-up required?"* (defaults to checked).
   - If checked, opens next follow-up date/time picker and activity type selector.
3. **Execution**:
   - Mutates current task status to `COMPLETED`.
   - Appends a resolution event to the contact's timeline.
   - Automatically provisions the next follow-up task in the schedule with linked reference notes.

---

## 4. Micro-Interaction States Specification

Every component adheres to the established design system tokens:

| State | Visual Treatment & Styling Rules |
| :--- | :--- |
| **Default** | Canvas: `#FFFFFF`, Background: `#F7F8FA`, Borders: `1px solid #E5E7EB`, Text: `#202938` (Inter 13-14px). |
| **Hover** | Buttons: background shifts to `#1D4ED8` (Primary) or `#F7F8FA` (Secondary); Table Rows: subtle `#F7F8FA` tint; Action Icons: color transitions to `#2563EB`. |
| **Active / Selected** | Selected table rows gain soft amber highlight (`#FFFBEB`) with a left vertical amber border (`border-l-4 border-l-[#F59E0B]`), triggering the floating bulk action bar. |
| **Loading State** | Simulated skeleton pulse overlay (`#loadingOverlay`) with centered spinner and backdrop blur, simulating live legal database synchronization. |
| **Empty State** | Illustrated graphic container with search icon, clear messaging (*"No prospects found matching your criteria"*), and primary `Clear Filters` button. |
| **Validation / Error State** | Inputs highlight with `border-[#DC5252]` and red helper text; duplicate checks display an amber warning alert (`#FFFBEB` with `#FDE68A` border). |
| **Success State** | Dynamic floating toast notification (bottom-right) with `#16A36A` green check badge, slide-in animation, and 3.5s auto-dismiss timer. |

---

## 5. Prototype Verification & Quality Assurance Checklist

| QA Requirement | Status | Verification Evidence |
| :--- | :---: | :--- |
| **1. Primary Navigation** | **PASSED** | All 10 sidebar links navigate correctly without page reloads, updating active pills, breadcrumbs, and views. |
| **2. Prospect Conversion** | **PASSED** | 6-step guided wizard mutates prospect into active paying client, transfers history, and generates billing ledger. |
| **3. Activity Audit History** | **PASSED** | Logging calls, demos, emails, or internal notes prepends directly to the audit stream with zero data loss. |
| **4. Follow-up Resolution** | **PASSED** | Tasks are never deleted; compound resolution records outcomes and schedules linked subsequent tasks. |
| **5. Subscription Status** | **PASSED** | Active client profiles display plan tier, seat count, renewal countdowns, and downloadable GST invoice history. |
| **6. Client Reactivation** | **PASSED** | Inactive accounts can be reactivated with custom win-back discounts and transferred back to active client rosters. |
| **7. Component Consistency** | **PASSED** | 100% adherence to Inter font hierarchy, 44px table rows, 600px peek drawer, and approved hex palette. |
| **8. Disconnection Check** | **PASSED** | All screens, modals, and actions are interconnected into a single reactive application. |

---

## 6. Accessing the Deliverables

- **Live Interactive Master Prototype**: [index.html](file:///Users/satyajit/Documents/Development/Sales%20Platform/index.html) *(located directly in your workspace)*
- **Figma Prototype Specification**: [legal_crm_prototype_specification.md](file:///Users/satyajit/Documents/Development/Sales%20Platform/legal_crm_prototype_specification.md)
- **Design System Component Showcase**: [legal_crm_design_system_showcase.html](file:///Users/satyajit/Documents/Development/Sales%20Platform/legal_crm_design_system_showcase.html)