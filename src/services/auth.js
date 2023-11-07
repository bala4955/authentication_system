const { matchedData } = require("express-validator");
const { UserORM } = require("../orm");
const { returnRegisterToken } = require("../utils/auth/helpers/returnRegisterToken");
const { returnUserToken } = require("../utils/auth/helpers/returnUserToken");
const { findUser, findUserById } = require("../utils/auth/helpers/findUser");
const { checkPassword } = require("../middlewares/auth");
const { buildErrObject } = require('../middlewares/buildErrObject');
const { handleError } = require('../middlewares/handleError');
const { emailExists } = require('../utils/auth/helpers/emailExists');
const mongoose = require("mongoose");
const CODE = require("../utils/httpResponseCode");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
      try {
      req = matchedData(req);
      const doesEmailExists = await emailExists(req.email);
      if (!doesEmailExists) {
        const item = await UserORM.registerUser(req);
        const userInfo = {
          _id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
        };
        const response = await returnRegisterToken(item, userInfo);
        res.status(201).json(response);
      }
    } catch (error) {
      handleError(res, buildErrObject(400, error.message));
    }
  };

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await findUser(data.email);
    if(user){
      const isPasswordMatch = await checkPassword(data.password, user);
      if (!isPasswordMatch) {
        handleError(res, buildErrObject(CODE.FORBIDDEN, 'WRONG_PASSWORD'));
      } else {
        delete user.password;
        const response = await returnUserToken(req, user);
        res.status(CODE.EVERYTHING_IS_OK).json({message: "User Successfully Logged In!", userData: {
          token: response.token,
          _id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
        }});
      }
    } else {
      handleError(res, buildErrObject(CODE.NOT_FOUND, 'USER_NOT_FOUND'));
    }
  } catch (error) {
    handleError(res, buildErrObject(CODE.INTERNAL_SERVER_ERROR, error.message));
  }
};


/**
 * LoupdateUsergin function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUser = async (req, res) => {
  try {
    if (req.params.userId !== undefined && !mongoose.isValidObjectId(req.params.userId)) {
			return res.status(CODE.BAD_REQUEST).json({
			  message: "Invalid User Id"
			});
		}
    const userId = req.params.userId;
    const user = await findUserById(userId);
    if(user){ 
      const item = await UserORM.updateUser(userId, req);
      if(item){
        res.status(CODE.EVERYTHING_IS_OK).send({message: "User updated Successfuly"});
      } else {
        res.status(CODE.INTERNAL_SERVER_ERROR).send({message: "Error in User Update"});
      }
    } else {
      handleError(res, buildErrObject(CODE.NOT_FOUND, 'USER_NOT_FOUND'));
    }
  } catch (error) {
    handleError(res, buildErrObject(CODE.INTERNAL_SERVER_ERROR, error.message));
  }
};

// Get all coupons
const getAllUsers = (req, res) => {
  try {
      let query = {};
      let sort = {};
      // declare pagination variables
      const limit =
      req.query.limit !== undefined && parseInt(req.query.limit) > 0
          ? parseInt(req.query.limit)
          : 10;
      const page =
      req.query.page !== undefined && parseInt(req.query.page) > 0
          ? parseInt(req.query.page)
          : 1;
      
      if (req.query.sortBy !== undefined && req.query.orderBy !== undefined) {
          sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
      } else {
          sort.modified_on = -1;
      }
      UserORM.gettAllUsers(query, limit, page, sort)
      .then(async(result) => {
          res.status(CODE.EVERYTHING_IS_OK).json({
              current_page: page,
              total_record: result.totalCount,
              per_page: limit,
              previous_page: page - 1 > 0 ? page - 1 : undefined,
              last_page: Math.ceil(result.totalCount / limit),
              next_page: result.totalCount > limit * page ? page + 1 : undefined,
              coupons: result.docs,
          });
      })
      .catch((err) => {
          res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
      });
  } catch (error) {
    console.log(error)
      return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
  }
};

module.exports = { login, register, updateUser, getAllUsers };
