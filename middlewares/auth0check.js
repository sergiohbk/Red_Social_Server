'use strict'


const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

exports.checkJwt = jwt({
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
