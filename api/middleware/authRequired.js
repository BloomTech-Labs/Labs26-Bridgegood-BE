const createError = require('http-errors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const oktaVerifierConfig = require('../../config/okta');
const Users = require('../users/userModel');
const oktaJwtVerifier = new OktaJwtVerifier(oktaVerifierConfig.config);

const makeUserObj = (claims) => {
  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name,
  };
};
/**
 * A simple middleware that asserts valid Okta idToken and sends 401 responses
 * if the token is not present or fails validation. If the token is valid its
 * contents are attached to req.user
 */
const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) throw new Error('Missing idToken');

    const idToken = match[1];
    oktaJwtVerifier
      .verifyAccessToken(idToken, oktaVerifierConfig.expectedAudience)
      .then(async (data) => {
        const jwtUserObj = makeUserObj(data.claims);
        const user = await Users.findOrCreateProfile(jwtUserObj);
        if (user) {
          req.user = user;
        } else {
          throw new Error('Unable to process idToken');
        }
        next();
      });
  } catch (err) {
    next(createError(401, err.message));
  }
};

module.exports = authRequired;
