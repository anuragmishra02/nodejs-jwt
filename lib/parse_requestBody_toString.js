const queryString = require("querystring");

module.exports = (proxyReq, req, res, options) => {
    if (!req.body || !Object.keys(req.body).length) {
        return;
    }

    var contentType = proxyReq.getHeader('Content-Type');
    var bodyData;

    if (contentType === 'application/json') {
        bodyData = JSON.stringify(req.body);
    }

    if (contentType === 'application/x-www-form-urlencoded') {
        bodyData = queryString.stringify(req.body);
    }

    if (bodyData) {
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};