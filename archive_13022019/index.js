require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const yaml = require("yamljs");
const proxy = require("http-proxy-middleware");
const cors = require("cors");
const queryString = require("querystring");
const auth_jwt = require("./middlewares/auth/JWT");
const auth_header = require("./middlewares/auth/Header");
const cookie_session = require("cookie-session");

const handleRequestBody = (proxyReq, req, res, options) => {
    if (!req.body || !Object.keys(req.body).length) {
        return;
    }

    var contentType = proxyReq.getHeader('Content-Type');
    var bodyData;

    if (contentType === 'application/json') {
        bodyData = JSON.stringify(req.body);
    }

    if (contentType === 'application/x-www-form-urlencoded') {
        bodyData = queryString.stringify(req.body);
    }

    if (bodyData) {
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

const app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cors());

app.use(cookie_session({
    name: 'stk_auth',
    keys: "Hello World",    
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use("/docs", require("./config/swagger_ui"));
/**
 * @type {gateway}
 */
const gateway_config = yaml.load("./api-gateway.yml");
const { microservices, services } = gateway_config;
const middlewares = require("./middlewares");

const mServices = services.map(s => ({
    ...s,
    name: s.server,
    server: microservices[s.server]
}));

mServices.forEach((service) => {
    const { name, auth, rules, path, server } = service;
    const basePath = path;
    const serverUrl = process.env[name + "_" + server.server];
    const serverVersion = process.env[name + "_" + server.version];
    const deprecatedVersions = process.env[name + "_" + "DeprecatedVersions"].split(",");
    const stackerApiUrl = basePath + "/" + serverVersion;
    const deprecatedApi = deprecatedVersions.map((ver) => basePath + "/" + ver);

    /**
     * Deprecated Versions
     */
    deprecatedApi.forEach((depApiPath) => {
        console.log(`Deprecated: ${depApiPath}`);
        app.use(depApiPath, (req, res, next) => {
            res.json({
                data: `${depApiPath} is deprecated`
            });
        });
    });

    /**
     * @description All anonymous request are processed here
     * Configure Middlewares
     */
    const excludedPaths = [];
    rules.forEach((rule) => {
        const _url = stackerApiUrl + rule.path;
        excludedPaths.push(_url);

        const _middleware = [];

        if (rule.auth === false) {
            _middleware.push(middlewares.AUTH_JWT);
            _middleware.push(middlewares.AUTH_APIKEY);
        }

        _middleware.push(middlewares.IGNORE_PATH);

        app.use(_url, middlewares.fetch(_middleware), proxy({
            target: serverUrl,
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                handleRequestBody(proxyReq, req, res);
            },
            selfHandleResponse: true,
            onProxyRes: (proxyRes, req, res) => {                
                if (proxyRes.statusCode === 200) {
                    let response = "";
                    proxyRes.on("data", (chunk) => { response += chunk; });
                    proxyRes.on("end", async () => {
                        response = JSON.parse(response);
                        const jwt_token = auth_jwt.sign({ id: 1 });
                        
                        res.cookie(auth_jwt.JWT_NAME, jwt_token, {
                            httpOnly: true
                        });

                        const headerToken = await auth_header.generateToken({ id: 1 });
                        
                        res.status(200).json({ 
                            message: "Registered in Stacker",
                            bearer: headerToken
                        });                        
                    });
                }
            }
        }));
    });

    const _middleware = [];

    if (auth === "jwt") {
        _middleware.push(middlewares.AUTH_APIKEY);
    }
    else if (auth === "apikey") {
        _middleware.push(middlewares.AUTH_JWT);
    }

    /**
     * @description All authorized calls are processed here
     */
    app.use(
        stackerApiUrl,
        middlewares.fetch(_middleware, {
            ignoredPaths: excludedPaths
        }),
        proxy({
            target: serverUrl,
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                if(auth_jwt.verify(req.cookie[auth_jwt.JWT_NAME])){
                    // forward
                }
                else{
                    // res.status(400).json({ message: unauthorized });
                }
                handleRequestBody(proxyReq, req, res);
            },
            onProxyRes: (proxyRes) => {
                console.log(proxyRes.rawHeaders);
            }
        })
    );
});

app.use((req, res, next) => res.status(400).json({ data: "Service does not exist" }))

app.listen(process.env.PORT, () => console.log(`App started at ${process.env.PORT}`));