const express = require("express");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const health = require("./src/utils/health");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(
    mongoSanitize({
      replaceWith: "_",
      onSanitize: ({ req, key }) => {
        console.log(
          `Request: ${req.originalUrl} | This request[${key}] is sanitized`
        );
      },
    })
);

//enables cors
app.use(cors());
app.disable("etag");
app.use(passport.initialize());

// Add Body Parser
app.use(bodyParser.json({ limit: "60mb" }));
app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

let setOrigin = "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", setOrigin);
  res.setHeader("Cache-Control", 9600);
  next();
});
  
//Load env variables
require("./config/envConfig").config();

//Mongo DB Connection
require("./config/mongodb").connectWithRetry();

app.use("/api/user", require("./src/routes/auth"));
app.use("/api/coupon", require("./src/routes/coupon"));

app.use("/api/health-check", health.check);


const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log("Error::", err);
    }
    console.log(`Running Node server from port - ${port}`);
});