const Report = require('../models/Report.model');  // Assuming you have a Report model for storing reports
const DonationItem = require('../models/DonationItem.model');  // DonationItem model to fetch item details

// Report item controller
const reportItem = async (req, res) => {
  const { itemId, reason } = req.body;
  
  // Check if itemId and reason are provided
  if (!itemId || !reason) {
    return res.status(400).json({ message: "Item ID and reason are required" });
  }

  try {
    // Check if the item exists
    const item = await DonationItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Donation item not found" });
    }

    // Create a new report
    const newReport = new Report({
      itemId,
      reason,
      reportedBy: req.user.id,  // Use the user ID from the decoded JWT token
    });

    // Save the report to the database
    await newReport.save();

    // Respond with a success message
    res.status(201).json({ message: "Item reported successfully" });
  } catch (error) {
    console.error("Error reporting item:", error.message);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = { reportItem };
