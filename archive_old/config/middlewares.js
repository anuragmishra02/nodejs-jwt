const body_parser = require("body-parser");

module.exports = (app) => {
    app.use(body_parser.urlencoded({ extended: true }));
    app.use(body_parser.json());
};