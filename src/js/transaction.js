import {Storage} from './store';


class Transaction {
    constructor (description, type, amount, date) {
        this.description = description;
        this.type = type;
        this.amount = parseInt(amount, 10);
        this.date = date;
        this.id = transactionid(type);
        this.email = localStorage.getItem('session');
    }
    
    creditAccount () {
        const users = Storage.getUsers();
        const index = Storage.findUser(localStorage.getItem('session'));
        let currentBalance = users[index].balance;
        const inputedAmount = this.amount;
        currentBalance += inputedAmount;
        users[index].balance = currentBalance;
        localStorage.setItem('users', JSON.stringify(users));
        this.balance = currentBalance;
    } 
    debitAccount () {
        const users = Storage.getUsers();
        const index = Storage.findUser(localStorage.getItem('session'));
        let currentBalance = users[index].balance;
        const inputedAmount = this.amount;
        currentBalance -= inputedAmount;
        users[index].balance = currentBalance;
        localStorage.setItem('users', JSON.stringify(users));
        this.balance = currentBalance;
    }

}

const transactionid = (type) => {
    let id;
    //check if this is the first id to be created
    if (localStorage.getItem('id') === null) {
        id = 1;
        localStorage.setItem('id', id); //set id to 1
        //returning  id based on transaction type
        return id;
        
    }else{
        id = parseInt(localStorage.getItem("id"), 10);
        id++;
        localStorage.setItem('id', id);
        return id;
    }
};

export {
    Transaction
};