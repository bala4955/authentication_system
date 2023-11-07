const router = require("express").Router();
const { CouponService } = require("../services");
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], {
  session: false,
});

// get all coupons
router.get("/", [
  requireAuth,
  CouponService.getAllCoupons,
]);

// Create coupon api
router.post("/", [
  requireAuth,
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
  CouponService.updateCouponDetails,
]);


module.exports = router;
