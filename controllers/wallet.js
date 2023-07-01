const queries = require("../data/queries");
const map = require("../utilities/map");
const {ETH_DIVISOR} = require("../utilities/constants")

class WalletController {

  async getAllWallets(req, res) {
    const pool = req.app.locals.pool;
    let allWallets = [];
    let results = await pool.query(queries.GET_ALL_WALLETS);
    let lastWallet = {
      address: "0",
    }
    for(let i=0; i < results.rows.length; i++) {
      let dbWallet = results.rows[i];
      let wallet = map.mapWallet(dbWallet, lastWallet);
      
      if(lastWallet.address != wallet.address) {
        if(i > 0) {
          allWallets.push(lastWallet);
        }
      } else {
        if (i == results.rows.length) {
          allWallets.push(wallet);
        }
      }

      lastWallet = wallet;
    }
    
    res.status(200).json(allWallets);
  }

  async getWalletById(req, res) {
    const pool = req.app.locals.pool;
    let results = await pool.query(queries.GET_WALLET, [
      req.params.id
    ]);
    
    let lastWallet = {};
    for(let i=0; i < results.rows.length; i++) {
      let dbWallet = results.rows[i];
      let wallet = map.mapWallet(dbWallet, lastWallet);
      lastWallet = wallet;
    }
    
    res.status(200).json(lastWallet);
  }
}

module.exports = new WalletController();