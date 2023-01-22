module.exports = class CitadelDataLoader {

  constructor(pool, gameV1) {
    this.pool = pool;
    this.gameV1 = gameV1;
  }

  async loadData() {
    console.log(this.pool);
    console.log("blah");
    console.log(this.gameV1);
    // var citadel = await gameV1.getCitadel(citadelId);
    // console.log(citadel)
    // return citadel;
  }

}

//module.exports = CitadelDataLoader;



