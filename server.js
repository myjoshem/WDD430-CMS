// Get dependencies
const express = require('express'); // Framework to build the web server
const path = require('path'); // Module to handle and transform file paths
const http = require('http'); // NodeJS module to create an HTTP server
const cookieParser = require('cookie-parser'); // Middleware to parse cookies in incoming requests
const logger = require('morgan'); // Middleware to log HTTP requests
const mongoose = require('mongoose'); // MongoDB object modeling tool

// Import the routing file to handle the default (index) route
const index = require('./server/routes/app');

// Import additional routing files
const documents = require('./server/routes/documents');
const messages = require('./server/routes/messages');
const contacts = require('./server/routes/contacts');

// Create an instance of Express
const app = express();

/* // MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/cms';
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err)); */

// Middleware for request parsing and logging
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data from forms
app.use(cookieParser()); // Parses cookies
app.use(logger('dev')); // Logs HTTP requests

// Add support for Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Serve static files for the Angular app
app.use(express.static(path.join(__dirname, 'dist/cms')));

// Route handling
app.use('/', index); // Default route
app.use('/api/documents', documents); // API route for documents
app.use('/api/messages', messages); // API route for messages
app.use('/api/contacts', contacts); // API route for contacts

// Handle undefined routes by sending back the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/index.html'));
});

// Define the port for the server
const port = process.env.PORT || '3000';
app.set('port', port);

// Create the HTTP server
const server = http.createServer(app);

// Start the server and listen on the defined port
server.listen(port, () => {
  console.log(`API running on localhost: ${port}`);
});