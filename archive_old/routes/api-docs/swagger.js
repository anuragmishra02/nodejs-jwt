const express = require("express");
const yaml = require("yamljs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');

const loadSwaggerSpec = () => yaml.load(path.resolve(__dirname, "..", "..", "swagger-config.yml"));

const SwaggerUIOptions = {
    plugins: [
        () => ({
            statePlugins: {
                spec: {
                    wrapSelectors: {
                        allowTryItOutFor: () => () => false
                    }
                }
            }
        })
    ]
};

const router = express.Router();
let swaggerSpec = loadSwaggerSpec();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec, { swaggerOptions: SwaggerUIOptions }));

module.exports = router;