const queries = require("../data/queries");
const map = require("../utilities/map");

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
    console.log(req.params.id);
    const pool = req.app.locals.pool;
    let allCitadel = [];
    let results = await pool.query(queries.GET_CITADEL, [
      req.params.id
    ]);
    let citadel = map.mapCitadel(results.rows[0]);
    
    res.status(200).json(citadel);
  }
}



module.exports = new CitadelController();