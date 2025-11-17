// require
const chatModel = require('../models/chat.model')

// controller function to create chat
async function createChat(req,res){
    // we only get here titme in req
    const {title} = req.body;
    
    // extracting user from req.user comming form authMiddleware
    const user = req.user;

    // creating chat
    const chat = await chatModel.create({
        user:user._id,
        title
    })

    // finally send message
    res.status(201).json({
        message:"Chat created successfully",
        chat:{
            id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user
        }
    })
}

// export chat controller
module.exports = {
    createChat
}