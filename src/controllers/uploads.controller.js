const path = require('path')
const fs = require('fs')

const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { User, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'excel')
        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}


const actualizarImagen = async (req = request, res = response) => {
    const { collection, id } = req.params

    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await User.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ${collection} con id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ${collection} con id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esta collection'
            })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        try {
            let pathImg = path.join(__dirname, '../uploads', collection, modelo.img);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, collection)
    modelo.img = nombre;
    await modelo.save();

    return res.json({
        msg: 'ok',
        modelo
    })
}



const mostrarImagen = async (req =request, res = response) =>{
    const {id, collection} = req.params

    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await User.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ${collection} con id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ${collection} con id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esta collection'
            })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        try {
            let pathImg = path.join(__dirname, '../uploads', collection, modelo.img);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg)
            }

        } catch (error) {
            console.log(error);
        }
    }

    let pathImg = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathImg)

    // res.json({
    //     msg: 'Falta placeholder.'
    // })
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}