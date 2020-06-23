class Store {
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
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // if user Store.finduser(useremail) returns undefined user doesnt exist
    //if user does this method would return its index
    static findUser(useremail) {
        let ind;
        const users = Store.getUsers();
        users.forEach((user, index) => {
            if(useremail == user.email){
                ind = index;
           }
        })
        return ind;
    }
    static removeBook(email) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
export {Store};