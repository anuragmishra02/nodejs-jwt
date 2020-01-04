// const morgan = require("morgan");
// const chalk = require("chalk").default;
// const winston = require("winston");
// // const morgan = require("morgan");
// const expressWinston = require("express-winston");

// const logger= winston.createLogger({
//     format: winston.format.combine(
//         winston.format.json(),
//         winston.format.timestamp()
//     )
// });

// logger.add(
//     new winston.transports.Console()
// );

// const transports = [
//     new winston.transports.Console({
//         format: winston.format.combine(
//             winston.format.printf((info) => {
//                 const { level, message, meta: { req, res, responseTime }, timestamp } = info;

//                 let logText = "\n";

//                 const fromWinston = {
//                     level: `${level}`,
//                     message: `${message}`,
//                     response_status: `${res.statusCode}`,
//                     response_time: `${responseTime}`,
//                     timestamp: `${timestamp}`,
//                     url: `${req.url}`,
//                     method: `${req.method}`,
//                     host: `${req.headers["host"]}`,
//                     user_agent: `${req.headers["user-agent"]}`,
//                     accept_lang: `${req.headers["accept-language"]}`
//                 };
                
//                 for(const key in fromWinston){
//                     logText += key + ": ";
//                     logText += chalk.cyanBright(fromWinston[key]);
//                     logText += ", ";
//                 }

//                 return logText;
//             })
//         )        
//     }),    
//     // new winston.transports.Console()
// ];

// const winstonMiddleware = expressWinston.logger({
//     expressFormat: true,
//     meta: true,
//     winstonInstance: winstonLogger,
//     ignoreRoute: (req, res) => { 
//         return req.path.includes("/api-docs/swagger/");                    
//     } // optional: allows to skip some log messages based on request and/or response
// });

// exports.configLogger = (app) => {
//     app.use(winstonMiddleware);    
// };

// exports.logger = winstonLogger;