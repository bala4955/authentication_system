const router = require("express").Router();
const { CouponService } = require("../services");
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], {
  session: false,
});
const { roleAuthorization } = require("../middlewares/roleAuthorization");

// get all coupons
router.get("/", [
  requireAuth,
  CouponService.getAllCoupons,
]);

// Create coupon api
router.post("/", [
  requireAuth,
  roleAuthorization(),
  CouponService.createCoupon,
]);

// get role details by Id
router.get("/:couponId", [
  requireAuth,
  CouponService.getCouponDetails,
]);

// update role details by Id
router.put("/:couponId", [
  requireAuth,
  roleAuthorization(),
  CouponService.updateCouponDetails,
]);


module.exports = router;
