const priceService = require('../../services/priceService');
const ibBNBAbi = require('./abi/ibBNBAbi.json');
const alphaContract = "0x3bB5f6285c312fc7E1877244103036ebBEda193d";

const bnbAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

const myFarmConfig = {
    "positionId": 6927
}

const getMyFarmInfo = async (alphaPoolInfo, farmName) => {
    const result = {};

    const bnbPrice = await priceService.getPrice(bnbAddress);

    result.farm = farmName;
    result.depositBnb = (alphaPoolInfo[0] - alphaPoolInfo[1]) / 1e18;
    result.depositValue = result.depositBnb * bnbPrice;
    result.totalValue = result.depositValue;

    return result;
}

module.exports = {
    ibBNBAbi,
    alphaContract,
    myFarmConfig,
    getMyFarmInfo
}