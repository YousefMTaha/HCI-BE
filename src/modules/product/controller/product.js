import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/model/Product.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import * as validation from "../product.middleware.js";

export const addProduct = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.subcategoryId = req.subcategory._id;
  req.body.brandId = req.brand._id;
  req.body.quantity = await validation.validateNumber(
    "quantity",
    req.body.quantity
  );
  req.body.price = await validation.validateNumber("price", req.body.price);
  req.product = await productModel.create(req.body);
  return next();
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findOneAndUpdate(
    { _id: req.product._id },
    req.body,
    {
      new: true,
    }
  );
  return res.status(200).json({
    message: "success",
    product,
  });
});

export const removeProduct = asyncHandler(async (req, res, next) => {
  await req.product.deleteOne();
  return res.status(200).json({ message: "success" });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel
    .findById(req.params._id)
    .populate("subcategoryId")
    .populate("createdBy");
  return res.status(200).json({
    message: "success",
    product: product,
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel
    .find()
    .populate("subcategoryId")
    .populate("createdById");
  const modifiedProducts = products.map((product) => ({
    ...product.toObject(),
    createdBy: product.createdById.name,
    category: product.subcategoryId.name,
  }));
  return res.status(200).json({
    message: "success",
    products: modifiedProducts,
  });
});

export const getUserProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel.find({ createdBy: req.user._id });
  return products.length
    ? res.status(200).json({ message: "success", products })
    : next(new ModifyError("no products found", StatusCodes.NOT_FOUND));
});
