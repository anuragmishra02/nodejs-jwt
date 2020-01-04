const crypto = require("crypto");
const algorithm = 'aes-192-cbc';

const password = crypto.randomBytes(16);
const salt = crypto.randomBytes(16);

const getDK = () => new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
            reject(err);
        }
        else{
            resolve(derivedKey);
        }        
    });
});

exports.generateToken = (data) => new Promise(async (resolve, reject) => {
    try {
        console.log(`Generate token for: ${JSON.stringify(data)}`);
        const dk = await getDK();
        const cipher = crypto.createCipher(algorithm, dk);
        let encrypted = cipher.update(typeof data === "object" ? JSON.stringify(data) : data, "utf8", "base64");
        encrypted += cipher.final("base64");
        console.log(`Token: ${encodeURIComponent(encrypted)}`);
        resolve(encodeURIComponent(encrypted));        
    }
    catch (ex) {
        console.log(ex);
    }
});

exports.checkToken = (data, token) => new Promise(async (resolve, reject) => {
    try {
        console.log(`Decode token: ${data}`);
        const dk = await getDK();
        const cipherData = decodeURIComponent(data);
        console.log(`DecodeToken: ${cipherData}`);
        const cipher = crypto.createDecipher(algorithm, dk);
        let encrypted = cipher.update(cipherData, "base64", "utf8");
        encrypted += cipher.final("utf8");
        console.log(token);
        console.log(encrypted);
        resolve(JSON.stringify(JSON.parse(encrypted)) === JSON.stringify(token));
        // });
    }
    catch (ex) {
        console.log(ex);
    }
});
