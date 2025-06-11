const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        //newurlParser: true, useUnifiedTopology: true ye options purani mongoose version ke liye hain
        // Ab mongoose ke naye version mein ye options default hain
        // isliye inhe dene ki zarurat nahi hai    
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}
module.exports = connectDB;