'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

//Conectamos a la BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social', {useUnifiedTopology: true, useNewUrlParser: true})
                .then(() => {
                    console.log("Conexión correcta");

                    //Crear el servidor
                    app.listen(port, () => {
                        console.log("Servidor funcionando correctamente en (localhost)" + " con puerto: " + port);
                    })
                })
                .catch(error => console.log(error));
