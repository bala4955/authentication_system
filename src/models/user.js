const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const { users } = require("../utils/constants");
const { enumValidator } = require("../utils/validate");
const { userRoles } = require("../utils/constants")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "User",
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      unique: true,
      required: true,
      default: null,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    role: {
      type: String,
      validate: enumValidator(userRoles),
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(
  users.model,
  UserSchema,
  users.collection
);
