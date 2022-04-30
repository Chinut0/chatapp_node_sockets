const Router = require('express')
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads.controller')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarCampos, validarArchivos } = require('../middlewares')

const router = Router()

router.get('/:collection/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
], mostrarImagen)

router.post('/', [
    validarArchivos,
], cargarArchivo)

router.put('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
    validarArchivos,
], actualizarImagen)


module.exports = router