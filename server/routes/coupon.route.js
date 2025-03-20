const express = require("express");
const couponController = require("../controllers/coupon.controller");

const router = express.Router();


router.post('/add', couponController.addCoupon);
router.post('/validate', couponController.validateCoupon);
router.get('/list', couponController.getAllCoupons);
router.delete("/delete/:id", couponController.deleteCoupon);
  


module.exports = router;
