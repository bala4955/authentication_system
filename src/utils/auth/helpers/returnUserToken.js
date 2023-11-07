const { generateToken } = require("./generateToken");

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const returnUserToken = (req = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    resolve({
      token: generateToken(user._id),
      user: user
    });
  });
};

module.exports = { returnUserToken };
