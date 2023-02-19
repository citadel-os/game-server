const queries = require("../data/queries");

class CitadelDataLoader {

  ETH_DIVISOR = 1000000000000000000;
  
  constructor(pool, gameV1, fleetV1) {
    this.pool = pool;
    this.gameV1 = gameV1;
    this.fleetV1 = fleetV1;
    this.citadel = [];
    this.grid = [];
    this.pilot = [];
  }

  async loadData() {
    let runForever = true;
    while (runForever) {
      for(let i=4; i<1024; i++) {
        try {
          let citadelStats = await this.gameV1.getCitadel(i);
          let citadelMining = await this.gameV1.getCitadelMining(i);
          let citadelFleetCount = await this.gameV1.getCitadelFleetCount(i);
          let citadelFleetTrainingCount = await this.fleetV1.getFleetInTraining(i);
          let citadelPilots = await this.gameV1.getCitadelPilot(i);
          let raid = await this.gameV1.getRaid(i);
    
          let unclaimedDrakma = Math.floor(citadelMining[3].toString() / this.ETH_DIVISOR)
          let gridId = citadelStats[1].toNumber() == 0 ? null : citadelStats[1].toNumber();
          let citadel = {
            id: i,
            walletAddress: citadelStats[0],
            gridId: gridId,
            factionId: citadelStats[2],
            pilotCount: citadelStats[3].toNumber(),
            isLit: citadelStats[4],
            timeLit: citadelMining[0].toNumber(),
            timeOfLastClaim: citadelMining[1].toNumber(),
            timeLastRaided: citadelMining[2].toNumber(),
            unclaimedDrakma: unclaimedDrakma
          }
    
          this.citadel.push(citadel);
    
          let resultsCitadelUpdt = await this.pool.query(queries.UPDATE_CITADEL, [
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
    
          let resultsGridUpdt = await this.pool.query(queries.UPDATE_GRID, [
            citadel.isLit, 
            citadel.gridId
          ]);
    
          let resultsCitadelFleetUpdt = await this.pool.query(queries.UPDATE_FLEET, [
            citadelFleetCount[0].toNumber(),
            citadelFleetCount[1].toNumber(),
            citadelFleetCount[2].toNumber(),
            citadelFleetTrainingCount[0].toNumber(),
            citadelFleetTrainingCount[1].toNumber(),
            citadelFleetTrainingCount[2].toNumber(),
            citadel.id
          ]);
  
          let resultsRaidUpdt = await this.pool.query(queries.UPDATE_ACTIVE_RAID, [
            citadel.id,
            raid[0].toNumber(),
            raid[1].toNumber(),
            raid[2].toNumber(),
            raid[3].toNumber(),
            raid[4].toNumber(),
            raid[5].toNumber()
          ]);

          let resultsDeleteCitadelPilot = await this.pool.query(queries.DELETE_CITADEL_PILOT, [
            i
          ]);

          for(let j = 0; j< citadelPilots.length; j++) {
            let pilotId = citadelPilots[j].toNumber()
            let resultsPilotInsert = await this.pool.query(queries.INSERT_CITADEL_PILOT, [
              i,
              pilotId
            ]);
          }

        } catch(err) {
          console.log(err);
        }

  
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("citadel: " + i + " updated");
      }

      console.log("done loading citadel, waiting for next run");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

}

module.exports = CitadelDataLoader;



