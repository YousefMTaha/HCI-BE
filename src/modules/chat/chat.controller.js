import * as socketService from "./chat.service.js";

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

        // console.log({ data });

        await socketService.addMsg(user, data);

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
        // console.log(msgs);

        socket.emit("retrieveMessages", { messages: msgs });
      } catch (error) {
        console.log(error);
      }
    });
  });
}

export default configSocket;
