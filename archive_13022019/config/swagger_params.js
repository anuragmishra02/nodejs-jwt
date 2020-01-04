const yaml = require("yamljs");

const swaggerConfig = yaml.load("./swagger-config.yml");

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
}

const getParams = (method, path, params) => {
    let _params = swaggerConfig.paths[path];    

    if(_params === void(0)){
        throw `Service not found`;
    }

    _params = _params[method.toLowerCase()]

    if(_params === void(0)){
        throw `Service not found`;
    }
    _params = _params.parameters.filter((p) => p.in === params);
    if(_params.length === 1){
        const { schema } = _params[0];
        return parseSwaggerObject(schema);
    }    
};

exports.getParams = getParams;
