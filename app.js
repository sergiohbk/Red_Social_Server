'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//Carga el framework
var app = express();

//Cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');
var characters_routes = require('./routes/characters');
var rol_routes = require('./routes/rol');
var member_routes =  require('./routes/member');
var publicationsrol_routes = require('./routes/publicationsRol');
var like_routes =  require('./routes/like');

//middlewares
//cada vez que hagamos peticiones de datos nos la convierte a JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', characters_routes);
app.use('/api', rol_routes);
app.use('/api', member_routes);
app.use('/api', publicationsrol_routes);
app.use('/api', like_routes);

//Exportar
module.exports = app;
