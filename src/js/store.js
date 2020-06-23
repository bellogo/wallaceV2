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
        });
        return ind;
    }
    static createSession(email){
        localStorage.setItem('session', email);
        console.log('session created');
    }

    static endSession(){
        localStorage.removeItem('session');
        alert('session ended');
        location.replace('index.html');
    }

}
export {Store};