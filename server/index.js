require('dotenv').config();
const cors = require('cors');
const helmet = require("helmet");
const express = require('express');

const khan = require('./routes/khan');
const hotlist = require('./routes/hotlist');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(helmet());

app.use('/hotlist', hotlist);
app.use('/khan', khan);

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
