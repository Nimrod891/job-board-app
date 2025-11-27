// src/components/JobDetails.jsx
// Shows a single job's details and allows registering a new email.

import { useState } from "react";

function JobDetails({ job, onRegisterEmail }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    try {
      setSubmitting(true);
      setLocalError("");
      await onRegisterEmail(job.id, email.trim());
      setEmail(""); // clear input on success
    } catch (err) {
      // Most errors are already handled at App level, but we keep local just in case.
      setLocalError(err.message || "Failed to register email");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h3 style={styles.title}>{job.title}</h3>
      <p style={styles.meta}>
        <strong>{job.company}</strong>
        {job.location ? ` · ${job.location}` : ""}
      </p>
      {job.created_at && (
        <p style={styles.metaSmall}>
          Created at: {new Date(job.created_at).toLocaleString()}
        </p>
      )}

      {job.description && (
        <p style={styles.description}>{job.description}</p>
      )}

      <hr style={styles.divider} />

      <h4 style={styles.subheading}>Registrations</h4>
      {job.registrations && job.registrations.length > 0 ? (
        <ul style={styles.list}>
          {job.registrations.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      ) : (
        <p>No registrations yet.</p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Register your email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
            disabled={submitting}
          />
        </label>
        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      {localError && <p style={styles.error}>{localError}</p>}
    </div>
  );
}

const styles = {
  title: {
    margin: "0 0 4px 0",
  },
  meta: {
    margin: "0 0 4px 0",
    color: "#444",
  },
  metaSmall: {
    margin: "0 0 12px 0",
    color: "#777",
    fontSize: "13px",
  },
  description: {
    marginBottom: "12px",
  },
  divider: {
    margin: "12px 0",
  },
  subheading: {
    margin: "0 0 8px 0",
  },
  list: {
    paddingLeft: "20px",
    marginTop: "0",
    marginBottom: "12px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "8px",
  },
  label: {
    fontSize: "14px",
  },
  input: {
    marginTop: "4px",
    padding: "6px 8px",
    fontSize: "14px",
    width: "100%",
    maxWidth: "260px",
  },
  button: {
    alignSelf: "flex-start",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },
  error: {
    color: "#a00",
    marginTop: "4px",
    fontSize: "13px",
  },
};

export default JobDetails;