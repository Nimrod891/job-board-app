import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import useJob from "../hooks/useJob";
import useRegisterForJob from "../hooks/useRegisterForJob";

interface JobDetailsModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Returns a human-friendly label for when the job was created.
 * - <5 minutes → "just now"
 * - <60 minutes → "X minutes ago"
 * - <24 hours → "X hours ago"
 * - otherwise → locale date string
 */
const formatPostedLabel = (createdAt: string) => {
  /**
   * Backend timestamps come from PostgreSQL which may serialize without a timezone.
   * When that happens the browser assumes the string is already in the user's local
   * timezone, which can make "just created" items look a few hours old.
   * We detect the absence of a timezone suffix and treat those strings as UTC so
   * everyone sees consistent relative times.
   */
  //const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(createdAt);
  //const safeTimestamp = hasTimezone ? createdAt : `${createdAt}Z`;
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMinutes < 5) return "just now";
  if (diffMinutes < 60) {
    const minuteLabel = diffMinutes === 1 ? "minute" : "minutes";
    return `${diffMinutes} ${minuteLabel} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    const hourLabel = diffHours === 1 ? "hour" : "hours";
    return `${diffHours} ${hourLabel} ago`;
  }

  return createdDate.toLocaleDateString();
};

const JobDetailsModal = ({ jobId, isOpen, onClose }: JobDetailsModalProps) => {
  /**
   * Mobile UX requirement: we keep the modal centered and cap its width.
   * Chakra's useBreakpointValue lets us pick a compact size for phones so the
   * dialog never spans edge-to-edge.
   */
  const modalSize = useBreakpointValue({ base: "xs", md: "lg" });

  const { job, error, isLoading, refetch } = useJob(jobId);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const {
    register: registerForJob,
    isSubmitting: isRegistering,
    error: registrationError,
    wasSuccessful,
    resetStatus,
  } = useRegisterForJob();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setEmailError("");
      resetStatus();
    }
  }, [isOpen, resetStatus]);

  useEffect(() => {
    if (jobId) {
      setEmail("");
      setEmailError("");
      resetStatus();
    }
  }, [jobId, resetStatus]);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (emailError) setEmailError("");
    if (registrationError || wasSuccessful) {
      resetStatus();
    }
    setEmail(event.target.value);
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!jobId) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      await registerForJob(jobId, trimmed);
      setEmail("");
      refetch();
    } catch {
      // Handler in hook sets the appropriate error message.
    }
  };

  /**
   * If there is no selected job id we abort rendering so we never show stale data
   * while the user is still picking something.
   */
  if (!jobId) return null;

  const postedLabel = job ? formatPostedLabel(job.created_at) : "";
  const registrations = job?.registrations ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={modalSize}
      motionPreset="scale"
    >
      <ModalOverlay />
      {/* mx keeps some breathing room on tiny screens without affecting desktop. */}
      <ModalContent mx={{ base: 4, md: 0 }}>
        <ModalHeader>
          <Text fontWeight="bold">{job?.title ?? "Loading job details…"}</Text>
          {job?.company && (
            <Text color="gray.500" fontSize="sm">
              {job.company}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Center py={10}>
              <Spinner size="lg" color="blue.500" />
            </Center>
          )}
          {!isLoading && error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          {!isLoading && !error && job && (
            <Stack spacing={4}>
              {job.location && (
                <Box>
                  <Badge colorScheme="blue" mr={2}>
                    Location
                  </Badge>
                  <Text as="span">{job.location}</Text>
                </Box>
              )}
              <Box>
                <Badge colorScheme="purple" mr={2}>
                  Posted
                </Badge>
                <Text as="span">{postedLabel}</Text>
              </Box>
              {job.description && (
                <Text color="white" whiteSpace="pre-wrap">
                  {/* Full description with pre-wrap so formatting/newlines are preserved. */}
                  {job.description}
                </Text>
              )}
              <Divider />
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Registrations
                </Text>
                {registrations.length > 0 ? (
                  <List spacing={2}>
                    {registrations.map((registration) => (
                      <ListItem
                        key={registration}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <ListIcon as={CheckCircleIcon} color="green.400" />
                        <Text>{registration}</Text>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text color="gray.500">
                    Nobody has registered for this role yet.
                  </Text>
                )}
              </Box>
              <Divider />
              <Box
                as="form"
                onSubmit={handleRegisterSubmit}
                aria-label="Register for this job"
              >
                <Stack spacing={3}>
                  <FormControl isInvalid={!!emailError}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      autoComplete="email"
                    />
                    {emailError && (
                      <FormErrorMessage>{emailError}</FormErrorMessage>
                    )}
                  </FormControl>
                  {registrationError && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {registrationError}
                    </Alert>
                  )}
                  {wasSuccessful && (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      You're registered for this role.
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    colorScheme="green"
                    width="100%"
                    isLoading={isRegistering}
                    isDisabled={!job}
                  >
                    Register
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* Plain close button keeps the action obvious for beginners. */}
          <Button onClick={onClose} colorScheme="blue" width="100%">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JobDetailsModal;
