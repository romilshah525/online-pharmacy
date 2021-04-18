const express = require("express");
const multer = require("multer");
const router = express.Router();

const pharmacyController = require("../controllers/pharmacy");
const isLoggedIn = require("../middlewares/isLoggedIn");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    req.user.orderCount += 1;
    let name =
      req.user.username +
      "." +
      req.user.orderCount +
      "." +
      file.mimetype.split("/")[1];
    req.user.prescription.push(name);
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({ storage, fileFilter });

router.get("/", pharmacyController.getHome);
router.get("/medicine-list", pharmacyController.getMedicineList);
router.get("/cart", isLoggedIn, pharmacyController.getCart);
router.get("/add-to-cart/:medId", isLoggedIn, pharmacyController.getAddToCart);
router.post(
  "/delete-from-cart/:medicineId",
  isLoggedIn,
  pharmacyController.postDeleteFromCart
);
router.get("/orders", isLoggedIn, pharmacyController.getOrders);
router.get("/clear-cart", isLoggedIn, pharmacyController.clearCart);
router.post(
  "/order",
  isLoggedIn,
  //   upload.single("image"),
  pharmacyController.postOrder
);
router.get(
  "/upload-prescription",
  isLoggedIn,
  pharmacyController.getPrescriptions
);
// router.get('/billing', isLoggedIn, pharmacyController.getBilling);
router.post(
  "/billing",
  isLoggedIn,
  //   upload.single("image"),
  pharmacyController.postBilling
);

// router.post('/upload-prescription', isLoggedIn, upload.single('image'), pharmacyController.postPrescriptions);

module.exports = router;
