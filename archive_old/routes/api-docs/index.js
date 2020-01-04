const express = require("express");
const router = express.Router();

router.use("/swagger", require("./swagger"));

module.exports = router;