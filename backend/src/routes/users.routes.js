// src/routes/users.routes.js
// Maps /users endpoints to controller handlers.

const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');

// POST /users - create a new user
router.post('/', usersController.createUser);

module.exports = router;

/*
WHY THIS HELPS:
- Keeps the URL → controller wiring in one simple place.
*/

