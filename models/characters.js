'use strict'
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var CharacterSchema = Schema({
         user: { type: Schema.ObjectId, ref: 'User' },
         name: String,
         surname: String,
         apodo: String,
         image: String,
         ficha: String,

 });

module.exports = mongoose.model('Character', CharacterSchema);
