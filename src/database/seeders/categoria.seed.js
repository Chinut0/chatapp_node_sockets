const { User, Categoria } = require('../../models');
const { dbConnection } = require('../config')
require('dotenv').config();

let usuario;

const createSeed = async () => {
    try {
        await dbConnection()
        let user = await User.aggregate([{ $sample: { size: 1 } }])
        user = await user[0]._id
        await Categoria.deleteMany({})
        await Categoria.insertMany(userData(user));
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}
createSeed();

var userData = (user) => [
    {
        'nombre': 'Categoria A',
        'usuario': user
    },
    {
        'nombre': 'Categoria B',
        'usuario': user
    }
];