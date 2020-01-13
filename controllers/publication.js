'use strict'

//LIBRERIAS
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//MODELOS
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
    res.status(200).send({
        message: "Hola desde el controlador de publicaciones"
    });
}

function savePublication(req, res) {
    var params = req.body;

    if (!params) return req.status(200).send({ message: "Deves enviar un texto" });

    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: "Error al guardar la publicación" });

        if (!publicationStored) return res.status(404).send({ message: "La publicación NO se ha guardado correctamente" });

        return res.status(200).send({ publication: publicationStored });
    });
}

function getPublications(req, res) {
  var page = req.params.page;
  var itemsPerPage = 4;
  console.log("entra" + req.user.sub);

  Publication.find({ userIdAu: req.user.sub }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
    if (err) return res.status(500).send({ message: "Error al devolver las publicaciones" });
    console.log("error pasado");
    if (!publications) return res.status(404).send({ message: "No hay publicaciones" });

    return res.status(200).send({
                    total_items: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page: page,
                    items_per_page: itemsPerPage,
                    publications
                });

  });

}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: "Error al devolver publicaciones" });

        if (!publication) return res.status(404).send({ message: "No existe la publicación" });

        res.status(200).send({ publication });

    });
}
//Borrar publicaciones
function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({ 'user': req.user.sub, '_id': publicationId })
        .remove((err, publicationRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al borrar publicaciones' });
            if (!publicationRemoved) return res.status(404).send({ message: 'No se ha borrado la publicacion ' });

            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion' });
            }

        });
}

//Subir archivos de imagen/avatar de usuario
function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {
        //Cojemos la ruta de la imagen
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);
        //Guardamos el nombre del archivo
        var file_name = file_split[2];

        //Guardamos el string(nombre de la imagen) apartir del . para cortar la extension de la imagen
        var ext_split = file_name.split('\.');
        console.log(ext_split);
        //Extensión del archivo en la posición 1 porque la 0 es el nombre de la imagen
        var file_ext = ext_split[1];

        if (file_ext == 'jpg' || file_ext == 'PNG' || file_ext == 'jpeg' || file_ext == 'gif') {
            Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {
                if (publication) {
                    //Actualizar documento de la publicación
                    Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (!publicationUpdated) return res.status(404).send({ message: "No se ha podido actualizar el usuario" });

                        //Nos devuelve el objeto anterior antes de ser actualizado
                        return res.status(200).send({ publication: publicationUpdated })
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, "No tienes permiso para actualizar esta publicación");
                }
            });

        } else {
            return removeFilesOfUploads(res, file_path, "Extensión no válida");
        }

    } else {
        return res.status(200).send({ message: "No se han subido imagenes" });
    }
}

//Función auxiliar
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

//Devolver imagenes de usuario
function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            //Para poder usar el fichero en cualquier parte
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "No existe la imagen..." });
        }
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile

}
