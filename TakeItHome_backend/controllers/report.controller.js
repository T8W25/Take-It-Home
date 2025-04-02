// report.controller.js
const Report = require("../models/Report.model");
const { sendNotificationToAdmin } = require("./notification.controller"); // Import the notification function

const createReport = async (data) => {
  try {
    const newReport = new Report(data);
    await newReport.save(); // Save the report to the database
    await sendNotificationToAdmin(newReport); // Send notification to admin
    return newReport;
  } catch (error) {
    throw new Error("Error creating report");
  }
};

module.exports = { createReport };
