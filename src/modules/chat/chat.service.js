import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/User.model.js";
import { chatModel } from "../../../DB/model/chat.model.js";

export const setNewSocketId = async (id, newSocket) => {
  await userModel.updateOne({ _id: id }, { socketId: newSocket });
};

export const checkToken = async (token) => {
  try {
    const { _id } = jwt.verify(token, process.env.TOKEN_SIGNATURE);

    const user = await userModel.findById(_id);
    // console.log(user);

    return user ? user : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addMsg = async (user, data) => {
  const { to, message } = data;

  await chatModel.create({
    from: user._id,
    to,
    content: message,
  });
};

export const getAllMsgs = async (loginUserId, anotherUserId) => {
  return await chatModel.find({
    $or: [
      { to: loginUserId, from: anotherUserId },
      {
        to: anotherUserId,
        from: loginUserId,
      },
    ],
  });
};
