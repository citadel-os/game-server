const queries = require("../data/queries");
const map = require("../utilities/map");

class RaidController {

  async getAllRaids(req, res) {
    const pool = req.app.locals.pool;
    let allRaids = [];
    let results = await pool.query(queries.GET_ALL_RAIDS);
    for(let i=0; i < results.rows.length; i++) {
      let raid = map.mapRaid(results.rows[i]);
      allRaids.push(raid);
    }
    
    res.status(200).json(allRaids);
  }
}



module.exports = new RaidController();