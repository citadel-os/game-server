const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PILOT_NFT = process.env.PILOT_NFT;
const CITADEL_GAMEV1 = process.env.CITADEL_GAMEV1;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const abi = require("./contracts/abi.js");

const contract = require("../artifacts/contracts/PilotNFT.sol/PilotNFT.json");
const nftContract = new web3.eth.Contract(abi.abiCitadelGameV1, CITADEL_GAMEV1);

async function getGasPrice() {
  const price = await web3.eth.getGasPrice();
  return price;
}


function main() {
  getGasPrice().then(result => {
    console.log(result);
  }).error(err => {

  })
  console.log("done");
}

