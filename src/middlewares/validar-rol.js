const { response } = require("express");

const esAdminRol = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el ROL antes del TOKEN'
        })
    }

    const { rol, nombre } = req.usuario

    if (rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            msg: 'No tiene permisos para efectuar esta operación.'
        })
    }

    next();
}

const tieneRol = (...roles) => {

    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el ROL antes del TOKEN'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'No tiene permisos para efectuar esta operación.'
            })
        }


        next();
    }
}


module.exports = {
    esAdminRol,
    tieneRol
}