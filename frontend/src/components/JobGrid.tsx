import { SimpleGrid, Text } from "@chakra-ui/react";
import JobCard from "./JobCard";
import useJobs from "../hooks/useJobs";
import JobCardSkeleton from "./JobCardSkeleton";

interface JobGridProps {
  refreshKey?: number;
}

const JobGrid = ({ refreshKey = 0 }: JobGridProps) => {
  // refreshKey is bumped by the parent whenever a new job gets created.
  const { jobs, error, isLoading } = useJobs(refreshKey);
  const skeletons = [1, 2, 3, 4, 5];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
        padding="20px"
        spacing={10}
      >
        {isLoading &&
          skeletons.map((skeleton) => <JobCardSkeleton key={skeleton} />)}
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default JobGrid;
