class CitadelDataLoader {

  constructor(pool, gameV1) {
    this.pool = pool;
    this.gameV1 = gameV1;
  }

  async loadData() {

    var citadel = await this.gameV1.getCitadel(999);
    console.log(citadel)
    return citadel;
  }

}

module.exports = CitadelDataLoader;



