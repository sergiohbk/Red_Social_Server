'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//Carga el framework
const app = express();
const cors = require('cors');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-v11492p0.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'http://localhost:3900/api',
  issuer: `https://dev-v11492p0.auth0.com/`,
  algorithms: ['RS256']
});

//Cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');
var characters_routes = require('./routes/characters');
var rol_routes = require('./routes/rol');
var member_routes =  require('./routes/member');
var publicationsrol_routes = require('./routes/publicationsRol');
var like_routes =  require('./routes/like');

const corsOptions =  {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
//middlewares
//cada vez que hagamos peticiones de datos nos la convierte a JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', characters_routes);
app.use('/api', rol_routes);
app.use('/api', member_routes);
app.use('/api', publicationsrol_routes);
app.use('/api', like_routes);


app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

//Exportar
module.exports = app;
