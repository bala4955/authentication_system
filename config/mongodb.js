
const mongoose = require("mongoose");
mongoose.set("debug", false);
let count = 0;
let db_url = process.env.MONGO_URI;
const options = {};
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
      console.log("MongoDB connection with retry");
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = {
  connectWithRetry,
};
