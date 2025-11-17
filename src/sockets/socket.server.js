// require Server class from socket.io
const { Server, Socket } = require("socket.io");

// socket server init function
// we pass httpServer because socket.io works on top of http server
function initSocketServer(httpServer) {

  // create new socket server
  // you can pass options later (cors, timeouts, etc.)
  const io = new Server(httpServer, {});

  // this runs when any user connects
  io.on("connection", (socket) => {

    // show socket id in terminal for debugging
    console.log("New socket connection : ", socket.id);

    // here later you will listen events like:
    // socket.on("send_message", () => {})
    // socket.on("join_chat", () => {})
    // etc.
  });
}

// export function so we can use it in server.js
module.exports = initSocketServer;
