const jwt = require("jsonwebtoken");
const jwtCookieName = process.env["JWT_COOKIE_NAME"];

exports.sign = (data) => {
    return jwt.sign(data, "Hello World", { expiresIn: (+process.env["JWT_EXPIRY_TIME"]) });
};

exports.verify = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "Hello World", (err, decoded) => {
            if(err){
                reject(err);
            }
            else{
                resolve(decoded.id);
            }
        });
    });
};

exports.JWT_NAME = jwtCookieName;