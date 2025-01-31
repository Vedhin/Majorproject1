const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, canDelete } = require("../middleware");
const reviewController = require("../controllers/review.js");

//reviews

router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.uploadReview),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  canDelete,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
