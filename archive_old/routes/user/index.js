const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
    res.json({
        data: "User registered successfully"
    });
});

router.post("/login", (req, res) => {    
    res.json({
        data: "User signed in successfully"
    });
});

router.get("/profile", (req, res) => {
    res.json({
        data: {
            name: "John",
            accountType: "basic"
        }
    });
});

module.exports = router;