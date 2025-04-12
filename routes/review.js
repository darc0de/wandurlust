const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });

// --------------------------------------- //
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isAuthorOfReview,
} = require("../middleware.js");
// const ejsMate = require("ejs-mate");    // we can also write engine in the place of ejsMate

// const path = require("path");

const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controller/review.js");

// requring joi listingSchema
// requring joi viewSchema
const { listingSchema, reviewSchema } = require("../schema.js");

// require custom error class ExpressError
const ExpressError = require("../utils/ExpressError.js");

// const ejsMate = require("ejs-mate");    // we can also write engine in the place of ejsMate
// app.engine('ejs', ejsMate);

// require method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// set and use it
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, '/views'));

// app.use(express.static(path.join(__dirname, "/public/css")));
// app.use(express.static(path.join(__dirname, "public")));

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());

// --------------------------------------- //

// --------------------------------------- //

// Validation for schema(Middleware) -> i shifted the code into middleware
// const validateReview = (req, res, next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(',');
//         throw new ExpressError(400, errMsg);
//     } else{
//         next();
//     }
// }

// --------------------------------------- //

// recieve post request from review(form)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthorOfReview,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
