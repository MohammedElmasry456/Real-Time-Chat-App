const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config({ path: "config.env" });
const userRoute = require("./routes/userRoute");
const userModel = require("./models/userModel");
const chatModel = require("./models/chatModel");
const app = express();
app.use(express.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server);

//middlewares
app.use(express.json());
app.use(express.static("public"));

//set view engine and view directory
app.set("view engine", "ejs");
app.set("views", "views");

//connection to database
connectDB();

//Socket.io Connection
io.on("connection", async (socket) => {
  console.log("user connected!");
  const user_Id = socket.handshake.auth.token;

  await userModel.findByIdAndUpdate(user_Id, { is_Online: true });
  io.sockets.emit("getOnlineUsers", { user_Id });

  socket.on("newChat", (res) => {
    socket.broadcast.emit("loadNewChat", { data: res.data });
  });

  socket.on("loadOldChat", async (res) => {
    const chats = await chatModel
      .find({
        $or: [
          { sender_id: res.receiver_id, receiver_id: res.sender_id },
          {
            receiver_id: res.receiver_id,
            sender_id: res.sender_id,
          },
        ],
      })
      .sort("createdAt");

    if (res.action === "delete" || res.action === "update") {
      io.sockets.emit("oldChats", chats);
    } else {
      socket.emit("oldChats", chats);
    }
  });

  socket.on("disconnect", async (reason) => {
    console.log("user disconnected | " + reason);
    await userModel.findByIdAndUpdate(user_Id, { is_Online: false });
    io.sockets.emit("getOfflineUsers", { user_Id });
  });
});

//mount routes
app.use(userRoute);
app.all("*", (req, res) => {
  res.redirect("/login");
});

//server listen
const connect = server.listen(process.env.PORT, () => {
  console.log(`connected successfully to port: ${process.env.PORT}`);
});

//Handle uncaughtException
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error: ${error.name} | ${error.message}`);
  connect.close(() => {
    console.log("server shutting down .....");
    process.exit(1);
  });
});
