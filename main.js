const express = require("express");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const health = require("./src/utils/health");
const mongoSanitize = require("express-mongo-sanitize");
const swagger = require("./swagger");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Remove any keys containing prohibited characters
// Helps us to prevent NoSQL injections
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

//Setting Res Headers
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

//Routing endpoints for user/auth, /user and coupon modules
app.use("/api/user", require("./src/routes/auth"));
app.use("/api/coupon", require("./src/routes/coupon"));

//Endpoint for Checking application health 
app.use("/api/health-check", health.check);

//Enpoint for http://localhost:3000/
app.get("/", (req, res)=>{ res.send("Welcome To Authentication System, Pls refer API Doc for Using this application: http://localhost:3000/api-docs/")});

// Swagger set up
app.use("/api-docs/", swagger.authenticationSystem, swaggerUi.serve, swaggerUi.setup());

//Defining Port number
const port = 3000;

//Connection to the node sever, listning to port 3000
app.listen(port, (err) => {
    if (err) {
        console.log("Error::", err);
    }
    console.log(`Running Node server from port - ${port}`);
});