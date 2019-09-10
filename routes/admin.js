const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');

router.get('/addMed', isAuth, adminController.getAddMedicine); // this requests are executed from left to right!
router.post('/addMed', isAuth, adminController.postAddMedicine);
router.get('/addMed/:id', isAuth, adminController.getUpdateMedicine);
router.post('/addMed/:id', isAuth, adminController.postUpdateMedicine);
router.get('/medList', isAuth, adminController.getMedicineList);
router.post('/medList/:id', isAuth, adminController.deleteMedicine);

module.exports = router;