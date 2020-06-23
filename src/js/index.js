import 'bootstrap';
import '../css/index.scss';

import {User} from './user'
import {Store} from './store'

class UI {
    static changeTab (el) {
        if(el.classList.contains('signuptab')){
            document.querySelector('.signintab').style.borderBottomColor = 'rgb(92, 50, 50)';
            document.querySelector('.signintab').style.fontWeight = 'normal';
            document.querySelector('#signinform').style.display = 'none';
            document.querySelector('.signuptab').style.borderBottomColor = 'rgb(253, 212, 212)';
            document.querySelector('.signuptab').style.fontWeight = 'bold';
            document.querySelector('#signupform').style.display = 'block';
        }
        else{
            document.querySelector('.signuptab').style.borderBottomColor = 'rgb(92, 50, 50)';
            document.querySelector('.signuptab').style.fontWeight = 'normal';
            document.querySelector('#signupform').style.display = 'none';
            document.querySelector('.signintab').style.borderBottomColor = 'rgb(253, 212, 212)';
            document.querySelector('.signintab').style.fontWeight = 'bold';
            document.querySelector('#signinform').style.display = 'block';
        }
    }
}

//EVENT LISTENERS

document.querySelector('.tabs').addEventListener('click', (e) =>{
     UI.changeTab(e.target);
})

// submit signup form
document.querySelector('#signupform').addEventListener('submit', (e) => {
    e.preventDefault();
    // get form values
    const firstname = document.querySelector('#fname').value;
    const lastname = document.querySelector('#lname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordv = document.querySelector('#passwordv').value;

    // instantiate a user
    const user = new User (firstname, lastname, email, password);
    // add user to local storage
    Store.addUsers(user);
})

// submit signin form

document.querySelector('#signinform').addEventListener('submit', (e) => {
    e.preventDefault();

    // get signin form values
    const signinemail = document.querySelector('#signinemail').value;
    const signinpassword = document.querySelector('#signinpassword').value;
    const users = Store.getUsers();
    const index = Store.findUser(signinemail);

    if (index !== undefined && signinpassword === users[index].password){
        location.replace('dashboard.html');
    }
})
