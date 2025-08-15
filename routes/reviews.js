const express = require('express');
const router = express.Router({ mergeParams: true }); // Important to access params from parent router
const Listing = require('../models/listing');
const Review = require('../models/reviews');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewControllers = require('../controllers/reviews');

// Create review route
router.post('/', isLoggedIn, reviewControllers.createReview);

// Delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewControllers.deleteReview);

module.exports = router;
