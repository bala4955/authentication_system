const { buildErrObject } = require('../../../middlewares/buildErrObject')
const CODE = require("../../httpResponseCode");

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
const itemNotFound = (err = {}, item = {}, message = 'NOT_FOUND') => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(422, err.message))
    }
    if (!item) {
      return reject(buildErrObject(CODE.NOT_FOUND, message))
    }
    resolve()
  })
}

module.exports = { itemNotFound }
