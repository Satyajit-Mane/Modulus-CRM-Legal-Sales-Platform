# Legal Sales CRM: Dedicated Follow-up Management Specification

## 1. Executive Module Overview

The **Follow-up Management Module** (`/followups`) is the centralized operational command center for the sales organization. Legal technology sales cycles involve multi-stakeholder decision-making—managing partners, litigation associates, chamber clerks, and IT administrators. Reps must orchestrate hundreds of scheduled touchpoints across court hearing schedules and chamber hours.

### 1.1 Core UX Objectives
1. **Zero-Lapse SLA Discipline**: Eliminating dropped deals through prominent, color-coded temporal reminder states (`Overdue`, `Due Today`, `Upcoming`, `Completed`).
2. **Multi-Modal Work Surface**: Seamless toggle between a **High-Density List Grid**, an **Interactive Calendar View** (synchronized with court calendar intervals), and a **Status Kanban Board**.
3. **Compound Resolution Workflow**: Checking off a completed task immediately prompts for the conversation outcome and schedules the next chronological touchpoint in under 15 seconds without losing task history.
4. **Contextual Action Acceleration**: 1-click direct VoIP dialing, 1-click snooze/reschedule presets, and slide-over contact inspection without navigating to separate screens.

---

## 2. Views & Information Architecture

### 2.1 The 5 Primary Status Views (Segmented Filter Tabs)
1. **All Follow-ups (`/followups/all`)**: Global task inventory across all temporal horizons.
2. **Today's Follow-ups (`/followups/today`)**: Active commitments due on the current calendar date (Calls, Demos, Proposal Deliveries).
3. **Upcoming (`/followups/upcoming`)**: Forward-looking pipeline tasks scheduled for tomorrow, this week, or future dates.
4. **Overdue (`/followups/overdue`)**: High-priority tasks whose SLA due timestamp has lapsed without resolution. Highlights breach duration (e.g. *"Overdue by 3h 15m"*).
5. **Completed (`/followups/completed`)**: Immutable audit ledger of all successfully executed tasks, complete with recorded outcomes, resolution notes, and completion timestamps.

### 2.2 The 3 Visual Layout Archetypes
- **List View (Default)**: Compact, high-density data table with sortable columns, inline action buttons, and checkboxes for batch operations.
- **Calendar View**: Day, Week, and Month view mapping follow-up tasks onto hourly time blocks, synchronized with court recess and afternoon chamber consultation hours (02:00 PM – 07:00 PM).
- **Kanban Board View**: Columnar task board grouped by status:
  `[Overdue (7)]` ➔ `[Due Today (5)]` ➔ `[Upcoming (14)]` ➔ `[Completed Today (8)]` with drag-and-drop rescheduling.

---

## 3. Follow-up Table Fields & Data Model

| # | Field Name | Data Type & Mapping | Visual Formatting & Semantics |
| :--- | :--- | :--- | :--- |
| 1 | **Select** | Checkbox | Row selection for batch reassignment or rescheduling. |
| 2 | **Prospect / Client Name**| String + Bar Council ID | Primary contact advocate name (`#202938`), firm name, Bar Council ID (e.g. `D/1982/2012`). |
| 3 | **Phone Number** | Tel URI Link | Clickable 1-click dialer link with phone icon (`+91 98101 23456`). |
| 4 | **Related Record Type** | Entity Tag | `PROSPECT` (Blue) \| `CLIENT` (Green) \| `AT-RISK` (Orange). |
| 5 | **Activity Type** | Channel Badge (Icon + Text) | 📞 Call, 🎥 Demo, 🤝 Chamber Meeting, ✉️ Proposal Review, 💬 WhatsApp. |
| 6 | **Follow-up Date & Time**| Timestamp + SLA Delta | Real-time countdown or breach indicator (`Today, 2:30 PM` or `2h Overdue`). |
| 7 | **Priority** | Semantic Badge | `URGENT` (Red) \| `HIGH` (Amber) \| `MEDIUM` (Blue) \| `LOW` (Slate). |
| 8 | **Assigned Salesperson** | Rep Avatar + Name | Circular photo/initials badge + rep short name (`Sarah J.`). |
| 9 | **Status** | Status Pill | `Overdue` (Pulsing Red) \| `Due Today` (Amber) \| `Upcoming` (Blue) \| `Completed` (Green). |
| 10 | **Actions** | Action Toolbar | Complete (✓), Reschedule (Clock), Reassign, View Contact, More `•••`. |

---

## 4. Visual Reminder State Taxonomy

| Reminder State | Background Tint | Text / Dot Color | Border Stroke | Visual Behavioral Cue |
| :--- | :--- | :--- | :--- | :--- |
| **Overdue** | `#FEF2F2` (10% Red) | `#DC5252` | `#FECACA` | Pulsing red dot indicator; displays exact elapsed breach time. |
| **Due Today** | `#FFF7ED` (10% Amber)| `#EA580C` | `#FED7AA` | Amber clock icon; prioritized at the top of the daily queue. |
| **Upcoming** | `#F0F9FF` (10% Sky) | `#0284C7` | `#BAE6FD` | Clean neutral calendar icon; sorted chronologically. |
| **Completed** | `#F0FDF4` (10% Green)| `#16A34A` | `#BBF7D0` | Strikethrough text decoration; 50% opacity muted row. |

---

## 5. Contextual Action Specifications

1. **Complete Action (The Compound Resolution Loop)**:
   - Checking off any task launches the resolution modal:
     1. *What happened?* (summary text)
     2. *What was the outcome?* (Connected - Positive, Demo Conducted, Rescheduled, Left Voicemail)
     3. *Is another follow-up required?* (Toggle `Yes / No`)
     4. *Next follow-up date, time, and channel*.
   - Never deletes completed records; mutates task status to `COMPLETED` and appends an activity event to the chronological timeline.
2. **Reschedule Action (Quick-Snooze)**:
   - Contextual popover offering 1-click presets:
     - `Tomorrow Morning (10:00 AM)`
     - `Tomorrow Afternoon (03:00 PM)`
     - `In 2 Business Days`
     - `Next Monday`
     - `Custom Date & Time Picker`
3. **Reassign Action**:
   - Modal allowing sales managers or reps to transfer task ownership with an optional handoff note.
4. **Add Comment**:
   - Opens a slide-out drawer to record private internal notes regarding the follow-up.
5. **View Contact**:
   - Slides out the **600px Right-Side Peek Drawer** displaying the contact card, past call recordings, and Bar Council ID without losing the table or calendar position.
6. **Cancel Follow-up**:
   - Confirmation dialog prompting for cancellation reason (*"Client requested no further contact"*, *"Duplicate task"*, *"Matter resolved"*), preserving the task in cancelled status.
