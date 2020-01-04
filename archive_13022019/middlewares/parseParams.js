const yaml = require("yamljs");
const swagger = yaml.load("../swagger-config.yml");
const apigateway = yaml.load("../api-gateway.yml");

const parseSwaggerObject = (data) => {
    let returnData = {};

    if(data.type === "object"){
        let { properties } = data;
        const keys = Object.keys(properties);
        keys.forEach((key) => {
            returnData[key] = parseSwaggerObject(properties[key]);
        });
        return returnData;
    }
    else{
        return data.type;
    }
};

const checkType_applyApiGateway = (data, type, name) => {
    let returnData = {};
    const gateway_config = apigateway.params[name];
    if(typeof data === "object"){
        returnData = checkType_applyApiGateway(data, type, name);
    }
    else if(typeof data === "string"){
        
    }
};

const validateDataType = (swaggerObject, data) => {
    const schema = parseSwaggerObject(swaggerObject);
    let validParams = {}
    let missingParams = [];

    for(const param in schema){
        const paramType = schema[param];
        const paramValue = data[param];
        if(paramValue !== null || paramValue !== void(0)){
            validParams[param] = validateObjectType(paramValue, paramType, param);
        }
        else{
            missingParams.push(param);
        }
    }
};

const validateParams = (req, res, next, parameters) => {
    const invalidParams = [];

    parameters.reduce((accumulator, currentValue) => {
        let isValid = {};
        if(params.in === "body"){
            isValid = validateDataType(params.schema, req.body);
        }
        else if(params.in === "query" || params.in === "path"){
            isValid = validateDataType({ [params.name]: { type: params.type } }, params.in === "query" ? req.query : req.params);
        }        

        if(isValid !== true){
            
        }
    }, invalidParams);    

};

module.exports = (req, res, next) => {
    let pathData = swagger.paths[req.originalUrl];

    if(pathData){
        pathData = pathData[req.method.toLowerCase()];
        if(pathData){
            if(!pathData.parameters){
                console.log("No parameters defined in swagger file");
                next();
            }
            else{
                validateParams(req, res, next, pathData.parameters);
            }
        }
        else{
            res.status(404).json({ data: "requested resource does not exists" });    
        }
    }
    else{
        res.status(404).json({ data: "requested resource does not exists" });
    }    
};