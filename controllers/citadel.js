//const CitadelService = require("../services/citadelService");

class CitadelController {
  async getAllCitadel(req, res) {

    res.status(200).json({"count": 1024});
  }
}

module.exports = new CitadelController();