// src/App.jsx
// Main application component: shows job list and selected job details.

import { useEffect, useState } from "react";
import { fetchJobs, fetchJobById, registerEmail } from "./api/jobsApi";
import JobsTable from "./components/JobsTable";
import JobDetails from "./components/JobDetails";

function App() {
  const [jobs, setJobs] = useState([]);              // all jobs from backend
  const [selectedJob, setSelectedJob] = useState(null); // job object with registrations
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [error, setError] = useState("");

  // Load job list on first render (componentDidMount equivalent).
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setError("");
        const data = await fetchJobs();
        setJobs(data);

        // Optionally auto-select first job
        if (data.length > 0) {
          await handleJobSelect(data[0].id, false);
        }
      } catch (err) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoadingJobs(false);
      }
    }

    loadJobs();
  }, []);

  /**
   * Handles selecting a job from the table.
   * Fetches full job details (including registrations) from backend.
   */
  async function handleJobSelect(jobId, showLoading = true) {
    try {
      if (showLoading) {
        setLoadingJobDetails(true);
      }
      setError("");
      const job = await fetchJobById(jobId);
      setSelectedJob(job);
    } catch (err) {
      setError(err.message || "Failed to load job details");
    } finally {
      if (showLoading) {
        setLoadingJobDetails(false);
      }
    }
  }

  /**
   * Handles email registration from JobDetails component.
   */
  async function handleRegisterEmail(jobId, email) {
    try {
      setError("");
      await registerEmail(jobId, email);
      // After successful registration, reload job details to show updated list.
      await handleJobSelect(jobId, false);
    } catch (err) {
      setError(err.message || "Failed to register email");
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Job Board</h1>
        <p style={styles.subtitle}>
          Simple job board MVP (React + Node + Postgres)
        </p>
      </header>

      {/* Error banner */}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        <section style={styles.leftPane}>
          <h2 style={styles.sectionTitle}>Jobs</h2>
          {loadingJobs ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <JobsTable
              jobs={jobs}
              selectedJobId={selectedJob?.id || null}
              onSelectJob={handleJobSelect}
            />
          )}
        </section>

        <section style={styles.rightPane}>
          <h2 style={styles.sectionTitle}>Job Details</h2>
          {loadingJobDetails && <p>Loading job details...</p>}
          {!loadingJobDetails && !selectedJob && <p>Select a job to see details.</p>}
          {!loadingJobDetails && selectedJob && (
            <JobDetails job={selectedJob} onRegisterEmail={handleRegisterEmail} />
          )}
        </section>
      </div>
    </div>
  );
}

// Simple inline styles to avoid CSS complexity for now
const styles = {
  page: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "16px",
  },
  header: {
    marginBottom: "16px",
  },
  subtitle: {
    color: "#555",
    marginTop: "4px",
  },
  error: {
    backgroundColor: "#ffe5e5",
    color: "#a00",
    padding: "8px 12px",
    borderRadius: "4px",
    marginBottom: "12px",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "16px",
    alignItems: "flex-start",
  },
  leftPane: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
  },
  rightPane: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "8px",
  },
};

export default App;