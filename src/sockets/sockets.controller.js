const verificarJWT = require("../helpers/verificarJWT");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


const socketController = async (socket, io) => {
    const usuario = await verificarJWT(socket.handshake.headers['x-token']);
    if (!usuario) {
        return socket.disconnect();
    }

    //Agregar el usuario conectado.
    chatMensajes.conectarUsuario(usuario)

    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    io.emit('recibir-mensajes', chatMensajes.ultimos10)

    //Conectar a sala especial
    socket.join(usuario.id); //Cada usuario va a estar en 3 salas, io(global), socket.id, usuario.id

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', ({ mensaje, uid }) => {
        if (uid) {
            //Mensaje privado.
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje });

        } else {
            //Mensaje global
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }

    })

}


module.exports = {
    socketController
}