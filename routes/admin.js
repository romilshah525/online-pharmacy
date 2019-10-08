const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAdmin = require('../middlewares/isAdmin');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/medicine/:medId', isLoggedIn, isAdmin, adminController.getEditMedicine);
router.post('/medicine/:medId', isLoggedIn, isAdmin, adminController.postEditMedicine);
router.get('/add-medicine', isLoggedIn, isAdmin, adminController.getAddMedicine);
router.post('/add-medicine', isLoggedIn, isAdmin, adminController.postAddMedicine);
router.get('/delete-medicine/:medId', isLoggedIn, isAdmin, adminController.deleteMedicine);

module.exports = router;