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

// State Management (Local Storage) [cite: 53]
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Food', 'Transport', 'Fun'];
let myChart = null;
let isDarkMode = localStorage.getItem('theme') === 'dark';

// Initialization
function init() {
    applyTheme();
    updateCategoryDropdown();
    renderTransactions();
    updateBalance();
    updateChart();
}

// 1. Transaction Management
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (name === '' || isNaN(amount)) return; // Validation [cite: 28]

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

// 2. Rendering & Sorting
function renderTransactions() {
    transactionList.innerHTML = '';
    
    // Sorting logic
    let sortedTransactions = [...transactions];
    const sortVal = sortOptions.value;
    
    if (sortVal === 'amount-desc') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
    } else if (sortVal === 'amount-asc') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    } else if (sortVal === 'category') {
        sortedTransactions.sort((a, b) => a.category.localeCompare(b.category));
    } else {
        // default 'date' (latest first)
        sortedTransactions.sort((a, b) => b.id - a.id);
    }

    sortedTransactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add('transaction-item');
        li.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-name">${t.name}</span>
                <span class="transaction-category">${t.category}</span>
            </div>
            <span class="transaction-amount">$${t.amount.toFixed(2)}</span>
            <button class="btn-danger" onclick="deleteTransaction(${t.id})">Delete</button>
        `;
        transactionList.appendChild(li);
    });
}

sortOptions.addEventListener('change', renderTransactions);

// 3. Balance Calculation [cite: 35-37]
function updateBalance() {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    totalBalanceEl.innerText = `$${total.toFixed(2)}`;
}

// 4. Chart Visualization [cite: 38-40]
function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Aggregate amounts by category
    const categoryTotals = {};
    transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Color palette generator based on theme
    const bgColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
    ];

    if (myChart) {
        myChart.destroy(); // Destroy previous instance before re-rendering
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: data.length ? bgColors.slice(0, labels.length) : ['#e5e7eb'],
                borderWidth: 1,
                borderColor: isDarkMode ? '#1f2937' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: isDarkMode ? '#f9fafb' : '#1f2937' } }
            }
        }
    });
}

// 5. Custom Categories Management
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
        opt.innerText = cat;
        categoryInput.appendChild(opt);
    });
}

// 6. Theme Toggle (Dark/Light)
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
    updateChart(); // Re-render chart for text/border color update
});

function applyTheme() {
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerText = '☀️ Light Mode';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerText = '🌙 Dark Mode';
    }
}

// Utilities
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Run app
init();