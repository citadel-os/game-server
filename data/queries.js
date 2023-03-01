
queries = {
    GET_ALL_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        , array_agg(p.pilotId) as pilotIds
        FROM citadel c LEFT JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        LEFT JOIN citadelPilot p on (c.id = p.citadelId)
        GROUP BY c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        ORDER BY c.id ASC
    `,
    GET_LIT_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        , array_agg(p.pilotId) as pilotIds
        FROM citadel c INNER JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        LEFT JOIN citadelPilot p on (c.id = p.citadelId)
        WHERE g.isLit = true
        GROUP BY c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        ORDER BY c.id ASC
    `,
    GET_CITADEL: `
        SELECT c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
        , array_agg(p.pilotId) as pilotIds
        FROM citadel c LEFT JOIN grid g ON (c.gridId = g.id)
        LEFT JOIN citadelFleet f ON (c.id = f.citadelId)
        LEFT JOIN citadelPilot p on (c.id = p.citadelId)
        WHERE c.id = $1
        GROUP BY c.id, c.walletAddress, c.gridId, c.timeOfLastClaim, c.timeLit, c.timeLastRaided
        , c.unclaimedDrakma, c.factionId, c.engine, c.weaponSystem, c.shield
        , c.level, c.pilotCount
        , g.isLit, g.multiple
        , f.sifGattaca, f.mhrudvogThrot, f.drebentraakht
        , f.sifGattacaTraining, f.mhrudvogThrotTraining, f.drebentraakhtTraining
    `,
    UPDATE_CITADEL: `
        UPDATE citadel
        SET walletAddress = $1,
        gridId = $2,
        factionId = $3,
        timeLit = $4,
        timeOfLastClaim = $5,
        timeLastRaided = $6,
        unclaimedDrakma = $7,
        pilotCount = $8
        WHERE id = $9
    `,
    UPDATE_GRID: `
        UPDATE grid
        SET isLit = $1
        WHERE id = $2
    `,
    DIM_GRID: `
        update grid
        set isLit = false
        where id not in (
            select gridId 
            from citadel
            where gridId is not null
        )
        and isLit = true
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
        , c.id as citadelId, c.walletAddress, c.factionId
        FROM grid g LEFT JOIN citadel c ON (g.id = c.gridId)
        order by g.id ASC
    `,
    GET_GRID: `
        SELECT g.id, g.multiple, g.isLit
        , c.id as citadelId, c.walletAddress, c.factionId
        FROM grid g LEFT JOIN citadel c ON (g.id = c.gridId)
        WHERE g.id = $1
    `,
    UPDATE_ACTIVE_RAID: `
        UPDATE activeRaids
        SET toCitadel = $2,
        sifGattaca = $3,
        mhrudvogThrot = $4,
        drebentraakht = $5,
        pilotCount = $6, 
        timeRaidHits = $7
        WHERE fromCitadel = $1
    `,
    GET_ALL_RAIDS: `
        SELECT fromCitadel, toCitadel, sifGattaca, mhrudvogThrot, drebentraakht
        , pilotCount, timeRaidHits
        FROM activeRaids
        WHERE toCitadel != 0
        ORDER BY fromCitadel
    `,
    DELETE_CITADEL_PILOT: `
        DELETE FROM citadelPilot 
        WHERE citadelId = $1
    `,
    INSERT_CITADEL_PILOT: `
        INSERT INTO citadelPilot(citadelId, pilotId)
        VALUES($1, $2)
    `,
    UPSERT_RAID_REPORT: `
    INSERT INTO raidReports(fromCitadel, toCitadel, timeRaidHit
        , offensiveCarryCapacity, drakmaRaided
        , offensiveSifGattacaDestroyed, offensiveMhrudvogThrotDestroyed, offensiveDrebentraakhtDestroyed
        , defensiveSifGattacaDestroyed, defensiveMhrudvogThrotDestroyed, defensiveDrebentraakhtDestroyed
        , blocknumber
    )
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT(blocknumber, fromCitadel)
    DO NOTHING
    `,
    GET_RAID_REPORT_FROM: `
    SELECT fromCitadel, toCitadel, timeRaidHit
    , offensiveCarryCapacity, drakmaRaided
    , offensiveSifGattacaDestroyed, offensiveMhrudvogThrotDestroyed, offensiveDrebentraakhtDestroyed
    , defensiveSifGattacaDestroyed, defensiveMhrudvogThrotDestroyed, defensiveDrebentraakhtDestroyed
    , blocknumber
    FROM raidReports
    WHERE fromCitadel = $1
    ORDER BY blocknumber desc
    `,
    GET_RAID_REPORT_TO: `
    SELECT fromCitadel, toCitadel, timeRaidHit
    , offensiveCarryCapacity, drakmaRaided
    , offensiveSifGattacaDestroyed, offensiveMhrudvogThrotDestroyed, offensiveDrebentraakhtDestroyed
    , defensiveSifGattacaDestroyed, defensiveMhrudvogThrotDestroyed, defensiveDrebentraakhtDestroyed
    , blocknumber
    FROM raidReports
    WHERE toCitadel = $1
    ORDER BY blocknumber desc
    `
};

module.exports = queries;
