const { response, request } = require("express");
const { Categoria } = require("../models");
const { findByIdAndUpdate } = require("../models/user.model");


const getCategorias = async (req = request, res = response) => {

    const { limit = null, desde = null } = req.query

    try {
        const [categorias, count] = await Promise.all([
            Categoria.find({ estado: true }).limit(Number(limit)).skip(Number(desde)).populate({ path: 'usuario', select: ['nombre', 'correo'] }),
            Categoria.countDocuments()
        ])
        res.json({
            msg: "ok",
            count,
            categorias
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Categorias - se ha producido un error",
        })

    }

}

const getCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario');

    if (!categoria) {
        return res.status(500).json({
            msg: 'La categoria no existe.'
        })
    }

    res.json({
        categoria
    })
}

const postCategorias = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre}, ya existe.`
        })
    }

    const categoria = new Categoria({ nombre, usuario: req.usuario._id, estado: true })

    try {
        await categoria.save()

        res.status(201).json({
            msg: "Categoria Creada",
            categoria
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Se produjo un error al crear la categoria'
        })
    }

}

const putCategorias = async (req = request, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // El tercer argumento hace que traiga el registro despues de los cambios
    let categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})

    res.json({
        msg: "ok - put",
        categoria
    })
}
const deleteCategorias = async (req = request, res = response) => {
    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true})

    res.json({
        msg: "Categoria eliminada",
        categoria
    })
}

module.exports = {
    getCategorias,
    getCategoria,
    postCategorias,
    putCategorias,
    deleteCategorias,
}