const queries = require("../data/queries");
const map = require("../utilities/map");
const {ETH_DIVISOR} = require("../utilities/constants")

class CitadelController {

  async getAllCitadel(req, res) {
    const pool = req.app.locals.pool;
    let allCitadel = [];
    let results = await pool.query(queries.GET_ALL_CITADEL);
    for(let i=0; i < results.rows.length; i++) {
      let citadel = map.mapCitadel(results.rows[i]);
      allCitadel.push(citadel);
    }
    
    res.status(200).json(allCitadel);
  }

  async getLitCitadel(req, res) {
    const pool = req.app.locals.pool;
    let allCitadel = [];
    let results = await pool.query(queries.GET_LIT_CITADEL);
    for(let i=0; i < results.rows.length; i++) {
      let citadel = map.mapCitadel(results.rows[i]);
      allCitadel.push(citadel);
    }
    
    res.status(200).json(allCitadel);
  }

  async getCitadel(req, res) {
    const pool = req.app.locals.pool;
    let results = await pool.query(queries.GET_CITADEL, [
      req.params.id
    ]);
    let citadel = map.mapCitadel(results.rows[0]);
    
    let allRaidsTo = [];
    let resultsRaidsTo = await pool.query(queries.GET_RAID_REPORT_TO, [
      req.params.id
    ]);
    for(let i=0; i < resultsRaidsTo.rows.length; i++) {
      let raid = map.mapRaidReport(resultsRaidsTo.rows[i]);
      allRaidsTo.push(raid);
    }

    let allRaidsFrom = [];
    let resultsRaidsFrom = await pool.query(queries.GET_RAID_REPORT_FROM, [
      req.params.id
    ]);
    for(let i=0; i < resultsRaidsFrom.rows.length; i++) {
      let raid = map.mapRaidReport(resultsRaidsFrom.rows[i]);
      allRaidsFrom.push(raid);
    }

    citadel.raidsFrom = allRaidsFrom;
    citadel.raidsTo = allRaidsTo;
    
    res.status(200).json(citadel);
  }

  async updateCitadel(req, res) {
    let citadelId = req.params.id;
    const pool = req.app.locals.pool;
    const gameV1 = req.app.locals.gameV1;
    const fleetV1 = req.app.locals.fleetV1;

    let citadelStats = await gameV1.getCitadel(citadelId);
    let citadelMining = await gameV1.getCitadelMining(citadelId);
    let citadelFleetCount = await gameV1.getCitadelFleetCount(citadelId);
    let citadelFleetTrainingCount = await fleetV1.getFleetInTraining(citadelId);
    let citadelPilots = await gameV1.getCitadelPilot(citadelId);
    let raid = await gameV1.getRaid(citadelId);

    let unclaimedDrakma = Math.floor(citadelMining[3].toString() / ETH_DIVISOR)
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

    await pool.query(queries.UPDATE_CITADEL, [
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

    await pool.query(queries.UPDATE_GRID, [
      citadel.isLit, 
      citadel.gridId
    ]);

    await pool.query(queries.UPDATE_FLEET, [
      citadelFleetCount[0].toNumber(),
      citadelFleetCount[1].toNumber(),
      citadelFleetCount[2].toNumber(),
      citadelFleetTrainingCount[0].toNumber(),
      citadelFleetTrainingCount[1].toNumber(),
      citadelFleetTrainingCount[2].toNumber(),
      citadel.id
    ]);

    await pool.query(queries.UPDATE_ACTIVE_RAID, [
      citadel.id,
      raid[0].toNumber(),
      raid[1].toNumber(),
      raid[2].toNumber(),
      raid[3].toNumber(),
      raid[4].toNumber(),
      raid[5].toNumber()
    ]);

    await pool.query(queries.DELETE_CITADEL_PILOT, [
      citadelId
    ]);

    for(let j = 0; j< citadelPilots.length; j++) {
      let pilotId = citadelPilots[j].toNumber()
      await pool.query(queries.INSERT_CITADEL_PILOT, [
        citadelId,
        pilotId
      ]);
    }

    await pool.query(queries.DIM_GRID, []);
    
    res.status(200).json({"ok": true});
  }
}



module.exports = new CitadelController();