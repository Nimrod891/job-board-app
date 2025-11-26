// src/app.js
// Creates the Express application, applies middleware, and mounts routes.

const express = require('express');
const cors = require('cors');
const jobsRouter = require('./routes/jobs.routes');

const app = express();

// Middleware

// Parse incoming JSON bodies so req.body is a JS object

app.use(express.json());
// Allow the frontend or postman to call this API
app.use(cors());
// Routes

// Simple health check endpoint for debugging
app.get('/health', (req, res) => {
    res.json({status: 'ok'});
});

// Mount the jobs routes
app.use('/jobs', jobsRouter);

module.exports = app;

/*
  WHY THIS FILE IS NICE:
  - All HTTP "plumbing" lives here: middleware, route mounting.
  - No business logic, no SQL, nothing about jobs themselves.
  - Easier to scan: you see the entire public surface of the backend in one place.
*/