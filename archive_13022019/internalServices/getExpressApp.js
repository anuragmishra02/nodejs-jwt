const express = require("express");
const body_parser = require("body-parser");

module.exports = () => {
    const app = express();
    const router = express.Router();

    app.use(body_parser.urlencoded({ extended: true }));
    app.use(body_parser.json());

    return { app, router };
};

