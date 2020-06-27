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

class Transaction {
    constructor (description, type, amount, date) {
        this.description = description;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.id = transactionid(type);
        this.email = localStorage.getItem('session');
    }
    
}



export {
    Transaction
};