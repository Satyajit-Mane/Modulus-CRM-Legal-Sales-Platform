# Modulus CRM

> High-performance, production-ready enterprise B2B Legal sales platform

[![Live Demo](https://img.shields.io/badge/demo-live-0284c7?style=flat-square)](https://satyajit-mane.github.io/Modulus-CRM-Legal-Sales-Platform/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

---

## Live Deployment
- **GitHub Repository**: [https://github.com/Satyajit-Mane/Modulus-CRM-Legal-Sales-Platform](https://github.com/Satyajit-Mane/Modulus-CRM-Legal-Sales-Platform)

## Overview

**Modulus CRM** is an enterprise-grade sales pipeline management platform tailored for high-velocity sales teams. It provides end-to-end visibility across prospects, client subscriptions, automated follow-ups, and client demos without external heavyweight framework overhead.

### Key Highlights
- **Zero Framework Bloat**: Pure modular ES6+ JavaScript, clean semantic HTML5, and utility-first Tailwind styling with CSS custom property tokens.
- **Persistent State**: Reactive store with automatic `localStorage` synchronization—records added, edited, or deleted persist across page reloads.
- **Enterprise Interaction Design**: Zero layout-shift or rubber-band scale artifacts; instantaneous table filtering, smooth 150ms transitions, and strict keyboard navigation.
- **Comprehensive Keyboard Accessibility**: Full support for <kbd>Cmd</kbd>+<kbd>B</kbd> / <kbd>Ctrl</kbd>+<kbd>B</kbd> sidebar toggling and hierarchical <kbd>Esc</kbd> dismissal across all overlays.

---

## Architecture & Code Organization

The codebase is organized into modular files with single responsibility:

```
├── index.html               # Semantic HTML5 application shell & view templates
├── css/
│   └── styles.css           # Design tokens, typography scales, card layouts, animations
├── js/
│   ├── data.js              # Production seed datasets (Prospects, Clients, Tasks, Meetings)
│   ├── state.js             # Reactive store & localStorage persistence layer
│   ├── utils.js             # DRY formatters, avatar generators, CSV exporter, toasts
│   ├── filters.js           # Multi-select dropdown portal engine & date range calendar
│   ├── tables.js            # Unified table renderers, bulk operations, pagination
│   ├── drawers.js           # Slide-out inspection drawers (Prospect & Client detail tabs)
│   ├── modals.js            # Modal dialog controllers, duplicate detection, CRUD flows
│   └── app.js               # Application router, universal search, global event listeners
├── assets/                  # Brand SVGs, logos, and vector graphics
├── docs/
│   ├── specifications/      # Module architecture specs & design system documentation
│   └── legacy-prototypes/   # Architectural design exploration artifacts
├── .gitignore               # Standard repository hygiene configuration
├── package.json             # NPM package descriptor & run scripts
└── README.md                # Project documentation
```

---

## Core Features

### 1. Executive Pipeline Dashboard
- **Sell Bridge-Inspired Hero**: Royal blue gradient welcome banner highlighting daily priorities.
- **shadcn/ui Metric Cards**: Key performance metrics (**Outreach**, **Activities**, **Conversations**) equipped with trend delta pills, distribution sparklines, and direct navigation arrows.
- **Two-Date Calendar Picker**: Interactive custom calendar supporting preset ranges (7D, 14D, Month) or custom start and end date selections.

### 2. Lead & Prospect Pipeline
- **Advanced Multi-Select Filtering**: Repliq-style floating dropdown portal filtering by Stage, Role, Source, Interest Level, Sales Rep, and City.
- **Bulk Actions**: Multi-row selection with bulk salesperson reassignment, batch archiving, and batch deletion.
- **Duplicate Prevention**: Real-time duplicate warning during prospect creation based on phone and email detection.
- **Export Capabilities**: Standardized CSV data export with RFC-4180-compliant escaping.

### 3. Active Accounts & Subscription Management
- **Subscription Lifecycle**: Track Plan tiers (Standard, Premium, Enterprise), Billing Cycles (Annual, Quarterly, Monthly), and Renewal Dates.
- **Account Health**: Real-time status indicators for Active, At Risk, and Grace Period accounts with one-click license renewal.

### 4. Follow-up Operations
- **Task Prioritization**: Categorized by Overdue, Today, Upcoming, and Completed statuses with dynamic sidebar counter badges.
- **Completion Workflow**: Mark tasks complete with outcome logging and optional automated scheduling of the next touchpoint.

### 5. Meetings & Product Demos
- **Dual Presentation**: Toggle effortlessly between structured List View and interactive Week / Month Calendar views.
- **Meeting Actions**: Direct Google Meet link launching, contact pre-population, and status updates.

### 6. Universal Command Palette & Search
- **Instant Global Search**: Header search input with auto-filtering across prospects, clients, meetings, and follow-ups.
- **Deep Linking**: Click any search match to directly navigate and open the corresponding detail drawer.

---

## Getting Started

### Prerequisites
Any standard modern web browser (Chrome, Edge, Safari, Firefox). No build step, compiler, or Node.js runtime is strictly required.

### Running Locally

#### Option 1: Python HTTP Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/Satyajit-Mane/Modulus-CRM-Legal-Sales-Platform.git
cd Modulus-CRM-Legal-Sales-Platform

# Start local server
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

#### Option 2: Node / NPM
```bash
# Install dependencies (optional serve utility)
npm start
```

---

## Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| <kbd>Cmd</kbd> + <kbd>B</kbd> / <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle Sidebar (Expanded 240px &harr; Collapsed 68px Rail) | Global |
| <kbd>Esc</kbd> | Dismiss topmost overlay (Dropdown &rarr; Calendar &rarr; Search &rarr; Modal &rarr; Drawer) | Global |
| <kbd>Enter</kbd> | Submit active modal form / Confirm action | Modals |

---

## Design System & Typography

- **Primary Font**: `Geist Sans` (Variable weight 100..900) via Google Fonts & CDN.
- **Monospace Font**: `Geist Mono` for Bar IDs, timestamps, phone numbers, and financial metrics.
- **Color System**: HSL CSS variable architecture aligned with shadcn/ui neutral palette and Modulus Sky Blue (`#0284C7`).
- **Icons**: Clean geometric SVG icons with zero emojis across the entire UI.

---

## License

This project is licensed under the [MIT License](LICENSE).
