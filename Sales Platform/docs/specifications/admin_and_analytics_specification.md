# Legal Sales CRM: Administrative & Analytical Modules Specification

## 1. Executive System Overview

The **Administrative and Analytical Modules** provide executive intelligence, workforce governance, and systemic customization across the entire legal technology sales organization:
1. **Reports & Analytics (`/reports`)**: Provides multi-dimensional revenue velocity, pipeline throughput, practice-area acquisition trends, and subscription health tracking.
2. **Team Management (`/team`)**: Governs sales roster capacity, role-based access control (RBAC), quota allocation, and account deactivation safeguards.
3. **Settings (`/settings`)**: Configures CRM pipeline stages, legal custom fields, communication channels, reminder SLAs, and software tier catalog items.

---

## 2. Module 1: Reports & Analytics

### 2.1 The 4 Analytical Dashboards
The analytics workspace features 4 dedicated dashboards accessible via segmented tabs:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ REPORTS & ANALYTICS: [📅 Date: Q4 2026 ▾]  [👤 Rep: All ▾]  [🏛️ Court: High Courts ▾] [Export]│
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│ 1. Sales Perf     │ 2. Lead Analytics │ 3. Team Scorecard │ 4. Subscription Analytics  │
└───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘
```

#### Dashboard 1: Sales Performance Dashboard
- **Total Leads Ingested**: `148 Leads` (`+18.2% vs Q3`).
- **Converted Clients**: `36 Law Firms` (`+25% QoQ`).
- **Gross Conversion Rate**: `24.6%` (`+3.1% vs quarterly target`).
- **Total Revenue (ARR)**: `₹48.2 Lakh` (`+14.2% QoQ`).
- **Monthly Revenue Velocity & Growth Trend**: 6-month dual-axis bar and trendline chart comparing target quota vs actual closed revenue.

#### Dashboard 2: Lead Analytics Dashboard
- **Leads by Source**:
  - *Bar Council Rosters & Directories*: 38% (56 deals)
  - *Advocate Peer Referrals*: 26% (38 deals)
  - *Legal Tech Expos & Court Conclaves*: 18% (27 deals)
  - *Inbound Website & Legal Search*: 12% (18 deals)
  - *Chamber Drop-ins*: 6% (9 deals)
- **Leads by City / Jurisdiction**: New Delhi / NCR (42%), Mumbai (28%), Bengaluru (14%), Chandigarh (9%), Kolkata (7%).
- **Leads by Profession**: Senior Advocates (34%), Advocates/Litigators (41%), Managing Partners (18%), Chamber Counsels (7%).
- **Leads by Sales Stage**: Pipeline stage distribution visualization (42 New ➔ 36 Contacted ➔ 18 Demo Sched ➔ 14 Demo Done ➔ 11 Interested ➔ 8 Negotiation ➔ 12 Converted).
- **Lost Lead Root Cause Breakdown**:
  - Pricing Concerns (38%)
  - Not Using / Legacy Preference (24%)
  - Switched to Competitor (18%)
  - Missing Specific Court Coverage (12%)
  - Court Recess Seasonality (8%)

#### Dashboard 3: Team Performance Scorecard (Leaderboard)
Comprehensive rep scorecard tracking the complete sales funnel velocity:
| Salesperson | Role | Assigned Leads | Calls Logged | Demos Done | Follow-ups Resolved | Deals Closed | Conversion % | Quota Attainment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | Senior Sales Exec | 46 | 142 | 34 | 128 | 12 | **26.1%** | **109% (₹14.2L)** |
| **David Kumar** | Sales Executive | 38 | 118 | 26 | 94 | 8 | **21.0%** | **88% (₹11.5L)** |
| **Priya Nair** | Sales Executive | 32 | 96 | 18 | 76 | 6 | **18.7%** | **65% (₹8.1L)** |
| **Rohan Mehta** | Junior Sales Rep | 24 | 74 | 12 | 52 | 4 | **16.6%** | **46% (₹4.6L)** |

#### Dashboard 4: Subscription Analytics Dashboard
- **Active Subscriptions**: `84 Live Contracts` (312 Total Seat Licenses).
- **Upcoming Renewals**: `18 Contracts` renewing in next 60 days (₹9.6 Lakh ARR value).
- **Expired Subscriptions**: `6 Accounts` in grace period recovery.
- **Cancelled Subscriptions (Churn)**: `5 Accounts` (Net MRR churn rate: 1.4%).
- **Plan Distribution Breakdown**:
  - *Professional (Chamber Pro)*: 58% (49 firms)
  - *Enterprise (Firm Suite)*: 28% (23 firms)
  - *Starter (Solo Advocate)*: 14% (12 firms)
- **Monthly Revenue by Plan Tier**: Stacked revenue chart breaking down MRR contributions.

---

## 3. Module 2: Team Management

### 3.1 Team Directory Table Specification
- **Employee Name**: Full legal name + avatar with online presence indicator.
- **Email**: Corporate email address.
- **Role**: `Administrator`, `Sales Manager`, `Sales Executive`.
- **Assigned Prospects**: Active lead workload counter.
- **Active Clients**: Converted client portfolio count.
- **Performance**: Percentage of monthly quota attained.
- **Account Status**: `Active` (Green), `Inactive` (Gray), `On Leave` (Amber).
- **Actions**: Edit Details, Reassign Workload, Deactivate / Activate Account.

### 3.2 Administrator Capabilities & Workflows
1. **Add Team Member Modal**:
   - Fields: Full Name, Corporate Email, Phone, Role Select (`Sales Executive` | `Sales Manager` | `Administrator`), Monthly Quota Target (`₹ / mo`), Territory / Jurisdiction Focus.
2. **Edit Details Modal**: Update quota targets, assigned territory, or role permissions.
3. **Account Deactivation Safeguard**:
   - Deactivating a sales rep prompts for mandatory **Lead Reassignment**:
   - *"Sarah Jenkins currently owns 46 active prospects and 12 paying clients. Select a team member to inherit these accounts before deactivating."*

---

## 4. Module 3: Settings Architecture (8 Configuration Panels)

### 4.1 Tab Structure & Settings Scope
1. **User Profile**:
   - Name, profile photo, phone number, Bar Council liaison ID, timezone (`Asia/Kolkata`), password update.
2. **Team Permissions (RBAC)**:
   - Granular capability toggles per role: Lead Export permissions, discount authority limits (e.g. Sales Exec ≤ 10%, Sales Mgr ≤ 25%), stage override bypass.
3. **Lead Sources Configuration**:
   - Add, edit, or archive lead sources (e.g. Bar Council Directories, High Court Expo, Organic Search, Referrals).
4. **Sales Pipeline Configuration**:
   - Drag-and-drop stage reordering (New Lead ➔ Contacted ➔ Demo Scheduled ➔ Demo Done ➔ Interested ➔ Negotiation ➔ Converted ➔ Lost).
   - Configure win probability percentages per stage.
   - Set Stale Stage Alert thresholds (e.g. flag if a deal remains in *Demo Completed* for > 7 days).
5. **Activity Types Configuration**:
   - Enable/disable communication channels: Phone Call, Video Demo, Chamber Visit, WhatsApp, Email, Proposal Review.
6. **Follow-up Reminder Settings**:
   - Global SLA rules: Set default reminder intervals (15 mins, 1 hour, morning of 09:00 AM).
   - Configure overdue breach escalation rules (alert sales manager when task is > 4 hours overdue).
7. **Plan Configuration**:
   - Define catalog tiers: Starter, Professional, Enterprise.
   - Set base pricing, included advocate seats, extra seat rates, and annual prepayment discounts.
8. **Notification Preferences**:
   - Channel toggles: In-app notification bell, desktop push notifications, daily summary email digest (08:30 AM), WhatsApp urgency alerts.
