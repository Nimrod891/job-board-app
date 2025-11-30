// src/controllers/auth.controller.js
// Minimal signup/login flow so the API can know who owns a job.

const usersService = require('../services/users.service');
const authService = require('../services/auth.service');
const { validate, schemas } = require('../validation');

// POST /auth/signup
async function signup(req, res) {
  const { value, error } = validate(schemas.signup, req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const { email, name } = value;

  try {
    const existing = await usersService.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A user with that email already exists' });
    }

    const user = await usersService.createUser({ email, name });
    const token = authService.issueTokenForUser(user);

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('Error in signup:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /auth/login
async function login(req, res) {
  const { value, error } = validate(schemas.login, req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const { email } = value;

  try {
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = authService.issueTokenForUser(user);
    return res.json({ token, user });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signup,
  login,
};

/*
SIMPLE BY DESIGN:
- We deliberately skip passwords/verification for now.
- Clients just store the token and send it as Bearer auth when creating jobs.
- Future enhancements (passwords, refresh tokens) can live here without
  touching unrelated controllers.
*/

