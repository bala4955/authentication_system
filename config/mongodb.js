
const mongoose = require("mongoose");
mongoose.set("debug", false);
let count = 0;
let db_url = process.env.MONGO_URI; // Mongo DB URL fetching from env file
const options = {};

//Conneting to MongoDB
const connectWithRetry = () => {
  console.log("MongoDB Connecting.... ", db_url);
  mongoose
    .connect(db_url, options)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(
        "MongoDB connection unsuccessful, retry after 5 seconds. ",
        ++count
      );
      console.log(err);
      console.log("MongoDB connection with retry"); // retrying connection
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = {
  connectWithRetry,
};
