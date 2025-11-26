// src/server.js
// Entry point: starts the HTTP server and listens on the configured port.
require('dotenv').config();

const app = require('./app'); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

/* WHY BETTER THAN SINGLE FILE:
 - server.js is tiny and has exactly one job: boot the app
 - app.js can be reused in tests (you can import app without listening on a port) */