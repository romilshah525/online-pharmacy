const express = require('express');
const router = express.Router();

const pharmacyController = require('../controllers/pharmacy');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', pharmacyController.getHome);
router.get('/medicine-list', pharmacyController.getMedicineList);
router.get('/cart', isLoggedIn, pharmacyController.getCart);
router.get('/add-to-cart/:medId', isLoggedIn, pharmacyController.getAddToCart);
router.post('/delete-from-cart/:medicineId', isLoggedIn, pharmacyController.postDeleteFromCart);
router.get('/orders', isLoggedIn, pharmacyController.getOrders);
router.post('/order', isLoggedIn, pharmacyController.postOrder);
router.get('/clear-cart', isLoggedIn, pharmacyController.clearCart);

module.exports = router;