// src/controllers/users.controller.js
// Handles HTTP concerns for user resources.

const usersService = require('../services/users.service');
const { validate, schemas } = require('../validation');

// POST /users
async function createUser(req, res) {
  const { value, error } = validate(schemas.userCreation, req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const { email, name } = value;

  try {
    const user = await usersService.createUser({ email, name });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error in createUser:', err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'A user with that email already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createUser,
};

/*
WHY THIS STAYS LEAN:
- Only deals with HTTP status codes and validation.
- Business logic + SQL stay inside the service layer.
*/

