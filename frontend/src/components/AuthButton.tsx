import { useState, FormEvent, ChangeEvent } from "react";
import { AxiosError } from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useAuth, AuthUser } from "../contexts/AuthContext";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

const formId = "auth-form";

const AuthButton = () => {
  const { setAuthState } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authValues, setAuthValues] = useState({ email: "", name: "" });
  const [authError, setAuthError] = useState("");
  const [authAction, setAuthAction] = useState<"signup" | "login" | null>(null);

  const handleAuthInputChange =
    (field: "email" | "name") => (event: ChangeEvent<HTMLInputElement>) => {
      setAuthValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleClose = () => {
    if (authAction) return;
    setAuthError("");
    onClose();
  };

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nativeEvent = event.nativeEvent as SubmitEvent & {
      submitter?: HTMLElement;
    };
    const intentAttr = nativeEvent.submitter?.getAttribute("data-intent");
    if (intentAttr !== "signup" && intentAttr !== "login") return;

    const intent = intentAttr as "signup" | "login";
    const trimmedEmail = authValues.email.trim();

    if (!trimmedEmail) {
      setAuthError("Email is required");
      return;
    }

    setAuthError("");
    setAuthAction(intent);

    try {
      const payload =
        intent === "signup"
          ? {
              email: trimmedEmail,
              name: authValues.name.trim() || undefined,
            }
          : { email: trimmedEmail };
      const endpoint = intent === "signup" ? "/auth/signup" : "/auth/login";

      const response = await apiClient.post<AuthResponse>(endpoint, payload);
      setAuthState({
        user: response.data.user,
        token: response.data.token,
      });
      setAuthValues({ email: "", name: "" });
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const friendlyMessage =
        axiosError.response?.data?.error ??
        axiosError.message ??
        "Unable to authenticate right now.";
      setAuthError(friendlyMessage);
    } finally {
      setAuthAction(null);
    }
  };

  const isAuthSubmitting = authAction !== null;

  return (
    <>
      <Button colorScheme="yellow" width="100%" onClick={onOpen}>
        Sign up / Log in
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up / Log in</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id={formId} onSubmit={handleAuthSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={authValues.email}
                    placeholder="you@example.com"
                    onChange={handleAuthInputChange("email")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Name (optional)</FormLabel>
                  <Input
                    value={authValues.name}
                    placeholder="Jane Doe"
                    onChange={handleAuthInputChange("name")}
                  />
                </FormControl>
                {authError && (
                  <Text color="red.400" fontSize="sm">
                    {authError}
                  </Text>
                )}
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              colorScheme="yellow"
              type="submit"
              form={formId}
              data-intent="signup"
              isLoading={authAction === "signup"}
              isDisabled={isAuthSubmitting}
            >
              Sign up
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form={formId}
              data-intent="login"
              isLoading={authAction === "login"}
              isDisabled={isAuthSubmitting}
            >
              Log in
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthButton;
