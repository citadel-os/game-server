const express = require("express");
const RaidController = require("../controllers/raid");

const router = express.Router();
router.get("/", RaidController.getAllRaids);

module.exports = router;