import { useState } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Show,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import JobGrid from "./components/JobGrid";
import CreateJobButton from "./components/CreateJobButton";
import AuthButton from "./components/AuthButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./contexts/AuthContext";
import ColorModeSwitch from "./components/ColorModeSwitch";

function App() {
  const { user } = useAuth();
  // Whenever a job is created we increment this number so JobGrid knows to re-fetch.
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleJobCreated = () => {
    setRefreshKey((current) => current + 1);
  };

  const renderAsideContent = (onJobCreatedCallback: () => void) =>
    user ? (
      <Stack spacing={3}>
        <CreateJobButton onJobCreated={onJobCreatedCallback} />
        <LogoutButton />
      </Stack>
    ) : (
      <AuthButton />
    );

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`, // 1024px and above
      }}
    >
      <GridItem
        area="nav"
        position="sticky"
        top={0}
        zIndex={10}
        bg="chakra-body-bg"
        boxShadow="sm"
      >
        <NavBar
          searchText={searchText}
          onSearch={setSearchText}
          onMenuClick={onOpen}
        />
      </GridItem>
      <Show above="lg">
        {/* The aside column is only visible on larger screens per the layout rules. */}
        <GridItem area="aside" width="220px" padding="16px">
          {renderAsideContent(handleJobCreated)}
        </GridItem>
      </Show>
      <GridItem area="main">
        <JobGrid refreshKey={refreshKey} searchText={searchText} />
      </GridItem>
      <Show below="lg">
        <Drawer isOpen={isOpen} placement="left" size="full" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody paddingY={6} paddingTop="72px">
              <Flex direction="column" height="100%">
                <Box>
                  {renderAsideContent(() => {
                    handleJobCreated();
                    onClose();
                  })}
                </Box>
                <Box marginTop="auto">
                  <ColorModeSwitch />
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Show>
    </Grid>
  );
}

export default App;
