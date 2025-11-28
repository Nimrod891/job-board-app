import { useState } from "react";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import JobGrid from "./components/JobGrid";
import CreateJobButton from "./components/CreateJobButton";

function App() {
  // Whenever a job is created we increment this number so JobGrid knows to re-fetch.
  const [refreshKey, setRefreshKey] = useState(0);

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
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        {/* The aside column is only visible on larger screens per the layout rules. */}
        <GridItem area="aside" width="220px" padding="16px">
          <CreateJobButton onJobCreated={handleJobCreated} />
        </GridItem>
      </Show>
      <GridItem area="main">
        <JobGrid refreshKey={refreshKey} />
      </GridItem>
    </Grid>
  );
}

export default App;
