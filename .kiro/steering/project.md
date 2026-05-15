---
inclusion: always
---

# Project: Expense & Budget Visualizer

## Tech Stack
- HTML for structure
- CSS for styling (single file: css/style.css)
- Vanilla JavaScript, no frameworks (single file: js/script.js)
- Chart.js via CDN for pie chart
- Browser LocalStorage API for persistence

## Folder Rules
- Only 1 CSS file inside css/
- Only 1 JavaScript file inside js/
- No backend, no build tools, no test setup

## Features Implemented
- Input form with validation (Item Name, Amount, Category)
- Scrollable transaction list with delete
- Total balance auto-update
- Pie chart by category (Chart.js)
- LocalStorage persistence
- Custom categories (Optional Challenge)
- Sort by amount or category (Optional Challenge)
- Spending limit highlight (Optional Challenge)
- Dark/light mode toggle (Optional Challenge)
- Export to CSV
- Transaction date display

## Constraints
- TC-1: Vanilla HTML/CSS/JS only
- TC-2: All data stored client-side via LocalStorage
- TC-3: Must work in Chrome, Firefox, Edge, Safari
