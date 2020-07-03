class Storage {
    // ACCESSING LOCALSTORAGE FOR USERS
    static getUsers() {
        let users;
        if (localStorage.getItem('users') === null) {
            users = [];
        } else {
            users = JSON.parse(localStorage.getItem('users'));
        }

        return users;
    }

    static addUsers(user) {
        const users = Storage.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // if user Storage.finduser(useremail) returns undefined user doesnt exist
    //if user does this method would return its index
    static findUser(useremail) {
        let ind;
        const users = Storage.getUsers();
        users.forEach((user, index) => {
            if (useremail == user.email) {
                ind = index;
            }
        });
        return ind;
    }

    // ACCESSING LOCALSTORAGE FOR USER SESSION Email

    static createSession(email) {
        localStorage.setItem('session', email);
        console.log('session created');
    }

    static endSession() {
        localStorage.removeItem('session');
        location.replace('index.html');
    }

    static removeUser(email) {
        //Delete all transactions by a particular user
        let transactions = Storage.getAllTransactions();
        let newArray = [];
        transactions.forEach((transaction, index) => {
            if (email !== transaction.email) {
                newArray.push(transaction);
            }
        });
        localStorage.setItem('transactions', JSON.stringify(newArray));

        // delete user
        const users = Storage.getUsers();
        const index = Storage.findUser(email);
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        Storage.endSession();
    }

    // ACCESSING LOCALSTORAGE FOR TRANSACTIONS
    static getAllTransactions() {
        let transactions;
        if (localStorage.getItem('transactions') === null) {
            transactions = [];
        } else {
            transactions = JSON.parse(localStorage.getItem('transactions'));
        }

        return transactions;
    }

    static addTransaction(transaction) {
        let transactions = Storage.getAllTransactions();
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // return an array of transactions by a particular user
    static userTransactions(email) {
        let userTransactions = [];
        const transactions = Storage.getAllTransactions();
        transactions.forEach((transaction, index) => {
            if (email === transaction.email) {
                userTransactions.push(transaction);
            }
        });
        return userTransactions;
    }

    static deleteTransaction(id) {
        let transactions = Storage.userTransactions(localStorage.getItem('session'));
        transactions.forEach((transaction, index) => {
            if (transaction.id === id) {
                transactions.splice(index, 1);
            }
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    //returns current balance
    static calculateBalance(email) {
        const alltransactions = Storage.userTransactions(email);
        let creditotal = 0;
        let debitotal = 0;
        alltransactions.forEach(transaction => {
            if (transaction.type === 'Credit') {
                creditotal += transaction.amount;
            } else {
                debitotal += transaction.amount;
            }
        });
        return creditotal - debitotal;
    }

    // Get all balances in UserTransactions
    static allUserBalances() {
        const userTransactions = this.userTransactions(localStorage.getItem('session'));
        let userBalances = [];
        userTransactions.forEach(transaction => {
            userBalances.push(transaction.balance);
        });
        return userBalances;
    }
    
    // Get all user transaction dates
    static allUserTransactionDates() {
        const userTransactions = this.userTransactions(localStorage.getItem('session'));
        let userTransactionDates = [];
        userTransactions.forEach(transaction => {
            userTransactionDates.push(transaction.date);
        });
        return userTransactionDates;
    }
}
export {
    Storage
};