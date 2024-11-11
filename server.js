const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON data
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// **Correction 1: Add a route for the root path**
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital API!'); // Response for root path
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    } else {
      res.json(results);
    }
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      res.status(500).json({ error: 'Failed to retrieve providers' });
    } else {
      res.json(results);
    }
  });
});

// Question 3: Filter patients by first name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error retrieving patients by first name:', err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'No patients found with that first name' });
    } else {
      res.json(results);
    }
  });
});

// Question 4: Retrieve all providers by specialty
app.get('/providers/filter', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error retrieving providers by specialty:', err);
      res.status(500).json({ error: 'Failed to retrieve providers' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'No providers found with that specialty' });
    } else {
      res.json(results);
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
