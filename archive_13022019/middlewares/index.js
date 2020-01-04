const { log_authAPIKEY, log_authJWT, log_params } = require("../config/logger");
const { getParams } = require("../config/swagger_params");
const jwt = require("./auth/JWT");
const header = require("./auth/Header");
const AUTH_JWT = "jwt";
const AUTH_APIKEY = "auth_apikey"
const PARAM = "params";
const IGNORE_PATH = "ignore_paths";

const middlewareTags = [
    AUTH_APIKEY, 
    AUTH_JWT,
    IGNORE_PATH,
    PARAM
];

const middlewareFunctions = {
    [AUTH_APIKEY]: (req, res, next) => {
        console.log("Verify api key");
        next();
    },
    [AUTH_JWT]: async (req, res, next) => {
        try{
            const token = req.cookies[jwt.JWT_NAME];
            const userId = await jwt.verify(token);
            const headerToken = req.headers["x-access-token"] || req.headers["authorization"];            
            const result = header.checkToken(headerToken, { id: userId });
            
            if(result){
                res.userId = userId;
                console.log("next");
                next();                
            }
            else{
                res.status(401).json({ message: "unauthorized" });
            }            
        }        
        catch(ex){
            res.status(401).json({ message: "unauthorized" });
        }
    },
    [IGNORE_PATH]: (ignoredPaths) => (req, res, next) => {
            if(ignoredPaths.indexOf(req.originalUrl) > -1){
                res.json({
                    data: "Request already processed"
                });
            }
            else{
                next();
            }            
        },
    [PARAM]: (req, res, next) => {
        try{
            const params = getParams(req.method, req.originalUrl, "body");
            for(let param in params){
                if(typeof params[param] === "string"){
                    
                }
                else{

                }
            }
            next();
        }
        catch(ex){
            console.log(ex);
            if(ex === "Service not found"){
                res.status(400).json({ data: "requested resource does not exist" });
            }
        }
    }
};

const fetchMiddlewares = (ignoreMiddlewares, options) => {
    let allMiddlewares = { ...middlewareFunctions };
    
    ignoreMiddlewares.forEach((ig_mdw) => {
        const { [ig_mdw]: fun, ...others } = allMiddlewares;
        allMiddlewares = others;
    });

    let middlewares = [];
    
    Object.keys(allMiddlewares).forEach((middlewareName) => {
        if(middlewareName === IGNORE_PATH){
            middlewares.push(allMiddlewares[middlewareName](options.ignoredPaths));
        }
        else{
            middlewares.push(allMiddlewares[middlewareName]);
        }
    });

    console.log(middlewares);

    return middlewares;
};

module.exports = {
    AUTH_APIKEY,
    AUTH_JWT,
    IGNORE_PATH,/** We define routes in two middlewares [1. Without Auth] [2. With Auth]. If incase middleware [1] fails and request comes to middleware [2] we should not process this request*/
    PARAM,
    fetch: fetchMiddlewares
};
