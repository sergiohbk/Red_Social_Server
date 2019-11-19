'use strict'
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var RolSchema = Schema({
         admin: { type: Schema.ObjectId, ref: 'Character' },
         name: String,
         image: String,
         thematic: String,
         history: String,
         rules: String,
 });

module.exports = mongoose.model('Rol', RolSchema);
