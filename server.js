require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // your MySQL DB connection file
const schoolRoutes = require('./routes/schoolRoutes'); // your API routes file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', schoolRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

// ✅ Use Render-provided port or default to 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
