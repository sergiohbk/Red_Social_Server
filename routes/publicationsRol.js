'use strict'

var express = require('express');
var publicationController = require('../controllers/publicationRol');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_character = require('../middlewares/CharacterLogins');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

api.post('/publicationrl' , [md_auth.ensureAuth, md_character.getCharacterLogin], publicationController.savePublication);

module.exports = api;
