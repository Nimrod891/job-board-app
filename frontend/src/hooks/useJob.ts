import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { JobSummary } from "./useJobs";

export interface JobDetails extends JobSummary {
  registrations: string[];
}

/**
 * Fetches a single job (including registrations) when given an id.
 * We use this inside the modal so the list endpoint can stay lightweight.
 */
const useJob = (jobId: string | null) => {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = () => setRefreshIndex((index) => index + 1);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setError("");
      setIsLoading(false);
      if (refreshIndex !== 0) setRefreshIndex(0);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError("");
    setJob(null);

    // we don't use a promise here because inside useEffect we can't return a promise.
    apiClient
      .get<JobDetails>(`/jobs/${jobId}`, { signal: controller.signal })
      .then((response) => setJob(response.data))
      .catch((err) => {
        if (err.name === "CanceledError") return;
        setError(err.message ?? "Failed to load the job details.");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [jobId, refreshIndex]);

  return { job, error, isLoading, refetch };
};

export default useJob;

