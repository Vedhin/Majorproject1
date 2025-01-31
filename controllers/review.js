const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.uploadReview = async (req, res) => {
  let list = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  list.reviews.push(newReview);

  await newReview.save();
  await list.save();
  req.flash("success", "review saved");
  res.redirect(`/listing/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted");
  res.redirect(`/listing/${id}`);
};
