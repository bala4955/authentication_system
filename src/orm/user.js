const User = require('../models/user')
const { buildErrObject } = require('../middlewares/buildErrObject')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = (req = {}) => {
  return new Promise((resolve, reject) => {
    const data = {
      name: req.name,
      email: req.email,
      password: req.password,
      role: req.role
    };
    const user = new User({ ...data });
    user
      .save()
      .then((item) => {
        resolve(item);
      })
      .catch((err) => {
        reject(err);
      });
  });
}


/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const updateUser = (id='', req = {}) => {
  return new Promise((resolve, reject) => {
    const data = {
      name: req.body.name,
      role: req.body.role,
    };
    User.updateOne({ _id: id }, { $set: data }, { new: true })
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { registerUser, updateUser }
