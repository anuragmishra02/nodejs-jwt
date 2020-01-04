const crypto = require("crypto");

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

exports.generateToken = (data) => {
    const _data = typeof data === "object" ? JSON.stringify(data) : data;
    const key = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512');
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(_data, 'utf8', 'base64');
    encrypted += cipher.final('base64');    
    return encodeURIComponent(encrypted);
};

exports.checkToken = (cipherText) => {
    const key = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512');
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(decodeURIComponent(cipherText), 'base64', 'utf8');
    decrypted += decipher.final('utf8');    
    return decrypted;
};