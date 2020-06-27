import 'bootstrap';
import '../css/index.scss';

import {
    User
} from './user';
import {
    Storage
} from './store';

class UI {
    static changeTab(el) {
        if (el.classList.contains('signuptab')) {
            document.querySelector('.signintab').style.borderBottomColor = 'rgb(92, 50, 50)';
            document.querySelector('.signintab').style.fontWeight = 'normal';
            document.querySelector('#signinform').style.display = 'none';
            document.querySelector('.signuptab').style.borderBottomColor = 'rgb(253, 212, 212)';
            document.querySelector('.signuptab').style.fontWeight = 'bold';
            document.querySelector('#signupform').style.display = 'block';
        } else {
            document.querySelector('.signuptab').style.borderBottomColor = 'rgb(92, 50, 50)';
            document.querySelector('.signuptab').style.fontWeight = 'normal';
            document.querySelector('#signupform').style.display = 'none';
            document.querySelector('.signintab').style.borderBottomColor = 'rgb(253, 212, 212)';
            document.querySelector('.signintab').style.fontWeight = 'bold';
            document.querySelector('#signinform').style.display = 'block';
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        document.querySelector('.signupimg').appendChild(div);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    // validate email
    static validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

//EVENT LISTENER(S
window.addEventListener("load", () => {
    if (localStorage.getItem('session') !== null) {
        location.replace('dashboard.html');
    }
    if (localStorage.getItem('rememberedemail') !== null) {
        const rememberedemail = localStorage.getItem('rememberedemail');
        document.querySelector('#signinemail').value = rememberedemail;
        document.querySelector('#signinpassword').value = Storage.getUsers()[Storage.findUser(rememberedemail)].password;
        document.querySelector('#rememberme').checked = true;
    }
});

document.querySelector('.tabs').addEventListener('click', (e) => {
    UI.changeTab(e.target);
});

// submit signup form
document.querySelector('#signupform').addEventListener('submit', (e) => {
    e.preventDefault();
    // get form values
    const firstname = document.querySelector('#fname').value;
    const lastname = document.querySelector('#lname').value;
    const email = document.querySelector('#email').value.toLowerCase();
    const password = document.querySelector('#password').value;
    const passwordv = document.querySelector('#passwordv').value;
    // Validate
    if (!firstname || !lastname || !email || !password || !passwordv) {
        UI.showAlert('Complete filling information', 'danger');
    } else if (password !== passwordv) {
        UI.showAlert('Both passwords must match', 'danger');
    } else if(!UI.validateEmail(email)){
        UI.showAlert('Invalid Email', 'danger');
    }else if (Storage.findUser(email) !== undefined) {
        UI.showAlert('User already exists', 'danger');
    } else {
        // instantiate a user
        const user = new User(firstname, lastname, email, password);
        // add user to local storage
        Storage.addUsers(user);
        UI.showAlert('Account created successfully', 'success');
        document.querySelector('#signupform').reset();
        //change to sign in
        UI.changeTab(document.querySelector('.signintab'));
    }
});

// submit signin form

document.querySelector('#signinform').addEventListener('submit', (e) => {
    e.preventDefault();

    // get signin form values
    const signinemail = document.querySelector('#signinemail').value.toLowerCase();
    const signinpassword = document.querySelector('#signinpassword').value;
    const rememberme = document.querySelector('#rememberme').checked;
    const users = Storage.getUsers();
    const index = Storage.findUser(signinemail);
    
    //remember me
    if(rememberme == true){
        localStorage.setItem('rememberedemail', signinemail);
    }else{
        localStorage.removeItem('rememberedemail');
    }

    // Validate
    if (!signinemail || !signinpassword) {
        UI.showAlert('Complete filling information', 'danger');
    }else if(!UI.validateEmail(signinemail)){
        UI.showAlert('Invalid Email', 'danger');
    }else if (index === undefined) {
        UI.showAlert('User doesnt exist, try signing up', 'danger');
    }else if (index !== undefined && signinpassword !== users[index].password) {
        UI.showAlert('Wrong password, try again', 'danger');
    }else if (index !== undefined && signinpassword === users[index].password) {
        Storage.createSession(signinemail);
        location.replace('dashboard.html');
    }
});