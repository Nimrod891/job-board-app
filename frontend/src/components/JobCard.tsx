import React from "react";
import { Job } from "../hooks/useJobs";
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card borderRadius={10} overflow="hidden">
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
