const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PILOT_NFT = process.env.PILOT_NFT;
const CITADEL_GAMEV1 = process.env.CITADEL_GAMEV1;



async function getCitadel(citadelId) {
  const GameV1 = await ethers.getContractFactory("CitadelGameV1");
  const gameV1 = await GameV1.attach(CITADEL_GAMEV1);
  var citadel = await gameV1.getCitadel(citadelId);
  console.log(citadel)
  return citadel;
}


function main() {
  getCitadel(999).then(result => {
    console.log(result);
  });
  console.log("done");
}

main();

