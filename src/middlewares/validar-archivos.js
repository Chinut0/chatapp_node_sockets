
const validarArchivos = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: "El request debe enviar el archivo en el body del form-data"
        });
    }
    next();
}

module.exports = {
    validarArchivos
}