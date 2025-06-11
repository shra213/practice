// File: backend/index.js
// Description: This is the entry point for the backend server. It connects to the database and starts the server.
require("dotenv").config();
const connectDB = require("./db/db");
const app = require("./app");
connectDB().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Error starting server:", error.message);
});
