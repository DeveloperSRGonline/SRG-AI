// configuring dotenv
require('dotenv').config()
// require
const app = require('./src/app')
const connectToDB = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server')

// requiring httpServer and creating also
const httpServer = require('http').createServer(app)


// calling connect to db function
connectToDB()
// starting socket server
initSocketServer(httpServer)

// server start
httpServer.listen(3000,()=> {
    console.log('Server is running on port 3000')
})