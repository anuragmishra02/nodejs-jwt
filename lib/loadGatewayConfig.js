const yaml = require("yamljs");

const env_vars = new RegExp("env.");
const environment_regex= new RegExp("#/environment/");

const getType = v => Object.prototype.toString.call(v);

const populateEnv = (environment) => {
    let returnValue = {};

    for(const envKey in environment){
        const envVal = environment[envKey];
        if(getType(envVal) === "[object Object]"){
            returnValue[envKey] = populateEnv(envVal);
        }
        else if(getType(envVal) === "[object Array]"){
            returnValue[envKey] = envVal.map((val) => populateEnv(val));
        }
        else{
            returnValue[envKey] = process.env[envVal.split(env_vars)[1]];            
        }
    }

    return returnValue;
};

module.exports = ({ path }) => {
    const gateway_config = yaml.load(path);
    const { services, environment } = gateway_config;    
    const routes = [];
    const _environment = populateEnv(environment);        

    services.forEach((_service) => {        
        let { basePath, middlewares, microservice, paths } = _service;        
        microservice = microservice.split(environment_regex)[1].split("/")[0];
        let { server, version, deprecated } = _environment[microservice];        
        const rootPath = basePath + "/" + version;        
        const standardMiddlewares = middlewares;

        if(deprecated){
            deprecated.split(",").forEach((dep_api) => {
                routes.push({
                    path: basePath + "/" + dep_api,
                    deprecated: true
                });
            });
        }

        console.log(paths);

        for(let i = paths.length - 1; i >=0; i--){
            const apiMethodObject = paths[i];
            const apiMethodName = Object.keys(apiMethodObject)[0];
            const apiMethodConfig = apiMethodObject[apiMethodName];
            const excludeMiddlewares = apiMethodConfig.exclude_middlewares;
            const interceptors = apiMethodConfig.interceptors;
            
            let apiMethodMiddlewares = null;
            let apiMethodInterceptors = null;

            if(excludeMiddlewares === null || excludeMiddlewares === void(0)){
                apiMethodMiddlewares = [...standardMiddlewares];
            }
            else{
                apiMethodMiddlewares = standardMiddlewares.filter(mdw => excludeMiddlewares.indexOf(mdw) === -1);
            }

            if(interceptors !== null && interceptors !== void(0)){
                apiMethodInterceptors = interceptors;
            }

            
            routes.push({
                path: rootPath + apiMethodName,
                deprecated: false,
                middlewares: apiMethodMiddlewares,
                interceptors: apiMethodInterceptors,
                server
            });
        }

        routes.push({
            path: rootPath,
            deprecated: false,
            middlewares: standardMiddlewares,
            interceptors: null,
            server
        });
    });

    return routes;
};
