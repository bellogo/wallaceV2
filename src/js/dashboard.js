import 'bootstrap';
import '../css/dashboard.scss';

import {
    Storage
} from './store';
import {
    Transaction
} from './transaction';

class UI {
    static updateUserName() {
        const users = Storage.getUsers();
        const index = Storage.findUser(localStorage.getItem('session'));
        document.querySelector('#username').innerHTML = `${users[index].firstname} ${users[index].lastname}`;
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        document.querySelector('.alertdiv').appendChild(div);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
     // Seperate number with commas function
    static numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static updateBalance() {
        let balance = Storage.calculateBalance(localStorage.getItem('session'));
        document.querySelector('.currentbalance').innerHTML = `${this.numberWithCommas(balance)}`;
    }
    static addTransactionToList(transaction) {
        const tablebody = document.querySelector('#table');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.id}</td>
        <td>${transaction.type}</td>
        <td>${this.numberWithCommas(transaction.amount)}</td>
        <td>${this.numberWithCommas(transaction.balance)}</td>
        <td>${transaction.description}</td>
        <td><a href="#" class="delete btn btn-danger btn-sm">Delete</a></td>
        `;
        tablebody.appendChild(row);
    }
    static displayTransactions () {
        const usertransactions = Storage.userTransactions(localStorage.getItem('session'));
        usertransactions.forEach(transaction => UI.addTransactionToList(transaction));
    }
    static deleteTransaction(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
}

// EVENT LISTENERS
window.addEventListener('DOMContentLoaded', () => {
    UI.updateUserName();
    UI.updateBalance();
    UI.displayTransactions();
});

document.querySelector('#logout').addEventListener('click', () => {
    Storage.endSession();
});

document.querySelector('#deleteaccount').addEventListener('click', () => {
    Storage.removeUser(localStorage.getItem('session'));
});

document.querySelector('#transactionform').addEventListener('submit', (e) => {
    e.preventDefault();
    // get form values
    const transactiontype = document.querySelector('#type').value;
    const amount = document.querySelector('#amount').value;
    const date = document.querySelector('#date').value;
    const description = document.querySelector('#description').value;

    //Bootstrap Validation
    document.querySelector('#transactionform').classList.remove('was-validated');
    if (document.querySelector('#transactionform').checkValidity() === false) {
        document.querySelector('#transactionform').classList.add('was-validated');
    } else {
        // instantiate a Transaction
        const transaction = new Transaction(description, transactiontype, amount, date);

        if (transactiontype === 'Credit') {
            transaction.creditAccount();
        } else if (transactiontype === 'Debit') {
            transaction.debitAccount();
        }
        // add Transaction to local storage
        Storage.addTransaction(transaction);

        UI.updateBalance();
        UI.addTransactionToList(transaction);
        UI.showAlert('Transaction saved successfully', 'success');
        document.querySelector('#transactionform').reset();
    }
});

//delete event listener
document.querySelector('#table').addEventListener('click', (e) => {
    //delete transaction from UI
    UI.deleteTransaction(e.target);
    //delete transaction from store
    const id = parseInt(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent, 10);
    //delete transaction from storage
    Storage.deleteTransaction(id);
    UI.showAlert('Transaction deleted successfully', 'success');
    UI.updateBalance();
});