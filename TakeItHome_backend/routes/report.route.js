// report.route.js
const express = require("express");
const { createReport } = require("../controllers/report.controller"); // Import the controller
const router = express.Router();

// POST: Create a new report
router.post("/", async (req, res) => {
  try {
    const { reportType, itemId, userId, message } = req.body;

    // Call the controller's createReport function
    const newReport = await createReport({
      reportType,
      itemId,
      userId,
      message,
      status: "pending", // All reports will be marked as "pending" initially
    });

    res.status(201).json({ message: "Report submitted successfully!", report: newReport });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Error submitting report." });
  }
});

module.exports = router;
