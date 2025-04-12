const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
// const ejsMate = require("ejs-mate");    // we can also write engine in the place of ejsMate

const { isLoggedIn, isOwner, validatesListing } = require("../middleware.js");

const path = require("path");

const wrapAsync = require("../utils/wrapAsync.js");

// require custom error class ExpressError
const ExpressError = require("../utils/ExpressError.js");

// --------------------------------------- //
// 59.1 MVC - M-model, V-views, C-controller
let listingController = require("../controller/listing.js");
// --------------------------------------- //
  //59.6 image upload middleware
  const multer = require("multer");
  const {storage} = require("../cloudConfig.js");
  // const upload = multer({ dest: "uploads/"}); // save the file into auto created uploads folder
  const upload = multer({storage});

// --------------------------------------- //

const ejsMate = require("ejs-mate"); // we can also write engine in the place of ejsMate
app.engine("ejs", ejsMate);

// require method-override
const methodOverride = require("method-override");
const { error } = require("console");
app.use(methodOverride("_method"));

// set and use it
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------------------------------- //

// Validation for schema(Middleware)
// const validatesListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// --------------------------------------- //
// 59.2 with the use of Route.route
// INDEX ROUTE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    validatesListing,  
    wrapAsync(listingController.createListing)
  );
  // .post(upload.single("listing[image]"), 
  //   (req,res) => {
  //     res.send(req.file);
  //   }
  // );

//CREATE ROUTE : new form
router.get(
  "/new",
  isLoggedIn,
  listingController.formOfNewListing
  //58.1 connecting login route

  //the below function can be use with middleware
  // console.log(req.user);
  // if(!req.isAuthenticated()){
  //     req.flash("error", "You must be logged in to create a listings");
  //     return res.redirect('/login');
  // }
  // res.render("listings/new.ejs");
);

//READ ROUTE : show listings
//UPDATE ROUTE
// DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// get update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.formofUpdateListing)
);

// COMMENTED OUT BECAUSE OF USE OF Route.route see above code
// CREATE ROUTE : create document in database from new form
// router.post(
//   "/",
//   validatesListing,
//   isLoggedIn,
//   wrapAsync(listingController.createListing)
// console.log("in new post");
// Another Potential Error
// if(!req.body.listings){
//     throw new ExpressError(400, "Send valid data for listings");
// }
// let result = listingSchema.validate(req.body);
// console.log(result);

// let listingData = req.body.listing;
// listingData.image = {
//   filename: "Random",
//   url: listingData.url,
// };
// delete listingData.url;

// console.log(listingData);

//Another way & in new js all input -> name convert to as exa; listing[title] , listing[price]
// Means it's simplly create listing object and insert all key like title, decription, image, price, location, country
// let newListing = new Listing(req.body.listing);

// console.log("in progress");
// 58.5 listing owner -> add owner to listing data
// listingData.owner = req.user._id;
// console.log(listingData);

// await Listing.insertOne(listingData);
// req.flash("success", "new listing added");
// console.log("listing added");
// res.redirect("/listings");
// );

module.exports = router;
