import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import apiClient from "../services/api-client";

const useDeleteRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const remove = useCallback(async (jobId: string, email: string) => {
    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.delete(`/jobs/${jobId}/registrations`, {
        data: { email },
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const friendlyMessage =
        axiosError.response?.data?.error ??
        axiosError.message ??
        "Something went wrong while deleting the registration.";
      setError(friendlyMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetStatus = useCallback(() => {
    setError("");
  }, []);

  return { remove, isSubmitting, error, resetStatus };
};

export default useDeleteRegistration;

