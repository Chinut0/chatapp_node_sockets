const { response, request } = require("express");
const { User, Categoria, Producto } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;

const collectionPermitidas = [
    'categoria',
    'usuario',
    'producto',
    'rol'
]

const buscarUsuarios = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);
    if (esMongoID) {
        const usuario = await User.findById(term)
        return res.json({
            results: usuario ? [usuario] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const usuario = await User.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]

    })
    const count = await User.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]

    })
    return res.json({
        count,
        results: usuario ? [usuario] : []
    })
}

const buscarCategorias = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);
    if (esMongoID) {
        const categoria = await Categoria.findById(term)
        return res.json({
            results: categoria ? [categoria] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const categoria = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]

    })
    const count = await Categoria.count({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]

    })
    return res.json({
        count,
        results: categoria ? [categoria] : []
    })
}

const buscarProductos = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);
    if (esMongoID) {
        const producto = await Producto.findById(term)
        return res.json({
            results: producto ? [producto] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const producto = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]

    }).populate('categoria', 'nombre')
        .populate('usuario', 'correo')
    const count = await Producto.count({
        $or: [{ nombre: regex },],
        $and: [{ estado: true }]

    })
    return res.json({
        count,
        results: producto ? [producto] : []
    })
}


const buscar = (req = request, res = response) => {

    const { collection, term } = req.params

    if (!collectionPermitidas.includes(collection)) {
        res.status(400).json({
            msg: `Las colecciones deben ser: ${collectionPermitidas}`
        })
    }

    switch (collection) {
        case 'categoria':
            buscarCategorias(term, res);
            break;
        case 'usuario':
            buscarUsuarios(term, res);
            break;
        case 'producto':
            buscarProductos(term, res);
            break;
        case 'rol':

            break;

        default:
            res.status(500).json({
                msg: 'Esta busqueda no es valida.'
            })
            break;
    }
}


module.exports = {
    buscar
}