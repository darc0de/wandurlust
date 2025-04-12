const User = require("../models/user.js");

module.exports.formOfSignUp = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.singup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    res.locals.username = username;
    let newUser = new User({ username, email });
    let registerUser = await User.register(newUser, password);
    req.flash("success", `Registered, Welcome to Wanderlust ${username}`);
    console.log(registerUser, "registered user in the db");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", "same username is already registerd");
    res.redirect("/signup");
  }
};

module.exports.formOfLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome to Wanderlust`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out !");
    res.redirect("/listings");
  });
};
