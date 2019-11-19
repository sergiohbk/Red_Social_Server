'use strict'

var express = require('express');
var MemberController = require('../controllers/member');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_character = require('../middlewares/CharacterLogins');

api.post('/joinrol', [md_auth.ensureAuth, md_character.getCharacterLogin], MemberController.memberSave);

module.exports = api;
