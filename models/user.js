'use strict'
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 //Modelo usuario
 var UserSchema = Schema({
        idAu: String,
        name: String,
        image: String
 });

 //Pluraliza y pon en minuscula user en la BD y guarda el modelo
 module.exports = mongoose.model('User', UserSchema);
