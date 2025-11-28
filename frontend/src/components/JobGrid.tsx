import { useState } from "react";
import { SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import JobCard from "./JobCard";
import useJobs, { JobSummary } from "../hooks/useJobs";
import JobCardSkeleton from "./JobCardSkeleton";
import JobDetailsModal from "./JobDetailsModal";

interface JobGridProps {
  refreshKey?: number;
}

const JobGrid = ({ refreshKey = 0 }: JobGridProps) => {
  // refreshKey is bumped by the parent whenever a new job gets created.
  const { jobs, error, isLoading } = useJobs(refreshKey);
  const skeletons = [1, 2, 3, 4, 5];
  /**
   * We keep the currently selected job at this level so we can show the modal
   * without each card having to manage its own state.
   */
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleJobSelect = (job: JobSummary) => {
    setSelectedJobId(job.id);
    onOpen();
  };

  const handleModalClose = () => {
    onClose();
    setSelectedJobId(null);
  };

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
          <JobCard key={job.id} job={job} onSelect={handleJobSelect} />
        ))}
      </SimpleGrid>
      {/* The modal lives here so it only renders once and reuses the selected job data. */}
      <JobDetailsModal
        jobId={selectedJobId}
        isOpen={isOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default JobGrid;
