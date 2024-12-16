import userModel from "../../../DB/model/User.model.js";
import * as socketService from "../real-time/chat.service.js";

function configSocket(io) {
  io.on("connection", (socket) => {
    console.log("connected");
    console.log(socket.id);

    socket.on("updateSocketId", async (token) => {
      try {
        console.log("updatedSocketID");

        const user = await socketService.checkToken(token);
        console.log(user);

        await socketService.setNewSocketId(user._id, socket.id);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("addMessage", async (data) => {
      try {
        console.log("addMsg");
        const user = await socketService.checkToken(data.token);

        io.emit("newMessage", {
          from: user._id,
          to: data.to,
          message: data.message,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("getMessages", async (data) => {
      try {
        // console.log("getMessages");
        const user = await socketService.checkToken(data.token);
        const msgs = await socketService.getAllMsgs(user._id, data.to);

        const user2 = await userModel.findById(to);

        // console.log(msgs);
        const res = {
          name: user2.name,
          toId: data.to,
          messages: msgs.map((ele) => {
            if (user._id.toString() == ele.from.toString()) {
              return {
                senderId: ele.from._id,
                sender: "Me",
                content: ele.content,
              };
            } else {
              return {
                senderId: ele.to._id,
                sener: ele.to.name,
                content: ele.content,
              };
            }
          }),
        };
        socket.emit("retrieveMessages", res);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

export default configSocket;
