const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');

router.route('/signup')
  .get(userController.signupForm)
  .post(userController.signup);

router.route('/login')
  .get(userController.loginForm)
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);

// LOGOUT HANDLER
router.get('/logout', userController.logout);


module.exports = router;

// Profile page (GET)
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'You must be logged in to view your profile.');
    return res.redirect('/login');
  }
  res.render('users/profile');
});

// Update username (POST)
router.post('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'You must be logged in to update your profile.');
    return res.redirect('/login');
  }
  try {
    req.user.username = req.body.username;
    await req.user.save();
    req.flash('success_msg', 'Username updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error_msg', 'Error updating username.');
    res.redirect('/profile');
  }
});

// Reset password (POST)
router.post('/profile/password', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'You must be logged in to reset your password.');
    return res.redirect('/login');
  }
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    user.changePassword(currentPassword, newPassword, (err) => {
      if (err) {
        req.flash('error_msg', 'Current password is incorrect.');
        return res.redirect('/profile');
      }
      req.flash('success_msg', 'Password updated successfully!');
      res.redirect('/profile');
    });
  } catch (err) {
    req.flash('error_msg', 'Error updating password.');
    res.redirect('/profile');
  }
});

const crypto = require('crypto');
const { sendWelcomeEmail } = require('../utils/mailer');
// Forgot Password (GET)
router.get('/forgot-password', (req, res) => {
  res.render('users/forgot-password');
});

// Forgot Password (POST)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error_msg', 'No account with that email found.');
    return res.redirect('/forgot-password');
  }
  // Generate token
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  // Send email
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
  try {
    await sendWelcomeEmail(email, user.username, `You requested a password reset. Click the link to reset your password: ${resetUrl}`);
    req.flash('success_msg', 'A password reset link has been sent to your email.');
  } catch (e) {
    req.flash('error_msg', 'Error sending reset email.');
  }
  res.redirect('/forgot-password');
});

// Reset Password (GET)
router.get('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error_msg', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot-password');
  }
  res.render('users/reset-password', { token: req.params.token });
});

// Reset Password (POST)
router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error_msg', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot-password');
  }
  user.setPassword(req.body.newPassword, async (err) => {
    if (err) {
      req.flash('error_msg', 'Error resetting password.');
      return res.redirect(`/reset-password/${req.params.token}`);
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    req.flash('success_msg', 'Password has been reset. You can now log in.');
    res.redirect('/login');
  });
});

