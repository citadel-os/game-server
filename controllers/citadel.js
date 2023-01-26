const queries = require("../data/queries");
const map = require("../utilities/map");

class CitadelController {


  async getAllCitadel(req, res) {
    const pool = req.app.locals.pool;
    let allCitadel = [];
    let results = await pool.query(queries.GET_ALL_CITADEL);
    let citadel = map.mapCitadel(results.rows[0]);
    for(let i=0; i < results.rows.length; i++) {
      let citadel = map.mapCitadel(results.rows[i]);
      allCitadel.push(citadel);
    }
    
    res.status(200).json(allCitadel);
  }
}



module.exports = new CitadelController();