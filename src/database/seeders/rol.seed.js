const { Rol } = require('../../models');
const { dbConnection } = require('../config')
require('dotenv').config();

const createSeed = async () => {
    try {
        await dbConnection()
        await Rol.deleteMany({})
        await Rol.insertMany(rolData);
        console.log('Rol seeder created')
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}
createSeed();

var rolData = [
    {
        'rol': 'ADMIN_ROL',
    },
    {
        'rol': 'USER_ROL',
    },
    {
        'rol': 'SALES_ROL',
    }
];