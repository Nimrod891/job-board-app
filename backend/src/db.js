// src/db.js
// Wrap pg's connection pool so the rest of the app can run queries easily

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Export a small helper so we always use the same pool instance
module.exports = {
    /**
     * Run a SQL query using the shared pool.
     * @param {string} text - SQL string with placeholders ($1, $2, ...)
     * @param {Array} params - values for the placeholders
     */
    query: (text, params) => pool.query(text, params),
  };
  
  /*
    MOSH PARALLEL:
    - This is like where he does `mongoose.connect(...)` once and then uses `Genre.find()`.
    - Instead of Mongoose models, we centralize the connection and expose a simple `query` function.
  
    WHY IT'S GOOD:
    - Only ONE place knows how to connect to the DB.
    - If DB config changes (host, password), only this file changes.
    - Services can focus on WHAT to query, not HOW to connect.
  */