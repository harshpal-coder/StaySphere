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

