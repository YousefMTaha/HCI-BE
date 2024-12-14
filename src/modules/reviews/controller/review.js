import { StatusCodes } from "http-status-codes";
import reviewModel from "../../../../DB/model/Review.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../../DB/model/Product.model.js";

export const getReviewsOfProduct = asyncHandler(async (req, res, next) => {
    const reviews = await reviewModel.find({ productId: req.params._id });
    // const modifiedReviwes = reviews.map((review) => ({
    //     ...review.toObject(),
    //     createdBy: review.createdBy.name,
    //     productId: review.createdBy.productId,
    // }));
    return res.json({ messgae: "Reviews Returned Successfully", reviews })
});

export const addReview = asyncHandler(async (req, res, next) => {
    const rev = await reviewModel.findOne({ productId: req.body.productId, createdBy: req.user._id })
    if (rev) {
        return next(new ModifyError(`You already reviewd this product before`, StatusCodes.CONFLICT));
    }
    req.body.createdBy = req.user._id;
    req.body.productId = req.product._id;
    req.product.noRating++;
    req.product.totalRating += req.body.rate;
    await req.product.save();
    const review = await reviewModel.create(req.body);
    return res.json({ messgae: "Reviews Added Successfully", review: review });
});

export const updateReview = asyncHandler(async (req, res, next) => {
    if (req.body.rate) {
        req.product.totalRating -= req.review.rate;
        req.product.totalRating += req.body.rate;
        await req.product.save();
    }

    const rev = await req.review.updateOne(req.body);
    return res.json({ messgae: "Reviews Updated Successfully", rev })
});

export const deleteReview = asyncHandler(async (req, res, next) => {
    req.product.noRating--;
    req.product.totalRating -= req.review.rate;
    await req.product.save();
    await req.review.deleteOne();

    return res.json({ messgae: "Reviews Deleted Successfully" });
});


