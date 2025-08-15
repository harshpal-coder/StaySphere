const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware');
const listingController = require('../controllers/listings');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });




router.route('/')
  .get(listingController.index) // Display all listings
  .post(isLoggedIn, upload.single('listing[image]') , listingController.createListing);




// Route to show new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route('/:id')
  .get(listingController.showListing) // Show a specific listing
  .put(isLoggedIn,upload.single('listing[image]'), listingController.updateListing ) // Update a specific listing
  .delete(isLoggedIn, listingController.deleteListing); // Delete a specific listing


// Edit route
router.get("/:id/edit", isLoggedIn, listingController.editListing);


module.exports = router;
