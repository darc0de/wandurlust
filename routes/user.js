const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controller/user.js");

const ejs = require("ejs");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync");
const { savedRedirectUrl } = require("../middleware.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// signup get -> form and post -> create user in db
router
  .route("/signup")
  .get(userController.formOfSignUp)
  .post(wrapAsync(userController.singup));

// login get -> form and post -> whether user in db exist or not
router
  .route("/login")
  .get(userController.formOfLogin)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// read for more info : https://www.passportjs.org/concepts/authentication/strategies/

//58.2 Logout User
router.get("/logout", userController.logout);

module.exports = router;
