import React from "react";
import { Job } from "../hooks/useJobs";
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card borderRadius={10} overflow="hidden" width="200px">
      <CardHeader>
        <Heading size="md">{job.title}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{job.company}</Text>
      </CardBody>
    </Card>
  );
};

export default JobCard;
