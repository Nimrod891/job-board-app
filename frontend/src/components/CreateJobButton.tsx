import { useState, FormEvent, ChangeEvent } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import useCreateJob, { CreateJobInput } from "../hooks/useCreateJob";
import { JobSummary } from "../hooks/useJobs";

interface CreateJobButtonProps {
  onJobCreated: (job: JobSummary) => void;
}

const formId = "create-job-form";

const CreateJobButton = ({ onJobCreated }: CreateJobButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createJob, isSubmitting, error } = useCreateJob();

  // Track the values typed into the form so we can send them to the backend.
  const [formValues, setFormValues] = useState<CreateJobInput>({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleChange =
    (field: keyof CreateJobInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const resetForm = () =>
    setFormValues({
      title: "",
      company: "",
      location: "",
      description: "",
    });

  const handleClose = () => {
    if (isSubmitting) return; // avoid closing while we are still waiting on the server
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const createdJob = await createJob(formValues);
      onJobCreated(createdJob); // let the parent know so it can refresh the grid
      resetForm();
      onClose();
    } catch {
      // useCreateJob already exposes a friendly error message that stays visible
    }
  };

  const isSubmitDisabled =
    !formValues.title.trim() || !formValues.company.trim() || isSubmitting;

  return (
    <>
      {/* This button lives in the Aside column and opens the editor modal. */}
      <Button colorScheme="teal" width="100%" onClick={onOpen}>
        Create Job
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card variant="outline" borderRadius={10}>
              <CardHeader>
                <Heading size="md">Job card details</Heading>
                <Text color="gray.500" fontSize="sm">
                  Fill in the details of the job you want to post.
                </Text>
              </CardHeader>
              <CardBody
                as="form"
                id={formId}
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={4}
              >
                <FormControl isRequired>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    value={formValues.title}
                    onChange={handleChange("title")}
                    placeholder="e.g. Security Guard"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Company</FormLabel>
                  <Input
                    value={formValues.company}
                    onChange={handleChange("company")}
                    placeholder="e.g. jobapp"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={formValues.location}
                    onChange={handleChange("location")}
                    placeholder="NYC, Berlin..."
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formValues.description}
                    onChange={handleChange("description")}
                    placeholder="Short summary of the role"
                    rows={4}
                  />
                </FormControl>

                {error && (
                  <Text color="red.400" fontSize="sm">
                    {error}
                  </Text>
                )}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="ghost"
              onClick={handleClose}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              type="submit"
              form={formId}
              isLoading={isSubmitting}
              isDisabled={isSubmitDisabled}
            >
              Submit Job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateJobButton;
