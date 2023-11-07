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
        res.status(200).json({message: "User Successfully Logged In!", userData: {
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
    const data = matchedData(req);
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

module.exports = { login, register, updateUser };
