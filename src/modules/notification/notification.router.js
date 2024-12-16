import notificationModel from "../../../DB/model/notification.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getAllNotification = asyncHandler(async (req, res) => {
  return res.json({
    message: "success",
    data: await notificationModel.find({ userId: req.user._id }),
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  return res.json({
    message: "success",
    data: await notificationModel.findOneAndUpdate(
      { _id: req.params.id },
      { isRead: true },
      { new: true }
    ),
  });
});

export const sendUpdateNotification = async (productId) => {
  const users = await userModel.aggregate([
    { $unwind: "$wishlist" },
    {
      $match: {
        $or: [{ wishlist: productId }, { wishlist: productId.toString() }],
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  users.forEach(async (user) => {
    await notificationModel.create({
      content: `the seller of the Product "${req.product.name} that in your wishlist updated it`,
      userId: user._id,
    });
  });
};

export const sendDeleteNotification = async (productId) => {
  const users = await userModel.aggregate([
    { $unwind: "$wishlist" },
    {
      $match: {
        $or: [{ wishlist: productId }, { wishlist: productId.toString() }],
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  users.forEach(async (user) => {
    await notificationModel.create({
      content: `the seller of the Product "${req.product.name} that in your wishlit deleted it"`,
      userId: user._id,
    });

    await userModel.updateOne(
      { _id: user._id },
      {
        $pull: { wishlist: productId },
      }
    );
  });
};

export const sendnewMessageNotification = async (loginUser, otherUser) => {
  users.forEach(async (user) => {
    await notificationModel.create({
      content: `You have recieved msg from "${otherUser}"`,
      userId: loginUser,
    });
  });
};
