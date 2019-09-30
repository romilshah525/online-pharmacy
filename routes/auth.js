const authController = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;