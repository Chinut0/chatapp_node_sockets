const validarCampos = require('./validar-campos');
const validarJWT    = require('./validar-jwt');
const validarRol    = require('./validar-rol');
const validarArchivos    = require('./validar-archivos');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarArchivos,
    ...validarRol,
}