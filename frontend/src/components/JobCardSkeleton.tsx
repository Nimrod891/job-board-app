import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const JobCardSkeleton = () => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Skeleton height="60px" />
      <CardBody>
        <SkeletonText />
      </CardBody>
    </Card>
  );
};

export default JobCardSkeleton;
