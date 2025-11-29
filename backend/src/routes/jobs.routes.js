// src/routes/jobs.routes.js
// Defines the HTTP routes and connects them to the controller functions.

const express = require('express');
const router = express.Router();

const jobsController = require('../controllers/jobs.controller');
const requireAuth = require('../middleware/auth');

// GET /jobs - list all jobs
router.get("/", jobsController.getAllJobs);

// GET /jobs/:id - get a single job and its registrations
router.get("/:id", jobsController.getJobById);

// POST /jobs - create a new job (requires auth so we know the owner)
router.post("/", requireAuth, jobsController.createJob);

// POST /jobs/:id/registrations - add a  registration email to a job
router.post("/:id/registrations", jobsController.addRegistration);

// DELETE /jobs/:id/registrations - owner removes a registration
router.delete("/:id/registrations", requireAuth, jobsController.removeRegistration);

module.exports = router;

 /* WHY THIS IS BETTER:
  - The router file is now just a "URL → function" map.
  - No business logic here, no DB calls.
  - Much easier to scan and see what endpoints exist.
*/