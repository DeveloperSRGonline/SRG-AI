// configuring dotenv
require('dotenv').config()
// require
const connectToDB = require('./src/db/db')
const app = require('./src/app')

// calling connect to db function
connectToDB()

// server start
app.listen(3000,()=> {
    console.log('Server is running on port 3000')
})