const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateError } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(listingController.index)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.postlisting),
  );

router.get("/new", isLoggedIn, listingController.newform);

router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.editlisting),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, listingController.editFormlisting);

module.exports = router;
