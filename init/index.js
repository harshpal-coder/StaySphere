const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/hotel";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}



const initDB = async () => {
  await Listing.deleteMany({});
  console.log("data was deleted");

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "689d53cbe97000b7d41ff89d" // Replace with a valid user ID
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();