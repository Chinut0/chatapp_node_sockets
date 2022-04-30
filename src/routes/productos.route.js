const { Router } = require("express");
const { check } = require("express-validator");
const { getProducto, getProductos, postProductos, putProductos, deleteProductos } = require("../controllers/productos.controller");
const { existeCategoriaPorId, existeCategoriaPorNombre, existeProductoPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");


const router = Router();


//Obtener todas las productos - public
router.get('/', getProductos);


//Obtener una producto - public
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProducto);

//Crear una producto - private all
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser un numero').isNumeric(),
    check('disponible', 'El valor debe ser true/false').isBoolean(),
    validarCampos
], postProductos);

//Editar una producto - private all 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser un numero').isNumeric(),
    check('disponible', 'El valor debe ser true/false').isBoolean(),
    validarCampos
], putProductos);

//Editar una producto - private admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProductos );


module.exports = router