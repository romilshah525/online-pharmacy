const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

router.get('/addMed', adminController.getAddMedicine);
router.post('/addMed',adminController.postAddMedicine);
router.get('/addMed/:id', adminController.getEditMedicineById);
router.post('/addMed/:id',adminController.postEditMedicineById);
router.get('/medList', adminController.getMedList);
router.get('/medList/:id', adminController.deleteMedById);

module.exports = router;