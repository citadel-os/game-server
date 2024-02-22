const Web3 = require('web3');
const Pool = require('pg').Pool;
require('dotenv').config();
const queries = require("../data/queries");
let CitadelDataLoader = require("./citadelDataLoader.js");

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const CITADEL_STORAGEV2 = process.env.CITADEL_STORAGEV2;
const CITADEL_GAMEV2 = process.env.CITADEL_GAMEV2;
const RAID_TOPIC = process.env.RAID_TOPIC;
const UPDATE_TOPIC = process.env.UPDATE_TOPIC;
const ALCHEMY_SOCKETSERVER = process.env.ALCHEMY_SOCKETSERVER;

const pool = new Pool({
    user: DB_USERNAME,
    host: DB_HOST,
    database: 'citadel',
    password: DB_PASSWORD,
    port: 5432
});

const web3SocketOptions = {
    keepAlive: true,
    timeout: 60000,
}
const web3 = new Web3()
const provider = new web3.providers.WebsocketProvider(ALCHEMY_SOCKETSERVER, web3SocketOptions);
web3.setProvider(provider);


var optionsRaid = {
    reconnect: {
        auto: true,
        delay: 60000, // ms
        maxAttempts: 500,
        onTimeout: true
},
    address: CITADEL_GAMEV2,
    topics: [
        RAID_TOPIC
    ],
    fromBlock: 9201150
};

var optionsUpdate = {
    reconnect: {
        auto: true,
        delay: 60000, // ms
        maxAttempts: 500,
        onTimeout: true
},
    address: CITADEL_GAMEV2,
    topics: [
        UPDATE_TOPIC
    ],
    fromBlock: 9286550
};

var optionsFleet = {
    reconnect: {
        auto: true,
        delay: 60000, // ms
        maxAttempts: 500,
        onTimeout: true
},
    address: CITADEL_STORAGEV2,
    topics: [
        UPDATE_TOPIC
    ],
    fromBlock: 9286550
};

function main() {

    console.log("starting");

    subscribe();

}

function subscribe() {

    // raids
    web3.eth.subscribe('logs', optionsRaid, function(error, result){
        console.log("raid subscription block: " + result.blockNumber);
        if (error) {
            console.log(error);
        }
    }).on("data", function(log) {
        let report = decodeReportData(log.data);
        writeReport(report, log.blockNumber);
        
    }).on("changed", function(log) {
        console.log('changed', log);
    });

    // main contract updates
    web3.eth.subscribe('logs', optionsUpdate, function(error, result){
        console.log("update subscription block: " + result.blockNumber);
        if (error) {
            console.log(error);
        }
    }).on("data", function(log) {
        let update = decodeUpdateData(log.data);
        callUpdate(update, log.blockNumber);
        
    }).on("changed", function(log) {
        console.log('changed', log);
    });

    // training updates from fleet contract
    web3.eth.subscribe('logs', optionsFleet, function(error, result){
        console.log("fleet subscription block: " + result.blockNumber);
        if (error) {
            console.log(error);
        }
    }).on("data", function(log) {
        let update = decodeUpdateData(log.data);
        callUpdate(update, log.blockNumber);
        
    }).on("changed", function(log) {
        console.log('changed', log);
    });

    console.log("subscribed to topics");
}


function decodeReportData(data) {
    const typesArray = [
        {type: 'uint256', name: 'fromCitadelId'}, 
        {type: 'uint256', name: 'toCitadelId'},
        {type: 'uint256', name: 'timeRaidHit'},
        {type: 'uint256', name: 'offensiveCarryCapacity'},
        {type: 'uint256', name: 'drakmaRaided'},
        {type: 'uint256', name: 'offensiveSifGattacaDestroyed'},
        {type: 'uint256', name: 'offensiveMhrudvogThrotDestroyed'},
        {type: 'uint256', name: 'offensiveDrebentraakhtDestroyed'},
        {type: 'uint256', name: 'defensiveSifGattacaDestroyed'},
        {type: 'uint256', name: 'defensiveMhrudvogThrotDestroyed'},
        {type: 'uint256', name: 'defensiveDrebentraakhtDestroyed'}
    ];
    let decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);
    return decodedParameters;
}

function decodeUpdateData(data) {
    const typesArray = [
        {type: 'uint256', name: 'citadelId'}
    ];
    let decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);
    return decodedParameters;
}

async function writeReport(report, blocknumber) {
    try {
        console.log("write report");
        console.log(report.fromCitadelId);
        await pool.query(queries.UPSERT_RAID_REPORT, [
            report.fromCitadelId,
            report.toCitadelId,
            report.timeRaidHit,
            parseInt(web3.utils.fromWei(report.offensiveCarryCapacity.toString(), 'ether')),
            parseInt(web3.utils.fromWei(report.drakmaRaided.toString(), 'ether')),
            report.offensiveSifGattacaDestroyed, 
            report.offensiveMhrudvogThrotDestroyed, 
            report.offensiveDrebentraakhtDestroyed, 
            report.defensiveSifGattacaDestroyed, 
            report.defensiveMhrudvogThrotDestroyed, 
            report.defensiveDrebentraakhtDestroyed,
            blocknumber
          ]);
    } catch (err) {
        console.log(err);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));

}

async function callUpdate(update, blocknumber) {

    try {
        const GameV2 = await ethers.getContractFactory("CitadelGameV2");
        const gameV2 = await GameV2.attach(CITADEL_GAMEV2);
        const StorageV2 = await ethers.getContractFactory("StorageV2");
        const storageV2 = await StorageV2.attach(CITADEL_STORAGEV2);
        
        const citadelDataLoader = new CitadelDataLoader(pool, gameV2, storageV2);
        
        let citadelId = update.citadelId;
        await citadelDataLoader.updateCitadel(citadelId);
        console.log("citadel " + citadelId + " updated");
    } catch (err) {
        console.log(err);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

}

main();