'use strict'

var express = require('express');
var UserController = require('../controllers/user');
//Para tener acceso a post, get, delete..
var api = express();
var tokenjwt = require('../middlewares/auth0check');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});

//Seleccionamos la ruta y llamamos a los metodos
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.get('/get-all-information', tokenjwt.checkJwt, UserController.saveUsers);
api.post('/login', UserController.loginUser);
api.get('/user/:id', UserController.getUser);
api.get('/users/:page?', UserController.getUsers);
api.get('/counters/:id?', UserController.getCounters);
api.put('/update-user/:id',  UserController.updateUser);
api.post('/upload-image-user/:id', UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;
