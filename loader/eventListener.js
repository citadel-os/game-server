const Web3 = require('web3');
const Pool = require('pg').Pool;
require('dotenv').config();
const queries = require("../data/queries");

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const CITADEL_GAMEV1 = process.env.CITADEL_GAMEV1;
const RAID_TOPIC = process.env.RAID_TOPIC;
const ALCHEMY_SOCKETSERVER = process.env.ALCHEMY_SOCKETSERVER;

const pool = new Pool({
    user: DB_USERNAME,
    host: DB_HOST,
    database: 'citadel',
    password: DB_PASSWORD,
    port: 5432
});

const web3 = new Web3()
const provider = new web3.providers.WebsocketProvider(ALCHEMY_SOCKETSERVER)
web3.setProvider(provider);

var options = {
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 50,
        onTimeout: false
},
    address: CITADEL_GAMEV1,
    topics: [
        RAID_TOPIC
    ],
    fromBlock: 8470000
};

function main() {

    var subscription = web3.eth.subscribe('logs', options, function(error, result){
        if (error) {
            console.log(error);
        }
    }).on("data", function(log) {

        console.log(log.blockNumber);
        let report = decodeLogData(log.data);
        writeReport(report, log.blockNumber);
        
    }).on("changed", function(log) {
        console.log('changed', log);
    });
}

function decodeLogData(data) {
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

async function writeReport(report, blocknumber) {
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
}

main();