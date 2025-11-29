// src/routes/auth.routes.js
// Exposes signup/login endpoints for lightweight auth.

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

/*
Keeping auth isolated here means we can later add refresh/logout/etc.
without touching unrelated routers.
*/

