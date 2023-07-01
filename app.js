const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const Pool = require('pg').Pool;
const citadelRoute = require("./routes/citadel");
const gridRoute = require("./routes/grid");
const raidRoute = require("./routes/raid");
const walletRoute = require("./routes/wallet");
const { ethers } = require("ethers");
const {abiCitadelGameV1, abiCitadelFleetV1} = require("./utilities/abi");
require('dotenv').config();

const env = {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  CITADEL_GAMEV1: process.env.CITADEL_GAMEV1,
  CITADEL_FLEETV1: process.env.CITADEL_FLEETV1,
  ALCHEMY_APISERVER: process.env.ALCHEMY_APISERVER,
  ALCHEMY_NFT_URL: process.env.ALCHEMY_NFT_URL,
  ETH_CHAINID: process.env.ETH_CHAIN_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CITADEL_NFT: process.env.CITADEL_NFT,
  PILOT_NFT: process.env.PILOT_NFT
}

const app = express();
app.use(cors());

const pool = new Pool({
  user: env.DB_USERNAME,
  host: env.DB_HOST,
  database: 'citadel',
  password: env.DB_PASSWORD,
  port: 5432,
});

app.locals.pool = pool;
app.locals.env = env;

loadEthereumVars();

app.get("/", (req, res) => res.status(200).json({
  status: true,
  message: "server running"
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/citadel", citadelRoute);
app.use("/api/v1/grid", gridRoute);
app.use("/api/v1/raid", raidRoute);
app.use("/api/v1/wallet", walletRoute);

app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 400);
  res.json({ error: err.message, message: "operation failed" });
});

console.log("server starting on port 3000");
app.listen(3000);


async function loadEthereumVars() {
  const provider = new ethers.providers.JsonRpcProvider(env.ALCHEMY_APISERVER, env.ETH_CHAINID);
  const signer = new ethers.Wallet(env.PRIVATE_KEY, provider);
  const gameV1 = new ethers.Contract(env.CITADEL_GAMEV1, abiCitadelGameV1, signer);
  const fleetV1 = new ethers.Contract(env.CITADEL_FLEETV1, abiCitadelFleetV1, signer);

  app.locals.gameV1 = gameV1;
  app.locals.fleetV1 = fleetV1;
}

module.exports = app;



