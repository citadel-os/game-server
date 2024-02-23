const queries = require("../data/queries");
const map = require("../utilities/map");

class SiegeController {

  async getAll(req, res) {
    const pool = req.app.locals.pool;
    let allRaids = [];
    let results = await pool.query(queries.GET_ALL_RAIDS);
    for(let i=0; i < results.rows.length; i++) {
      console.log(results.rows[i]);
      let raid = map.mapSiege(results.rows[i]);

      allRaids.push(raid);
    }
    
    res.status(200).json(allRaids);
  }

  async getReportsFrom(req, res) {
    const pool = req.app.locals.pool;
    let allRaids = [];
    let results = await pool.query(queries.GET_REPORT_FROM, [
      req.params.id
    ]);
    for(let i=0; i < results.rows.length; i++) {
      let raid = map.mapRaidReport(results.rows[i]);
      allRaids.push(raid);
    }
    
    res.status(200).json(allRaids);
  }

  async getReportsTo(req, res) {
    const pool = req.app.locals.pool;
    let allRaids = [];
    let results = await pool.query(queries.GET_REPORT_TO, [
      req.params.id
    ]);
    for(let i=0; i < results.rows.length; i++) {
      let raid = map.mapRaidReport(results.rows[i]);
      allRaids.push(raid);
    }
    
    res.status(200).json(allRaids);
  }
}



module.exports = new RaidController();