const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

exports.authenticationSystem = (req, res, next) => {
  swaggerDocument.host = req.get("host");
  req.swaggerDoc = swaggerDocument;
  next();
};
