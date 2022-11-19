const express = require("express");

const router = express.Router();

const CitadelController = require("../controllers/citadel");

router.get("/", CitadelController.getAllCitadel);

module.exports = router;