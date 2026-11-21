# Legal Sales CRM: Main Dashboard Overview Specification

## 1. Executive Screen Architecture

The **Main Dashboard Overview** (`/dashboard/overview`) serves as the operational mission control for the legal technology sales team. It synthesizes executive pipeline visibility with high-velocity daily task execution, balancing aggregate KPIs with direct action triggers.

### 1.1 Layout Grid & Spatial Hierarchy (12-Column Responsive)
The page adheres to a desktop-first 12-column grid (`1440px+` optimized, responsive to `1024px`) with consistent 24px gutters and 16px internal card padding:
- **Header Zone (Full Width, 12 Cols)**: Greeting, date context, system status pill, and primary action bar.
- **KPI Metrics Deck (Full Width, 12 Cols)**: 6-card horizontal matrix providing instant situational awareness.
- **Sales Funnel & Stage Velocity (Full Width, 12 Cols)**: Connected 8-stage pipeline visualization with stage drop-off and deal valuations.
- **Operational Split (Two-Column Layout)**:
  - **Left Work Surface (7 Cols / 58% Width)**: 
    - *Follow-ups Task Console*: Tabbed SLA worklist (Overdue, Due Today, Upcoming) with inline 1-click actions.
    - *Acquisition & Conversion Trends*: Dual-metric performance chart tracking monthly growth and conversion velocity.
  - **Right Intelligence Surface (5 Cols / 42% Width)**:
    - *Recent Activities Live Stream*: Chronological audit feed capturing real-time sales milestones.
    - *Sales Rep Leaderboard*: Quota attainment bars, deals won, and activity volume across team members.
    - *Lead Source Distribution*: Practice-area and acquisition channel breakdown.

---

## 2. Section-by-Section Component Specifications

### Section 1: Welcome Header Bar
- **Greeting & User Context**:
  - Dynamic greeting based on system clock: `"Good morning"` (05:00–11:59), `"Good afternoon"` (12:00–16:59), or `"Good evening"` (17:00–04:59).
  - Rep Name: `"Sarah Jenkins"` + Role pill `[Senior Sales Executive]`.
  - Date Stamp: Localized formatted string: `"Thursday, November 19, 2026"`.
  - Real-time SLA Status Pill: `"3 Overdue Follow-ups"` in warning amber with a pulsing dot.
- **Action Triggers**:
  - `Export Report` (Secondary Outline Button): Launches date-range export options (PDF summary, CSV raw dump).
  - `+ Add Prospect` (Primary Blue CTA `#2563EB`): Opens the rapid lead creation drawer.

---

### Section 2: KPI Metrics Deck (6 Cards)

| Card | Main Metric | Comparison Delta | Supporting Micro-Indicator | Semantic Icon & Tint |
| :--- | :--- | :--- | :--- | :--- |
| **1. Total Prospects** | `148` | `+18.2% vs last mo` | Active in pipeline (28 closing this mo) | 🎯 Blue (`#EFF6FF` / `#2563EB`) |
| **2. Active Clients** | `84 Firms` | `+8.5% vs last mo` | 312 total advocate seat licenses | 🏛️ Green (`#ECFDF5` / `#16A36A`) |
| **3. Pending Follow-ups** | `19 Tasks` | `4 Due Today` | 100% assigned to active reps | ⏱️ Violet (`#F5F3FF` / `#7C3AED`) |
| **4. Overdue Follow-ups**| `7 Tasks` | `-2 from yesterday` | Immediate SLA breach alert | ⚠️ Coral/Red (`#FEF2F2` / `#DC5252`) |
| **5. Conversion Rate** | `24.6%` | `+3.1% vs target` | Top quartile: Litigation practice | 📈 Emerald (`#F0FDF4` / `#16A34A`) |
| **6. Monthly Revenue** | `₹38.4 Lakh` | `+14.2% vs last mo` | ₹45L monthly quota (85.3% achieved) | 💳 Amber (`#FFFBEB` / `#D97706`) |

*Micro-interactions*: Hovering over any card displays an elevation border highlight (`border-[#CBD5E1]`); clicking navigates directly to the filtered sub-module (e.g., clicking *Overdue Follow-ups* filters the follow-ups queue).

---

### Section 3: Visual Sales Funnel (8 Connected Pipeline Stages)

