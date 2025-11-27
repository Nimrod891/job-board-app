// src/components/JobsTable.jsx
// Displays jobs in a simple table/grid, similar to Mosh's tables.

function JobsTable({ jobs, selectedJobId, onSelectJob }) {
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              style={
                job.id === selectedJobId
                  ? { ...styles.tr, ...styles.trSelected }
                  : styles.tr
              }
              onClick={() => onSelectJob(job.id)}
            >
              <td style={styles.td}>{job.title}</td>
              <td style={styles.td}>{job.company}</td>
              <td style={styles.td}>{job.location || "-"}</td>
              <td style={styles.td}>
                {job.created_at
                  ? new Date(job.created_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      cursor: "pointer",
    },
    th: {
      textAlign: "left",
      borderBottom: "1px solid #ccc",
      padding: "8px",
      fontWeight: "600",
      backgroundColor: "#f7f7f7",
    },
    tr: {
      borderBottom: "1px solid #eee",
    },
    trSelected: {
      backgroundColor: "#e8f4ff",
    },
    td: {
      padding: "8px",
      fontSize: "14px",
    },
  };
  
  export default JobsTable;