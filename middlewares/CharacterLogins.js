'use strict'

exports.getCharacterLogin =  function(req, res, next){

    if(!req.headers.chlogin){
      return res.status(403).send({ message: 'La petición no tiene el id del perosnaje seleccionado' });
    }

    req.chId = req.headers.chlogin;

    next();
}
