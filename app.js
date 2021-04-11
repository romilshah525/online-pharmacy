const localStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const errorController = require("./controllers/error");
const pharmRoutes = require("./routes/pharmacy");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

const keys = require("./keys.json");

const MONGODB_URI = keys["MONGO_URI"];
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: keys["SESSION_SECRET"],
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use((req, res, next) => {
  if (req.user) {
    res.locals.isAuthenticated = req.user.username;
  } else {
    res.locals.isAuthenticated = false;
  }
  if (res.locals.isAuthenticated) {
    res.locals.isAdmin = req.user.isAdmin;
  } else {
    res.locals.isAdmin = false;
  }
  next();
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (_req, res) {
    res.redirect("/medicine-list");
  }
);

app.use("/admin/", adminRoutes);
app.use(pharmRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`==> Server started at http://localhost:${port}/`);
    });
  })
  .catch((err) => console.log(err));

exports.port = port;
