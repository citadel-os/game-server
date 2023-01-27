const express = require("express");
const CitadelController = require("../controllers/citadel");

const router = express.Router();
router.get("/", CitadelController.getAllCitadel);
router.get("/lit", CitadelController.getLitCitadel);
router.get("/:id", CitadelController.getCitadel);

module.exports = router;