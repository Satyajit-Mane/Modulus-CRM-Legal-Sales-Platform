# Legal Sales CRM: Prospect Management Module Specification

## 1. Executive Module Overview

The **Prospect Management Module** (`/prospects`) is the pipeline engine of the Legal Sales CRM. It governs the intake, qualification, interaction history, stage progression, and conversion readiness of prospective legal clients—spanning solo advocates, chamber counsels, boutique law partnerships, and corporate legal departments.

### Key Architectural Principles
1. **High Information Density**: The table view accommodates 13 core legal and sales attributes without visual clutter, utilizing sticky headers, micro-labels, and muted secondary text.
2. **Context Preservation (Peek Drawer vs. Full 360°)**:
   - A single click on the quick-view icon or row action opens a **600px Right-Side Peek Drawer** for immediate inspection, 1-click VoIP dialing, and rapid note-taking.
   - Clicking the prospect name or choosing `"View Details"` opens the **Full Prospect 360° Profile Screen** for comprehensive case history and stage progression.
3. **Data Integrity & Duplicate Detection**: Ingestion workflows validate email, phone, and Bar Council Registration Numbers against existing records to avoid territory collision.
4. **Standardized Legal Taxonomy**: Native fields for Indian Bar Council Enrollment IDs (e.g. `D/1982/2012`), Court Jurisdictions, and Legal Designations.

---

## 2. Screen 1: Prospects Listing (Data Table & Filter Deck)

### 2.1 Route & Anatomy
- **Route**: `/prospects/list`
- **Primary CTA**: `+ Add Prospect` (Primary Blue Button `#2563EB`)
- **Secondary Actions**: `Export CSV/Excel`, `Save View`, `Clear All Filters`

### 2.2 Table Columns & Data Mapping
| # | Column Name | Field Type / Content | Visual Styling & Formatting |
| :--- | :--- | :--- | :--- |
| 1 | **Select** | Checkbox | Master checkbox in header; row checkbox with indeterminate state. |
| 2 | **Prospect Name** | String + Avatar | Bold primary text (`#202938`), Initials circle, Bar Council ID sub-label. |
| 3 | **Phone Number** | Tel URI | Font-mono, clickable link with phone icon (`#2563EB`). |
| 4 | **Email Address** | Mailto URI | Secondary text (`#667085`), clickable. |
| 5 | **Profession** | Categorized Tag | Advocate, Senior Advocate, Managing Partner, Chamber Counsel. |
| 6 | **Firm / Chamber** | String | Firm name (`#202938`) with legal icon badge (⚖️ / 🏛️). |
| 7 | **City** | Geographic Tag | New Delhi, Mumbai, Bengaluru, Chandigarh, Kolkata, Chennai, Hyderabad. |
| 8 | **Lead Source** | Categorized Tag | Bar Council Directory, Referral, Legal Tech Expo, Website Inbound. |
| 9 | **Sales Stage** | Status Badge | Design system 10% tinted badge with 6px dot (New Lead to Negotiation). |
| 10 | **Last Contact** | Relative Date | Timestamp (`"Yesterday"`, `"2 days ago"`, `"Nov 16"`). |
| 11 | **Next Follow-up**| Date + SLA Tag | Colored warning if overdue (`Red`), today (`Amber`), or scheduled (`Gray`). |
| 12 | **Assigned Rep** | Rep Avatar + Name | Circular photo/initials badge + short name (`Sarah J.`). |
| 13 | **Actions** | Action Buttons | 1-click Dial, Quick View Peek, and 3-dot Kebab Menu (`•••`). |

### 2.3 Filter & Search Capabilities
- **Universal Field Search**: Instant debounced search querying across Name, Phone, Email, and Bar Registration ID.
- **Dedicated Dropdown Filters**:
  1. *Stage*: Multi-select for all 8 pipeline stages.
  2. *Lead Source*: Bar Roster, Referral, Conference, Inbound, Chamber Drop-in.
  3. *Assigned Salesperson*: Filter by individual rep or team pod.
  4. *City*: Multi-select major legal hubs (Delhi NCR, Mumbai, Bengaluru, etc.).
  5. *Follow-up Date Range*: Presets (Overdue, Due Today, Tomorrow, This Week, Custom).
