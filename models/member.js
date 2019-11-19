'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = Schema({
        character: { type: Schema.ObjectId, ref: 'Character' },
        rol: { type: Schema.ObjectId, ref: 'Rol' },
        moderation: Boolean
});

module.exports = mongoose.model('Member', memberSchema);
