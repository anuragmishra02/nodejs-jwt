const winston = require("winston");
const { format } = winston;
const { combine, json, timestamp } = format;

const transports = [
    new winston.transports.Console()
];

module.exports = winston.createLogger({
    format: combine(
        timestamp(),
        json()
    ),
    transports
});
