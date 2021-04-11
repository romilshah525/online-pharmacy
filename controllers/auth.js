const localStrategy = require("passport-local");
const nodemailer = require("nodemailer");
const passport = require("passport");

const keys = require("./../keys.json");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: keys["GMAIL_USERNAME"],
    pass: keys["GMAIL_PASSWORD"],
  },
});

passport.use(new localStrategy(User.authenticate()));

exports.getSignUp = (req, res) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/signup", {
    error: error,
  });
};

exports.postSignUp = (req, res) => {
  newUser = new User({
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    address: req.body.address,
    age: req.body.age,
    contact: req.body.contact,
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", "Enter valid credentials!");
      console.log(`Error:${err}`);
      return res.redirect("/signup");
    }
    console.log(`User Saved Details:${user}`);
    passport.authenticate("local")(req, res, function () {
      console.log(`Sending mail to : ${user.username}...\n`);
      let mailOptions = {
        from: "shahromil525@gmail.com",
        to: user.username,
        subject: "Email Registered on Medi-life Store!",
        text: `Hey there, your account has been created!\n\nYour Username is ${user.username}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(`Email Not Send!\n`);
          console.log(err);
        } else {
          console.log(`Email sent successfully: ${info.response}`);
        }
        return res.redirect("/login");
      });
      res.redirect("/login");
    });
  });
};

exports.getLogin = (req, res) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/login", {
    error: error,
  });
};

exports.postLogin = () => {
  passport.authenticate("local", {
    successRedirect: "/medicine-list",
    failureRedirect: "/login",
    failureFlash: { type: "error", message: "blah" },
  });
};

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.getResetPassword = (req, res) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/reset-password", {
    error: error,
  });
};

exports.postResetPassword = (req, res) => {
  const email = req.body.email;
  let newUser;
  User.findOne({ username: email })
    .then((user) => {
      newUser = new User({
        username: user.username,
        name: user.name,
        gender: user.gender,
        address: user.address,
        age: user.age,
        contact: user.contact,
        cart: user.cart,
      });
      return user.remove();
    })
    .then(() => {
      User.register(newUser, req.body.password, (err, userNew) => {
        if (err) {
          req.flash("error", "Enter valid credentials!");
          console.log(`Error:${err}`);
          return res.redirect("/signup");
        } else {
          console.log(`User Saved Details:${userNew}`);
          passport.authenticate("local")(req, res, () => {
            console.log(`Sending mail to : ${userNew.username}...\n`);
            let mailOptions = {
              from: "shahromil525@gmail.com",
              to: userNew.username,
              subject: "Email Registered on Medi-life Store!",
              text: `Hey there, your account has been created!\n\nYour Username is ${userNew.username}`,
            };
            return transporter.sendMail(mailOptions);
          });
        }
      });
    })
    .then((err, info) => {
      if (err) {
        console.log(`Email Not Send!\n`);
        console.log(err);
      } else {
        console.log(`Email sent successfully: ${info.response}`);
      }
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
