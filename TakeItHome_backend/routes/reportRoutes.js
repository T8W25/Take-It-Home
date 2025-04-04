const express = require('express');
const router = express.Router();
const { reportItem } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');  // Import the verifyToken middleware

// Protect the /report route by using the verifyToken middleware
router.post('/report', verifyToken, reportItem);

module.exports = router;
