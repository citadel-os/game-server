const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const Pool = require('pg').Pool;
const citadelRoute = require("./routes/citadel");
const gridRoute = require("./routes/grid");
const raidRoute = require("./routes/raid");
const { ethers } = require("ethers");
const {abiCitadelGameV1, abiCitadelFleetV1} = require("./utilities/abi");
require('dotenv').config();

// env variables
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const CITADEL_GAMEV1 = process.env.CITADEL_GAMEV1;
const CITADEL_FLEETV1 = process.env.CITADEL_FLEETV1;
const ALCHEMY_APISERVER = process.env.ALCHEMY_APISERVER;
const ETH_CHAINID = process.env.ETH_CHAIN_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const app = express();
app.use(cors());

const pool = new Pool({
  user: DB_USERNAME,
  host: DB_HOST,
  database: 'citadel',
  password: DB_PASSWORD,
  port: 5432,
});

app.locals.pool = pool;

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
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_APISERVER, ETH_CHAINID);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const gameV1 = new ethers.Contract(CITADEL_GAMEV1, abiCitadelGameV1, signer);
  const fleetV1 = new ethers.Contract(CITADEL_FLEETV1, abiCitadelFleetV1, signer);

  app.locals.gameV1 = gameV1;
  app.locals.fleetV1 = fleetV1;
}

module.exports = app;



