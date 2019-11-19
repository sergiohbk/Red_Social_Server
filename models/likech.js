'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeChSchema = Schema({
        character: { type: Schema.ObjectId, ref: 'Character' },
        publication: { type: Schema.ObjectId, ref: 'Publication' }
});

module.exports = mongoose.model('LikeCh', LikeChSchema);
