const pharmacyController = require('../controllers/pharmacy');
const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');

router.get('/', pharmacyController.getHome);
router.get('/medicine-list', pharmacyController.getMedicineList);
router.get('/cart', isAuth, pharmacyController.getCart);
router.post('/add-to-cart', isAuth, pharmacyController.postAddToCart);
router.post('/delete-from-cart/:medicineId', isAuth, pharmacyController.postDeleteFromCart);

module.exports = router;