import * as mongo from "mongoose";
import reviewModel from "./Review.model.js";

const productSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      min: [1, "Min length is 1 char"],
      max: [500, "Max length is 500 char"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    subcategoryId: {
      type: mongo.Types.ObjectId,
      ref: "Subcategory",
      required: [true, "subCategory is required"],
    },
    category: {
      type: mongo.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: { type: Number, default: 1 },
    createdBy: { type: mongo.Types.ObjectId, ref: "User", required: true },
    brandId: {
      type: mongo.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    noRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    color: [String],
    size: [String],
    images: [Object],
    imageCover: {
      type: Object,
      default: {
        public_id: "123",
        secure_url:
          "https://cdn.discordapp.com/attachments/724206735350431763/1239191116579078236/no-image-available-icon-vector.png?ex=66420629&is=6640b4a9&hm=050cbbdf7a67532d60393443bc239d5566037b26866f2d44af1f5b8726943306&",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("avgRating").get(function () {
  // console.log(this);
  if (this.noRating == 0) return 0;
  return this.totalRating / this.noRating;
});

productSchema.method("check_Stock", function (quantity) {
  return quantity <= this.stock;
});

productSchema.post("deleteOne", async function () {
  // delete the reviews related to this product
  await reviewModel.deleteMany({ productId: this.getFilter()._id });
});

const productModel = mongo.model("Product", productSchema);
export default productModel;
