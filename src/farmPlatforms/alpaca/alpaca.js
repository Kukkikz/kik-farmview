const priceService = require('../../services/priceService');
const fairlaunchAbi = require('./abi/fairlaunch.json');
const workerAbi = require('./abi/worker.json');
const fairlaunchContract = "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F";
const workerContract = "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f";

const alpacaAddress = "0x8f0528ce5ef7b51152a59745befdd91d97091d2f";
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

const myFarmConfig = {
    "positionId": 2311,
    "pid": 7
}

const getMyFarmInfo = async (alpacaPoolInfo, pendingAlpaca, farmName) => {
    const result = {};

    const alpacaPrice = await priceService.getPrice(alpacaAddress);
    const busdPrice = await priceService.getPrice(busdAddress);
    
    result.farm = farmName;
    result.depositBusd = (parseFloat(alpacaPoolInfo[0]) - parseFloat(alpacaPoolInfo[1])) / 1e18
    result.depositValue = result.depositBusd * busdPrice;
    result.pendingAlpaca = pendingAlpaca / 1e18;
    result.pendingValue = result.pendingAlpaca * alpacaPrice;
    result.totalValue = result.depositValue + result.pendingValue;

    return(result);
}

module.exports = {
    fairlaunchAbi: fairlaunchAbi,
    workerAbi: workerAbi,
    fairlaunchContract: fairlaunchContract,
    workerContract: workerContract,
    myFarmConfig: myFarmConfig,
    getMyFarmInfo
}