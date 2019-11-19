'use strict'

var jwt = require('jwt-simple');
//Crear fechas
var moment = require('moment');
var secret = 'Levisnk92';

//Payload es el objeto con todos los datos del token
exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    //Codificamos el token con una clave secreta
    return jwt.encode(payload, secret);
}