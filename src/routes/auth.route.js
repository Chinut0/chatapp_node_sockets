//Node imports

//3ros
const { Router } = require('express');
const { check } = require('express-validator');

//Mis funciones
const { login, googleSignIn, renovarToken } = require('../controllers/auth.controller');
const { validarCampos, validarJWT } = require('../middlewares');



const router = Router();

router.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
], login);

router.post('/google', [
    check('id_token', 'el id_token es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignIn);

router.get('/', validarJWT, renovarToken);

module.exports = router;