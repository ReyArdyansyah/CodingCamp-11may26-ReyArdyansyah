// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transactionList');
const totalBalanceEl = document.getElementById('totalBalance');
const themeToggle = document.getElementById('themeToggle');
const sortOptions = document.getElementById('sortOptions');
const categoryForm = document.getElementById('categoryForm');
const newCategoryInput = document.getElementById('newCategory');

// State Management (Local Storage)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Food', 'Transport', 'Fun'];
let myChart = null;
let isDarkMode = localStorage.getItem('theme') === 'dark';
let spendingLimit = parseFloat(localStorage.getItem('spendingLimit')) || 0;

// Initialization
function init() {
    applyTheme();
    updateCategoryDropdown();
    renderTransactions();
    updateBalance();
    updateChart();
    const limitInput = document.getElementById('spendingLimit');
    if (limitInput && spendingLimit > 0) limitInput.value = spendingLimit;
    updateLimitStatus();
}

// ─── 1. Transaction Management ───────────────────────────────────────────────

transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (name === '' || isNaN(amount) || amount <= 0) return;

    const transaction = {
        id: Date.now(),
        name,
        amount,
        category,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    saveData();
    renderTransactions();
    updateBalance();
    updateChart();
    transactionForm.reset();
});

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    renderTransactions();
    updateBalance();
    updateChart();
}

// ─── 2. Rendering & Sorting ───────────────────────────────────────────────────

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderTransactions() {
    transactionList.innerHTML = '';

    let sortedTransactions = [...transactions];
    const sortVal = sortOptions.value;

    if (sortVal === 'amount-desc') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
    } else if (sortVal === 'amount-asc') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    } else if (sortVal === 'category') {
        sortedTransactions.sort((a, b) => a.category.localeCompare(b.category));
    } else {
        sortedTransactions.sort((a, b) => b.id - a.id);
    }

    if (transactions.length === 0) {
        const empty = document.createElement('li');
        empty.classList.add('empty-state');
        transactionList.appendChild(empty);
        return;
    }

    sortedTransactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add('transaction-item');

        // Left: info block
        const info = document.createElement('div');
        info.classList.add('transaction-info');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('transaction-name');
        nameSpan.textContent = t.name;

        const meta = document.createElement('div');
        meta.classList.add('transaction-meta');

        const catSpan = document.createElement('span');
        catSpan.classList.add('transaction-category');
        catSpan.textContent = t.category;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('transaction-date');
        dateSpan.textContent = formatDate(t.date);

        meta.appendChild(catSpan);
        meta.appendChild(dateSpan);
        info.appendChild(nameSpan);
        info.appendChild(meta);

        // Right: amount + delete
        const amountSpan = document.createElement('span');
        amountSpan.classList.add('transaction-amount');
        amountSpan.textContent = `$${t.amount.toFixed(2)}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-danger');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTransaction(t.id));

        li.appendChild(info);
        li.appendChild(amountSpan);
        li.appendChild(deleteBtn);
        transactionList.appendChild(li);
    });
}

sortOptions.addEventListener('change', renderTransactions);

// ─── 3. Balance Calculation ───────────────────────────────────────────────────

function updateBalance() {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    totalBalanceEl.innerText = `$${total.toFixed(2)}`;
    updateLimitStatus();
}

// ─── 4. Chart Visualization ───────────────────────────────────────────────────

function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const categoryTotals = {};
    transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const bgColors = [
        '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#3b82f6'
    ];

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: data.length ? bgColors.slice(0, labels.length) : ['#e2e8f0'],
                borderWidth: 2,
                borderColor: isDarkMode ? '#141927' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#94a3b8' : '#475569',
                        padding: 16,
                        font: { size: 12, family: 'Inter, sans-serif' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const val = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                            return ` $${val.toFixed(2)} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ─── 5. Custom Categories ─────────────────────────────────────────────────────

categoryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newCat = newCategoryInput.value.trim();
    if (newCat && !categories.includes(newCat)) {
        categories.push(newCat);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateCategoryDropdown();
        newCategoryInput.value = '';
    }
});

function updateCategoryDropdown() {
    categoryInput.innerHTML = '';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryInput.appendChild(opt);
    });
}

// ─── 6. Spending Limit ────────────────────────────────────────────────────────

function updateLimitStatus() {
    const limitStatus = document.getElementById('limitStatus');
    if (!limitStatus) return;

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);

    if (spendingLimit > 0) {
        const percentage = ((total / spendingLimit) * 100).toFixed(1);
        const remaining = spendingLimit - total;
        if (total > spendingLimit) {
            limitStatus.className = 'limit-status over-limit';
            limitStatus.textContent = `⚠️ Over limit by $${Math.abs(remaining).toFixed(2)} (${percentage}%)`;
        } else {
            limitStatus.className = 'limit-status under-limit';
            limitStatus.textContent = `✅ $${remaining.toFixed(2)} remaining (${percentage}% used)`;
        }
    } else {
        limitStatus.className = 'limit-status';
        limitStatus.textContent = '';
    }
}

document.getElementById('setLimitBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('spendingLimit').value);
    if (!isNaN(val) && val >= 0) {
        spendingLimit = val;
        localStorage.setItem('spendingLimit', spendingLimit);
        updateLimitStatus();
    }
});

// ─── 7. Export to CSV ─────────────────────────────────────────────────────────

document.getElementById('exportBtn').addEventListener('click', () => {
    if (transactions.length === 0) {
        alert('No transactions to export.');
        return;
    }

    const header = ['Date', 'Item Name', 'Category', 'Amount'];
    const rows = transactions.map(t => [
        formatDate(t.date),
        `"${t.name.replace(/"/g, '""')}"`,
        t.category,
        t.amount.toFixed(2)
    ]);

    const csvContent = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

// ─── 8. Theme Toggle ──────────────────────────────────────────────────────────

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
    updateChart();
});

function applyTheme() {
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙 Dark Mode';
    }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Run app
init();
