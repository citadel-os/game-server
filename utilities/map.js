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
        isOnline: dbCitadel.isonline,
        faction: constants.FACTION[dbCitadel.factionid],
        weaponSystem: constants.WEAPON_SYSTEM[dbCitadel.weaponsystem],
        engine: constants.ENGINE[dbCitadel.engine],
        shield: constants.SHIELD[dbCitadel.shield],
        level: 0,
        fleetPoints: dbCitadel.fleetpoints
    };
    return citadel;
}

function mapGrid(dbGrid) {
    const grid = {
        id: dbGrid.id,
        isLit: dbGrid.islit,
        multiple: dbGrid.multiple,
        citadel: {
            citadelId: dbGrid.citadelid,
            isOnline: dbGrid.isonline,
            walletAddress: dbGrid.walletaddress,
            faction: constants.FACTION[dbGrid.factionid]
        }
    };
    return grid;
}

function mapRaid(dbRaid) {
    const raid = {
        fromCitadel: dbRaid.fromCitadel,
        toCitadel: dbRaid.toCitadel,
        sifGattaca: dbRaid.sifGattaca, 
        mhrudvogThrot: dbRaid.mhrudvogThrot, 
        drebentraakht: dbRaid.drebentraakht,
        pilotCount: dbRaid.pilotCount, 
        timeRaidHits: dbRaid.timeRaidHits
    };
    return raid;
}

module.exports = {
    mapCitadel: mapCitadel,
    mapGrid: mapGrid,
    mapRaid: mapRaid
};