const express = require('express');
const multer = require('multer');
const router = express.Router();

const pharmacyController = require('../controllers/pharmacy');
const isLoggedIn = require('../middlewares/isLoggedIn');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        let name = req.user.username+'_';
        cb(null, name+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
var upload = multer({storage, fileFilter});

router.get('/', pharmacyController.getHome);
router.get('/medicine-list', pharmacyController.getMedicineList);
router.get('/cart', isLoggedIn, pharmacyController.getCart);
router.get('/add-to-cart/:medId', isLoggedIn, pharmacyController.getAddToCart);
router.post('/delete-from-cart/:medicineId', isLoggedIn, pharmacyController.postDeleteFromCart);
router.get('/orders', isLoggedIn, pharmacyController.getOrders);
router.get('/clear-cart', isLoggedIn, pharmacyController.clearCart);
router.post('/order', isLoggedIn, upload.single('image'), pharmacyController.postOrder);

module.exports = router;