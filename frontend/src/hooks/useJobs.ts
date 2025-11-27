import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

interface Job {
    id: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
    created_at: string;
    registrations: string[];
  }
  interface FetchJobsResponse {
    count: number;
    results: Job[];
  }

const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<Job[]>("/jobs", { signal: controller.signal })
      .then((res) => setJobs(res.data))
      .catch((err) => { 
        if (err.name === 'CanceledError') return;
        setError(err.message);
      });

      return () => controller.abort();
  }, []);
  

  return { jobs, error };
}

export default useJobs;