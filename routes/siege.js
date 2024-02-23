const express = require("express");
const SiegeController = require("../controllers/siege");

const router = express.Router();
router.get("/", SiegeController.getAll);
router.get("/from/:id", SiegeController.getReportsFrom);
router.get("/to/:id", SiegeController.getReportsTo);

module.exports = router;