const express = require("express");
const WalletController = require("../controllers/wallet");

const router = express.Router();
router.get("/", WalletController.getAllWallets);
router.get("/:id", WalletController.getWalletById);

module.exports = router;