'use strict'

//Crear fechas
var moment = require('moment');
//Clave secreta
var secret = 'Levisnk92';
//Importamos el servicio
var jwt = require('jwt-simple');

exports.ensureAuth = function (req, res, next) {
    //Si no recibimos en token 
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene la cabecera de Autenticación' });
    }
    //Si recibimos bien el token eliminamos del string comillas dobles y simples
    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        //Decodificamos el token
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }
    req.user = payload;

    next();
}