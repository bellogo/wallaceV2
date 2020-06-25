import 'bootstrap';
import '../css/index.scss';

import {
    User
} from './user';
import {
    Store
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
    if (localStorage.getItem('logindetails') !== null) {
        const logindetails = JSON.parse(localStorage.getItem('logindetails'));
        document.querySelector('#signinemail').value = logindetails.email;
        document.querySelector('#signinpassword').value = logindetails.password;
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
    }else if (Store.findUser(email) !== undefined) {
        UI.showAlert('User already exists', 'danger');
    } else {
        // instantiate a user
        const user = new User(firstname, lastname, email, password);
        // add user to local storage
        Store.addUsers(user);
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
    const users = Store.getUsers();
    const index = Store.findUser(signinemail);
    
    //remember me
    if(rememberme == true){
        const logindetails = {email: signinemail, password: signinpassword};
        localStorage.setItem('logindetails', JSON.stringify(logindetails));
    }else{
        localStorage.removeItem('logindetails');
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
        Store.createSession(signinemail);
        location.replace('dashboard.html');
    }
});