- **Floating Bulk Action Bar**: Appears when ≥1 row is checked:
  - Display count: `"[N] Prospects Selected"`
  - `Bulk Reassign Rep`: Opens modal to reassign owner.
  - `Schedule Mass Follow-up`: Assigns cadenced task.
  - `Export Selected CSV`: Downloads highlighted dataset.
  - `Deselect All (×)`.

---

## 3. Screen 2: Add Prospect (Ingestion & Validation)

### 3.1 Form Layout & Structural Sections
Designed as a centered focus modal (`max-w-2xl`) or dedicated ingestion page (`/prospects/new`).

#### Section A: Personal Information
1. **Full Name** (`text`, Required): Prefix (Adv. / Dr. / Mr. / Ms.) + Full Legal Name.
2. **Phone Number** (`tel`, Required): Format: `+91 XXXXX XXXXX`. Real-time validation for 10-digit Indian mobile.
3. **Email Address** (`email`, Required): Format validation.
4. **Profession / Designation** (`select`, Required):
   - *Senior Advocate*
   - *Advocate / Litigator*
   - *Managing Partner*
   - *Partner / Associate*
   - *Independent Legal Practitioner*
   - *In-house Legal Counsel*
5. **Bar Council / Enrollment Number** (`text`, Optional): e.g. `D/1982/2012` (State Bar / Year / Serial).
6. **Firm / Chamber Name** (`text`, Required): Registered name of law practice or chamber.
7. **City** (`select`, Required) & **State** (`select`, Required).

#### Section B: Lead & Sales Information
8. **Lead Source** (`select`, Required): Bar Directory, Event, Referral, Organic Inbound, Chamber Drop-in.
9. **Interest / Legal Solution Requirement** (`multi-select`, Required):
   - *Judgment & Citation Search Engine*
   - *e-Courts Case Cause-List Tracker*
   - *Chamber Billing & Time-Recording Suite*
   - *Contract Lifecycle & Drafting Assistant*
   - *Litigation Matter Management*
10. **Current Sales Stage** (`select`, Default: `New Lead`): Stage dropdown with probability indicator.
11. **Assigned Salesperson** (`select`, Default: Current user): Rep assignment dropdown.
12. **Priority** (`segmented-control`, Default: `Medium`): `Urgent` | `High` | `Medium` | `Low`.
13. **Next Follow-up Date & Time** (`datetime-picker`, Required): Initial outreach schedule.
14. **Initial Discovery Notes** (`textarea`, Optional): Qualitative context, chamber practice areas.

### 3.2 Real-Time Validation & Duplicate Warning Engine
- **Duplicate Detection**: Typing a phone number or email that matches an active record triggers a prominent warning banner:
  > **⚠️ Potential Duplicate Contact Detected**:
  > An advocate with phone `+91 98101 23456` already exists under **Apex Legal Partners** assigned to **Sarah Jenkins** (Stage: *Demo Completed*).  
  > `[View Existing Record]` or `[Continue As Separate Branch]`.

---

## 4. Screen 3: Prospect Details (360° Profile Hub)

### 4.1 Route & Master Header
- **Route**: `/prospects/:id`
- **Master Header Anatomy**:
  - Entity Icon (⚖️) + Prospect Name (`Adv. Rajesh Sharma`) + Designation (`Senior Advocate & Managing Partner`).
  - Bar Council Accreditation: `Bar Council of Delhi (Enrollment: D/1982/2012)`.
  - Direct Contact Chips: Phone (`+91 98101 23456`), Email (`sharma@apexlegal.in`), Location (`New Delhi • Supreme Court & Delhi HC`).
  - Current Stage Badge (`Demo Completed`) + Stage Stepper Visualizer.
  - Assigned Rep Badge (`Sarah Jenkins`).
  - Primary Actions: `Convert to Client ➔` (Green Button), `Edit Prospect` (Outline Button), `••• More Actions`.

