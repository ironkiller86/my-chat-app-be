/*
 * import express
 */
const express = require("express");
/*
 * import http  module from nodes
 */
const http = require("http");
const Moment = require("moment");
/*
 *  import socketIo library
 */
const {
  addUser,
  removeUser,
  loadUsers,
  readUserByUId,
} = require("./UsersManager");
/*
 *  import cors package
 */
const cors = require("cors");
const router = require("./router");
/*
 *
 */
const app = express();
//app.use(cors());
/*app.use(router);*/
app.use(express.json());
/*
 *  creation of the serve
 */
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3333;
/**
 *
 * @param {*} timeStamp
 */
function getFullTime(timeStamp) {
  const stamp = new Date(timeStamp);
  const time = Moment(stamp).format("DD-MM-YYYY HH:mm:ss");

  return time;
}

io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  /*
   *
   */
  socket.on("newUser", (user) => {
    const userData = {
      nickname: user,
      uId: socket.id,
    };
    addUser(userData);
    let userOnline = loadUsers();
    socket.broadcast.emit("currentUserOnline", userOnline);
    socket.emit("currentUserOnline", userOnline);
    let message = {
      msgType: "system",
      title: `Messaggio di sistema`,
      message: `${userData.nickname} è entrato in chat ${getFullTime(
        Date.now()
      )}`,
    };
    socket.broadcast.emit("messageSystem", message);

    /*
     *
     */
    socket.on("messageToChat", (msg) => {
      console.log(msg);
      let message = {
        msgType: "chat",
        title: `${userData.nickname}`,
        message: msg,
      };
      socket.broadcast.emit("messageSystem", message);
      socket.emit("messageSystem", message);
    });
  });

  /*
   *
   */
  socket.on("disconnect", () => {
    let userOnline = loadUsers();
    socket.broadcast.emit("currentUserOnline", userOnline);
    const user = readUserByUId(socket.id);
    console.log("user disconnected", user);
    removeUser(socket.id);
    userOnline = loadUsers();
    if (user) {
      let message = {
        msgType: "system",
        title: `Messaggio di sistema`,
        message: `${user.nickname} ha abbandonato la chat  ${getFullTime(
          Date.now()
        )}`,
      };
      console.log("messages", message);
      socket.broadcast.emit("messageSystem", message);
      socket.broadcast.emit("currentUserOnline", userOnline);
    }
    console.log("Client disconnected");
  });
});
/*
 *
 */
server.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
