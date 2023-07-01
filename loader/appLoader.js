const Pool = require('pg').Pool;
let CitadelDataLoader = require("./citadelDataLoader.js");

const env = {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  CITADEL_GAMEV1: process.env.CITADEL_GAMEV1,
  CITADEL_FLEETV1: process.env.CITADEL_FLEETV1,
  ALCHEMY_APISERVER: process.env.ALCHEMY_APISERVER,
  ALCHEMY_NFT_URL: process.env.ALCHEMY_NFT_URL,
  ETH_CHAINID: process.env.ETH_CHAINID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CITADEL_NFT: process.env.CITADEL_NFT,
  PILOT_NFT: process.env.PILOT_NFT
}

const pool = new Pool({
    user: env.DB_USERNAME,
    host: env.DB_HOST,
    database: 'citadel',
    password: env.DB_PASSWORD,
    port: 5432
});

async function loadCitadel() {
    const GameV1 = await ethers.getContractFactory("CitadelGameV1");
    const gameV1 = await GameV1.attach(env.CITADEL_GAMEV1);
    const FleetV1 = await ethers.getContractFactory("CitadelFleetV1");
    const fleetV1 = await FleetV1.attach(env.CITADEL_FLEETV1);
    const citadelDataLoader = new CitadelDataLoader(pool, gameV1, fleetV1, env);
    await citadelDataLoader.loadData();
}

function main() {
  loadCitadel().then(result => {
    console.log("citadel data loader done");
  });
}
  
main();