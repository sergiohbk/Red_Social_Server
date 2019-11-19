use strict'

var express = require('express');
var publicationController = require('../controllers/like');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

module.exports = api;
