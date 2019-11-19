'use strict'

//LIBRERIAS
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var PublicationRol = require('../models/publicationRol');
var Character = require('../models/characters');
var Rol = require('../models/rol');

function savePublication(req, res) {
    var params = req.body;

    //comprobar si el existe el rol y si el usuario esta dentro del rol

    if (!params) return req.status(200).send({ message: "Debes enviar un texto" });

    var pb = new PublicationRol();
    pb.text = params.text;
    pb.file = null;
    pb.character = req.chId;
    pb.rol = params.rol;
    pb.created_at = moment().unix();

    pb.save((err, pbStored) => {
        if (err) return res.status(500).send({ message: "Error al guardar la publicación" });

        if (!pbStored) return res.status(404).send({ message: "La publicación NO se ha guardado correctamente" });

        return res.status(200).send({ publication: pbStored });
    });
}

module.exports = {
  savePublication
}
