// notification.controller.js
const sendNotificationToAdmin = async (report) => {
    // Logic for sending notifications (e.g., email, socket, etc.)
    console.log(`Admin notified about the ${report.reportType} report.`);
  };
  
  module.exports = { sendNotificationToAdmin };
  
