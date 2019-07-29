const pharmacyController = require('../controllers/pharmacy');
const express = require('express');
const router = express.Router();

router.get('/', pharmacyController.getDashboard);
router.get('/cart', pharmacyController.getCart);
router.get('/checkout', pharmacyController.getCheckOut);
router.get('/medDetails',pharmacyController.getMedicineDetails);
router.get('/medList', pharmacyController.getMedicineList);
router.get('/orders', pharmacyController.getOrders);

module.exports = router;