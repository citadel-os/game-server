const express = require("express");
const RaidController = require("../controllers/raid");

const router = express.Router();
router.get("/", RaidController.getAllRaids);
router.get("/from/:id", RaidController.getRaidReportsFrom);
router.get("/to/:id", RaidController.getRaidReportsTo);

module.exports = router;