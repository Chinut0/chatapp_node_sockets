const { Schema, model } = require("mongoose");


const UserSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'EL nombre es obligatorio'],

    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'EL correo es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'La constraseña es obligatoria'],
        enum: ['ADMIN_ROL', 'USER_ROL']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true
    }
});

//sobreescribo el elemento que devuelve users quitando __v y password
UserSchema.methods.toJSON = function () {
    const {__v, password, _id, ...user} =this.toObject()
    user.uid = _id;
    return user;
}


module.exports = model('User', UserSchema);