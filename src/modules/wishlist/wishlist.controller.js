import { ModifyError } from "../../utils/classError.js";
import productModel from "../../../DB/model/Product.model.js";
import userModel from "../../../DB/model/User.model.js";

// add to wishlist
export const addToWishlist = async (req, res, next) => {
  // get data from req
  let { productId } = req.body;
  // check product exist
  const productExist = await productModel.findById(productId);
  if (!productExist) {
    return next(new ModifyError(messages.product.notFound, 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  ); // user.wishlist=[1,2,3]
  return res.status(200).json({
    message: "success",
    success: true,
    data: user,
  });
};
export const deleteFromWishlist = async (req, res, next) => {
  // get data from req
  const { productId } = req.params;
  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: productId },
      },
      {
        new: true,
      }
    )
    .select("wishlist");
  return res.status(200).json({
    message: "success",
    success: true,
    data: user,
  });
};
