const { buildErrObject } = require('../middlewares/buildErrObject');
const { handleError } = require('../middlewares/handleError');
const CODE = require("../utils/httpResponseCode");

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
const roleAuthorization = () => async (req, res, next) => {
  try {
    if(!req.user){
      return buildErrObject(CODE.UNAUTHORIZED, 'UNAUTHORIZED')
    }
    if(req.user.role !== "admin") {
      return handleError(res, buildErrObject(CODE.UNAUTHORIZED, 'You do have permission to do this action, Only Admins are allowed'));
    } else {
      next();
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { roleAuthorization }
