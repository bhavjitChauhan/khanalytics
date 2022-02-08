require('dotenv').config();
const cors = require('cors');
const helmet = require("helmet");
const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');

const khan = require('./routes/khan');
const hotlist = require('./routes/hotlist');
const statistics = require('./routes/statistics');
const performanceRouter = require('./routes/performance');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.simple(),
    meta: false,
    msg: "{{req.ip}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
}));

app.use(express.static('dist'));
app.use('/khan', khan);
app.use('/hotlist', hotlist);
app.use('/statistics', statistics);
app.use('/performance', performanceRouter);

app.get('/status', (req, res) => {
    res.json({
        message: 'OK',
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
    });
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}...`);
});
