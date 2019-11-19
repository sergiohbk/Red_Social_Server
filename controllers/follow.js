//Para poder usar todas las caracteristicas de edma script-6
'use strict'

var mongoosePaginate = require('mongoose-pagination');

//Modelos
var User = require('../models/user');
var Follow = require('../models/follow');

//Seguir a usuarios
function saveFollow(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: "Error al guardar el seguimiento" });

        if (!followStored) return res.status(404).send({ message: "El seguimiento no se ha guardado" });

        return res.status(200).send({ follow: followStored });
    });
}

//Dejar de seguir a usuarios
function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).deleteOne(err => {
        if (err) return res.status(500).send({ message: "Error al dejar de seguir" });

        return res.status(200).send({ message: "El follow se ha eliminado" });
    });
}

//Listado de usuarios a los que seguimos
function getFollowingUsers(req, res) {
    var userId = req.user.sub;

    //Comprobamos si llega el ID del usuario a traves de la URL
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }
    //Comprabamos que nos llegue la página
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    //Buscamos a todos los usuarios a los que seguimos
    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: "Error en el servidor" });

        if (!follows) return res.status(404).send({ message: "No estas siguiendo a ningun usuario" });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            //Objeto completo de todos los follows
            follows
        });
    });
}

//Listado de usuarios que nos estan siguiendo
function getFollowedUsers(req, res) {
    var userId = req.user.sub;

    //Comprobamos si llega el ID del usuario a traves de la URL
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }
    //Comprabamos que nos llegue la página
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    //Buscamos a todos los usuarios a los que seguimos
    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: "Error en el servidor" });

        if (!follows) return res.status(404).send({ message: "No te sigue ningun usuario" });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            //Objeto completo de todos los follows
            follows
        });
    });
}

//Listado de usuarios que estoy y me estan siguiendo, no paginado
function getMyFollows(req, res) {
    var userId = req.user.sub;
    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('user followed').populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: "Error en el servidor" });

        if (!follows) return res.status(404).send({ message: "No te sigue ningun usuario" });

        return res.status(200).send({ follows });
    });
}


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}