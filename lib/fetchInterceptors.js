const jwt = require("./jwt");
const headerToken = require("./headerToken");

module.exports = (middlewares, { userId }) => {
    if(Array.isArray(middlewares) && middlewares.length > 0){
        const value = {};

        middlewares.forEach((middlewareName) => {
            switch(middlewareName){
                case "generate_jwt":
                    value.jwt = jwt.generateToken({ userId });
                    break; 
                case "generate_csrf_token":
                    return true;                
                default:
                    throw new SyntaxError(`${middlewareName} does not exist`);
            }
        });         

        return value;
    }
    else{
        throw new TypeError(JSON.stringify({
            from: "fetchMiddlewares",
            message: "Function expects an array of string"
        }));
    }
};