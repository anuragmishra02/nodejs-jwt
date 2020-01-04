const yaml = require("yamljs");
const path = require("path");

/**
 * @typedef {object} ApiGateway_MServices
 * @property {string} ApiGateway_MServices.name
 * @property {string} ApiGateway_MServices.server
 ****************************************************************************

 * @typedef  {object} ApiGateway_RouteProperty
 * @property {string} ApiGateway_RouteProperty.proxy
 * @property {boolean} ApiGateway_RouteProperty.auth
 * @property {string} ApiGateway_RouteProperty.auth_type
 * @property {boolean} ApiGateway_RouteProperty.deprecated
 ****************************************************************************

 * @typedef { object } ApiGateway
 * @property { ApiGateway_MServices[] } ApiGateway.microservices
 * @property { Object.<string, ApiGateway_RouteProperty> } ApiGateway.services
 */


/**
 * @type { ApiGateway }
 */
const apigateway = yaml.load(path.resolve(__dirname, "..", "apigateway.yml"));
const swagger = yaml.load(path.resolve(__dirname, "..", "swagger-config.yml"));
const express = require("express");

const swaggerPath = swagger.paths;

const parsePaths = (swaggerPath) => {
    const allPaths = Object.keys(swaggerPath);
    
    allPaths.forEach((requestObject) => {
        console.log(swaggerPath[requestObject]);
    })
};

parsePaths(swaggerPath);
