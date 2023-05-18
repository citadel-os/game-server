const queries = require("../data/queries");

class CitadelDataLoader {

  ETH_DIVISOR = 1000000000000000000;
  
  constructor(pool, gameV1, fleetV1) {
    this.pool = pool;
    this.gameV1 = gameV1;
    this.fleetV1 = fleetV1;
  }

  async loadData() {
    let runForever = true;
    while (runForever) {
      for(let i=5; i<6; i++) {
        await this.updateCitadel(i);

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("citadel: " + i + " updated");
      }

      console.log("dimming grid");
      var res = await this.pool.query(queries.DIM_GRID, []);
      console.log(res);

      console.log("done loading citadel, waiting for next run");
      await new Promise(resolve => setTimeout(resolve, 7500));
    }
  }

  async updateCitadel(citadelId) {
    try {
      let citadelStats = await this.gameV1.getCitadel(citadelId);
      let citadelMining = await this.gameV1.getCitadelMining(citadelId);
      let citadelFleetCount = await this.fleetV1.getTrainedFleet(citadelId);
      console.log("citadel fleet count 0")
      console.log(citadelFleetCount);
      let citadelFleetTrainingCount = await this.fleetV1.getFleetInTraining(citadelId);
      let citadelPilots = await this.gameV1.getCitadelPilot(citadelId);
      let raid = await this.gameV1.getRaid(citadelId);

      let unclaimedDrakma = Math.floor(citadelMining[3].toString() / this.ETH_DIVISOR);
      let gridId = citadelStats[1].toNumber() == 0 ? null : citadelStats[1].toNumber();
      let isLit = citadelMining[0].toNumber() > 0 ? true : false;
      let citadel = {
        id: citadelId,
        walletAddress: citadelStats[0],
        gridId: gridId,
        factionId: citadelStats[2],
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
        citadel.factionId,
        citadel.timeLit,
        citadel.timeOfLastClaim,
        citadel.timeLastRaided,
        citadel.unclaimedDrakma,
        citadel.pilotCount,
        citadel.id
      ]);

      if(citadel.gridId != null) {
        await this.pool.query(queries.UPDATE_GRID, [
          citadel.isLit, 
          citadel.gridId
        ]);
      }

      await this.pool.query(queries.UPDATE_FLEET, [
        citadelFleetCount[0].toNumber(),
        citadelFleetCount[1].toNumber(),
        citadelFleetCount[2].toNumber(),
        citadelFleetTrainingCount[0].toNumber(),
        citadelFleetTrainingCount[1].toNumber(),
        citadelFleetTrainingCount[2].toNumber(),
        citadel.id
      ]);

      console.log("citadel fleet count 1")
      console.log(citadelFleetCount)

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

    } catch(err) {

      console.log(err);
    }
  }

}

module.exports = CitadelDataLoader;



