// packages require
const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')



// instance of app(server create)
const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())

// api
app.use('/api/auth',authRoutes)
app.use('/api/chat',chatRoutes)

// app export to use in server.js
module.exports = app;