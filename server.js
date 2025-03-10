const express = require('express');
const cors = require('cors');
const app = express();
const schoolRoutes = require('./routes/schoolRoutes');

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/', schoolRoutes);


app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
