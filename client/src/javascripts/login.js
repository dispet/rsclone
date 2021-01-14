const {$, $All} = require('./utils')

const loginForm = $('.loginForm');

const loginEventHandler = (event) => {
    event.preventDefault()
    const  payload = {
        email: loginForm.email.value,
        password: loginForm.password.value
    };

    fetch('/api/users/auth/login',{
        method: 'POST',
        mode:'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((res) => res.json())
    .then((res) => {
        alert('You are logged in.')
        window.location.replace('/');
    })
    .catch((err) => {
        alert(err);
        window.location.href='/login';
    })


}

const init =() => {

    loginForm.addEventListener('submit', loginEventHandler);
}

init();
