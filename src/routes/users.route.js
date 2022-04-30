const { Router } = require('express');
const { check } = require('express-validator');

const { isRolValid, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');
const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/users.controller');
const {validarCampos, validarJWT, esAdminRol, tieneRol} = require('../middlewares');

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('nombre', 'el nombre ingresado no es correcto').not().isEmpty(),
    check('password', 'el password incorrecto. Mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'el correo ingresado no es correcto').isEmail(),
    check('rol', 'no es un rol valido').custom(isRolValid),
    check('correo').custom(existeEmail),
    validarCampos
], usersPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol', 'no es un rol valido').custom(isRolValid),
    validarCampos
], usersPut);

router.delete('/:id', [
    validarJWT,
    esAdminRol,
    // tieneRol('ADMIN_ROL', 'USER_ROL'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usersDelete);

module.exports = router;