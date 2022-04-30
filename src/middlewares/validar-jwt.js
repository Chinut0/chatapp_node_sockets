const { response, request } = require('express');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model')


const validarJWT = async (req =request, res= response, next) => {

    const token = req.header('x-token')
    if(!token){
        //401 - unaot
        return res.status(401).json({
            msg: 'Debe logearse para la consulta'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const usuario = await User.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido - Usuario no existe.'
            })
        }

        //Verificar si el uid tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token no valido.'
            })
        }

        req.usuario = usuario

        next();
    } catch (error) {
        res.status(401).json({
            msg:'Token no valido.'
        })
        
    }
    
}

module.exports = {
    validarJWT
}