const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

router.get('/addMed/', adminController.getAddMedicine);
router.post('/addMed',adminController.postAddMedicine);
router.get('/medList', adminController.getMedList);
router.get('/addMed/:id', adminController.getEditMedicine);
router.post('/addMed/:id',adminController.postEditMedicine);

module.exports = router;