const { CouponORM } = require("../orm");
const CODE = require("../utils/httpResponseCode");
const { hideCoupons } = require("../utils/commonFunctions")
const _ = require("lodash");

// Get all coupons
exports.getAllCoupons = (req, res) => {
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
        CouponORM.getCoupons(query, limit, page, sort)
        .then(async(result) => {
            if(result.docs && result.docs.length > 0){
                if(req.user.role !== "admin"){
                    result.docs = await hideCoupons(result.docs)
                }
            }
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
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
    }
};

// Create coupon record
exports.createCoupon = async (req, res) => {
    try {
        if (req.body.name === undefined || req.body.code === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments" });
        }
        if (req.body.code.length !== 10) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Coupon code length should be 10" });
        }
        CouponORM.addCoupon({
            name: req.body.name,
            code: req.body.code,
            created_by: req.user._id
        })
        .then((doc) => {
            res
            .status(CODE.NEW_RESOURCE_CREATED)
            .json({ message: `Coupon created successfully!`, coupon: doc });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(200).send({err: error, message: `Something Went wrong in CMS`});
    }
};

// Get coupoon by id
exports.getCouponDetails = (req, res) => {
    try {
        if (
            req.params.couponId !== undefined && !mongoose.isValidObjectId(req.params.couponId)
        ) {
            return res.status(CODE.NOT_FOUND).json({ message: MESSAGE.INVALID_VALUE });
        }
        const id = mongoose.Types.ObjectId(req.params.couponId);
        CouponORM.getCouponById(id)
        .then(async (doc) => {
            if (!_.isEmpty(doc)) {
                if(doc && doc.length > 0){
                    if(req.user.role !== "admin"){
                        doc = await hideCoupons(doc)
                    }
                }
                res.status(CODE.EVERYTHING_IS_OK).json(doc);
            } else {
                res
                    .status(CODE.NOT_FOUND)
                    .json({ message: "No record found" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};



// Update coupn by id
exports.updateCouponDetails = (req, res) => {
    try {
        const id = req.params.couponId;
        if (_.isEmpty(req.body)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        if (req.body.code && req.body.code.length !== 10) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Coupon code length should be 10" });
        }
        CouponORM.getCouponById(id)
        .then((doc) => {
            if (doc) {
            let updateOps = {};
            if (req.body.name !== undefined) {
                updateOps.name = req.body.name;
            }
            if (req.body.code !== undefined) {
                updateOps.code = req.body.code;
            }
            CouponORM.updateCoupon(id, updateOps)
                .then((doc) => {
                    res.status(CODE.EVERYTHING_IS_OK)
                    .json({ message: `Coupon updated successfully!` });
                })
                .catch((err) => {
                    res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
                });
            } else {
            res
                .status(CODE.NOT_FOUND)
                .json({ message: "No record found!" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};
