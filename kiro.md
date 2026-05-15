# Kiro AI Contributions

This file documents all improvements made to this project with the help of **Kiro AI**.

---

## Session 1 — Bug Fixes & Core Features

### Bug Fixes
- **Amount validation**: Fixed the form to reject zero and negative amounts (`amount <= 0` check added).
- **XSS security fix**: Replaced unsafe `innerHTML` injection of user-supplied transaction names and categories with safe DOM creation using `textContent`.

### New Features
- **Spending Limit** *(Optional Challenge #4)*: Added a "Spending Limit" card in the sidebar. Users can set a monthly spending limit. The app highlights when total spending exceeds the limit (red) or is within budget (green). Persisted in LocalStorage.

### UX Improvements
- **Empty state message**: The transaction list now shows a friendly message with emoji when no transactions have been added yet.

---

## Session 2 — Visual Design Overhaul

Rewrote `css/style.css` entirely with a modern design system:

- **Design tokens**: CSS custom properties for colors, shadows, radius, and transitions — consistent across light and dark mode.
- **Header**: Gradient purple background with decorative circle overlays and a glassmorphism theme toggle button.
- **Balance card**: Gradient text for the total amount, accent color bar at the top.
- **Cards**: Subtle shadows with hover depth effect, uppercase section labels.
- **Buttons**: Primary button uses gradient + glow shadow; danger button is subtle until hovered.
- **Inputs**: Focus ring with glow effect, custom select arrow, smooth transitions.
- **Transaction list**: Category shown as pill/badge, thin custom scrollbar, row hover highlight.
- **Typography**: Switched to Inter font (via Google Fonts) for sharper, more professional text.
- **Dark mode**: Fully updated dark palette with proper contrast ratios.
- **Responsive**: Mobile tweaks for small screens (≤480px).

---

## Session 3 — Additional Features

### New Features
- **Export to CSV**: Added an "Export CSV" button next to the sort dropdown. Downloads all transactions as a `.csv` file (Date, Item Name, Category, Amount) — compatible with Excel and Google Sheets. No libraries required.
- **Transaction date display**: Each transaction now shows the date it was added, formatted as "May 15, 2026", displayed alongside the category badge.
- **Chart tooltip improvement**: Pie chart tooltips now show both the dollar amount and percentage of total spending.

---

## Technology used
- HTML, CSS, Vanilla JavaScript (no frameworks)
- Chart.js for pie chart visualization
- Browser LocalStorage API for data persistence
- Google Fonts (Inter) for typography
- Native Blob + URL API for CSV export
