
// require all essential packages
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");    // we can also write engine in the place of ejsMate

// ------------------------------- //
// 59.7 require .env
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUD_NAME);    
    
// ------------------------------- //
// 57.6 user model and require models for creating password
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    const User = require("./models/user.js");

// ------------------------------- //

// 62.1 Mongo store
const MongoStore = require("connect-mongo");
const dbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,    /// now session store in mongoAtlas but if we pass mongodb/local url session store in local-storage  
    crypto: {   // for more secure and used it when we work with sansitive environment 
        secret: process.env.SECRET_KEY,
    }, 
    touchAfter: 24 * 60 * 60
});

store.on("error", ()=> {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const session = require("express-session");
const sessionOption = {
    store, 
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
const flash = require('connect-flash');
app.use(session(sessionOption));
app.use(flash());

// ------------------------------- //

// 57.7 cofiguring strategy 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ------------------------------- //
 
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
     
    next();
});

// ------------------------------- //


// require method-override
const methodOverride = require("method-override");
    const { error } = require("console");
    app.use(methodOverride('_method'));

// set and use it 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

// app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine('ejs', ejsMate);

// require wrapAsync function 
const wrapAsync = require("./utils/wrapAsync.js");

// require custom error class ExpressError
const ExpressError = require("./utils/ExpressError.js");


// requring joi listingSchema
// requring joi viewSchema
const { listingSchema, reviewSchema } = require("./schema.js");

// connect node to mongodb
// console.log(ATLAS_URL);
main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


// ------------------------------- //
    // requiring listing express router from routes folder
    const listings = require('./routes/listing.js'); 
    // requiring review express router from routes folder
    const reviews = require('./routes/review.js'); 
    // requiring user express router from routes folder
    const users = require('./routes/user.js');

const cookieParser = require("cookie-parser");


// ------------------------------- //

// --------------------------------------- //

    // Validation for schema(Middleware)
        const validatesListing = (req, res, next) => {
            let {error} = listingSchema.validate(req.body);
            if(error){
                let errMsg = error.details.map((el) => el.message).join(',');
                throw new ExpressError(400, errMsg);
            } else{
                next();
            }
        }
        const validateReview = (req, res, next) => {
            let {error} = reviewSchema.validate(req.body);
            if(error){
                let errMsg = error.details.map((el) => el.message).join(',');
                throw new ExpressError(400, errMsg);
            } else{
                next();
            }
        }

// --------------------------------------- //

//Routing 
app.get("/", (req,res) => {
    res.send("Working");
});

// --------------------------------------- //
    // 57.8 Demo User
    // app.get('/demouser', async (req, res) => {
    //     let fakeUser = new User({
    //         email: 'sigma567@gmail.com',
    //         username: 'sigma_student'
    //     });

    //     // here we can't use User.save because the register is inbuild 
    //     // method that do all the things of it with password
    //     let registerFakeUser = await User.register(fakeUser, "letmein");
    //     res.send(registerFakeUser);
    // });

// --------------------------------------- //


// use of listing.js
app.use('/listings', listings);

// use of review.js
app.use('/listings/:listingId/reviews', reviews);

// use of user.js
app.use('/', users);


// if req doesn't match any of above so we made below handler for all
app.all("*", (req, res, next) => {
    return next(new ExpressError(404, "Page not Found!!"));
});

// error handling middleware
app.use((err, req, res, next)=> {
    let { status = 500, message = "something went wrong"} = err;
    console.log(err);
    res.status(status).render('error.ejs', {err});
});

app.listen(8080, () => {
    console.log("Server is listing on port 8080");
});