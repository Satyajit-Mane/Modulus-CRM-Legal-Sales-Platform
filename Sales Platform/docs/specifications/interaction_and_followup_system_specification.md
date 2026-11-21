# Legal Sales CRM: Activity Logging & Follow-up Management Specification

## 1. Executive System Architecture

The **Activity Logging & Follow-up System** is the operational core of the Legal Sales CRM. High-velocity sales representatives process dozens of calls, WhatsApp messages, court chamber meetings, and video demonstrations daily. If interaction logging is cumbersome or fragmented, data hygiene degrades, institutional knowledge is lost, and follow-up SLAs lapse.

### 1.1 Core UX Design Principles
1. **Zero-Friction Contextual Execution**: Reps must never be forced to navigate away from their active workspace. All logging, scheduling, and completion workflows occur inside **Slide-Over Drawers (600px)** or **Focused Contextual Modals (520px)**.
2. **One-Action Compound Logging**: Logging a call or meeting allows the rep to concurrently record the conversation outcome, advance the sales stage, and schedule the next follow-up in a single 20-second submission.
3. **Immutable History Preservation**: Completed follow-ups are never purged from the database. When marked complete, their status mutates to `COMPLETED`, recording the outcome, completion timestamp, and notes, while preserving the audit trail.
4. **Strict Internal Privacy Separation**: Internal comments and team strategy notes are visually demarcated with team-only security indicators (`🔒 Internal Note`), guaranteeing that sensitive discounting or partner discussions remain strictly private.

---

## 2. Component 1: Add Activity Modal

### 2.1 Trigger & Placement
- **Trigger**: Click `+ Log Activity` button from the Prospect Profile, Table quick-actions, or Global `+` menu.
- **Form Factor**: Centered Focus Modal (`max-w-xl`, 560px wide) with subtle backdrop blur.

### 2.2 Field Definitions & Data Contract
| # | Field Name | Type / Control | Options & Legal Tech Context |
| :--- | :--- | :--- | :--- |
| 1 | **Activity Type** | Segmented Pill Selector (Icon + Label) | `📞 Phone Call`, `✉️ Email`, `🤝 Meeting`, `🎥 Product Demo`, `💬 WhatsApp`, `📝 Other`. |
| 2 | **Date & Time** | DateTime Input + Shortcuts | Defaults to `Current Timestamp`. Quick pills: `"Just now"`, `"15m ago"`, `"1h ago"`. |
| 3 | **Conversation Outcome** | Chip Grid (Single Select) | `Connected - Positive`, `Connected - Neutral`, `Demo Conducted`, `Left Voicemail / Busy`, `Gatekeeper Refused`, `Rescheduled`, `No Answer`. |
| 4 | **Discussion Notes** | Rich Textarea (4 rows) | Structured prompts: *"Key pain points discussed, case search feedback, decision makers present..."* |
| 5 | **Prospect Interest Level**| 5-Tier Segmented Bar | `🔥 High Intent` \| `⚡ Warm` \| `⚖️ Moderate` \| `❄️ Cold` \| `🚫 Not Interested`. |
| 6 | **Current Sales Stage** | Smart Stage Dropdown | Pre-selects current stage. Highlights recommended advancement (e.g., advancing from *Contacted* to *Demo Scheduled*). |
| 7 | **Next Action Type** | Select Dropdown | `Send Proposal`, `Product Demo Walkthrough`, `Partner Contract Review`, `Follow-up Call`, `No Action Needed`. |
| 8 | **Next Follow-up Date** | Date & Time Picker | Conditional: Active if *Next Action* ≠ *No Action Needed*. |
| 9 | **Assigned Salesperson** | Rep Select Dropdown | Defaults to current logged-in rep (`Sarah Jenkins`). Allows reassignment. |

---

## 3. Component 2: Internal Comment Composer & Feed

### 3.1 Purpose & Security Guardrails
Allows sales executives, account managers, and sales leadership to annotate legal accounts with tactical observations (e.g., partner fee sensitivities, chamber politics, bar council standing) without polluting official client-facing interaction logs.

### 3.2 Component Anatomy
1. **Security Banner**: Visual indicator: `🔒 Team-Only Private Note • Visible exclusively to internal sales and leadership`.
2. **Composer Box**:
   - Multiline textarea with `@mention` auto-complete (`@david.kumar`, `@manager`).
   - Action controls: `Pin Note to Top 📌`, `Notify Sales Manager 🔔`.
   - Submit: `Post Internal Note` (Black primary button `#202938`).
3. **Comment Card Anatomy**:
   - **Header**: User Avatar + Salesperson Name (`Sarah Jenkins`) + Role Pill (`Senior Sales Exec`) + Timestamp (`Today, 11:45 AM`).
   - **Security Badge**: Soft gray padlock icon (`🔒 Internal`).
   - **Body**: Comment text with highlighted `@mentions` and linked firm references.
   - **Action Triggers**: `Edit Comment` (accessible to author/manager), `Pin / Unpin`, `Delete`.

