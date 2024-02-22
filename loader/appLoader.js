const Pool = require('pg').Pool;
let CitadelDataLoader = require("./citadelDataLoader.js");

const env = {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  CITADEL_GAMEV2: process.env.CITADEL_GAMEV2,
  CITADEL_STORAGEV2: process.env.CITADEL_STORAGEV2,
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
    const GameV2 = await ethers.getContractFactory("CitadelGameV2");
    const gameV2 = await GameV2.attach(env.CITADEL_GAMEV2);
    const StorageV2 = await ethers.getContractFactory("StorageV2");
    const storageV2 = await StorageV2.attach(env.CITADEL_STORAGEV2);
    const citadelDataLoader = new CitadelDataLoader(pool, gameV2, storageV2, env);
    await citadelDataLoader.loadData();
}

function main() {
  loadCitadel().then(result => {
    console.log("citadel data loader done");
  });
}
  
main();