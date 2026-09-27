// 1. Grab UI Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

// 2. Load data from LocalStorage, fallback to empty array if nothing exists
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 3. Add a newly submitted transaction
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: Math.floor(Math.random() * 100000000), // Unique ID
        text: text.value,
        amount: parseFloat(amount.value),
        type: type.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Clear form inputs
    text.value = '';
    amount.value = '';
}

// 4. Render a transaction row to the layout list
function addTransactionDOM(transaction) {
    const sign = transaction.type === 'income' ? '+' : '-';
    const item = document.createElement('li');

    // Attach styling class based on type
    item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// 5. Update overall metrics (Total balance, Income, Expense indicators)
function updateValues() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

// 6. Delete a single transaction entry
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init(); // Refresh DOM layout
}

// 7. Sync variable array state back to browser storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 8. Boot up / initialize application state
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
form.addEventListener('submit', addTransaction);