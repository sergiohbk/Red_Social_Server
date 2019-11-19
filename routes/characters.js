'use strict'

var express = require('express');
var CharacterControler = require('../controllers/characters');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/characters'});
var md_uploadfh = multipart({uploadDir:'./uploads/charactersficha'});

api.post('/newcharacter', md_auth.ensureAuth, CharacterControler.saveCharacter);
api.post('/upload-image-character/:id', [md_auth.ensureAuth, md_upload], CharacterControler.uploadImage);
api.post('/upload-image-characterf/:id', [md_auth.ensureAuth, md_uploadfh], CharacterControler.uploadImageFicha);

module.exports = api;
