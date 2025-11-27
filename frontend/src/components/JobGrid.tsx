import { Text } from "@chakra-ui/react";
import useJobs from "../hooks/useJobs";

const JobGrid = () => {
  const { jobs, error } = useJobs();

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
