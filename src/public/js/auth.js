const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:5000/api/auth/'
    : '';

const miFormulario = document.querySelector('form');


miFormulario.addEventListener('submit', async (ev) => {
    ev.preventDefault()
    const formData = {};
    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value
        }
    }
    try {
        const res = await fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })
        const json = await res.json();
        localStorage.setItem('token', json.token)
        window.location = 'chat.html'
    } catch (e) {
        console.log(e);
    }
})

//Login with google.
async function handleCredentialResponse(response) {
    try {
        const res = await fetch(url + 'google', {
            method: 'POST',
            body: JSON.stringify({ 'id_token': response.credential }),
            headers: { 'Content-Type': 'application/json' }
        })
        const json = await res.json();
        const token = await json.token;
        localStorage.setItem('token', token);
        window.location = 'chat.html'

    } catch (e) {
        console.log(e)
    }
}

//Logout
const button = document.getElementById('signOut')
button.onclick = (evt) => {
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    })
}