The pipeline is laid out as an 8-column connected progression bar. Each stage card displays the stage name, active prospect count, cumulative pipeline deal value, and conversion drop-off percentage:

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ 1. New Leads │ 2. Contacted │ 3. Demo Sched│ 4. Demo Done │ 5. Interested│ 6. Negotiate │ 7. Converted │ 8. Lost Deal │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 42 Prospects │ 36 Prospects │ 18 Prospects │ 14 Prospects │ 11 Prospects │ 8 Prospects  │ 12 Won       │ 7 Lost       │
│ ₹14.8L Value │ ₹12.4L Value │ ₹8.6L Value  │ ₹7.2L Value  │ ₹6.1L Value  │ ₹5.4L Value  │ ₹9.6L Closed │ ₹3.2L Lost   │
│ (85% to next)│ (50% to next)│ (78% to next)│ (79% to next)│ (73% to next)│ (67% to next)│ (100% Won)   │ (Churn log)  │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

*Interactive Feature*: Clicking any funnel stage card instantly applies a filter to the Prospects table and triggers a notification pill showing filtered stage deals.

---

### Section 4: Follow-ups SLA Worklist Table

The follow-ups module organizes critical communications by temporal urgency using segmented tabs:
- **Tab 1: Today's Follow-ups (5)** – Active scheduled calls, video demos, and in-person chamber meetings.
- **Tab 2: Overdue Follow-ups (7)** – High-urgency tasks requiring immediate intervention.
- **Tab 3: Upcoming (14)** – Confirmed calendar events over the next 7 business days.

**Table Structure & Column Definitions**:
1. **Prospect / Client**: Firm/Chamber Name, Bar Council registration ID, Court Tier (e.g., *Apex Legal Partners • Supreme Court & Delhi HC*).
2. **Primary Contact & Phone**: Senior Advocate name with 1-click dialable phone link.
3. **Activity Type**: Badged channel indicator (📞 Phone Call, 🎥 Video Demo, ✉️ Proposal Email, 🤝 Chamber Visit).
4. **Follow-up Date & Time**: Timestamp with relative SLA warning (`Today, 2:30 PM` or `Overdue by 3h`).
5. **Assigned Rep**: Rep avatar badge + short name (*Sarah J.*).
6. **Status Badge**: Standardized design system badge (*Urgent*, *Due Today*, *Scheduled*).
7. **Quick Actions**:
   - `1-Click Dial` (triggers softphone / VoIP integration).
   - `Mark Complete` (checkbox icon that logs completion notes).
   - `Reschedule` (calendar icon that opens quick snooze popover).
   - `View Record` (slides out the 600px Peek Drawer).

---

### Section 5: Recent Activities Live Feed

Chronological activity stream featuring rich event nodes with author attribution, timestamps, and deep links:
1. **Prospect Converted** (Green node): *"Justice Chambers & Co. converted to Chamber Pro Plan (5 seats). Historical logs locked and preserved."*
2. **Demo Completed** (Violet node): *"Product Demo (IP & Trademark Suite) conducted with Senior Adv. Sneha Chitale (Chitale & Associates)."*
3. **Stage Advanced** (Blue node): *"LexCor Advocates moved from 'Proposal Sent' to 'Negotiation' (25 seats Enterprise)."*
4. **Call Completed** (Sky node): *"Discovery call logged with Managing Partner, K.R. Associates (15 min call)."*
5. **Subscription Renewed** (Emerald node): *"Verma Law Chambers renewed Annual Enterprise Plan (+2 seat expansion)."*
6. **New Prospect Ingested** (Slate node): *"New lead added: Singhania & Partners via High Court Bar Directory."*

---

### Section 6: Sales Performance Analytics Charts

1. **Monthly Prospect Acquisition vs Conversion Trend**:
   - 6-month stacked bar chart showing total new legal leads ingested vs leads successfully converted to paying clients.
   - Highlights positive conversion velocity increase from 18.4% in June to 24.6% in November.
2. **Salesperson Leaderboard**:
   - Comparative rep scorecard tracking Quota Attainment (`%`), Deals Closed, Revenue Generated, and Activity Velocity (Calls + Demos conducted).
   - Visual progress bars color-coded by attainment threshold (Green ≥ 80%, Amber 50–79%, Gray < 50%).
3. **Lead Source Distribution**:
   - Breakdown of acquisition channels:
     - Bar Council Rosters & Directories: 38%
     - Advocate Peer Referrals: 26%
     - Legal Tech Conclaves & Court Events: 18%
     - Inbound Website & Organic Search: 12%
     - Chamber Drop-ins & Walk-ins: 6%

---

## 3. Interaction & Navigation Model

1. **Row & Card Peek Drawers**: Clicking any firm name or follow-up row slides out the 600px right-side drawer, allowing the rep to review past call recordings, inspect Bar Council membership, or click `"Convert to Client ➔"` without leaving the dashboard.
2. **Stage Drill-down**: Clicking any pipeline funnel column navigates to `/prospects/pipeline` with that stage pre-filtered.
3. **Inline Quick Actions**: Checkbox completion on follow-ups immediately strikes through the row, increments completed counters, and logs an activity event in real time.
