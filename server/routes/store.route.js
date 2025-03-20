/**
 * Title: Write a program using JavaScript on Store Route

 * Date: 11, November 2023
 */

/* external import */
const express = require("express");

/* middleware imports */
const upload = require("../middleware/upload.middleware");

/* internal import */
const storeController = require("../controllers/store.controller");
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");
const restrict = require("../middleware/restrict.middleware");

/* router level connection */
const router = express.Router();

/* router methods integration */

// add new store
router.post(
  "/add-store",
  verify,
  authorize("admin", "seller"),
  restrict,
  upload.single("thumbnail"),
  storeController.addStore
);

// get all stores
router.get("/get-stores", storeController.getStores);

// get a store
router.get("/get-store/:id", storeController.getStore);

// update store
router.patch(
  "/update-store/:id",
  verify,
  authorize("admin", "seller"),
  upload.single("thumbnail"),
  storeController.updateStore
);

// delete store
router.delete(
  "/delete-store/:id",
  verify,
  authorize("admin", "seller"),
  storeController.deleteStore
);

module.exports = router;
