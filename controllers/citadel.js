class CitadelController {

  async getAllCitadel(req, res) {
    console.log("good");
    const pool = req.app.locals.pool;
    pool.query('SELECT * FROM citadel ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json({"rows": results.rows})
    })
  }
}

module.exports = new CitadelController();