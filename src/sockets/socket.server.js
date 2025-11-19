// require Server class from socket.io
const { Server, Socket } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require('../services/ai.service')
const messageModel = require("../models/message.model");
const { default: mongoose } = require("mongoose");


// socket server init function
// we pass httpServer because socket.io works on top of http server
function initSocketServer(httpServer) {
  // create new socket server
  // you can pass options later (cors, timeouts, etc.)
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    // extracting cookie comming from socket
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    // first we check in cookie token exist of not
    if (!cookies.token) {
      next(new Error("Authentication error: no token provided"));
    }

    // if token available then we verify it
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      socket.user = await userModel.findById(decoded.id);
      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  // this runs when any user connects
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {

      // saving user message in the mongodb
      await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user._id,
        content:messagePayload.content,
        role:"user"
      })

      // getting chat history of the chat id
      const chatHistory = await messageModel.find({chat:messagePayload.chat})
    
      // getting ai response
      const response = await aiService(chatHistory.map(item => {
        return {
          role:item.role,
          parts:[{text:item.content}]
        }
      }))

      // sending ai response to the frontend
      socket.emit('ai-response',{
        content:response,
        chat:messagePayload.chat
      })

      // saving model response in the mongodb
      await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user._id,
        content:response,
        role:"model"
      })
    });
  });
}

// export function so we can use it in server.js
module.exports = initSocketServer;
