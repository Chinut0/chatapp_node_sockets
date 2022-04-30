const bcryptjs = require('bcryptjs');
const { User } = require('../../models');
const { dbConnection } = require('../config')
require('dotenv').config();

const createSeed = async () => {
    try {
        await dbConnection()
        await User.deleteMany({})
        await User.insertMany(userData);
        console.log('User seeder created')
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}
createSeed();

const encriptPass = (password)=> {
        //Encriptar constraseña
        const salt = bcryptjs.genSaltSync()
        return bcryptjs.hashSync(password, salt);
}

var userData = [
    {
        "nombre": "Hernan",
        "correo": "hernan.capanegra@gmail.com",
        "password": encriptPass("asdasd"),
        "rol": "ADMIN_ROL",
        "img": null,
        "estado": true,
        "google": false
    }
];