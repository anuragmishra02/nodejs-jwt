require("dotenv").config();

const express = require("express");
const app = express();
// const { logger, configLogger } = require("./config/logging");
const configMiddleware = require("./config/middlewares");
const cookie_parser = require("cookie-parser");
// const service_registry_client = require("./config/service_registry");

configMiddleware(app);
// configLogger(app);
app.use(cookie_parser("stacker_secret"));

const printDetails = (req, res, next) => {
    console.log(req.originalUrl);     
    console.log(req.baseUrl);
    console.log(req.method);
    console.log(req.path);
    next();    
};

const route_apiDocs = require("./routes/api-docs");
const route_userServices = require("./routes/user");

app.use("/api-docs", route_apiDocs);

app.use(`/user/${process.env.Service_User_Version}`, printDetails, route_userServices);

app.use((req, res, next) => res.status(404).send("Service does not exists"));

(async () => {    
    
    app.listen(process.env.PORT, () => {
        console.log(`Gateway serving at ${process.env.PORT}`);
    });

})();
