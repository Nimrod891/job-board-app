// src/services/auth.service.js
// Tiny helper around JWT so controllers/middleware can issue + verify tokens.

const jwt = require('jsonwebtoken');
//TODO: Add setting JWT_SECRET to .env in the README
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = process.env.JWT_TTL || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

/**
 * Generates a signed token for the provided user.
 * Only stores the user id so payloads stay small.
 */
function issueTokenForUser(user) {
  return jwt.sign(
    {
      sub: user.id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

/**
 * Verifies a token and returns its payload.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  issueTokenForUser,
  verifyToken,
};

/*
NOTES:
- We intentionally keep the payload lean so future claims (roles, scopes)
  can be added without changing every controller.

*/

