const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("mongo connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const addData = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67979dd30db1603a8c774b6b",
  }));
  await listing.insertMany(initData.data);
  console.log("data inserted");
};

addData();
