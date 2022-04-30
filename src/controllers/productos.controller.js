const { response, request } = require("express");
const { Producto, Categoria } = require("../models");


const getProductos = async (req = request, res = response) => {

    const { limit = null, desde = null } = req.query

    try {
        const [productos, count] = await Promise.all([
            Producto.find({ estado: true }).limit(Number(limit)).skip(Number(desde)).populate([{ path: 'usuario', select: ['nombre', 'correo'] }, { path: 'categoria', select: ['nombre'] }]),
            Producto.countDocuments()
        ])
        res.json({
            msg: "ok",
            count,
            productos
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Categorias - se ha producido un error",
        })

    }

}

const getProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario');

    if (!producto) {
        return res.status(500).json({
            msg: 'El producto no existe.'
        })
    }

    res.json({
        producto
    })
}

const postProductos = async (req = request, res = response) => {

    const { usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id;

    let producto = new Producto(data);

    try {
        producto = await producto.save()

        res.status(201).json({
            msg: "Producto Creado.",
            producto
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Se produjo un error al crear el producto.'
        })
    }

}

const putProductos = async (req = request, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    try {
        // El tercer argumento hace que traiga el registro despues de los cambios
        let producto = await Producto.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json({
            msg: "Producto Modificado.",
            producto
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Se produjo un error al modificar el producto.'
        })
    }
}

const deleteProductos = async (req = request, res = response) => {
    const { id } = req.params
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        msg: "Producto eliminado",
        producto
    })
}

module.exports = {
    getProductos,
    getProducto,
    postProductos,
    putProductos,
    deleteProductos,
}