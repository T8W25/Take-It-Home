const sendNotificationToAdmin = async (report) => {
    // Logic for sending notifications (e.g., email, socket, etc.)
    console.log(`Admin notified about the ${report.reportType} report.`);
  };
  
  const createReport = async (data) => {
    const newReport = new Report(data);
    await newReport.save();
    sendNotificationToAdmin(newReport);
  };
  
  module.exports = { createReport };
  
