'use strict'

var User = require('../models/user');
var Like = require('../models/like');
var Character = require('../models/characters');
var LikeCh = require('../models/likech');

function saveLike(req, res) {
    var params = req.body;

    if (!params) return req.status(404).send({ message: "Faltan los parametros" });

    var like = new Like();
    like.user = req.user.sub;
    like.publication = params.publication;

    like.save((err, likeStored) => {
        if (err) return res.status(500).send({ message: "Error al guardar el like" });

        if (!likeStored) return res.status(404).send({ message: "el like NO se ha guardado correctamente" });

        return res.status(200).send({ like: likeStored });
    });
}

function deleteLike(req, res) {
    var likeId = req.params.id;

    Like.find({ 'user': req.user.sub, '_id': likeId })
        .remove((err, likeRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al borrar el like' });
            if (!likeRemoved) return res.status(404).send({ message: 'No se ha borrado el like ' });

            if (likeRemoved.n == 1) {
                return res.status(200).send({ message: 'Like eliminado correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar el like' });
            }

        });
}

function saveLikeCh(req, res) {
    var params = req.body;

    if (!params) return req.status(404).send({ message: "Faltan los parametros" });

    var like = new LikeCh();
    like.character = req.chId;
    like.publication = params.publication;

    like.save((err, likeStored) => {
        if (err) return res.status(500).send({ message: "Error al guardar el like" });

        if (!likeStored) return res.status(404).send({ message: "el like NO se ha guardado correctamente" });

        return res.status(200).send({ like: likeStored });
    });
}

function deleteLikeCh(req, res) {
    var likeId = req.params.id;

    LikeCh.find({ 'character': req.chId, '_id': likeId })
        .remove((err, likeRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al borrar el like' });
            if (!likeRemoved) return res.status(404).send({ message: 'No se ha borrado el like ' });

            if (likeRemoved.n == 1) {
                return res.status(200).send({ message: 'Like eliminado correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar el like' });
            }

        });
}

module.exports = {
  saveLike,
  deleteLike,
  saveLikeCh,
  deleteLikeCh
}
