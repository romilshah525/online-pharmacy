const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

router.get('/addMed', adminController.getAddMedicine);
router.post('/addMed',adminController.postAddMedicine);
router.get('/addMed/:id', adminController.getUpdateMedicine);
router.post('/addMed/:id',adminController.postUpdateMedicine);
router.get('/medList', adminController.getMedicineList);
router.get('/medList/:id', adminController.deleteMedicine);

module.exports = router;