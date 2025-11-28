import React from "react";
import { JobSummary } from "../hooks/useJobs";
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

interface JobCardProps {
  job: JobSummary;
  /**
   * The parent can pass a callback so it knows which job was clicked.
   * Keeping the callback optional lets us keep using JobCard in read-only spots.
   */
  onSelect?: (job: JobSummary) => void;
}

const JobCard = ({ job, onSelect }: JobCardProps) => {
  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      cursor="pointer"
      role="button"
      tabIndex={0}
      /**
       * Clicking the card notifies the parent JobGrid about which job was selected.
       * We keep the handler inline so the component stays tiny and readable.
       */
      onClick={() => onSelect?.(job)}
      /**
       * Let keyboard users open the modal by pressing Enter/Space while focused.
       * Chakra cards are simple divs, so we wire up the key handler ourselves.
       */
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(job);
        }
      }}
      _hover={{ shadow: "lg" }}
    >
      <CardHeader>
        <Heading size="md">{job.title}</Heading>
        <Text color="gray.500">{job.company}</Text>
      </CardHeader>
      <CardBody>
        {/* These extra fields keep the cards and the creation modal visually aligned. */}
        {job.location && (
          <Text fontSize="sm" color="gray.600">
            {job.location}
          </Text>
        )}
        {job.description && (
          <Text fontSize="sm" color="gray.600" mt={3} noOfLines={3}>
            {job.description}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export default JobCard;
