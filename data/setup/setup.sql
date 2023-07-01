CREATE DATABASE citadel;
CREATE USER max WITH ENCRYPTED PASSWORD 'bugbox';
GRANT ALL PRIVILEGES ON DATABASE citadel TO max;
GRANT ALL ON ALL TABLES IN SCHEMA public to max;

CREATE TABLE citadel (
    id INTEGER PRIMARY KEY,
    walletAddress VARCHAR(42),
    gridId INTEGER,
    factionId INTEGER,
    engine INTEGER,
    weaponSystem INTEGER,
    shield INTEGER,
    level INTEGER,
    timeOfLastClaim INTEGER,
    timeLit INTEGER,
    timeLastRaided INTEGER,
    unclaimedDrakma INTEGER,
    isOnline BOOLEAN,
    fleetPoints INTEGER
);

CREATE INDEX IF NOT EXISTS citadelGridIDX ON citadel (gridId); 

CREATE TABLE citadelFleet (
    citadelId INTEGER PRIMARY KEY,
    sifGattaca INTEGER,
    mhrudvogThrot INTEGER,
    drebentraakht INTEGER,
    sifGattacaTraining INTEGER,
    mhrudvogThrotTraining INTEGER,
    drebentraakhtTraining INTEGER
);

CREATE TABLE pilot (
    id INTEGER PRIMARY KEY,
    death varchar(64),
    subjugation varchar(64),
    sovereign BOOLEAN,
    level INTEGER
);

CREATE TABLE citadelPilot (
    citadelId INTEGER,
    pilotId INTEGER,
    PRIMARY KEY (citadelId, pilotId)
);

CREATE TABLE grid (
    id INTEGER PRIMARY KEY,
    isLit BOOLEAN,
    multiple NUMERIC
);

CREATE TABLE activeRaids (
    fromCitadel INTEGER PRIMARY KEY,
    toCitadel INTEGER,
    sifGattaca INTEGER,
    mhrudvogThrot INTEGER,
    drebentraakht INTEGER,
    pilotCount INTEGER,
    timeRaidHits INTEGER
);

ALTER TABLE citadel
ADD COLUMN pilotCount INTEGER;

CREATE TABLE raidReports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fromCitadel BIGINT,
    toCitadel BIGINT,
    timeRaidHit BIGINT,
    offensiveCarryCapacity BIGINT,
    drakmaRaided BIGINT,
    blocknumber BIGINT
);

ALTER TABLE raidReports
    ADD CONSTRAINT raid_report_block_from_citadel
    UNIQUE (fromCitadel, blocknumber);

ALTER TABLE raidReports
ADD COLUMN offensiveSifGattacaDestroyed INTEGER,
ADD COLUMN offensiveMhrudvogThrotDestroyed INTEGER,
ADD COLUMN offensiveDrebentraakhtDestroyed INTEGER,
ADD COLUMN defensiveSifGattacaDestroyed INTEGER,
ADD COLUMN defensiveMhrudvogThrotDestroyed INTEGER,
ADD COLUMN defensiveDrebentraakhtDestroyed INTEGER;

ALTER TABLE citadel
DROP COLUMN isOnline,
DROP COLUMN fleetPoints;

CREATE TABLE wallet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    walletAddress VARCHAR(42),
    contract VARCHAR(256),
    nftName VARCHAR(64),
    tokenId VARCHAR(256),
    balance INTEGER
);

ALTER TABLE wallet
    ADD CONSTRAINT wallet_unique
    UNIQUE (walletAddress, contract, tokenId);