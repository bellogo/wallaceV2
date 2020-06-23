import 'bootstrap';
import '../css/dashboard.scss';

import {Store} from './store';

class UI {
    static updateUserName(){
        const users = Store.getUsers();
        const index = Store.findUser(localStorage.getItem('session'));
        document.querySelector('#username').innerHTML = `${users[index].firstname} ${users[index].lastname}`;
    }
}

// EVENT LISTENERS
window.addEventListener('load', () => {
    UI.updateUserName();
});

document.querySelector('#logout').addEventListener('click', () => {
    Store.endSession();
});