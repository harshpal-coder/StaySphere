const Review = require('./models/reviews.js'); 

module.exports = {
  isLoggedIn: (req, res, next) => {
     console.log(req.user);
    if (!req.isAuthenticated()) {
      //redirect url save
      req.session.redirectUrl = req.originalUrl;
      req.flash('error_msg', 'You must be logged in to access that page');
      return res.redirect('/login');
    }
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
