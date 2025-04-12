const Listing = require("../models/listing");
const axios = require('axios');
// const { search } = require("../routes/listing");


module.exports.index = async (req, res) => {

  // implement search feature
  let searchQuery = req.query.search || "";
  let allListingsData;

  if(searchQuery){
    allListingsData = await Listing.find({
      title: { $regex: searchQuery, $options: 'i'}
    });
    console.log(allListingsData);
  } else {
    allListingsData = await Listing.find({});
  }

  // console.log(allListingsData);
  // res.send(allListingsData);

  res.render("listings/index.ejs", { allListingsData });
};

module.exports.formOfNewListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let listingId = req.params.id;
  // console.log(listingId);

  let listingData = await Listing.findById(listingId)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  if (!listingData) {
    req.flash("error", "Requested listing doesn't exit or may be deleted");
    res.redirect("/listings");
  }
  // console.log(listingData.reviews);

  res.render("listings/show.ejs", { listingData });
};

module.exports.createListing = async (req, res) => {
  console.log("in new post");

  //60.5 geocoding
  const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            q: req.body.listing.location,
            format: 'json',
            limit: 1
        },
        headers: {
            'User-Agent': 'wanderlust-app'
        }
    });

    if (!geoRes.data || geoRes.data.length === 0) {
        throw new Error('Location not found');
    }

    const {lon, lat} = geoRes.data[0];
    console.log(lon, lat);


  // Another Potential Error
  // if(!req.body.listings){
  //     throw new ExpressError(400, "Send valid data for listings");
  // }
  // let result = listingSchema.validate(req.body);
  // console.log(result);

  
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
  // console.log(req.body.listing);
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  // console.log(listingData);

  let filename = req.file.filename;
  let url = req.file.path;
  newListing.image.filename = filename;
  newListing.image.url = url;

  newListing.geomentry =  {
      type: 'Point',
      coordinates: [lon, lat] // GeoJSON format [lng, lat]
  }
  
  console.log(newListing);
  await Listing.insertOne(newListing);
  req.flash("success", "new listing added");
  console.log("listing added");
  res.redirect("/listings");
};

module.exports.formofUpdateListing = async (req, res) => {
  let listingId = req.params.id;

  let listingData = await Listing.findById(listingId);
  // console.log(listingData);
  if (!listingData) {
    req.flash("error", "Requested listing doesn't exit or may be deleted");
    res.redirect("/listings");
  }


  // console.log(listingData);
  let orginalImageUrl = listingData.image.url;
  orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/w_250");
  console.log(orginalImageUrl);
  
  // res.send("Edit page");
  res.render("listings/edit.ejs", { listingData, orginalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let listingId = req.params.id;

  // let updatedListing = req.body;
  // updatedListing.image = {
  //   filename: "Random",
  //   url: updatedListing.url,
  // };
  // delete updatedListing.url;
  // let updatedListing = new Listing(req.body.listing);
  
  let updatedListing = await Listing.findByIdAndUpdate(listingId, {...req.body.listing}, { new: true });

  if(req.file){
    // res.send(req.file.filename);
    let filename = req.file.filename;
    let url = req.file.path;
    updatedListing.image = {filename, url};
    await updatedListing.save();
  }
  req.flash("success", "listing edited successfully");
  res.redirect(`/listings/${listingId}`);
};

module.exports.deleteListing = async (req, res) => {
  let listingId = req.params.id;

  await Listing.deleteOne({ _id: listingId });
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};
