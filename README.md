# game-server


## running
Runs on http://localhost:8000/

`npm install`

`npm start`

## run tests
`npm test`

## run data loader
`npx hardhat run loader/appLoader.js --network goerli`

## data model
    citadel
        id: int
        walletAddress: string
        gridId: int
        timeOfLastClaim: int
        timeLit: int
        timeLastRaided: int
        unclaimedDrakma: int
        isOnline: bool
        factionId: int
        engine: int
        weaponSystem: int
        shield: int
        fleetPoints: int
        level: int
        pilotCount: int

    citadelFleet
        citadelId int
        sifGattaca int
        mhrudvogThrot int
        drebentraakht int
        sifGattacaTraining int
        mhrudvogThrotTraining int
        drebentraakhtTraining int

    pilot
        id: int,
        death: int
        subjugation: int
        sovereign: bool
        level: int

    citadelPilot
        pilotID: int
        citadelID: int    

    grid
        id: int
        isLit: bool
        multiple: int

    raid (will be ethereum events)
        id: uuid
        fromCitadelId: int
        toCitadelId: int
        sifGattacaSent: int
        pilotOffense: int
        mhrudvogThrotOffense: int
        drebentraakhtOffense: int
        sifGattacaOffense: int
        mhrudvogThrotOffenseDestroyed: int
        drebentraakhtOffenseDestroyed: int
        sifGattacaOffenseDestroyed: int
        pilotDefense: int
        mhrudvogThrotDefense: int
        drebentraakhtDefense: int
        sifGattacaDefense: int
        mhrudvogThrotDefenseDestroyed: int
        drebentraakhtDefenseDestroyed: int
        sifGattacaDefenseDestroyed: int
        offensiveCarryCapacity: int
        drakmaRaided: int
        drakmaRemaining: int
        timeRaidHit: int



## entities
    citadel: {
        citadelId: int,
        walletAddress: string,
        grid: {
            gridId: int,
            isLit: true,
            multiple: int,
        },
        fleet: {
            sifGattaca: int,
            mhrudvogThrot: int,
            drebentraakht: int,
            sifGattacaTraining: int,
            mhrudvogThrotTraining: int,
            drebentraakhtTraining: int,
        },
        pilots: [
            {
                id: int,
                death: bool,
                level: int,
                subjugation: string
            }
        ],
        pilotCount: int,
        timeOfLastClaim: int,
        timeLit: int,
        timeLastRaided: int,
        unclaimedDrakma: int,
        isOnline: bool,
        faction: string,
        weaponSystem: string,
        engine: string,
        shield: string,
        level: int,
        fleetPoints: int
    }

    grid: {
            gridId: int,
            isLit: bool,
            multiple: int,
            citadel: {
                citadelId: int,
                isOnline: bool,
                walletAddress: string,
                faction: string 
            }
    }

    raid: {
        fromCitadel: int,
        toCitadel: int,
        fleetOffense: {
            sifGattaca: int,
            mhrudvogThrot: int,
            drebentraakht: int,
            destroyed: {
                sifGattaca: int,
                mhrudvogThrot: int,
                drebentraakht: int,
            }
        },
        fleetDefense: {
            sifGattaca: int,
            mhrudvogThrot: int,
            drebentraakht: int,
            destroyed: {
                sifGattaca: int,
                mhrudvogThrot: int,
                drebentraakht: int,
            }
        },
        fleetDeserted: {
            sifGattaca: int,
            mhrudvogThrot: int,
            drebentraakht: int,
        },
        drakmaAvaliable: int,
        carryCapacity: int,
        drakmaClaimed: int,
        timeHit: int,
    }



## endpoints
    GET getAllCitadel: [citadel]
    GET getCitadelById: citadel
    GET getAllGrid: [grid]
    GET getReports: [report]
    GET getRaid: raid
    PUT updateCitadel: citadel 


