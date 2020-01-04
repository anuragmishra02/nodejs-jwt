const yaml = require("yamljs");
const path = require("path");
const swagger_config = yaml.load(path.resolve(__dirname, "..", "swagger-config.yml"));

const parseSwaggerObject = (data) => {
    let returnData;
    if (data.type === "object") {
        returnData = {};
        const { properties } = data;
        Object.keys(properties).forEach((k) => {
            returnData[k] = parseSwaggerObject(properties[k]);
        });
        return returnData;
    }
    return data.type;
};

const getParams = (path, method, where) => {
    const spec = swagger_config.paths[path][method.toLowerCase()];
    const params = spec.parameters;
    let dataSchema = params.filter((param) => param.in === where.toLowerCase());
    if (dataSchema.length > 0) {
        dataSchema = dataSchema[0].schema;
        return parseSwaggerObject(dataSchema);
    }
    else {
        throw `Error parsing required params from swagger for ${path}`;
    }
};

module.exports = getParams;