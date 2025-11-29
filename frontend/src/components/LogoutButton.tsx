import { Button } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton = () => {
  const { clearAuth } = useAuth();

  return (
    <Button
      colorScheme="red"
      variant="outline"
      width="100%"
      size="sm"
      onClick={clearAuth}
    >
      Log out
    </Button>
  );
};

export default LogoutButton;
