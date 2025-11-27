import { SimpleGrid, Text } from "@chakra-ui/react";
import JobCard from "./JobCard";
import useJobs from "../hooks/useJobs";

const JobGrid = () => {
  const { jobs, error } = useJobs();

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
        padding="10px"
        spacing={10}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default JobGrid;
