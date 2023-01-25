const Pool = require('pg').Pool;
let CitadelDataLoader = require("./citadelDataLoader.js");

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const CITADEL_GAMEV1 = process.env.CITADEL_GAMEV1;


const pool = new Pool({
    user: DB_USERNAME,
    host: DB_HOST,
    database: 'citadel',
    password: DB_PASSWORD,
    port: 5432
});

async function loadCitadel() {
    const GameV1 = await ethers.getContractFactory("CitadelGameV1");
    const gameV1 = await GameV1.attach(CITADEL_GAMEV1);
    const citadelDataLoader = new CitadelDataLoader(pool, gameV1);
    await citadelDataLoader.loadData();
}

function main() {
    loadCitadel().then(result => {
      console.log("citadel data loader done");
    });
    console.log("done");
  }
  
  main();