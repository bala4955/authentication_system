
/**
 *
 * @param {string} coupons - array contains
 * Input: [{.., code: "3BNBGLEDJWND", name: "3BNBGLEDJWND"},{}....]
 * Output: [{.., code: "3BN******WND", name: "3BN******WND"},{}....]
 */
exports.hideCoupons = async (coupons) => {
    if (coupons && Array.isArray(coupons) && coupons.length > 0) {
      const couponsLen = coupons.length;
      for (let i = 0; i < couponsLen; i++) {
        if (coupons[i].code) {
          coupons[i].code = await hideCouponCode(coupons[i].code);
        }
        if (i == couponsLen - 1) {
          return coupons;
        }
      }
    } else {
      return coupons;
    }
};

/**
 *
 * @param {string} code - string contains
 * Input: 3BNBGLEDJWND
 * Output: "3BN******WND"
 */
const hideCouponCode = async (code) => {
  let strArray = code.split("");
  const strArrayLen = strArray.length;
  for (let i = 3; i < strArrayLen - 3; i++) {
    strArray[i] = "*";
  }
  return strArray.join("");
};