import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "../services/api-client";
import { JobSummary } from "./useJobs";

export interface CreateJobInput {
  title: string;
  company: string;
  location?: string;
  description?: string;
}

/**
 * Encapsulates the POST /jobs call so components only worry about UI state.
 */
const useCreateJob = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createJob = async (payload: CreateJobInput): Promise<JobSummary> => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.post<JobSummary>("/jobs", payload);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const friendlyMessage =
        axiosError.response?.data?.error ??
        axiosError.message ??
        "Something went wrong while creating the job.";
      setError(friendlyMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, isSubmitting, error };
};

export default useCreateJob;