### 4.2 The 5 Core Profile Sections

#### Section 1: Overview
- **Practice Demographics**: Primary legal domains (Commercial Litigation, Arbitration, Insolvency/NCLT, Criminal Law).
- **Firm Profile**: Apex Legal Partners (12 Associates, 3 Chambers across Delhi NCR).
- **Technology Profile**: Currently using manual case registers and legacy desktop software; needs cloud citation search.
- **Key Decision Makers**: Hierarchy of managing partners, chamber clerks, and billing accounts managers.

#### Section 2: Activity Timeline (Chronological Audit Stream)
- Comprehensive record of all touchpoints with channel filter buttons (`All`, `Calls`, `Emails`, `Meetings`, `Demos`, `Stage Changes`):
  - *Demo Completed*: Zoom recording link, 45-minute product walk-through, attendees logged.
  - *Call Completed*: Outbound call notes, discussion on citation accuracy.
  - *Stage Change*: Stage promoted from *Contacted* to *Demo Scheduled*.
  - *Proposal Sent*: Attached PDF quotation for Chamber Pro 12-seat package.

#### Section 3: Follow-up History
- **Pending Tasks**: Next action with SLA counter (`Today, 2:30 PM: Follow-up on partnership sign-off`).
- **Completed Follow-ups**: Table of past scheduled tasks, completion dates, and outcomes logged.

#### Section 4: Internal Notes & Team Mentions
- Collaborative scratchpad for the sales team.
- Mentions support (`@david`, `@manager`) with notification routing.
- Pinned critical note: e.g. *"Partner requested customized quotation with stamp duty billing."*

#### Section 5: Sales Information
- Estimated Contract Value: `₹2,16,000 / year (₹18,000 / mo)`.
- Target Subscription Plan: `Chambers Pro Tier (12 Seats)`.
- Win Probability: `80%`.
- Expected Closing Date: `Nov 30, 2026`.
- Competitor Analysis: Currently evaluating SCC Online and Manupatra; our differentiator is real-time High Court cause-list alerts.

---

## 5. Screen 4: Edit Prospect

- **Anatomy**: Identical field schema to the Add Prospect form, populated with current record state.
- **Capabilities**:
  - Update contact information, address, and firm name.
  - Reassign salesperson with mandatory reason log.
  - Adjust priority and target plan requirements.
  - Audit stamp: Records `last_modified_by` and `last_modified_at`.

---

## 6. The Three-Dot (`•••`) Action Menu & Delete Safeguard

### 6.1 Action Menu Matrix
The contextual action menu provides 8 targeted actions:
1. **View Details**: Navigates to `/prospects/:id` full profile.
2. **Edit**: Opens the pre-populated Edit Prospect modal.
3. **Add Follow-up**: Opens quick task scheduler popover (Date, Time, Activity type).
4. **Add Comment**: Opens internal note drawer.
5. **Change Stage**: Quick dropdown to advance or regress deal stage.
6. **Convert to Client** (Highlighted in Success Green): Launches the zero-loss conversion wizard.
7. **Mark as Lost** (Highlighted in Warning Amber): Prompts for structured lost reason (Budget, Competitor, Dormant).
8. **Delete Prospect** (Highlighted in Danger Red): Triggers destructive confirmation dialog.

### 6.2 Delete Confirmation Dialog Specification
To prevent accidental loss of legal leads:
- **Title**: `Delete Prospect Record?`
- **Body**: *"Are you sure you want to delete **Adv. Rajesh Sharma (Apex Legal Partners)**? This will permanently remove their contact information, 14 recorded interaction logs, and pending follow-ups. This action cannot be undone."*
- **Alternative Suggestion**: *"Tip: If the prospect did not purchase, consider marking them as **Lost** or **Inactive** instead of deleting to preserve interaction history."*
- **Buttons**:
  - `Cancel` (Default outline button).
  - `Permanently Delete` (Danger Red button `#DC5252`).
