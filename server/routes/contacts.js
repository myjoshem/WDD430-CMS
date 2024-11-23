const express = require('express');
const router = express.Router();
const path = require('path');

// Example route
router.get('/', (req, res) => {
  res.send('Contacts API is working');
});

module.exports = router;