const User = require("../../../models/user");
const { buildErrObject } = require("../../../middlewares/buildErrObject");

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = (email = "") => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email})
      .exec()
      .then((item) => {
        if (item) {
          return reject(buildErrObject(422, "EMAIL_ALREADY_EXISTS"));
        }
        resolve(false);
      })
      .catch((err) => {
        return reject(buildErrObject(422, err.message));
      });
  });
};

module.exports = { emailExists };
