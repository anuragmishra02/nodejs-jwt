require("dotenv").config();
require("./config/environment_variables").parse();

const express = require("express");
const body_parser = require("body-parser");
const cookie_session = require("cookie-session");
const cookie_parser = require("cookie-parser");
const crypto = require("crypto");
const http_proxy_middleware = require("http-proxy-middleware");
const csurf = require("csurf");

const env = require("./config/environment_variables").getEnv();
const lib = require("./lib");
const logger = require("./config/logger");
const parse_requestBody_toString = require("./lib/parse_requestBody_toString");
const swagger_ui = require("./lib/swagger_ui");

const app = express();

/**
 * hpp module & helmet
 */
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cookie_parser());
app.use(cookie_session({
    httpOnly: true,
    name: "_stk_auth",
    keys: [crypto.randomBytes(16).toString("hex")]
}));

const loadGateway = require("./lib/loadGatewayConfig");
const allServices = loadGateway({ path: "./gateway.yml" });

app.use("/swagger", swagger_ui);

allServices.forEach((_service) => {
    if (_service.deprecated === true) {
        app.use(_service.path, (req, res, next) => {
            res.json({ message: `${_service.path} is deprecated` });
        });
    }
    else {
        app.use(
            _service.path,
            lib.fetchMiddlewares(_service.middlewares),
            (req, res, next) => {

                const csrf_options = {
                    // sessionKey: "csrfSecret",
                    value: (req) => {
                        const token = req.headers["authorization"];
                        if (token == null) {
                            return "";
                        }
                        else {
                            const encryptedToken = decodeURIComponent(token);
                            let decodedToken = require("./lib/headerToken").checkToken(encryptedToken);
                            decodedToken = JSON.parse(decodedToken);
                            console.log("CSRF Matches");
                            console.log({ token: decodedToken.id, userId: req.userId });
                            if(decodedToken.id === req.userId){
                                return decodedToken.token;
                            }                            
                            else{
                                return null;
                            }
                        }
                    },
                    cookie: true
                };

                if (req.originalUrl === "/user/v1/register" || req.originalUrl === "/user/v1/login") { 
                    const opts = {
                        ...csrf_options,
                        ignoreMethods: ["POST"]
                    };
                    console.log(opts);
                    csurf(opts)(req, res, next);
                }
                else {
                    const opts = {
                        ...csrf_options,
                        ignoreMethods: ["HEAD", "OPTIONS"]
                    };
                    console.log(opts);
                    csurf(opts)(req, res, next);
                }
            },
            http_proxy_middleware({
                logProvider: () => logger,
                target: _service.server,
                changeOrigin: true,
                selfHandleResponse: _service.interceptors !== null,
                onProxyReq: (proxyReq, req, res) => {
                    parse_requestBody_toString(proxyReq, req, res);
                },
                onProxyRes: (proxyRes, req, res) => {                    
                    if (_service.interceptors !== null) {
                        let response = "";
                        
                        proxyRes.on("data", (chunk) => {                            
                            response += chunk;
                        });
                        proxyRes.on("end", () => {
                            response = JSON.parse(response);
                            const __data = { userId: 12345 };

                            const interceptors = lib.fetchInterceptors(_service.interceptors, __data);
                            if (interceptors.jwt) {
                                req.session._auth_jwt = interceptors.jwt;
                            }

                            res.status(proxyRes.statusCode).json({
                                ...response,
                                token: require("./lib/headerToken").generateToken({
                                    token: req.csrfToken(),
                                    id: __data.userId,
                                    issued_at: new Date().getTime()
                                })
                            });
                        });
                    }
                }
            })
        );
    }
});

app.use((error, req, res, next) => {
    console.log(error);
    res.json({
        error: "Hi"
    });
});

app.listen(env.port, () => logger.info(`Gateway started at port: ${env.port}`));
