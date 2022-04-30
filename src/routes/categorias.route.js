const { Router } = require("express");
const { check } = require("express-validator");
const { getCategorias, deleteCategorias, putCategorias, postCategorias, getCategoria } = require("../controllers/categorias.controller");
const { existeCategoriaPorId, existeCategoriaPorNombre } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");


const router = Router();


//Obtener todas las categorias - public
router.get('/', getCategorias);


//Obtener una categoria - public
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], getCategoria);

//Crear una categoria - private all
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], postCategorias);

//Editar una categoria - private all 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    // check('nombre').custom(existeCategoriaPorNombre),
    validarCampos

], putCategorias);

//Editar una categoria - private admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], deleteCategorias);


module.exports = router