const queries = require("../data/queries");
const map = require("../utilities/map");

class GridController {


  async getAllGrid(req, res) {
    const pool = req.app.locals.pool;
    let allGrid = [];
    let results = await pool.query(queries.GET_ALL_GRID);
    for(let i=0; i < results.rows.length; i++) {
      let grid = map.mapGrid(results.rows[i]);
      allGrid.push(grid);
    }
    
    res.status(200).json(allGrid);
  }

  async getGrid(req, res) {
    const pool = req.app.locals.pool;
    let results = await pool.query(queries.GET_GRID, [
      req.params.id
    ]);
    let grid = map.mapGrid(results.rows[0]);
    
    res.status(200).json(grid);
  }
}



module.exports = new GridController();