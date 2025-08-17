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
    subject: 'Welcome to StaySphere! Your Journey Begins Here',
    text: `Hello ${username},

Welcome to StaySphere – your new home for discovering, booking, and enjoying the world’s best stays!

We’re thrilled to have you join our community of explorers, hosts, and travelers. Here’s what you can look forward to as a StaySphere member:

• Effortless Booking: Find and reserve unique stays in just a few clicks.
• Trusted Reviews: Read honest feedback from real guests to help you choose the perfect place.
• Secure Payments: Your safety is our priority. All transactions are encrypted and protected.
• 24/7 Support: Our team is always here to help, no matter where you are in the world.

Getting Started:
1. Browse our listings and discover your next adventure.
2. Save your favorite places for quick access later.
3. Connect with hosts and ask questions directly.
4. Book with confidence and enjoy exclusive member benefits.

Need help? Visit our Help Center or reply to this email – we’re always happy to assist.

Thank you for choosing StaySphere. We can’t wait to be a part of your journey!

Happy travels,
The StaySphere Team

---
This is an automated message. Please do not reply directly to this email.`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
