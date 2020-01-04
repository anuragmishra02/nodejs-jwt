const jwt = require("jsonwebtoken");
const env = require("../config/environment_variables").getEnv();
const logger = require("../config/logger");

exports.generateToken = (data) => {
    return jwt.sign(
        data, 
        env.jwt.secret, 
        {
            expiresIn: 15
        }
    );
};

exports.verifyToken = (token) => {
    try{
        return jwt.verify(token, env.jwt.secret);
    }    
    catch(ex){
        const { name, message } = ex;
        for(let r in ex){
            console.log(r);
            console.log(ex[r])
        }
        logger.error(JSON.stringify({ name, message }));
        throw { name, message };
    }
};
