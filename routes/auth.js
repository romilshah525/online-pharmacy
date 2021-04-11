const passport = require("passport");
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/signup", authController.getSignUp);
router.post("/signup", authController.postSignUp);
router.get("/login", authController.getLogin);
router.get("/logout", authController.getLogout);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
// router.get('/reset-password/:token', authController.getNewPassword);
// router.post('/new-password', authController.postNewPassword);

module.exports = router;
