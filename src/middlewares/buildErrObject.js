/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
const buildErrObject = (code = '', message = 'Error') => {
    return {
      code,
      message
    }
  }
  
  module.exports = { buildErrObject }
  