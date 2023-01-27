
queries = {
    GET_ALL_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.isOnline, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.fleetPoints, c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        FROM citadel c LEFT JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        ORDER BY c.id ASC
    `,
    GET_LIT_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.isOnline, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.fleetPoints, c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        FROM citadel c INNER JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        WHERE g.isLit = true
        ORDER BY c.id ASC
    `,
    GET_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.isOnline, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.fleetPoints, c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        FROM citadel c LEFT JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        WHERE c.id = $1
    `,
    UPDATE_CITADEL: `
        UPDATE citadel
        SET walletAddress = $1,
        gridId = $2,
        factionId = $3,
        fleetPoints = $4,
        timeLit = $5,
        timeOfLastClaim = $6,
        timeLastRaided = $7,
        unclaimedDrakma = $8,
        isOnline = $9,
        pilotCount = $10
        WHERE id = $11
    `,
    UPDATE_GRID: `
        UPDATE grid
        SET isLit = $1
        WHERE id = $2
    `,
    UPDATE_FLEET: `
        UPDATE citadelFleet
        SET sifGattaca = $1,
        mhrudvogThrot = $2,
        drebentraakht = $3,
        sifGattacaTraining = $4,
        mhrudvogThrotTraining = $5,
        drebentraakhtTraining = $6
        WHERE citadelId = $7
    `,
    GET_ALL_GRID: `
        SELECT g.id, g.multiple, g.isLit
        , c.id as citadelId, c.isOnline, c.walletAddress, c.factionId
        FROM grid g LEFT JOIN citadel c ON (g.id = c.gridId)
        order by g.id ASC
    `,
    GET_GRID: `
        SELECT g.id, g.multiple, g.isLit
        , c.id as citadelId, c.isOnline, c.walletAddress, c.factionId
        FROM grid g LEFT JOIN citadel c ON (g.id = c.gridId)
        WHERE g.id = $1
    `


};

module.exports = queries;