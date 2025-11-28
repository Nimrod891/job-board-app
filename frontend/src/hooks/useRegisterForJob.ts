import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "../services/api-client";

/**
 * Encapsulates POST /jobs/:id/registrations so components can stay lean.
 */
const useRegisterForJob = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const register = async (jobId: string, email: string) => {
    if (!jobId) {
      throw new Error("Job id is required to register");
    }

    setIsSubmitting(true);
    setError("");
    setWasSuccessful(false);

    try {
      await apiClient.post(`/jobs/${jobId}/registrations`, { email });
      setWasSuccessful(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const friendlyMessage =
        axiosError.response?.data?.error ??
        axiosError.message ??
        "Something went wrong while registering for this job.";
      setError(friendlyMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = useCallback(() => {
    setError("");
    setWasSuccessful(false);
  }, []);

  return { register, isSubmitting, error, wasSuccessful, resetStatus };
};

export default useRegisterForJob;


