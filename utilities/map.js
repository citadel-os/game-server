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
            sifgattaca: dbCitadel.sifgattaca,
            mhrudvogthrot: dbCitadel.mhrudvogthrot,
            drebentraakht: dbCitadel.drebentraakht,
            sifgattacatraining: dbCitadel.sifgattacatraining,
            mhrudvogthrottraining: dbCitadel.mhrudvogthrottraining,
            drebentraakhttraining: dbCitadel.drebentraakhttraining
        },
        pilots: [],
        pilotCount: dbCitadel.pilotcount,
        timeOfLastClaim: dbCitadel.timeoflastclaim,
        timeLit: dbCitadel.timelit,
        timeLastRaided: dbCitadel.timelastraided,
        unclaimedDrakma: dbCitadel.unclaimeddrakma,
        isOnline: dbCitadel.isonline,
        faction: constants.FACTION[dbCitadel.faction],
        weaponSystem: constants.WEAPON_SYSTEM[dbCitadel.weaponsystem],
        engine: constants.ENGINE[dbCitadel.engine],
        shield: constants.SHIELD[dbCitadel.shield],
        level: 0,
        fleetPoints: dbCitadel.fleetpoints
    };
    return citadel;
}

function mapGrid(dbGrid) {
    console.log(dbGrid.id);
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

module.exports = {
    mapCitadel: mapCitadel,
    mapGrid: mapGrid
};