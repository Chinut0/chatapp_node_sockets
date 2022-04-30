console.log('Javascript chat cargado');

//Referencias
const txtUid = document.getElementById('txtUid');
const txtMsg = document.getElementById('txtMsg');
const ulUsuarios = document.getElementById('ulUsuarios');
const ulMsg = document.getElementById('ulMsg');
const btnLogout = document.getElementById('btnLogout');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:5000/api/auth'
    : '';

let usuario = null;
let socket = null;

//Validar token de local storage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length < 10) {
        window.location = 'index.html';
        throw new Error('Token no valido');
    }

    try {
        const res = await fetch(url, { headers: { 'x-token': token } });
        const { usuario: userDB, token: tokenDB } = await res.json();
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre
        await conectarSocket();

    } catch (e) {
        console.log(e);
    }
}

const conectarSocket = async () => {

    //Set socket headers to authenticate
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{
        console.log('Sockets online');
    });

    socket.on('disconnect', ()=>{
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload)=>{
        console.log('asdfasdf');
        console.log(payload);
    });
}

const dibujarUsuarios = (usuarios = [])=>{
    let usersHtml = '';
    usuarios.forEach(({nombre, uid})=>{
        usersHtml += `<li ><p><h5 class="text-success"> ${nombre} </h5><span class=""fs-6 text-muted">${uid}</span><p></li>`;

    })
    ulUsuarios.innerHTML = usersHtml
}

const dibujarMensajes = (mensajes = [])=>{
    console.log(mensajes);
    let mensajesHtml = '';
    mensajes.forEach(({mensaje, uid, nombre})=>{
        mensajesHtml += `<li ><p><span class="text-success"> ${nombre}: </span><span class=""fs-6 text-muted">${mensaje}</span><p></li>`;
    })
    ulMsg.innerHTML = mensajesHtml
}

txtMsg.addEventListener('keyup', ({key})=>{
    const mensaje = txtMsg.value;
    const uid = txtUid.value;
    
    if (key !== 'Enter') return;
    if (mensaje.length === 0) return;

    socket.emit('enviar-mensaje', {mensaje, uid})
})

const main = async () => {

    //Validar JWT
    await validarJWT();
}

main();