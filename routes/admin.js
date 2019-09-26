const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

const isAdmin = require('../middlewares/isAdmin');

router.get('/medicine-list', isAdmin, adminController.getMedicineList);
router.get('/medicine/:medId', isAdmin, adminController.getEditMedicine);
router.post('/medicine/:medId', isAdmin, adminController.postEditMedicine);
router.get('/add-medicine', isAdmin, adminController.getAddMedicine);
router.post('/add-medicine', isAdmin, adminController.postAddMedicine);
// router.get('/addMed', isAdmin, adminController.getAddMedicine); // this requests are executed from left to right!
// router.post('/addMed', isAdmin, adminController.postAddMedicine);
router.get('/delete-medicine/:medId', isAdmin, adminController.deleteMedicine);

module.exports = router;