const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

const isAdmin = require('../middlewares/isAdmin');
const isAuth = require('../middlewares/isAuth');

router.get('/medicine-list', isAuth, isAdmin, adminController.getMedicineList);
router.get('/medicine/:medId', isAuth, isAdmin, adminController.getEditMedicine);
router.post('/medicine/:medId', isAuth, isAdmin, adminController.postEditMedicine);
router.get('/add-medicine', isAuth, isAdmin, adminController.getAddMedicine);
router.post('/add-medicine', isAuth, isAdmin, adminController.postAddMedicine);
router.get('/delete-medicine/:medId', isAuth, isAdmin, adminController.deleteMedicine);

module.exports = router;