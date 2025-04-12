const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema, listingSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
  // console.log(req.path);
  // console.log(req.route.path);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listings");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let listingId = req.params.id;
  let listingData = await Listing.findById(listingId);
  if (!listingData.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Unauthorize user try to upadate");
    return res.redirect(`/listings/${listingId}`);
  }
  next();
};

module.exports.isAuthorOfReview = async (req, res, next) => {
  let listingId = req.params.listingId;
  let reviewId = req.params.reviewId;
  let reviewData = await Review.findById(reviewId);
  if (!reviewData.author._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "Unauthorized user ! you haven't permission to delete review"
    );
    return res.redirect(`/listings/${listingId}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validatesListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
