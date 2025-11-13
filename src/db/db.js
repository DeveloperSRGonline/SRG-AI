// require mongose
const  mongoose = require('mongoose')

// mondodb database connectin logic function
// async because it take time to do 
// try and catch for safe case if error it catch 
async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected')
    } catch (error) {
        console.log("Error in connecting to database",error)
    }
}

// export connectToDB function to use in server.js
module.exports = connectToDB;