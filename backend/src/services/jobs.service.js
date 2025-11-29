// src/services/jobs.service.js
// Contains the data access logic using the db helper

const db = require('../db');
const {randomUUID} = require('crypto');

// Return all jobs (simple list, no registrations)
async function getAllJobs(){
    const result = await db.query(
        `SELECT id, title, company, location, description, owner_user_id, created_at
        FROM jobs
        ORDER BY created_at DESC`
    );
    return result.rows;

}

// Return a single job + its registrations
async function getJobWithRegistrations(jobId){
    const jobResult = await db.query(
        `
        SELECT id, title, company, location, description, owner_user_id, created_at
        FROM jobs
        WHERE id=$1
        `, [jobId]
    );
    if(jobResult.rows.length===0){
        return null; // job not found
    }

    const job = jobResult.rows[0];

    // Get registrations for this job
    const regResult = await db.query(
        `
        SELECT email, created_at
        FROM registrations
        WHERE job_id=$1
        ORDER BY created_at ASC
        `,
        [jobId]
    );
    return {
        // Spread operator to copy all job properties and add registrations
        ...job,
        // Map the registrations to an array of emails
        registrations: regResult.rows.map((r)=>r.email),
    };
}

// Create a new job in the database
async function createJob({title, company, location, description, ownerUserId}){
    const id = randomUUID();

    const result = await db.query(
        `
        INSERT INTO jobs (id, title, company, location, description, owner_user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, title, company, location, description, owner_user_id, created_at
        `,
        [id, title, company, location || null, description || null, ownerUserId]
    );

    return result.rows[0];
}

// Add a registration for a given job
async function addRegistration(jobId, email){
    // Check the job exists
    const jobResult = await db.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if(jobResult.rows.length===0){
        return 'JOB_NOT_FOUND';
    }
    const id=randomUUID();
    await db.query(
        `
        INSERT INTO registrations (id, job_id, email)
        VALUES ($1, $2, $3)
        `,
        [id, jobId, email]
    );
    return "OK";
}

module.exports = {
    getAllJobs,
    getJobWithRegistrations,
    createJob,
    addRegistration,
};
/* WHY ITS BETTER:
 - If the DB changes( Postgres-> mySQL, new columns, joins),
    you only touch this file and the db.js.
 - Controllers don't know SQL exists. They just call services.
 - Easier to add bonus logic here (filters, pagination, ownership) without
   touching the HTTP code
   */