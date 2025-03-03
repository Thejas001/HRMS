require("dotenv").config();
const nodemailer = require("nodemailer");

// Ensure credentials are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use the App Password here
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// Test the email function
sendEmail("receiver@example.com", "Test Email", "Hello! This is a test email using Gmail SMTP.");
