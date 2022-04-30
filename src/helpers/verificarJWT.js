const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const verificarJWT = async (token = '') => {
    try {
        //verifica si viene un token
        if (token.length < 10) {
            return null;
        }
        //Busca usuario en DB
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById(uid);
        //Verifica si existe
        if (!usuario) {
            return null;
        }
        //Verifica estado
        if (!usuario.estado) {
            return null;
        }

        return usuario;
        
    } catch (error) {
        return null
    }

}

module.exports = verificarJWT