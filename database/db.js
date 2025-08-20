require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.DB_URI

const connectDB = async () => {
    try {
        await mongoose.connect(URI,{dbName:"NotesDb"});
        console.log("DB Connected to NotesDb")
    } catch (error) {
        console.log("DB Connection Failed")        
    }
}

module.exports = connectDB