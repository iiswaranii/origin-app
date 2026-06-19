const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoute = require('./routes/auth.routes');
const reflectionRoutes = require("./routes/reflection.routes");
const lifeMomentRoutes = require("./routes/lifeMoment.routes");
const taxonomyRoutes = require("./routes/taxonomy.routes");

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
app.use("/api/v1/reflections", reflectionRoutes);
app.use("/api/v1/life-moments", lifeMomentRoutes);
app.use("/api/v1", taxonomyRoutes);

module.exports = app;