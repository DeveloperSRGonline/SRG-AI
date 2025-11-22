// require Server class from socket.io
const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createVector, queryMemory } = require("../services/vector.service");


// socket server init function
// we pass httpServer because socket.io works on top of http server
function initSocketServer(httpServer) {


  // create new socket server
  // you can pass options later (cors, timeouts, etc.)
  const socketIoServer = new Server(httpServer, {});

  socketIoServer.use(async (socket, next) => {


    // extracting cookie comming from socket
    const browserCookies = cookie.parse(socket.handshake.headers?.cookie || "");


    // first we check in cookie token exist of not
    if (!browserCookies.token) {
      next(new Error("Authentication error: no token provided"));
    }

    // if token available then we verify it
    try {
      const decodedTokenInformation = jwt.verify(browserCookies.token, process.env.JWT_SECRET_KEY);
      socket.user = await userModel.findById(decodedTokenInformation.id);
      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });


  // this runs when any user connects
  socketIoServer.on("connection", (socket) => {
    socket.on("ai-message", async (userMessageData) => {


      // saving user message in the mongodb
      await messageModel.create({
        chat: userMessageData.chat,
        user: socket.user._id,
        content: userMessageData.content,
        role: "user",
      });

      // generating vector
      try {
        const vectors = await generateVector(userMessageData.content);

        await createVector({
          vectors,
          messageId: new Date().getTime().toString(),
          metadata: {
            chat: userMessageData.chat,
            user: socket.user._id.toString(),
            text: userMessageData.content
          }
        })

        const vectorMemory = await queryMemory({
          queryVector:vectors,
          limit:5,
          metadata:{
            
          }
        })
      } catch (error) {
        console.error("Error in vector generation/saving:", error);
      }

      // getting chat history of the chat id
      const pastConversationMessages = (
        await messageModel
          .find({ chat: userMessageData.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();


      // adding current message to the history so AI can see it
      pastConversationMessages.push({
        role: "user",
        content: userMessageData.content
      });


      // getting ai response
      try {
        const aiGeneratedText = await generateResponse(
          pastConversationMessages.map((message) => {
            return {
              role: message.role,
              parts: [{ text: message.content }],
            };
          })
        );

        // sending ai response to the frontend
        socket.emit("ai-response", {
          content: aiGeneratedText,
          chat: userMessageData.chat,
        });

        // saving model response in the mongodb
        await messageModel.create({
          chat: userMessageData.chat,
          user: socket.user._id,
          content: aiGeneratedText,
          role: "model",
        });

        // generating vector of the ai response
        try {
          const vectors = await generateVector(aiGeneratedText);

          await createVector({
            vectors,
            messageId: new Date().getTime().toString(),
            metadata: {
              chat: userMessageData.chat,
              user: socket.user._id.toString(),
              text: aiGeneratedText
            }
          })
        } catch (error) {
          console.error("Error in vector generation/saving:", error);
        }

      } catch (error) {
        console.error("Error generating AI response:", error);
        socket.emit("ai-response", {
          content: "Sorry, I encountered an error processing your request.",
          chat: userMessageData.chat,
        });
      }
    });
  });
}


// export function so we can use it in server.js
module.exports = initSocketServer;
