class CitadelDataLoader {

  ETH_DIVISOR = 1000000000000000000;
  
  constructor(pool, gameV1) {
    this.pool = pool;
    this.gameV1 = gameV1;
    this.citadel = [];
    this.grid = [];
    this.pilot = [];
  }

  async loadData() {
    for(let i=997; i<1024; i++) {
      let citadelStats = await this.gameV1.getCitadel(i);
      let citadelMining = await this.gameV1.getCitadelMining(i);
      let citadelFleetCount = await this.gameV1.getCitadelFleetCount(i);
      let citadelFleetTrainingCount = await this.gameV1.getCitadelFleetCountTraining(i);

      let unclaimedDrakma = Math.floor(citadelMining[3].toString() / this.ETH_DIVISOR)

      let citadel = {
        id: i,
        walletAddress: citadelStats[0],
        factionId: citadelStats[2],
        pilotCount: citadelStats[3].toNumber(),
        isLit: citadelStats[4],
        fleetPoints: citadelStats[5].toNumber(),
        timeLit: citadelMining[0].toNumber(),
        timeOfLastClaim: citadelMining[1].toNumber(),
        timeLastRaided: citadelMining[2].toNumber(),
        unclaimedDrakma: unclaimedDrakma,
        isOnline: citadelMining[4]
      }

      this.citadel.push(citadel);

      let updtCitadelQuery = `
        UPDATE citadel
        SET walletAddress = $1,
        gridId = $2,
        factionId = $3,
        fleetPoints = $4,
        timeLit = $5,
        timeOfLastClaim = $6,
        timeLastRaided = $7,
        unclaimedDrakma = $8,
        isOnline = $9,
        pilotCount = $10
        WHERE id = $11`

      let resultsCitadelUpdt = await this.pool.query(updtCitadelQuery, [
        citadel.walletAddress, 
        citadel.gridId, 
        citadel.factionId, 
        citadel.fleetPoints, 
        citadel.timeLit,
        citadel.timeOfLastClaim,
        citadel.timeLastRaided,
        citadel.unclaimedDrakma,
        citadel.isOnline,
        citadel.pilotCount,
        citadel.id
      ]);

      let updtGridQuery = `
        UPDATE grid
        SET isLit = $1
        WHERE id = $2`

      let resultsGridUpdt = await this.pool.query(updtGridQuery, [
        citadel.isLit, 
        citadel.gridId
      ]);

      let updtCitadelFeetQuery = `
        UPDATE citadelFleet
        SET sifGattaca = $1,
        mhrudvogThrot = $2,
        drebentraakht = $3,
        sifGattacaTraining = $4,
        mhrudvogThrotTraining = $5,
        drebentraakhtTraining = $6
        WHERE citadelId = $7`

      let resultsCitadelFleetUpdt = await this.pool.query(updtCitadelFeetQuery, [
        citadelFleetCount[0].toNumber(),
        citadelFleetCount[1].toNumber(),
        citadelFleetCount[2].toNumber(),
        citadelFleetTrainingCount[0].toNumber(),
        citadelFleetTrainingCount[1].toNumber(),
        citadelFleetTrainingCount[2].toNumber(),
        citadel.id
      ]);

      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("citadel: " + i + " updated");
    }


  }

}

module.exports = CitadelDataLoader;



