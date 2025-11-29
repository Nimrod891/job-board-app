// src/middleware/auth.js
// Verifies Bearer tokens and attaches the authenticated user to req.user.

const authService = require('../services/auth.service');
const usersService = require('../services/users.service');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = authService.verifyToken(token);
    const user = await usersService.getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;

/*
WHY THIS IS USEFUL:
- Centralizes auth so routes can just plug the middleware in.
- req.user keeps future owner-only checks simple (job deletions, etc.).
*/

