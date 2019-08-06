const pharmacyController = require('../controllers/pharmacy');
const express = require('express');
const router = express.Router();

router.get('/', pharmacyController.getHome);
router.get('/cart', pharmacyController.getCart);
router.post('/cart', pharmacyController.postCart);
router.get('/checkout', pharmacyController.getCheckOut);
router.get('/medList', pharmacyController.getMedicineList);
router.get('/orders', pharmacyController.getOrders);

module.exports = router;