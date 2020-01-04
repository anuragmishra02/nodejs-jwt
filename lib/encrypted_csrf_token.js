const csurf = require("csurf");

exports.middleware = csurf({
    value: (req) => {
        const token = req.headers["authorization"];
        return token == null ? null : decodeURIComponent(token);
    }
});
