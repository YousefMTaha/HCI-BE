import { Router } from "express";
import { addToWishlist, deleteFromWishlist } from "./wishlist.controller.js";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const wishlistRouter = Router();

// add to wishlist
wishlistRouter.put("/", auth(), asyncHandler(addToWishlist));

wishlistRouter.put("/:productId", auth(), asyncHandler(deleteFromWishlist));
export default wishlistRouter;
