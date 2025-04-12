const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res, next) => {
  let listingId = req.params.listingId;
  console.log("Review id : ", listingId);

  let listingData = await Listing.findById(listingId);
  req.body.review.author = res.locals.currUser._id;

  console.log("////////////////");
  console.log(req.body.review.author);

  let newReview = new Review(req.body.review);
  console.log(req.body);

  listingData.reviews.push(newReview);

  await newReview.save();
  let result = await listingData.save(); // because of we added review in listings

  // console.log(result);
  console.log("review added successfully");
  req.flash("success", "review added successfully");
  res.redirect(`/listings/${listingId}`);
};

module.exports.deleteReview = async (req, res) => {
  let { listingId, reviewId } = req.params;
  // let listingId = id;

  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(listingId, {
    $pull: { reviews: reviewId },
  });

  console.log("Review Deleted Successfulluy");
  req.flash("success", "review delted successfully");
  res.redirect(`/listings/${listingId}`);
};
