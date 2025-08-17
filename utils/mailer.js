const nodemailer = require('nodemailer');

// Configure your transporter (example: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});


// Send a welcome or custom email
async function sendWelcomeEmail(to, username, customText) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: customText
      ? 'StaySphere Password Reset'
      : 'Welcome to StaySphere! Your Journey Begins Here',
    text: customText
      ? `Hello ${username},\n\n${customText}\n\nIf you did not request this, please ignore this email.\n\nStaySphere Team`
      : `Hello ${username},\n\nWelcome to StaySphere – your new home for discovering, booking, and enjoying the world’s best stays!\n\nWe’re thrilled to have you join our community of explorers, hosts, and travelers. Here’s what you can look forward to as a StaySphere member:\n\n• Effortless Booking: Find and reserve unique stays in just a few clicks.\n• Trusted Reviews: Read honest feedback from real guests to help you choose the perfect place.\n• Secure Payments: Your safety is our priority. All transactions are encrypted and protected.\n• 24/7 Support: Our team is always here to help, no matter where you are in the world.\n\nGetting Started:\n1. Browse our listings and discover your next adventure.\n2. Save your favorite places for quick access later.\n3. Connect with hosts and ask questions directly.\n4. Book with confidence and enjoy exclusive member benefits.\n\nNeed help? Visit our Help Center or reply to this email – we’re always happy to assist.\n\nThank you for choosing StaySphere. We can’t wait to be a part of your journey!\n\nHappy travels,\nThe StaySphere Team\n\n---\nThis is an automated message. Please do not reply directly to this email.`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
