const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const listData = await listing.find({});
  res.render("listings/index.ejs", { listData });
};

module.exports.newform = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  const { id } = req.params;
  const result = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!result) {
    req.flash("error", "Listing Does not exist");
    res.redirect("/listing");
  }
  res.render("listings/show.ejs", { result });
};

module.exports.postlisting = async (req, res) => {
  let responce = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const listingData = new listing(req.body.listing);
  listingData.owner = req.user._id;
  listingData.image = { url, filename };

  listingData.geometry = responce.body.features[0].geometry;

  await listingData.save();

  console.log(listingData);
  req.flash("success", "listing was Inserted");
  res.redirect("/listing");
};

module.exports.editFormlisting = async (req, res) => {
  const { id } = req.params;
  const result = await listing.findById(id);
  if (!result) {
    req.flash("error", "Listing Does not exist");
    res.redirect("/listing");
  }

  let orginalUrl = result.image.url;
  orginalUrl = orginalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { result, orginalUrl });
};

module.exports.editlisting = async (req, res) => {
  const { id } = req.params;
  let listingData = await listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listingData.image = { url, filename };
    await listingData.save();
  }

  req.flash("success", "listing was UPDATED");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "listing was Deleted");
  res.redirect("/listing");
};
