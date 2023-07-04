const fs = require("fs");
const https = require("https");
const express = require("express");									// Express Framework
const morgan = require("morgan");									// Cool logger
const helmet = require("helmet");									// Cluster of 15 (11) middlewares that automatically setups some headers

const apiHandler = require("./routers/apiRouter");					// API router (protected)
const selectDatabase = require("./middlewares/selectDatabase");
const allowCrossDomain = require("./middlewares/allowCrossDomain");

/* ============== INITIALIZATION ================================================================ */
const app = express();												// App instance
require("dotenv").config();											// Enviroment variables setup


/* ============== MIDDLEWARES =================================================================== */
// * They have to act before the request handler
app.use(morgan("common"));											// Logger
app.use(express.json());											// Read json payloads
app.use(express.urlencoded({ extended: true }));					// Read url=encoded payloads
app.use(helmet());													// Headers for Security and other staff

/* ============== REQUEST HANDLER =============================================================== */
app.use(express.static("./public/"));                               // Automatically redirects requests to files in ./public
app.use(allowCrossDomain);
app.use("/api/:dbName", selectDatabase, apiHandler);
app.all('*', (req, res) => res.redirect("/"));

/* ============== LISTENING ===================================================================== */
// app.listen(process.env.HTTP_PORT, () => console.log(`HTTP server successfully started and listening on port ${process.env.HTTP_PORT}... `));

const options = {                                                   // File contenenti le credenziali SSL
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};

https.createServer(options, app).listen(process.env.HTTPS_PORT,
    () => console.log(`HTTPS server successfully started. Listening on port ${process.env.HTTPS_PORT}... `));