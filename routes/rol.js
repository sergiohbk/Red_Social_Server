'use strict'

var express = require('express');
var RolController = require('../controllers/rol');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_character = require('../middlewares/CharacterLogins');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/rolimages'});

api.post('/newrol', [md_auth.ensureAuth, md_character.getCharacterLogin], RolController.saveRol);
api.post('/upload-image-rolav/:id', [md_auth.ensureAuth, md_upload], RolController.uploadImageRolAvatar);

module.exports = api;
