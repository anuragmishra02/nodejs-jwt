const yaml = require("yamljs");
const config = yaml.load("../apigateway.yml");
const getSwaggerParams = require("../config/swagger_parser");

const GateWay = (req, res, next) => {
    console.log(req)
};

module.exports = GateWay;
