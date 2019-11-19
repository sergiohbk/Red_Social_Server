'use strict'

var Character = require('../models/characters');
var fs = require('fs');
var path = require('path');
var characterSelected = null;
//crear personaje
function saveCharacter(req, res) {
  var params = req.body;
  var character = new Character();

  if (params.name && params.surname){
     character.user = req.user.sub;
     character.name = params.name;
     character.surname = params.surname;
     character.apodo = params.apodo;
     character.image = null;
     character.ficha = null;


     character.save((err, characterStored) => {
         if (err) return res.status(500).send({ message: "Error al guardar el personaje" })

         if (characterStored) {
             res.status(200).send({ character: characterStored });
         } else {
             res.status(404).send({ message: "No se ha registrado el personaje" })
         }
     });
  }else {
    res.status(200).send({
        message: "Envia todos los campos necesarios!"
    });
  }
}

//response del personaje seleccionado
function loginCharacter(req, res){
    var params = req.body;
    characterId = params.id;
    //comprobar  si el personaje le pertenece al usuario
    return res.status(200).send({
        characterId: characterId});
}

//subir imagen para personaje
function uploadImage(req, res) {
  var characterId = req.params.id;

  /*if(req.user.sub != req.params.user){
    return res.status(500).send({ message: "No tienes permisos para actualizar los datos del personaje" })
  }*/ //conseguir los datos de la base de datos para comprobar la configuracion

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento de usuario logueado
            Character.findByIdAndUpdate(characterId, { image: file_name }, { new: true }, (err, characterUpdated) => {
                if (!characterUpdated) return res.status(404).send({ message: "No se ha podido actualizar la imagen de personaje" });

                //Nos devuelve el objeto anterior antes de ser actualizado
                return res.status(200).send({ character: characterUpdated })
            });
        } else {
            return removeFilesOfUploads(res, file_path, "Extensión no válida");
        }
    } else {
        return res.status(200).send({ message: "No se han subido imagenes" });
    }
}

//subir imagen para la ficha
function uploadImageFicha(req, res) {
  var characterId = req.params.id;

  if(req.user.sub != req.params.user){
    return res.status(500).send({ message: "No tienes permisos para actualizar los datos del personaje" })
  }

  if(req.files){
    var file_path = req.files.ficha.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento de usuario logueado
            Character.findByIdAndUpdate(characterId, { ficha: file_name }, { new: true }, (err, characterUpdated) => {
                if (!characterUpdated) return res.status(404).send({ message: "No se ha podido actualizar la imagen de personaje" });

                //Nos devuelve el objeto anterior antes de ser actualizado
                return res.status(200).send({ character: characterUpdated })
            });
        } else {
            return removeFilesOfUploads(res, file_path, "Extensión no válida");
        }
    } else {
        return res.status(200).send({ message: "No se han subido imagenes" });
    }
}

//funcion para encontrar todos los personajes que el usuario tiene
function getCharacterSelected(req, res) {

}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            //Para poder usar el fichero en cualquier parte
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "No existe la imagen..." });
        }
    });
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function deleteImageProfile(req, res) {
    var characterId = req.chId;

    Character.findByIdAndUpdate(characterId, { image: null }, { new: true }, (err, characterUpdated) => {
            if (!characterUpdated) return res.status(404).send({ message: "No se ha podido borrar la imagen" });

            //Nos devuelve el objeto anterior antes de ser actualizado
            return res.status(200).send({ characterImage: characterUpdated.image})
        });
}

module.exports = {
  uploadImage,
  uploadImageFicha,
  saveCharacter
}
