
queries = {
    GET_ALL_CITADEL: `
        SELECT c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
        , array_agg(p.pilot_id) as pilot_ids
        FROM citadel c LEFT JOIN grid g ON (c.grid_id = g.id)
        LEFT JOIN fleet f ON (c.id = f.citadel_id)
        LEFT JOIN citadel_pilot p on (c.id = p.citadel_id)
        GROUP BY c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
        ORDER BY c.id ASC
    `,
    GET_LIT_CITADEL: `
        SELECT c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
        , array_agg(p.pilot_id) as pilotIds
        FROM citadel c INNER JOIN grid g ON (c.grid_id = g.id)
        LEFT JOIN fleet f ON (c.id = f.citadel_id)
        LEFT JOIN citadel_pilot p on (c.id = p.citadel_id)
        WHERE g.is_lit = true
        GROUP BY c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
        ORDER BY c.id ASC
    `,
    GET_CITADEL: `
        SELECT c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
        , array_agg(p.pilotId) as pilotIds
        FROM citadel c LEFT JOIN grid g ON (c.grid_id = g.id)
        LEFT JOIN fleet f ON (c.id = f.citadel_id)
        LEFT JOIN citadel_pilot p on (c.id = p.citadel_id)
        WHERE c.id = $1
        GROUP BY c.id, c.wallet_address, c.grid_id, c.time_of_last_claim, c.time_lit, c.time_last_raided
        , c.unclaimed_drakma, c.capital_id, c.engine, c.weapon_system, c.shield
        , c.pilot_count
        , g.is_lit, g.multiple
        , f.sif_gattaca, f.mhrudvog_throt, f.drebentraakht
        , f.sif_gattaca_training, f.mhrudvog_throt_training, f.drebentraakht_training
    `,
    UPDATE_CITADEL: `
        UPDATE citadel
        SET wallet_address = $1,
        grid_id = $2,
        capital_id = $3,
        time_lit = $4,
        time_of_last_claim = $5,
        time_last_raided = $6,
        unclaimed_drakma = $7,
        pilot_count = $8
        WHERE id = $9
    `,
    UPDATE_GRID: `
        UPDATE grid
        SET is_lit = $1
        WHERE id = $2
    `,
    DIM_GRID: `
        update grid
        set is_lit = false
        where id not in (
            select grid_id 
            from citadel
            where grid_id is not null
        )
        and is_lit = true
    `,
    UPDATE_FLEET: `
        UPDATE fleet
        SET sif_gattaca = $1,
        mhrudvog_throt = $2,
        drebentraakht = $3,
        sif_gattaca_training = $4,
        mhrudvog_throt_training = $5,
        drebentraakht_training = $6
        WHERE citadel_id = $7
    `,
    GET_ALL_GRID: `
        SELECT g.id, g.multiple, g.is_lit
        , c.id as citadel_id, c.wallet_address, c.capital_id
        FROM grid g LEFT JOIN citadel c ON (g.id = c.grid_id)
        order by g.id ASC
    `,
    GET_GRID: `
        SELECT g.id, g.multiple, g.is_lit
        , c.id as citadel_id, c.wallet_address, c.capital_id
        FROM grid g LEFT JOIN citadel c ON (g.id = c.grid_id)
        WHERE g.id = $1
    `,
    UPDATE_ACTIVE_RSIEGE: `
        UPDATE siege
        SET to_citadel = $2,
        sif_gattaca = $3,
        mhrudvog_throt = $4,
        drebentraakht = $5,
        pilot_count = $6, 
        time_siege_hits = $7
        WHERE from_citadel = $1
    `,
    GET_ALL_RAIDS: `
        SELECT from_citadel, to_citadel, sif_gattaca, mhrudvog_throt, drebentraakht
        , pilot_count, time_siege_hits
        FROM activeRaids
        WHERE to_citadel != 0
        ORDER BY from_citadel
    `,
    DELETE_CITADEL_PILOT: `
        DELETE FROM citadelPilot 
        WHERE citadel_id = $1
    `,
    INSERT_CITADEL_PILOT: `
        INSERT INTO citadelPilot(citadel_id, pilotId)
        VALUES($1, $2)
    `,
    UPSERT_REPORT: `
        INSERT INTO report(from_citadel, to_citadel, time_siege_hit
            , offensive_carry_capacity, drakma_sieged
            , offensive_sif_gattaca_destroyed, offensive_mhrudvog_throt_destroyed, offensive_drebentraakht_destroyed
            , defensive_sif_gattaca_destroyed, defensive_mhrudvog_throt_destroyed, defensive_drebentraakht_destroyed
            , block_number
        )
        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT(block_number, from_citadel)
        DO NOTHING
    `,
    GET_REPORT_FROM: `
        SELECT from_citadel, to_citadel, time_siege_hit
        , offensive_carry_capacity, drakma_sieged
        , offensive_sif_gattaca_destroyed, offensive_mhrudvog_throt_destroyed, offensive_drebentraakht_destroyed
        , defensive_sif_gattaca_destroyed, defensive_mhrudvog_throt_destroyed, defensive_drebentraakht_destroyed
        , block_number
        FROM report
        WHERE from_citadel = $1
        ORDER BY block_number desc
    `,
    GET_REPORT_TO: `
        SELECT from_citadel, to_citadel, time_siege_hit
        , offensive_carry_capacity, drakma_sieged
        , offensive_sif_gattaca_destroyed, offensive_mhrudvog_throt_destroyed, offensive_drebentraakht_destroyed
        , defensive_sif_gattaca_destroyed, defensive_mhrudvog_throt_destroyed, defensive_drebentraakht_destroyed
        , block_number
        FROM report
        WHERE to_citadel = $1
        ORDER BY block_number desc
    `,
    GET_ACTIVE_WALLETS: `
        SELECT distinct wallet_address
        FROM citadel
    `,
    UPSERT_WALLET: `
        INSERT INTO wallet(
            wallet_address, contract, tokenId, nftName
        )
        values($1, $2, $3, $4)
        ON CONFLICT(wallet_address, contract, tokenId)
        DO NOTHING
    `,
    DIM_WALLET: `
        DELETE FROM wallet
        WHERE wallet_address NOT IN (
            SELECT DISTINCT wallet_address
            FROM citadel 
        )
    `,
    GET_ALL_WALLETS: `
        SELECT wallet_address, contract, tokenId, nftName
        FROM wallet
        order by wallet_address, contract, tokenId
    `,
    GET_WALLET: `
        SELECT wallet_address, contract, tokenId, nftName
        FROM wallet
        WHERE wallet_address = $1
        order by wallet_address, contract, tokenId
    `,
};

module.exports = queries;
