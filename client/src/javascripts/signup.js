import { $, postFetch } from './utils'

const signupForm = $('.signupForm');

const signupEventHandler = (event) => {
    event.preventDefault()
    const payload = {
        email: signupForm.email.value,
        password: signupForm.password.value,
        name: signupForm.name.value,
        phone: signupForm.phone.value,
        addedBy: localStorage.getItem('userId') || 'null'
    };
    postFetch('/api/users', payload)
    .then((res) => {
        alert('Membership has been registered.')
        window.location.replace('/');
    })
    .catch((err) => {
        window.location.href='/signup';
    })
}

const init = () => {
    signupForm.addEventListener('submit', signupEventHandler);
}

init();
