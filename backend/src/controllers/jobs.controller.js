// src/controllers/jobs.controller.js
// Handles HTTP requests/responses and delegates to the service layer.

const jobsService = require('../services/jobs.service');
const { validate, schemas } = require('../validation');

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
    const { value: params, error } = validate(schemas.jobIdParam, req.params);
    if (error) {
        return res.status(400).json({error});
    }
    const jobId = params.id;

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
    const { value, error } = validate(schemas.createJob, req.body);
    if (error) {
        return res.status(400).json({error});
    }
    const { title, company, location, description } = value;
    const ownerUserId = req.user?.id;

    if (!ownerUserId) {
        return res.status(401).json({error: 'Authentication is required to create jobs'});
    }
    try {
        const newJob = await jobsService.createJob({
            title,
            company,
            location,
            description,
            ownerUserId,
        });

        res.status(201).json(newJob);
    } catch(err){
        console.error("Error in createJob:", err);
        res.status(500).json({error: 'Internal server error'})
    }
}

// POST /jobs/:id/registrations
async function addRegistration(req, res){
    const { value: params, error: paramsError } = validate(schemas.jobIdParam, req.params);
    if (paramsError) {
        return res.status(400).json({error: paramsError});
    }
    const jobId = params.id;
    const { value, error } = validate(schemas.registration, req.body);
    if (error) {
        return res.status(400).json({error});
    }
    const { email } = value;

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

// DELETE /jobs/:id/registrations
async function removeRegistration(req, res){
    const { value: params, error: paramsError } = validate(schemas.jobIdParam, req.params);
    if (paramsError) {
        return res.status(400).json({error: paramsError});
    }
    const jobId = params.id;
    const { value, error } = validate(schemas.registration, req.body);
    if (error) {
        return res.status(400).json({error});
    }
    const { email } = value;
    const ownerUserId = req.user?.id;

    if (!ownerUserId) {
        return res.status(401).json({error: 'Authentication is required'});
    }

    try {
        const result = await jobsService.removeRegistration(jobId, email, ownerUserId);

        if (result === 'JOB_NOT_FOUND') {
            return res.status(404).json({error: 'Job not found'});
        }

        if (result === 'FORBIDDEN') {
            return res.status(403).json({error: 'Only the job owner can delete registrations'});
        }

        if (result === 'REGISTRATION_NOT_FOUND') {
            return res.status(404).json({error: 'Registration not found for this job'});
        }

        res.json({success: true});
    } catch (err) {
        console.error("Error in removeRegistration:", err);
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    addRegistration,
    removeRegistration,
};
/*WHY ITS BETTER:
 - Controllers only care about HTTP:
    - reading req
    - choosing status codes
    - sending JSON
- You can change DB details (SQL, schema) without touching controllers
- Easy to test services seperately from HTTP
 */
