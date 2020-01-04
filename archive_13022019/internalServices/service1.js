const { app, router } = require("./getExpressApp")();

app.set('trust proxy', '127.0.0.1');

app.use("/", (req, res, next) => {
    console.log(req.connection.remoteAddress);
    console.log(req.connection.remotePort);
    console.log(req.ips);
    console.log(req.headers);    
    res.json({
        data: "received"
    });
});

app.listen(7000, () => console.log("app started in port 7000"));