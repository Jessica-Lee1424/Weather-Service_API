import dotenv from 'dotenv';
import express from 'express';


// Load environment variables from .env file
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses incoming URL-encoded form data

// Serve static files from the client dist folder
app.use(express.static('../client/dist'));

// Connect your routes
app.use('/api', routes);

// Serve the index.html file for any other requests (for client-side routing)
app.get('*', (_req, res) => {
    res.sendFile('../client/dist/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// TODO: Implement middleware to connect the routes
// app.use(routes);

// Start the server on the port
// app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
