const Coupon = require("../models/coupon");
const { users } = require("../utils/constants");

// Get all coupon with filter
exports.getCoupons = (query, limit, page, sort) => {
  return new Promise((resolve, reject) => {
    Coupon.find(query)
    .populate({
      path: "created_by",
      model: users.model,
      select: "name email",
    })
      .sort(sort)
      .skip(limit * page - limit)
      .limit(limit)
      .exec()
      .then((docs) => {
        Coupon.countDocuments(query)
          .then((totalCount) => {
            resolve({ docs: docs, totalCount: totalCount });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Add coupon record
exports.addCoupon = (data) => {
  return new Promise((resolve, reject) => {
    const coupon = new Coupon({ ...data });
    coupon
      .save()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Get coupon by id
exports.getCouponById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Coupon
      .find(condition)
      .select("-__v")
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Update coupon record by id
exports.updateCoupon = (id, data) => {
  return new Promise((resolve, reject) => {
    Coupon.updateOne({ _id: id }, { $set: data }, { new: true })
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};