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
  IconButton,
} from "@chakra-ui/react";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import useJob from "../hooks/useJob";
import useRegisterForJob from "../hooks/useRegisterForJob";
import { useAuth } from "../contexts/AuthContext";
import useDeleteRegistration from "../hooks/useDeleteRegistration";

interface JobDetailsModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatPostedLabel = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffSeconds = Math.max(Math.floor(diffMs / 1000), 0);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  // Fallback to local date string
  return created.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const JobDetailsModal = ({ jobId, isOpen, onClose }: JobDetailsModalProps) => {
  /**
   * Mobile UX requirement: we keep the modal centered and cap its width.
   * Chakra's useBreakpointValue lets us pick a compact size for phones so the
   * dialog never spans edge-to-edge.
   */
  const modalSize = useBreakpointValue({ base: "xs", md: "lg" });

  const { job, error, isLoading, refetch } = useJob(jobId);
  const { user } = useAuth();
  const {
    remove: deleteRegistration,
    isSubmitting: isDeleting,
    error: deleteError,
    resetStatus: resetDeleteStatus,
  } = useDeleteRegistration();
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
      resetDeleteStatus();
    }
  }, [isOpen, resetStatus, resetDeleteStatus]);

  useEffect(() => {
    if (jobId) {
      setEmail("");
      setEmailError("");
      resetStatus();
      resetDeleteStatus();
    }
  }, [jobId, resetStatus, resetDeleteStatus]);

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
  const canManage = user && job?.owner_user_id === user.id;

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
                  <Box
                    maxH={{ base: 32, md: 48 }}
                    overflowY="auto"
                    pr={2}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="whiteAlpha.200"
                  >
                    <List spacing={2}>
                      {registrations.map((registration) => (
                        <ListItem
                          key={registration}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <ListIcon as={CheckCircleIcon} color="green.400" />
                            <Text>{registration}</Text>
                          </Box>
                          {canManage && (
                            <IconButton
                              aria-label={`Remove ${registration}`}
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              isDisabled={isDeleting}
                              onClick={() =>
                                deleteRegistration(jobId, registration).then(
                                  () => refetch()
                                )
                              }
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
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
                  {deleteError && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {deleteError}
                    </Alert>
                  )}
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
