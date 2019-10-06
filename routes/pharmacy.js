const express = require('express');
const router = express.Router();

const pharmacyController = require('../controllers/pharmacy');
const isAuth = require('../middlewares/isAuth');

router.get('/', pharmacyController.getHome);
router.get('/medicine-list', pharmacyController.getMedicineList);
router.get('/cart', isAuth, pharmacyController.getCart);
router.post('/add-to-cart', isAuth, pharmacyController.postAddToCart);
router.post('/delete-from-cart/:medicineId', isAuth, pharmacyController.postDeleteFromCart);
router.get('/orders', isAuth, pharmacyController.getOrders);
router.post('/order', isAuth, pharmacyController.postOrder);
router.get('/clear-cart', isAuth, pharmacyController.clearCart);

module.exports = router;