const { request, response } = require('express');
const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');


const usersGet = async (req = request, res = response) => {

    const { limit = null, desde = null } = req.query
    const query = { estado: true }
    // const usuarios = await User.find(query)
    //     .limit(Number(limit))
    //     .skip(Number(desde))

    // const total = await User.countDocuments(query)

    // const selected = await User.countDocuments(query)
    //     .limit(Number(limit))
    //     .skip(Number(desde))

    //Con la promesa es mas rapido porque se ejecutan en simultaneo
    // const resp = await Promise.all([
    //     User.countDocuments(query),
    //     User.find(query)
    //         .limit(Number(limit))
    //         .skip(Number(desde)),

    // ])

    const [total, users, selected] = await Promise.all([
        User.countDocuments(query),
        User.find(query).limit(Number(limit)).skip(Number(desde)),
        User.countDocuments(query).limit(Number(2)).skip(Number(2)),

    ])

    res.json({
        // registros: `${selected} de ${total}`,
        // usuarios
        total,
        selected,
        users
    })
}

const usersPost = async (req = request, res = response) => {

    const { nombre, correo, password, img, rol, estado, google } = req.body;
    const usuario = new User({ nombre, correo, password, rol });

    //Encriptar constraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);

    try {
        await usuario.save();
        const { password, ...rest } = usuario
        res.json({
            msg: 'usuario creado',
            body: usuario
        })
    } catch (error) {
        res.json({
            msg: 'error al crear el usuario',
        })
        console.log(error)
    }

    // res.json({
    //     msg: 'User POSTasd',
    //     ...req.body,
    // })
}

const usersPut = async (req, res = response) => {
    const { id } = req.params
    const { _id, password, correo, google, ...resto } = req.body

    if (password) {
        //Encriptar constraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt);

        const user = await User.findByIdAndUpdate(id, resto)
    }
    const user = await User.findById(id)

    res.json({
        user
    })
}

const usersDelete = async (req, res = response) => {

    const { id } = req.params;

    //BORRAR FISICAMENTE
    // const usuario = await User.findByIdAndDelete(id)

    //CAMBIAR EL ESTADO DEL USUARIO - SOFT DELETE
    const usuario = await User.findByIdAndUpdate(id,  { estado: false })

    res.json({
        usuario
    })
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'User Patch'
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersPatch
}