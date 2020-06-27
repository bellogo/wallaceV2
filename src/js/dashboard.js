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
}

// EVENT LISTENERS
window.addEventListener('load', () => {
    UI.updateUserName();
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
    if (document.querySelector('#transactionform').checkValidity() === false) {
        document.querySelector('#transactionform').classList.add('was-validated');
    } else {
        // instantiate a user
        const transaction = new Transaction(description, transactiontype, amount, date);
        // add Transaction to local storage
        Storage.addTransaction(transaction);
        UI.showAlert('Transaction saved successfully', 'success');
        document.querySelector('#transactionform').reset();
    }
});