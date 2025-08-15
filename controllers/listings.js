const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { listings: alllistings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({path : 'reviews', populate: {path: 'author'}}).populate('owner');
  if (!listing) {
    req.flash('error_msg', 'Listing not found');
    return res.redirect('/listings');
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing , currentUser: req.user });
  await listing.save();
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  
  let listing = new Listing(req.body.listing);
  console.log(req.user);
  listing.owner = req.user._id; // Set the owner to the currently logged-in user
  listing.image = { url, filename };
  await listing.save();
  req.flash('success_msg', 'Listing created successfully');
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    return res.redirect('/listings');
  }
  
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing =  await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash('error_msg', 'You do not have permission to edit this listing');
    return res.redirect(`/listings/${id}`);
  }

  let listingup = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listingup.image = { url, filename };
    await listingup.save();
  }
  req.flash('success_msg', 'Listing updated successfully');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(`Deleted listing: ${deletedListing.title}`);
  req.flash('success_msg', 'Listing deleted successfully');
  res.redirect("/listings");
};
