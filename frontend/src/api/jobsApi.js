// src/api/jobsApi.js
// Small helper functions to talk to your backend API

const API_BASE_URL = 'http://localhost:3000';


/**
 * Fetch all jobs from the backend

 */
export async function fetchJobs(){
    const response = await fetch(`${API_BASE_URL}/jobs`);

    if (!response.ok){
        throw new Error('Failed to fetch jobs');
    }
    return response.json();
}

/**
 * Fetch a single job (including its registrations)
 */
export async function fetchJobById(jobId){
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);

    if(!response.ok){
        if(response.status===404){
            throw new Error("Job not found");
        }
        throw new Error('Failed to fetch job');
    }
    return response.json();
}

/**
 * Add a new registration for a job
 */
export async function registerEmail(jobId, email) {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/registrations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if(!response.ok){
        const errorBody=await response.json().catch(()=>({}))
        const errorMessage=errorBody.error || 'Failed to register email';
        throw new Error(errorMessage);
    }
    return response.json();
}

