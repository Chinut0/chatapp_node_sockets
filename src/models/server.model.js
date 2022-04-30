const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http')
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/sockets.controller');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            upload: '/api/uploads',
            users: '/api/users',
        }

        //Connect to DB
        this.connectDB()

        //Middleware
        this.middleware()

        //App Routes
        this.routes();

        //Sockets Events
        this.sockets()
    }


    async connectDB() {
        await dbConnection()
    }

    middleware() {

        //cors
        this.app.use(cors())

        //Lectura y parseo del body
        this.app.use(express.json())

        //Directorio Publico
        this.app.use(express.static('src/public'));

        //Carga de archivos.
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: './temp/',
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.route'))
        this.app.use(this.paths.users, require('../routes/users.route'))
        this.app.use(this.paths.categorias, require('../routes/categorias.route'))
        this.app.use(this.paths.productos, require('../routes/productos.route'))
        this.app.use(this.paths.buscar, require('../routes/buscar.route'))
        this.app.use(this.paths.upload, require('../routes/uploads.route'))

        //Page not found
        this.app.get('*', (req, res) => {
            res.status(404).sendFile(__dirname.replace('/models', '') + '/public/404.html');
        })

    }

    sockets(){
        this.io.on('connection', (socket)=>socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`)
        })
    }
}

module.exports = Server;