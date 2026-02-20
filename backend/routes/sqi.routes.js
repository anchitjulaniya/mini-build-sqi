const express = require("express");
const router = express.Router();
const { compute } = require("../controllers/sqi.controller");

router.post("/compute", compute);

module.exports = router;