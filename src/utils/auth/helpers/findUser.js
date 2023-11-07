const User = require("../../../models/user");
const { itemNotFound } = require("../../auth/helpers/itemNotFound");

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = (email = "") => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email})
      .select("_id name email password role")
      .exec()
      .then(async (item) => {
        if (item) {
          resolve(item);
        }
        resolve(false);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUserById = (id = "") => {
  return new Promise((resolve, reject) => {
    User.findOne({_id: id})
      .select("_id name email")
      .exec()
      .then(async (item) => {
        if (item) {
          resolve(item);
        }
        resolve(false);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { findUser, findUserById };
