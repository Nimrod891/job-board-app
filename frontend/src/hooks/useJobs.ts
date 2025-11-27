import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

export interface Job {
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
    const [isLoading, setIsLoading] = useState(false);
    

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    apiClient
      .get<Job[]>("/jobs", { signal: controller.signal })
      .then((res) => setJobs(res.data))
      .catch((err) => { 
        if (err.name === 'CanceledError') return;
        setError(err.message);
      }
    )
    .finally(() => setIsLoading(false));

      return () => controller.abort();
  }, []);
  

  return { jobs, error, isLoading };
}

export default useJobs;