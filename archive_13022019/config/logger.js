const winston = require("winston");
const { format } = winston;
const { combine, json } = format;

const container = new winston.Container();
const transports = [new winston.transports.Console()];

const loggerCategory = {
    AUTHJWT: "AUTHJWT",
    AUTHAPIKEY: "AUTHAPIKEY",
    PARAMS: "PARAMCHECK"    
};

container.add(loggerCategory.AUTHJWT, {
  format: combine(
    format.label({ label: `MIDDLEWARE_${loggerCategory.AUTHJWT}` })    
  ),
  transports
});

container.add(loggerCategory.AUTHAPIKEY, {
    format: combine(
        format.label({ label: `MIDDLEWARE_${loggerCategory.AUTHAPIKEY}` })
    ),
    transports
});

container.add(loggerCategory.PARAMS, {
    format: combine(
        format.label({ label: `MIDDLEWARE_${loggerCategory.PARAMS}` })
    ),
    transports
});

module.exports = {
    log_authJWT: container.get(loggerCategory.AUTHJWT),
    log_authAPIKEY: container.get(loggerCategory.AUTHAPIKEY),
    log_params: container.get(loggerCategory.PARAMS)
};
