/**
 * Handles error by printing to console sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const handleError = (res = {}, err = {}) => {
  // Prints error in console
  console.log("caught handleError  ", err);
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};

module.exports = { handleError };
