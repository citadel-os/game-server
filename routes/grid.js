const express = require("express");
const GridController = require("../controllers/grid");

const router = express.Router();
router.get("/", GridController.getAllGrid);
router.get("/:id", GridController.getGrid);

module.exports = router;