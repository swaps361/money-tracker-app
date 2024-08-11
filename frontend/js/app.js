const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');

let transactions = [];

// Fetch transactions from the server
async function fetchTransactions() {
    const res = await fetch('http://localhost:5000/api/transactions');
    const data = await res.json();
    transactions = data;
    updateUI();
}

// Add transaction
async function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        description: description.value,
        amount: +amount.value,
        type: amount.value > 0 ? 'income' : 'expense',
    };

    const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });

    const data = await res.json();
    transactions.push(data);
    updateUI();
}

// Remove transaction
async function removeTransaction(id) {
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
    });

    transactions = transactions.filter(transaction => transaction._id !== id);
    updateUI();
}

// Update the UI
function updateUI() {
    list.innerHTML = '';
    const income = transactions.filter(transaction => transaction.type === 'income')
                                .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = transactions.filter(transaction => transaction.type === 'expense')
                                .reduce((acc, transaction) => acc + transaction.amount, 0);

    balance.innerText = `$${income - expense}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${Math.abs(expense)}`;

    transactions.forEach(transaction => {
        const sign = transaction.type === 'income' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');
        item.innerHTML = `
            ${transaction.description} <span>${sign}$${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
        `;
        list.appendChild(item);
    });
}

form.addEventListener('submit', addTransaction);
document.addEventListener('DOMContentLoaded', fetchTransactions);
