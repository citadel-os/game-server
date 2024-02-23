const constants = require("./constants");

function mapCitadel(dbCitadel) {
    const citadel = {
        id: dbCitadel.id,
        walletAddress: dbCitadel.wallet_address,
        grid: {
            gridId: dbCitadel.grid_id,
            is_lit: dbCitadel.is_lit,
            multiple: dbCitadel.multiple
        },
        fleet: {
            sifGattaca: dbCitadel.sif_gattaca,
            mhrudvogThrot: dbCitadel.mhrudvog_throt,
            drebentraakht: dbCitadel.drebentraakht,
            sifGattacaTraining: dbCitadel.sifgattaca_training,
            mhrudvogThrotTraining: dbCitadel.mhrudvog_throt_training,
            drebentraakhtTraining: dbCitadel.drebentraakht_training
        },
        pilots: [],
        pilotCount: dbCitadel.pilot_count,
        timeOfLastClaim: dbCitadel.time_of_last_claim,
        timeLit: dbCitadel.time_lit,
        timeLastSieged: dbCitadel.time_last_sieged,
        unclaimedDrakma: dbCitadel.unclaimed_drakma,
        faction: constants.FACTION[dbCitadel.capital_id],
        weaponSystem: constants.WEAPON_SYSTEM[dbCitadel.weapon_system],
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
        is_lit: dbGrid.is_lit,
        multiple: dbGrid.multiple,
        citadel: {
            citadelId: dbGrid.citadel_id,
            walletAddress: dbGrid.wallet_address,
            faction: constants.FACTION[dbGrid.capital_id]
        }
    };
    return grid;
}

function mapSiege(dbSiege) {
    const siege = {
        fromCitadel: dbSiege.from_citadel,
        toCitadel: dbSiege.to_citadel,
        sifGattaca: dbSiege.sif_gattaca, 
        mhrudvogThrot: dbSiege.mhrudvog_throt, 
        drebentraakht: dbSiege.drebentraakht,
        pilotCount: dbSiege.pilot_count, 
        timeRaidHits: dbSiege.time_siege_hits
    };
    return siege;
}

function mapReport(dbReport) {
    const report = {
        fromCitadel: dbReport.from_citadel,
        toCitadel: dbReport.to_citadel,
        timeRaidHit: dbReport.time_raid_hits,
        offensiveCarryCapacity: dbReport.offensive_carry_capacity,
        drakmaRaided: dbReport.drakma_sieged,
        blockNumber: dbReport.block_number,
        offensiveSifGattacaDestroyed: dbReport.offensive_sif_gattaca_destroyed, 
        offensiveMhrudvogThrotDestroyed: dbReport.offensive_mhrudvog_throt_destroyed, 
        offensiveDrebentraakhtDestroyed: dbReport.offensive_drebentraakht_destroyed, 
        defensiveSifGattacaDestroyed: dbReport.defensive_sif_gattaca_destroyed, 
        defensiveMhrudvogThrotDestroyed: dbReport.defensive_mhrudvog_throt_destroyed, 
        defensiveDrebentraakhtDestroyed: dbReport.defensive_drebentraakht_destroyed
    };
    return report;
}
 
function mapWallet(dbWallet, lastWallet) {
    let wallet = {
        totalCount: 0,
    };

    if (lastWallet.address == dbWallet.wallet_address) {
        wallet = structuredClone(lastWallet);
    } else {
        wallet.ownedNfts = [];
        wallet.address = dbWallet.wallet_address;
    }

    let nft = {
        contract: {
            address: dbWallet.contract,
            id: {
                tokenId: dbWallet.token_id
            },
            balance: 1
        }
    }
    
    wallet.ownedNfts.push(nft);
    wallet.totalCount = wallet.totalCount + 1;
    
    return wallet;
}

module.exports = {
    mapCitadel: mapCitadel,
    mapGrid: mapGrid,
    mapSiege: mapSiege,
    mapReport: mapReport,
    mapWallet: mapWallet
};