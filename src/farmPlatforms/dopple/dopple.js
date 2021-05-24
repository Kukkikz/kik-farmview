const priceService = require('../../services/priceService');
const fairlaunchAbi = require('./abi/fairlaunch.json');
const dopPoolAbi = require('./abi/swap.json');
const fairlaunchContract = "0xDa0a175960007b0919DBF11a38e6EC52896bddbE"
const dopPoolContract = "0x5162f992EDF7101637446ecCcD5943A9dcC63A8A"
const dopAddress = "0x844fa82f1e54824655470970f7004dd90546bb28"

const myFarmConfig = {
    "pid": 1
}

const getMyFarmInfo = async (deposit, dopple, lpPrice, farmName ) => {
    const result = {};
    const dopPrice = await priceService.getPrice(dopAddress);

    result.farm = farmName;
    result.deposit = deposit / 1e18;
    result.pendingDop = dopple / 1e18;
    result.depositValue = result.deposit * (lpPrice / 1e18);
    result.pendingValue = result.pendingDop * dopPrice;

    return(result);
}

module.exports = {
    fairlaunchAbi,
    dopPoolAbi,
    fairlaunchContract,
    dopPoolContract,
    myFarmConfig,
    getMyFarmInfo
}
