const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/route');
const cookieParser = require('cookie-parser');
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}
));
app.use(express.static('public')); // ✅ Correct

app.use(cookieParser());
app.use('/api/v1', router);
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // console.log(this.stack);
    console.log("therre is some error in the server");
    return res.status(statusCode).json({ error: message });
})
module.exports = app;