var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var express = require('express')
const cookie_session = require("cookie-session");

// setup route middlewares
var csrfProtection = csrf({
    value: (req) => {
        const token = req.headers["authorization"];
        if (token == null) {
            return "";
        }
        else {
            return decodeURIComponent(token);
        }
    }    
});
var parseForm = bodyParser.urlencoded({ extended: false })

// create express app
var app = express();
app.use(cookieParser());
app.use(cookie_session({
    secret: "Hello World",
    httpOnly: true,
    name: "_stk_auth"
}));

// parse cookies
// we need this because "cookie" is true in csrfProtection
// app.use(cookieParser())

app.get('/form', csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    res.send(JSON.stringify({ csrfToken: encodeURIComponent(req.csrfToken()) }));
});

app.post('/process', parseForm, csrfProtection, function (req, res) {
    res.send('data is being processed')
});

app.use((error, req, res, next) => {
    if (error && error.code === "EBADCSRFTOKEN") {
        res.status(403).send({ message: "No CSURF token found" });
    }
    next(error);
});

app.listen(3000, () => console.log("App listening at 3000"));
