const queries = require("../data/queries");
const fetch = require('node-fetch');

class CitadelDataLoader {

  ETH_DIVISOR = 1000000000000000000;
  
  
  constructor(pool, gameV2, storageV2, env) {
    this.pool = pool;
    this.gameV2 = gameV2;
    this.storageV2 = storageV2;
    this.env = env;
  }

  async loadData() {
    let runForever = true;
    while (runForever) {
      console.log("== updating active wallets ==");
      
      await this.loadWalletData();
      await new Promise(resolve => setTimeout(resolve, 3000));


      console.log("== updating citadel ==");
      for(let i=0; i<1023; i++) {
        await this.updateCitadel(i);

        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("citadel: " + i + " updated");
      }

      console.log("== dimming grid ==");
      var res = await this.pool.query(queries.DIM_GRID, []);
      console.log(res);

      console.log("== done with data load, waiting for next run ==");
      await new Promise(resolve => setTimeout(resolve, 300000));
    }
  }

  async updateCitadel(citadelId) {
    try {
      let citadelStats = await this.gameV2.getCitadel(citadelId);
      let citadelMining = await this.gameV2.getCitadelMining(citadelId);
      let citadelFleetCount = await this.gameV2.getCitadelFleetCount(citadelId);
      let citadelFleetTrainingCount = await this.fleetV1.getFleetInTraining(citadelId);
      let citadelPilots = await this.gameV2.getCitadelPilot(citadelId);
      let raid = await this.gameV2.getRaid(citadelId);
  
      let unclaimedDrakma = Math.floor(citadelMining[3].toString() / this.ETH_DIVISOR)
      let gridId = citadelStats[1].toNumber() == 0 ? null : citadelStats[1].toNumber();
      let isLit = citadelMining[0].toNumber() > 0 ? true : false;
      let citadel = {
        id: citadelId,
        walletAddress: citadelStats[0],
        gridId: gridId,
        capitalId: citadelStats[2],
        pilotCount: citadelStats[3].toNumber(),
        isLit: isLit,
        timeLit: citadelMining[0].toNumber(),
        timeOfLastClaim: citadelMining[1].toNumber(),
        timeLastRaided: citadelMining[2].toNumber(),
        unclaimedDrakma: unclaimedDrakma
      }
  
      await this.pool.query(queries.UPDATE_CITADEL, [
        citadel.walletAddress, 
        citadel.gridId, 
        citadel.capitalId,
        citadel.timeLit,
        citadel.timeOfLastClaim,
        citadel.timeLastRaided,
        citadel.unclaimedDrakma,
        citadel.pilotCount,
        citadel.id
      ]);
  
      await this.pool.query(queries.UPDATE_GRID, [
        citadel.isLit, 
        citadel.gridId
      ]);
  
      await this.pool.query(queries.UPDATE_FLEET, [
        citadelFleetCount[0].toNumber(),
        citadelFleetCount[1].toNumber(),
        citadelFleetCount[2].toNumber(),
        citadelFleetTrainingCount[0].toNumber(),
        citadelFleetTrainingCount[1].toNumber(),
        citadelFleetTrainingCount[2].toNumber(),
        citadel.id
      ]);
  
      await this.pool.query(queries.UPDATE_ACTIVE_RAID, [
        citadel.id,
        raid[0].toNumber(),
        raid[1].toNumber(),
        raid[2].toNumber(),
        raid[3].toNumber(),
        raid[4].toNumber(),
        raid[5].toNumber()
      ]);
  
      await this.pool.query(queries.DELETE_CITADEL_PILOT, [
        citadelId
      ]);
  
      for(let j = 0; j< citadelPilots.length; j++) {
        let pilotId = citadelPilots[j].toNumber()
        await this.pool.query(queries.INSERT_CITADEL_PILOT, [
          citadelId,
          pilotId
        ]);
      }
  
      await this.pool.query(queries.DIM_GRID, []);

    } catch(err) {

      console.log(err);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async loadWalletData() {
    try {
      let allCitadelWalletOwnersURL = this.env.ALCHEMY_NFT_URL +
        "/getOwnersForCollection/" +
        "?contractAddress=" + this.env.CITADEL_NFT +
        "&withMetadata=false";

      let allCitadelResponse = await fetch(allCitadelWalletOwnersURL, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });

      const allCitadelData = await allCitadelResponse.json();

      for(let i=0; i < allCitadelData.ownerAddresses.length; i++) {

        let wallet = allCitadelData.ownerAddresses[i];

        let nftOwnershipURL = this.env.ALCHEMY_NFT_URL +
          "/getNFTs/" +
          "?owner=" +  wallet + 
          "&contractAddresses[]=" + this.env.CITADEL_NFT +
          "&contractAddresses[]=" + this.env.PILOT_NFT +
          "&withMetadata=false";
          
        let response = await fetch(nftOwnershipURL, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        });
  
        const data = await response.json();
  
        for(let j=0; j < data.ownedNfts.length; j++) {
          let nft = data.ownedNfts[j];

          let nftName = "CITADEL";
          if (nft.contract.address == this.env.PILOT_NFT) {
            nftName = "PILOT";
          }
  
          await this.pool.query(queries.UPSERT_WALLET, [
            wallet, 
            nft.contract.address,
            nft.id.tokenId,
            nftName
          ]);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(wallet + " updated with " + data.ownedNfts.length + " nft");
      }
    }
    catch(err) {
      console.log(err);
    }
  }
}

module.exports = CitadelDataLoader;



