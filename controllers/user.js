'use strict'
var bcrypt = require('bcrypt-nodejs');
//Cargamos el modulo de paginación
var mongoosePaginate = require('mongoose-pagination');
//Librería que permite trabajar con archivos
var fs = require('fs');
//Liberia para trabajar con rutas de ficheros
var path = require('path');

//Cargamos el modelo de usuario
var User = require('../models/user');
//Cargamos el modelo de follow
var Follow = require('../models/follow');
//Cargamos el modelo de publicaciones
var Publication = require('../models/publication');

//Importamos el servicio
var jwt = require('../services/jwt');


//Metodo de pruebas
function home(req, res) {
    res.status(200).send({
        message:"funciona"
    });
}

//Metodo de pruebas
function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de nodejs'
    });
}
//registro

function saveUsers(req, res){
  var user = req.user;
  console.log(user);
  if (user) {
    res.status(200).send({
      user
    });
  }
  else {
    res.status(200).send({message: "nada"});

  }
}

function LoginOrRegister(u){
  User.findOne({ email: u.email.toLowerCase() })
    .exec((err, user) => {
        if (err)  console.log("error en el intento de pillar si esta registrado o logeado");
        if (users && users.length >= 1) {
            return user;
          }
        else {
          return false;
        }});
}
//Login
function loginUser(req, res) {
    var params = req.body;

    var profile = params.profile;

    var user = LoginOrRegister(profile);
    //Valida que el email este en la base de datos
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: "Error en la petición" });
        //Compara que la contraseña normal coincida con la contraseña cifrada
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //Devolvemos y generamos el token con los datos del usuario.
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });

                    } else {
                        //No devolvemos la contraseña para más seguridad
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }

                    //Devolver datos de usuario
                } else {
                    return res.status(404).send({ message: "El usaurio no se ha podido identificar" })
                }
            });
        } else {
            return res.status(404).send({ message: "El usaurio no se ha podido identificar" })
        }
    })
}

//Conseguir datos de usuario
function getUser(req, res) {
    console.log(req);
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: "Error en la petición" });

        if (!user) return res.status(404).send({ message: "El usaurio no existe" });

        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
}

//Funcion syncrona
async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id }).exec()
            .then((following) => {

                return following;
            })
            .catch((err) => {
                return handleerror(err);
            });
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id }).exec()
            .then((followed) => {

                return followed;
            })
            .catch((err) => {
                return handleerror(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch (e) {
        console.log(e);
    }
}

//Devolver un listado de usaurios paginados
function getUsers(req, res) {
    //Recojemos el usaurio que este logueado en este momento
    var identity_user_id = req.user.sub;

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    //Buscamos todos los usuarios y los oredenas por ID, le pasamos la paginación
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: "Error en la petición" });

        //Si el usaurio no existe
        if (!users) return res.status(404).send({ message: "No hay usuarios disponibles" });

        followUserIds(identity_user_id).then((value) => {
            //Construimos el objeto con los datos que nos interese
            return res.status(200).send({
                //Todos los datos del ususario
                users,
                //Usuarios que siguimos
                users_following: value.following,
                //Usuarios que nos siguen
                users_follow_me: value.followed,
                //El total de usuarios
                total,
                //Número de páginas totales
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}

async function followUserIds(user_id) {


    var following = await Follow.find({ user: user_id }).select({ _id: 0, __v: 0, user: 0 })

        .exec()

        .then((follows) => {
            //console.log(follows);
            var follows_clean = [];


            follows.forEach((follow) => {

                follows_clean.push(follow.followed);

            });


            return follows_clean;

        })

        .catch((err) => {

            return handleError(err);

        });




    var followed = await Follow.find({ followed: user_id }).select({ _id: 0, __v: 0, followed: 0 })

        .exec()

        .then((follows) => {

            var follows_clean = [];


            follows.forEach((follow) => {

                follows_clean.push(follow.user);

            });


            return follows_clean;

        })

        .catch((err) => {

            return handleError(err);

        });


    return {
        following: following,
        followed: followed
    };
}

const getCounters = (req, res) => {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    })
}

const getCountFollow = async (user_id) => {
    try {
        // Lo hice de dos formas. "following" con callback de countDocuments y "followed" con una promesa
        let following = await Follow.countDocuments({ "user": user_id }, (err, result) => { return result });
        let followed = await Follow.countDocuments({ "followed": user_id }).then(count => count);
        let publications = await Publication.countDocuments({ "user": user_id }).then(count => count);

        return { following, followed, publications }

    } catch (e) {
        console.log(e);
    }
}


//Edición de datos de usuario
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    //Borrar la propiedad password
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: "No tienes permiso para actualizar los datos de usuario" });
    }

    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }
        ]}).exec((err, users) => {

        var user_isstet = false;
        users.forEach((user) => {
            if (user && user._id != userId) user_isstet = true;
        });

        if(user_isstet) return res.status(404).send({ message: "Ese nick ya existe, prueba con otro." });

        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: "Error en la petición" });

            if (!userUpdated) return res.status(404).send({ message: "No se ha podido actualizar el usuario" });

            //Nos devuelve el objeto anterior antes de ser actualizado
            return res.status(200).send({ user: userUpdated })
        });
    });
}

//Subir archivos de imagen/avatar de usuario
function uploadImage(req, res) {
    var userId = req.params.id;

    if(userId != req.user.sub){
      return res.status(500).send({ message: "No tienes permisos para actualizar los datos del usuario" })
    }

    if (req.files) {
        //Cojemos la ruta de la imagen
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);
        //Guardamos el nombre del archivo
        var file_name = file_split[2];
        console.log(file_name);

        //Guardamos el string(nombre de la imagen) apartir del . para cortar la extension de la imagen
        var ext_split = file_name.split('\.');
        console.log(ext_split);
        //Extensión del archivo en la posición 1 porque la 0 es el nombre de la imagen
        var file_ext = ext_split[1];

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, "No tienes permiso para actualizar los datos de usuario");
        }

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (!userUpdated) return res.status(404).send({ message: "No se ha podido actualizar el usuario" });

                //Nos devuelve el objeto anterior antes de ser actualizado
                return res.status(200).send({ user: userUpdated })
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

//Exportamos el metodo para poder usarlo en otros ficheros
module.exports = {
    home,
    pruebas,
    saveUsers,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}
