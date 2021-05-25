const priceService = require('../../services/priceService');

const growFarmAbi = require('./abi/growFarmAbi.json');
const growMinterAbi = require('./abi/growMinterAbi.json');
const growFarmContract = "0xD0c27bA118483a6449E11C7f260434BAF9DF4f3D";
const growMinterContract = "0xE2009352AE22CD1cFD4C89110Fb0e9225a89Cf8C";

const growAddress = "0x8CEF274596d334FFa10f8976a920DDC81ba6e29b";
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

const getMyFarmInfo = async (growPoolBalance, pendingGrow, farmName) => {
    const result = {};

    const growPrice = await priceService.getPrice(growAddress);
    const busdPrice = await priceService.getPrice(busdAddress);

    result.farm = farmName;
    result.depositBusd = growPoolBalance / 1e18;
    result.depositValue = result.depositBusd * busdPrice;
    result.pendingGrow = (parseInt(pendingGrow.lockedRewards) + parseInt(pendingGrow.pendingRewards)) / 1e18;
    result.pendingValue = result.pendingGrow * growPrice;
    result.totalValue = result.depositValue + result.pendingValue;

    return result;
}

module.exports = {
    growFarmAbi,
    growMinterAbi,
    growFarmContract,
    growMinterContract,
    getMyFarmInfo
}

