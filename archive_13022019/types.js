/**
 * @typedef {object} microservice 
 * @property {string} microservice.version
 * @property {string} microservice.server
 * @property {boolean} microservice.deprecated
 */

/**
 * @typedef {Array<microservice>} microservice_array
 */

/**
 * @typedef {object} path_exclude
 * @property {string} path_exclude.path
 * @property {boolean} path_exclude.auth
 */

/**
 * @typedef {object} service
 * @property {string} service.path
 * @property {string} service.server
 * @property {string} service.auth
 * @property {Array<path_exclude>} service.exclude
 */

/**
 * @typedef {object} gateway
 * @property {Object.<string, microservice_array>} gateway.microservices
 * @property {Array.<service>} gateway.services
 */