---

## 4. Component 3: Follow-Up Scheduling Modal

### 4.1 Trigger & Placement
- **Trigger**: Click `Schedule Follow-up` from profile action bar, table row menu, or post-activity prompt.
- **Form Factor**: Contextual Modal (`max-w-md`, 480px wide).

### 4.2 Field Specifications
1. **Activity Channel**: Icon buttons (`Call`, `Demo`, `Email`, `Chamber Visit`, `Contract Review`).
2. **Follow-up Date & Time**:
   - Smart Date Shortcuts: `Tomorrow 10:00 AM`, `In 2 Days`, `Next Monday 11:00 AM`, `Custom Calendar`.
3. **SLA Priority Tag**: `Urgent` (Red), `High` (Amber), `Medium` (Blue), `Low` (Gray).
4. **Reminder Alert Trigger**:
   - Options: `15 minutes before`, `1 hour before`, `Morning of (09:00 AM)`, `No reminder`.
   - Generates in-app topbar notification pill and optional calendar sync.
5. **Assigned Salesperson**: Rep dropdown with active task load indicator (e.g., `Sarah Jenkins (4 tasks today)`).
6. **Agenda & Supporting Notes**: Brief description of the follow-up goal (e.g., *"Review GST invoicing draft with chamber clerk"*).

---

## 5. Component 4: Follow-Up Completion Flow (The Resolution Loop)

### 5.1 The Anti-Data Loss Principle
Generic CRMs allow users to click a checkbox and delete or vanish the task. This CRM strictly implements an **Outcome-Driven Resolution Modal**:
1. When a rep checks the completion box on any follow-up task, the task is **not** deleted.
2. A focused modal dialog opens instantly: **"Complete Follow-up: [Task Title]"**.
3. Captures the outcome in seconds, records the historical log, and prompts for the inevitable next step.

### 5.2 Follow-up Completion Modal Fields
```
┌────────────────────────────────────────────────────────────────────────┐
│ COMPLETED TASK: Follow-up on Chamber Pro Proposal                      │
│ Prospect: Apex Legal Partners • Adv. Rajesh Sharma                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. What happened?                                                      │
│    [ Discussed the 12-seat licensing quote with Senior Partner...    ] │
│                                                                        │
│ 2. What was the outcome?                                               │
│    (•) Successful / Moving Forward      ( ) Needs More Time            │
│    ( ) Rescheduled by Advocate          ( ) Unreachable / No Answer    │
│    ( ) Uninterested / Budget Issue                                     │
│                                                                        │
│ 3. Is another follow-up required?                                      │
│    [ YES / TOGGLE ON ]                                                 │
│                                                                        │
│ 4. Next Follow-up Date & Time:                                         │
│    [ Tomorrow, 11:00 AM ▾ ]    Channel: [ 📞 Phone Call ▾ ]            │
├────────────────────────────────────────────────────────────────────────┤
│ [ Cancel ]                                [ Complete & Save Log ➔ ]    │
└────────────────────────────────────────────────────────────────────────┘
```
- **Post-Submission State Mutation**:
  - The original task transitions: `status: COMPLETED`, `completed_at: now()`, `resolution_notes: text`.
  - An activity event is automatically appended to the chronological timeline.
  - If *"Another follow-up required"* = `true`, a new `PENDING` task is created linked to the account.

---

## 6. Component 5: Chronological Activity Timeline

### 6.1 Display Order & Filtering
- **Temporal Order**: Strictly reverse-chronological (**Newest activities first**).
- **Pagination / Virtualization**: Initial load renders the 10 most recent events; sticky button at bottom: `"Load Older Activities (14 more)"`.
- **Channel Filter Bar**: Segmented filter chips:
  `[All Activities (24)]` `[Calls (8)]` `[Demos (3)]` `[Emails (6)]` `[Notes (4)]` `[Stage Changes (3)]`.

### 6.2 Event Node Typology & Visual Encoding
1. **Product Demo Node** (`#F5F3FF` violet icon, `#7C3AED` border):
   - Header: *"Product Demonstration (Zoom Meeting)"* + Duration + Host.
   - Body: Summary of features demonstrated, attendees present, recorded demo link.
2. **Phone Call Node** (`#EFF6FF` blue icon, `#2563EB` border):
   - Header: *"Outbound Call"* + Outcome badge (`Connected - Positive`) + Duration (`18m`).
   - Body: Call summary and action item.
3. **Stage Promotion Node** (`#ECFDF5` emerald icon, `#16A36A` border):
   - Header: *"Stage Advanced: Demo Completed ➔ Negotiation"*.
   - Body: Automatic system log with deal valuation update (`₹2.16L ARR`).
4. **Email / WhatsApp Node** (`#F0FDF4` green icon):
   - Header: *"Formal Proposal PDF Sent"* via official mailer.
5. **Team Comment Node** (`#FFFBEB` amber icon, padlock indicator):
   - Body: Internal team remark with author avatar and mention tags.
