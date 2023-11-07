const path = require("path");

exports.config = () => {
  const environment = "development";
  let envPath = "./env/.env-dev";
  require("dotenv").config({ path: path.resolve(process.cwd(), envPath) });
  return environment;
};
