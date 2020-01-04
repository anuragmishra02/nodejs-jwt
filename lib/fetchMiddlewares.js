const jwt = require("./jwt");
const headerToken = require("./headerToken");

const mdw_jwt = (req, res, next) => {
    console.log(req.session);
    const token = jwt.verifyToken(req.session._auth_jwt);
    console.log(token);
    next();
};

const mdw_headerToken = (req, res, next) => {    
    next();
};

const mdw_params = (req, res, next) => {
    next();
};

module.exports = (middlewares) => {
    if(Array.isArray(middlewares) && middlewares.length > 0){
        const _middlewares = middlewares.map((middlewareName) => {
            switch(middlewareName){
                case "verify_csrf_token":
                    return mdw_headerToken;
                case "verify_jwt":
                    return mdw_jwt;
                case "verify_params":
                    return mdw_params;
                default:
                    throw new SyntaxError(`${middlewareName} does not exist`);
            }
        });
        console.log(_middlewares);
        console.log("\n")        
        return _middlewares;
    }
    else{
        throw new TypeError(JSON.stringify({
            from: "fetchMiddlewares",
            message: "Function expects an array of string"
        }));
    }
};