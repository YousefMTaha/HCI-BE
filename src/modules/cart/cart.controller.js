import cartModel from "../../../DB/model/Cart.model.js";
import { ModifyError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";

/*
two conditions:
1- product is in cart already
2- product isn't in cart
*/

export const add = asyncHandler(async (req, res, next) => {
  // check if the product is already exist in the cart
  req.body.productExist
    ? // update quantity of the exist product in the cart
      await cartModel.updateOne(
        {
          _id: req.cart._id,
          "products.id": req.product._id,
        },
        {
          "products.$.quantity": req.body.quantity,
        }
      )
    : // add the product info to the user cart
      await req.cart.updateOne({
        $push: {
          products: { id: req.product._id, quantity: req.body.quantity || 1 },
        },
      });

  return res.status(200).json({ message: "success" });
});

export const update = asyncHandler(async (req, res, next) => {
  await cartModel.updateOne(
    {
      _id: req.cart._id,
      "products.id": req.product._id,
    },
    {
      "products.$.quantity": req.body.quantity,
    }
  );
  return res.status(200).json({ message: "success" });
});

export const remove = asyncHandler(async (req, res, next) => {
  // check if the product is exist in cart or not
  if (!req.body.productExist)
    return next(new ModifyError("product not found", StatusCodes.BAD_REQUEST));

  // remove the product from cart that match product.id = cart.products.id
  await cartModel.updateOne(
    { _id: req.cart._id },
    {
      $pull: { products: { id: req.product._id } },
    }
  );
  return res.status(200).json({ message: "success" });
});

export const get = async (req, res, next) =>
  res.status(200).json({ message: "success", cart: req.cart });
