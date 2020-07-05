import 'bootstrap';
import '../css/dashboard.scss';

import {
    Storage
} from './store';
import {
    Transaction
} from './transaction';


class UI {
    static welcomeUser() {
        const users = Storage.getUsers();
        const index = Storage.findUser(localStorage.getItem('session'));
        this.showAlert(`Welcome, ${users[index].firstname} ${users[index].lastname}`, 'success');
        // document.querySelector('#username').innerHTML = `${users[index].firstname} ${users[index].lastname}`;
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
        row.classList.add('tr');
        if (transaction.type === 'Credit') {
            row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.id}</td>
        <td>${transaction.type}</td>
        <td class="credit">${this.numberWithCommas(transaction.amount)}</td>
        <td>${this.numberWithCommas(transaction.balance)}</td>
        <td>${transaction.description}</td>
        <td><a href="#" class="delete btn btn-danger btn-sm">Delete</a></td>
        `;
        } else {
            row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.id}</td>
            <td>${transaction.type}</td>
            <td class="debit">${this.numberWithCommas(transaction.amount)}</td>
            <td>${this.numberWithCommas(transaction.balance)}</td>
            <td>${transaction.description}</td>
            <td><a href="#" class="delete btn btn-danger btn-sm">Delete</a></td>
            `;
        }

        // tablebody.appendChild(row);

        tablebody.insertBefore(row, tablebody.childNodes[0]); //let recent transactions appear from the top of the table 
    }
    static displayTransactions() {
        const usertransactions = Storage.userTransactions(localStorage.getItem('session'));
        usertransactions.forEach(transaction => UI.addTransactionToList(transaction));
    }
    static deleteTransaction(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static runChart() {
        var ctx = document.getElementById('myChart').getContext('2d');

        // global options
        Chart.defaults.global.defaultFontColor = 'rgb(255, 234, 231)';
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: Storage.allUserTransactionDates(),
                datasets: [{
                    label: 'Balance',
                    backgroundColor: 'rgba(255, 234, 231, 0.2)',
                    hoverBackgroundColor: 'blue',
                    borderColor: 'rgb(255, 234, 231)',
                    hoverBorderColor: 'red',
                    pointRadius: 5,
                    data: Storage.allUserBalances()
                }]
            },

            // Configuration options go here
            options: {
                // title:{
                //     display:true,
                //     text: 'Account balance history',
                //     fontSize: 15
                // },
                legend:{
                    display:false,
                    // position:'right'
                },
                layout:{
                    // padding:30
                },
                gridLines: {
                    display: true ,
                    color: "#6FFF"
                }

            }
        });
    }

}

// EVENT LISTENERS
window.addEventListener('load', () => {
    if (localStorage.getItem('session') === null) {
        location.replace('index.html');
    }
    UI.welcomeUser();
    UI.updateBalance();
    UI.displayTransactions();
    UI.runChart();
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
        UI.runChart();
        UI.showAlert('Transaction saved successfully', 'success');
        document.querySelector('#transactionform').reset();
    }
});

//delete event listener
document.querySelector('#table').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        //delete transaction from UI
        UI.deleteTransaction(e.target);

        //delete transaction from storage
        const id = parseInt(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent, 10);
        Storage.deleteTransaction(id);

        UI.runChart();
        UI.showAlert('Transaction deleted successfully', 'success');
        UI.updateBalance();
    }
});