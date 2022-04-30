const { request, response } = require('express');

const bcryptjs = require('bcryptjs');

const { User } = require('../models');
const generarJWT = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {
    const { correo, password } = req.body

    try {

        //Verificar si el email existe
        const usuario = await User.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos"
            })
        }
        //Verificar usuario en DB
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - fue bloqueado"
            })
        }
        
        // Verificar la constraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos"
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Acceso invalido"
        })
    }




} 

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body
    try {
        const { nombre, img, correo } = await googleVerify(id_token)

        //Busca usuario
        let usuario = await User.findOne({ correo });

        //Si no existe lo crea
        if (!usuario) {
            usuario = new User({
                nombre,
                correo,
                password: '*',
                rol: 'ADMIN_ROL',
                estado: true,
                google: true,
                img
            });
            await usuario.save();
        }

        //verifica que se encuentre activo.
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hablar con el Administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        //Respuesta ok
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: "El token no se pudo verificar.",

        })
    }



}

const renovarToken = async (req, res)=>{
    const {usuario} =req;

        // Generar el JWT
        const token = await generarJWT(usuario.id);

    res.json({
        usuario, 
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}