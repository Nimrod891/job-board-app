import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  created_at: string;
  owner_user_id: string;
}

/**
 * Allows components to re-fetch the jobs list by bumping refreshKey.
 * We default to 0 so existing consumers keep working without passing anything.
 */
const useJobs = (refreshKey = 0) => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    apiClient
      .get<JobSummary[]>("/jobs", { signal: controller.signal })
      .then((res) => setJobs(res.data))
      .catch((err) => {
        if (err.name === "CanceledError") return;
        setError(err.message);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [refreshKey]); // re-run whenever refreshKey changes

  return { jobs, error, isLoading };
};

export default useJobs;