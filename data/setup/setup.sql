CREATE DATABASE citadel;
CREATE USER max WITH ENCRYPTED PASSWORD 'bugbox';
GRANT ALL PRIVILEGES ON DATABASE citadel TO max;
GRANT ALL ON ALL TABLES IN SCHEMA public to max;

DROP TABLE citadel;
DROP TABLE pilot;
DROP TABLE citadelPilot;
DROP TABLE citadelFleet;
DROP TABLE grid;
DROP TABLE activeRaids;
DROP TABLE activeRaids;
DROP TABLE raidReports;
DROP TABLE wallet;


CREATE TABLE citadel (
    id INTEGER PRIMARY KEY,
    wallet_address VARCHAR(42),
    grid_id INTEGER,
    capital_id INTEGER,
    engine INTEGER,
    weapon_system INTEGER,
    shield INTEGER,
    sekt INTEGER,
    time_of_last_claim INTEGER,
    time_lit INTEGER,
    time_last_raided INTEGER,
    unclaimed_drakma INTEGER,
    pilot_count INTEGER
);

CREATE INDEX IF NOT EXISTS citadel_grid_idx ON citadel (grid_id); 

CREATE TABLE fleet (
    citadel_id INTEGER PRIMARY KEY,
    sif_gattaca INTEGER,
    mhrudvog_throt INTEGER,
    drebentraakht INTEGER,
    sif_gattaca_training INTEGER,
    mhrudvog_throt_training INTEGER,
    drebentraakht_training INTEGER
); 

CREATE TABLE pilot (
    id INTEGER PRIMARY KEY,
    death varchar(64),
    subjugation varchar(64),
    sovereign BOOLEAN,
    level INTEGER
);

CREATE TABLE citadel_pilot (
    citadel_id INTEGER,
    pilot_id INTEGER,
    PRIMARY KEY (citadel_id, pilot_id)
);

CREATE TABLE grid (
    id INTEGER PRIMARY KEY,
    is_lit BOOLEAN,
    is_capital BOOLEAN,
    sovereign_until INTEGER,
    citadel_id INTEGER
);

CREATE INDEX IF NOT EXISTS grid_idx ON grid (citadel_id);

CREATE TABLE siege (
    from_citadel INTEGER PRIMARY KEY,
    to_citadel INTEGER,
    sif_gattaca INTEGER,
    mhrudvog_throt INTEGER,
    drebentraakht INTEGER,
    pilot_count INTEGER,
    time_raid_hits INTEGER
);

CREATE TABLE report (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_citadel INTEGER,
    to_citadel INTEGER,
    time_siege_hit INTEGER,
    offensive_carry_capacity INTEGER,
    drakma_sieged INTEGER,
    block_number INTEGER,
    offensive_sif_gattaca_destroyed INTEGER,
    offensive_mhrudvog_throt_destroyed INTEGER,
    offensive_drebentraakht_destroyed INTEGER,
    defensive_sif_gattaca_destroyed INTEGER,
    defensive_mhrudvog_throt_destroyed INTEGER,
    defensive_drebentraakht_destroyed INTEGER
);

ALTER TABLE report
    ADD CONSTRAINT report_block_from_citadel
    UNIQUE (from_citadel, block_number);

CREATE TABLE wallet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(42),
    contract VARCHAR(256),
    nft_name VARCHAR(64),
    token_id VARCHAR(256),
    balance INTEGER
);

ALTER TABLE wallet
    ADD CONSTRAINT wallet_unique
    UNIQUE (wallet_address, contract, token_id);

CREATE TABLE capital (
    id INTEGER PRIMARY KEY,
    grid_id INTEGER,
    treasury INTEGER,
    bribe_amt INTEGER,
    capital_name VARCHAR(256),
    last_sack INTEGER
);

