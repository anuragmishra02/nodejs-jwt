const fs = require("fs");

const variables = {
    PORT: "PORT",
    UserServices_Server: "UserServices_Server",
    UserServices_Version: "UserServices_Version",
    UserServices_Deprecated: "UserServices_Deprecated",
    JWT_EXPIRY_TIME: "JWT_EXPIRY_TIME",
    COOKIE_NAME: "COOKIE_NAME",
    JWT_SECRET: "JWT_SECRET"
};

class Env {

    constructor() {
        this.value = {
            port: null,
            userServices: {
                server: null,
                version: null,
                deprecated: null
            },
            jwt: {
                expiresIn: null,
                secret: null
            },
            server_cookie: {
                name: null
            }            
        };
    }

    updateEnv(key, value) {
        switch (key) {
            case variables.COOKIE_NAME:
                this.value.server_cookie.name = value;
                break;
            case variables.JWT_EXPIRY_TIME:
                this.value.jwt.expiresIn = value;
                break;
            case variables.JWT_SECRET:
                this.value.jwt.secret = value;
                break;
            case variables.PORT:
                this.value.port = value;
                break;
            case variables.UserServices_Deprecated:
                this.value.userServices.deprecated = value;
                break;
            case variables.UserServices_Server:
                this.value.userServices.server = value;
                break;
            case variables.UserServices_Version:
                this.value.userServices.version = value;
                break;
            default:
                return null;
        }
    }

    parse() {
        Object.keys(variables).forEach((envKey) => {
            const envValue = process.env[envKey];
            if (envValue === null || envValue === void (0)) {
                throw `${envKey} is undefined in process.env. 
If the application is started in local environment please add it in the .env file. 
The list of variables with values(dev) is provided in readme file.
`;
            }
            else if (typeof envValue === "string" && envValue.trim().length === 0) {
                throw `${envKey} is undefined in process.env. 
If the application is started in local environment please add it in the .env file. 
The list of variables with values(dev) is provided in readme file.
`;
            }
            else {
                this.updateEnv(envKey, envValue);
            }
        });
    }

    getEnv() {
        return { ...this.value };
    }
}

module.exports = new Env();


