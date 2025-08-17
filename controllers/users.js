
const User = require('../models/user');
const { sendWelcomeEmail } = require('../utils/mailer');

module.exports.signupForm = (req, res) => {
  res.render('users/signup.ejs');
};    

module.exports.signup  = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Send welcome email after successful registration
    try {
      await sendWelcomeEmail(email, username);
    } catch (e) {
      console.error('Error sending welcome email:', e);
    }

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash('error_msg', 'Error during login after signup');
        return res.redirect('/signup');
      }
      req.flash('success_msg', 'Welcome to Hotel App!');
      res.redirect('/listings');
    });
  } catch (err) {
    if (err.name === 'UserExistsError') {
      req.flash('error_msg', 'Username already exists');
    } else {
      req.flash('error_msg', 'Registration failed: ' + err.message);
    }
    res.redirect('/signup');
  }
};

module.exports.loginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
    // Send welcome email on login
    try {
      await sendWelcomeEmail(req.user.email, req.user.username);
    } catch (e) {
      console.error('Error sending welcome email on login:', e);
    }
    req.flash('success_msg', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error_msg', 'Error logging out');
    } else {
      req.flash('success_msg', 'You have logged out successfully');
    }
    res.redirect('/login');
  });
};