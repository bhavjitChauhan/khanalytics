require('dotenv').config();
const cors = require('cors');
const helmet = require("helmet");
const express = require('express');

require('./jobs/hotlist');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(helmet());

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}...`);
});
