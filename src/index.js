const fs = require("fs");
const https = require("https");
const express = require("express");									// Express Framework
const morgan = require("morgan");									// Cool logger
const helmet = require("helmet");
const apiHandler = require("./routers/apiRouter");
const selectDatabase = require("./middlewares/selectDatabase");
const allowCrossDomain = require("./middlewares/allowCrossDomain");


/* ============== INITIALIZATION ============================================ */
/** Express app instance. */
const app = express();


/* ============== MIDDLEWARES =============================================== */
// Middlewares act before request handlers

// Logger with a specific format useful for API calls
app.use(morgan("common"));

// Enable JSON payloads
app.use(express.json());

// Read url=encoded payloads
app.use(express.urlencoded({ extended: true }));

// Cluster of 15 (11) middlewares that automatically setups Security headers.
// In order to correctly display CSS, disable "contentSecurityPolicy" feature.
app.use(helmet({ contentSecurityPolicy: false }));


/* ============== REQUEST HANDLER =========================================== */
// Automatically redirect requests to files in ./public (serve frontend files)
app.use(express.static("./public/"));

// Apply CORS fix middleware
app.use(allowCrossDomain);

// Setup API handler - each request specifies what database to be used
app.use("/api/:dbName", selectDatabase, apiHandler);

// If the called endpoint does not exist, redirect to / (index.html)
app.all('*', (req, res) => res.redirect("/"));


/* ============== LISTENING ================================================= */
// Configure SSL keys and self-signed certificate for HTTPS
const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};

// Set up HTTP server
app.listen(process.env.HTTP_PORT, () => {
    console.log(`HTTP server started on port ${process.env.HTTP_PORT}... `);
});

// Set up HTTPS server
https.createServer(options, app).listen(process.env.HTTPS_PORT, () => {
    console.log(`HTTPS server started on port ${process.env.HTTPS_PORT}... `);
});