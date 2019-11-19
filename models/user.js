'use strict'
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 //Modelo usuario
 var UserSchema = Schema({
        name: String,
        nick: String,
        email: String,
        password: String,
        role: String,
        image: String,
        condiciones: Boolean
 });

 //Pluraliza y pon en minuscula user en la BD y guarda el modelo
 module.exports = mongoose.model('User', UserSchema);
