const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject, // Email subject
      text: message, // Email body
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
