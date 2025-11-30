import { useState } from "react";
import { Grid, GridItem, Show, Stack } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import JobGrid from "./components/JobGrid";
import CreateJobButton from "./components/CreateJobButton";
import AuthButton from "./components/AuthButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();
  // Whenever a job is created we increment this number so JobGrid knows to re-fetch.
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchText, setSearchText] = useState("");

  const handleJobCreated = () => {
    setRefreshKey((current) => current + 1);
  };

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
        <NavBar searchText={searchText} onSearch={setSearchText} />
      </GridItem>
      <Show above="lg">
        {/* The aside column is only visible on larger screens per the layout rules. */}
        <GridItem area="aside" width="220px" padding="16px">
          {user ? (
            <Stack spacing={3}>
              <CreateJobButton onJobCreated={handleJobCreated} />
              <LogoutButton />
            </Stack>
          ) : (
            <AuthButton />
          )}
        </GridItem>
      </Show>
      <GridItem area="main">
        <JobGrid refreshKey={refreshKey} searchText={searchText} />
      </GridItem>
    </Grid>
  );
}

export default App;
