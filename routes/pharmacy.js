const pharmacyController = require('../controllers/pharmacy');
const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');

router.get('/', pharmacyController.getHome);
router.get('/cart', isAuth, pharmacyController.getCart);
router.post('/cart/:medId', isAuth, pharmacyController.postRemoveFromCart);
router.post('/cart', isAuth, pharmacyController.postAddToCart);
router.get('/checkout', isAuth, pharmacyController.getCheckOut);
router.get('/medList', pharmacyController.getMedicineList);
router.get('/orders', isAuth, pharmacyController.getOrders);
// router.post('/cart-delete-item', shopController.postCartDeleteProduct);
// router.post('/create-order', shopController.postOrder);

module.exports = router;