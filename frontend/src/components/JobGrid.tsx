import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
import apiClient from "../services/api-client";

interface Job {
  id: string;
  title: string;
}
interface FetchJobsResponse {
  count: number;
  results: Job[];
}

const JobGrid = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<Job[]>("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => setError(err.message));
  }, []);
  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </>
  );
};

export default JobGrid;
