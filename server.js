require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
const routes = require("./routes/index.js")

const environement = process.env.NODE_ENV;
const stage = require("./config")[environement];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (environement !== 'production') {
    app.use(logger('dev'));
};

app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
    console.log(`Server listening on port ${stage.port}`)
});

module.exports = app;