require("dotenv").config();
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  const newUser = new User({ email: "demo@gmail.com", username: "demo" });
  const registeredUser = await User.register(newUser, "demo1234");
  console.log("Default user created:", registeredUser.username);

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: registeredUser._id,
  }));
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");
};

initDB()
  .then(() => {
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });
