const createError = require('http-errors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const oktaVerifierConfig = require('../../config/okta');
const oktaJwtVerifier = new OktaJwtVerifier(oktaVerifierConfig.config);

/**
 * A simple middleware that asserts valid Okta idToken and sends 401 responses
 * if the token is not present or fails validation. If the token is valid its
 * contents are attached to req.user
 */
const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);
    if (!match) throw new Error(authHeader);
    const token = match[1];
    oktaJwtVerifier
      .verifyAccessToken(token, oktaVerifierConfig.expectedAudience)
      .then(async (data) => {
        if (data.claims.email) {
          req.user = data.claims.email;
        } else {
          throw new Error('Unable to create or find user.');
        }
        next();
      });
  } catch (err) {
    next(createError(401, err.message));
  }
};

module.exports = authRequired;
