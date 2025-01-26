const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require("nodemailer");

const sendOtpEmail = async (recipientEmail) => {
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Configure the transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Replace with your Gmail email
        pass: process.env.EMAIL_PASS2, // Replace with your Gmail App Password
      },
    });

    // Email details
    const mailOptions = {
      from: `"FintechSigmas" ${process.env.EMAIL_USER}`, // Sender address
      to: recipientEmail, // Recipient address
      subject: "Your OTP Code", // Subject line
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`, // Plain text body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: %s", info.messageId);

    // Log the OTP (for testing purposes)
    console.log("Generated OTP:", otp);

    return otp;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Test the function
sendOtpEmail("udayvalera2004@gmail.com") // Replace with the recipient's email
  .then((otp) => console.log("OTP sent successfully:", otp))
  .catch((error) => console.error("Failed to send OTP:", error));
