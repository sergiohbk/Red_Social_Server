'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationRolSchema = Schema({
        text: String,
        file: String,
        created_at: String,
        character: { type: Schema.ObjectId, ref: 'Character' },
        rol: { type: Schema.ObjectId, ref: 'Rol' }
});

module.exports = mongoose.model('PublicationRol', PublicationRolSchema);
