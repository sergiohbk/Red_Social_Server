'use strict'

var Rol = require('../models/rol');
var fs = require('fs');
var path = require('path');

function saveRol(req, res){
  var params = req.body;
  var rol = new Rol();

  if (params.name && params.thematic && params.rules){
     rol.admin = req.chId;
     rol.name = params.name;
     rol.image = null;
     rol.thematic = params.thematic;
     rol.history = params.history;
     rol.rules = params.rules;


         rol.save((err, rolStored) => {
             if (err) return res.status(500).send({ message: "Error al guardar el rol" })

             if (rolStored) {
                 res.status(200).send({ rol: rolStored });
             } else {
                 res.status(404).send({ message: "No se ha registrado el rol" })
             }
         });
      }else {
        res.status(200).send({
            message: "Envia todos los campos necesarios!"
        });
    }
}

function uploadImageRolAvatar(req, res) {
  var rolId = req.params.id;
  //comprobar si es el admin el que esta acutalizando el rol

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento de usuario logueado
            Rol.findByIdAndUpdate(rolId, { image: file_name }, { new: true }, (err, rolUpdated) => {
                if (!rolUpdated) return res.status(404).send({ message: "No se ha podido actualizar la imagen principal del rol" });

                //Nos devuelve el objeto anterior antes de ser actualizado
                return res.status(200).send({ rol: rolUpdated })
            });
        } else {
            return removeFilesOfUploads(res, file_path, "Extensión no válida");
        }
    } else {
        return res.status(200).send({ message: "No se han subido imagenes" });
    }
}

module.exports = {
  uploadImageRolAvatar,
  saveRol
}
