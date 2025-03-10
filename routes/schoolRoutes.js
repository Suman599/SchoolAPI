const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /addSchool
router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database insert error' });
    res.status(201).json({ message: 'School added successfully' });
  });
});

// GET /listSchools
router.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Provide valid latitude and longitude in query' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  db.query('SELECT * FROM schools', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const sorted = results.map(school => {
      const dist = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance: parseFloat(dist.toFixed(2)) };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sorted);
  });
});

module.exports = router;
