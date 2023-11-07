const mongoose = require("mongoose");
const { coupons } = require("../utils/constants");

const couponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    created_on: {
      type: Date,
    },
    modified_on: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_on", updatedAt: "modified_on" },
  }
);

module.exports = mongoose.model(coupons.model, couponsSchema, coupons.collection);
