// packages require
const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')


// instance of app(server create)
const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())

// api
app.use('/api/auth',authRoutes)

// app export to use in server.js
module.exports = app;