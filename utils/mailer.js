const nodemailer = require('nodemailer');

// Configure your transporter (example: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Send a welcome email
async function sendWelcomeEmail(to, username) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to StaySphere!',
    text: `Hello ${username},\n\nWelcome to StaySphere! We are excited to have you on board.\n\nBest regards,\nStaySphere Team`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
