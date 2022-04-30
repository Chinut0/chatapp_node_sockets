const Rol = require('../models/rol.model');
const User = require('../models/user.model');

const { Categoria, Producto } = require('../models');



const isRolValid = async (rol = "") => {
    const existeRol = await Rol.findOne({ rol })
    if (!existeRol) {
        throw new Error(`el rol ${rol} no existe`)
    }
}

const existeEmail = async (correo) => {
    const existeEmail = await User.findOne({ correo: correo })
    if (existeEmail) {
        throw new Error(`El email ya se encuentra registrado`)
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id)
    if (!existeUsuario) {
        throw new Error(`No existe usuario con id: ${id}`)
    }
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`No existe categoria con id: ${id}`)
    }
}

const existeCategoriaPorNombre = async (nombre) => {
    const existeNombre = await Categoria.find({nombre})
    if (existeNombre) {
        throw new Error(`Ya existe una categoria con el mismo nombre`)
    }
}

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`No existe Producto con id: ${id}`)
    }
}

const coleccionesPermitidas = async (collection = '', collections = []) =>{
    const incluida = collections.includes(collection);
    if(!incluida){
        throw(new Error(`Coleccion no permitida. Permitidas ${collections}`))
    }
}

module.exports = {
    existeEmail,
    isRolValid,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeProductoPorId,
    coleccionesPermitidas
}