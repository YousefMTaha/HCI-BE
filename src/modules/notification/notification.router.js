import notificationModel from "../../../DB/model/notification.model.js";
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
