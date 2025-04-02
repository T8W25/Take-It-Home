// report.route.js
const express = require("express");
const Report = require("../models/Report.model");
const { sendNotificationToAdmin } = require("../controllers/notification.controller"); // Import the notification function
const router = express.Router();

// POST: Create a new report
router.post("/", async (req, res) => {
  try {
    const { reportType, itemId, userId, message } = req.body;

    const newReport = new Report({
      reportType,
      itemId,
      userId,
      message,
      status: "pending", // All reports will be marked as "pending" initially
    });

    // Save the report to the database
    await newReport.save();

    // Call the sendNotificationToAdmin function after the report is created
    await sendNotificationToAdmin(newReport);

    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Error submitting report." });
  }
});

module.exports = router;
