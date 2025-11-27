// src/controllers/jobs.controller.js
// Handles HTTP requests/responses and delegates to the service layer.

const jobsService = require('../services/jobs.service');

// GET /jobs
async function getAllJobs(req,res){
    try{
        const jobs = await jobsService.getAllJobs();
        res.json(jobs);
    }catch(err){
        console.error('Error in getAllJobs: ', err);
        res.status(500).json({error: 'Internal server error'});
        
    }
}

// GET /jobs/:id
async function getJobById(req, res){
    const jobId = req.params.id;

    try {
        const job = await jobsService.getJobWithRegistrations(jobId);

        if(!job){
            // If service returns null the job doesn't exist
            return res.status(404).json({error: 'Job not found'});
        }
        res.json(job);
    }catch(err){
        console.error("Error in getJobById: ", err);
        res.status(500).json({error: 'Internal server error'});
    }
}

// POST /jobs
async function createJob(req, res){
    const { title, company, location, description } = req.body;

    // Basic validation according to API logic
    if (!title || !company) {
        return res.status(400).json({error: 'Job title and company name are required'});
    }
    try {
        const newJob = await jobsService.createJob({
            title,
            company,
            location,
            description,
        });

        res.status(201).json(newJob);
    } catch(err){
        console.error("Error in createJob:", err);
        res.status(500).json({error: 'Internal server error'})
    }
}

// POST /jobs/:id/registrations
async function addRegistration(req, res){
    const jobId = req.params.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({error: 'Email is required'});
    }
    try {
        const result = await jobsService.addRegistration(jobId, email);
        
        if(result==='JOB_NOT_FOUND'){
            return res.status(404).json({error: 'Job not found'});
        }

        res.status(201).json({success: true});
    } catch(err){
        console.error("Error in addRegistration:", err);

        // Handle duplicate registration (unique constraint)
        if(err.code==='23505'){
            return res
            .status(409)
            .json({error: 'This email is already registered for this job'});
    }

    res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    addRegistration,
};
/*WHY ITS BETTER:
 - Controllers only care about HTTP:
    - reading req
    - choosing status codes
    - sending JSON
- You can change DB details (SQL, schema) without touching controllers
- Easy to test services seperately from HTTP
 */
