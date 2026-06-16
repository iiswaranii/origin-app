const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoute = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "Origin backend running!"
    })
});

app.use("/api/v1/auth", authRoute);

module.exports = app;