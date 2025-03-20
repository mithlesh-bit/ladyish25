
const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

// Controllers
const paymentcontroller = require("../controllers/payment.controller");

router.post("/order", verify, paymentcontroller.postOrder);
router.post("/order/validate",verify, paymentcontroller.orderValidate);

module.exports = router;
