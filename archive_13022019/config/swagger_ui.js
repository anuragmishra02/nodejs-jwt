const express = require("express");
const yaml = require("yamljs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const cookie_parser = require("cookie-parser");

const router = express.Router();
let swaggerSpec = yaml.load(path.resolve(__dirname, "..", "swagger-config.yml"));

const options = {
    swaggerOptions: {
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
    }
};

router.use("/swagger", swaggerUi.serve);
router.get("/swagger", swaggerUi.setup(swaggerSpec, options));

module.exports = router;