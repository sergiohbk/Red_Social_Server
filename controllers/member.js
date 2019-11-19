'use strict'

var Member = require('../models/member')

function memberSave(req, res){

  var params = req.body;

  var member = new Member();
  member.character = req.chId;
  member.rol = params.rol;
  if (params.moderation == null) {
    params.moderation = false;
  }
  member.moderation = params.moderation;

  //realizar comprobaciones, tendra que llegar un mensaje privado y este aceptar su solicitud
  member.save((err, memberStored) => {
      if (err) return res.status(500).send({ message: "Error al guardar el personaje en el rol" });

      if (!memberStored) return res.status(404).send({ message: "el personaje no se ha guardado en el rol" });

      return res.status(200).send({ member: memberStored });
  });
}

module.exports = {
  memberSave
}
