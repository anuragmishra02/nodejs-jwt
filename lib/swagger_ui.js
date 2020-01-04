const express = require("express");
const yaml = require("swagger-parser");
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
    parsed: false,
    value: null,
    error: false,
    errorObject: null
};

const router = express.Router();
yaml.validate("../swagger_config.yml").then((value) => {
    swaggerSpec.parsed = true;
    swaggerSpec.value = value;
}).catch((err) => {    
    swaggerSpec.err = true;
    swaggerSpec.errorObject = err;
});

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

router.use("/", swaggerUi.serve);

router.get("/", (req, res, next) => {
    const interval = setInterval(() => {
        if(swaggerSpec.parsed === true){
            clearInterval(interval);

            if(swaggerSpec.error){
                console.log(swaggerSpec.errorObject);
                res.status(500).send({ message: "Internal server error" });
            }
            else{
                swaggerUi.setup(swaggerSpec, options)(req, res, next);
            }
        }
    }, 1000);    
});

module.exports = router;