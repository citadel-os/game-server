const constants = require("./constants");

function mapCitadel(dbCitadel) {
    const citadel = {
        id: dbCitadel.id,
        walletAddress: dbCitadel.walletaddress,
        grid: {
            gridId: dbCitadel.gridid,
            isLit: dbCitadel.islit,
            multiple: dbCitadel.multiple
        },
        fleet: {
            sifGattaca: dbCitadel.sifgattaca,
            mhrudvogThrot: dbCitadel.mhrudvogthrot,
            drebentraakht: dbCitadel.drebentraakht,
            sifGattacaTraining: dbCitadel.sifgattacatraining,
            mhrudvogThrotTraining: dbCitadel.mhrudvogthrottraining,
            drebentraakhtTraining: dbCitadel.drebentraakhttraining
        },
        pilots: [],
        pilotCount: dbCitadel.pilotcount,
        timeOfLastClaim: dbCitadel.timeoflastclaim,
        timeLit: dbCitadel.timelit,
        timeLastRaided: dbCitadel.timelastraided,
        unclaimedDrakma: dbCitadel.unclaimeddrakma,
        faction: constants.FACTION[dbCitadel.factionid],
        weaponSystem: constants.WEAPON_SYSTEM[dbCitadel.weaponsystem],
        engine: constants.ENGINE[dbCitadel.engine],
        shield: constants.SHIELD[dbCitadel.shield],
        level: 0
    };
    if(dbCitadel.pilotids[0] != null) {
        citadel.pilots = dbCitadel.pilotids;
    }

    return citadel;
}

function mapGrid(dbGrid) {
    const grid = {
        id: dbGrid.id,
        isLit: dbGrid.islit,
        multiple: dbGrid.multiple,
        citadel: {
            citadelId: dbGrid.citadelid,
            walletAddress: dbGrid.walletaddress,
            faction: constants.FACTION[dbGrid.factionid]
        }
    };
    return grid;
}

function mapRaid(dbRaid) {
    const raid = {
        fromCitadel: dbRaid.fromcitadel,
        toCitadel: dbRaid.tocitadel,
        sifGattaca: dbRaid.sifgattaca, 
        mhrudvogThrot: dbRaid.mhrudvogthrot, 
        drebentraakht: dbRaid.drebentraakht,
        pilotCount: dbRaid.pilotcount, 
        timeRaidHits: dbRaid.timeraidhits
    };
    return raid;
}

function mapRaidReport(dbReport) {
    const report = {
        fromCitadel: dbReport.fromcitadel,
        toCitadel: dbReport.tocitadel,
        timeRaidHit: dbReport.timeraidhits,
        offensiveCarryCapacity: dbReport.offensivecarrycapacity,
        drakmaRaided: dbReport.drakmaraided,
        blocknumber: dbReport.blocknumber,
        offensiveSifGattacaDestroyed: dbReport.offensivesifgattacadestroyed, 
        offensiveMhrudvogThrotDestroyed: dbReport.offensivemhrudvogthrotdestroyed, 
        offensiveDrebentraakhtDestroyed: dbReport.offensivedrebentraakhtdestroyed, 
        defensiveSifGattacaDestroyed: dbReport.defensivesifgattacadestroyed, 
        defensiveMhrudvogThrotDestroyed: dbReport.defensivemhrudvogthrotdestroyed, 
        defensiveDrebentraakhtDestroyed: dbReport.defensivedrebentraakhtdestroyed
    };
    return report;
}

module.exports = {
    mapCitadel: mapCitadel,
    mapGrid: mapGrid,
    mapRaid: mapRaid,
    mapRaidReport: mapRaidReport
};