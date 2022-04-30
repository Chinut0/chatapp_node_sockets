const res = require('express/lib/response')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'xlsx'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1];
        // const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'xlsx']

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es valida. Usar ${extensionesValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }

            resolve(nombreTemp);
        });

    })

}

module.exports = {
    subirArchivo
}