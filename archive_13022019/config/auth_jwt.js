const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const auth_secret = "ffd72ed711f410c721ddf947ca36c52834315f2778a36bdf34615665d65f912b";

const auth_generateToken = (data) => {
    const dataToSign = { 
        ...data, 
        iat: Date.now() 
    };
    const expiresIn = 60000;
    return jwt.sign(dataToSign, auth_secret, { expiresIn });
};

const auth_verifyToken = (token, callback) => {
    jwt.verify(token, auth_secret, (err, decoded) => {
        console.log(decoded.exp - Date.now());
        if(err){
            callback(err);
        }
        else if((decoded.exp - Date.now()) > 0){
            callback(decoded);
        }
        else{
            callback("Token Expired");
        }
    });
};

const token = auth_generateToken({ id: "12345", iat: Date.now() });

exports.generateToken = auth_generateToken;
exports.verifyToken = auth_verifyToken;