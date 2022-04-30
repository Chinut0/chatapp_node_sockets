const mongoose = require('mongoose');

const dbConnection = async ()=>{
    const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_DB
      } = process.env;
      
    //   const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
      const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo/${MONGO_DB}?authSource=admin`;
    try {
        // await mongoose.connect(process.env.DB_MONGO_CNN);
        const connectOptions = {
            useNewUrlParser: true,
        }
        await mongoose.connect(url, connectOptions);
        console.log('DB connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la DB')
    }
}

module.exports = {
    dbConnection
};