const axios = require("axios");

const farmAbi = require('./abi/farmAbi.json');
const farmContract = '0x3e349b83A3E68bdD5BB71fAB63dDE123c478FEA4';
const lpPriceUrl = 'https://api.beefy.finance/lps'
const lpName = 'iron-iron-usdc';

const getMyFarmInfo = async (shareBalance, sharePrice, farmName) => {
    const result = {};
    result.farm = farmName;
    const lpPrice = await getlpPrice(lpName);
    result.depositBalance = shareBalance / 1e18;
    result.totalValue = result.depositBalance * (sharePrice / 1e18) * lpPrice;

    return result;
}

const getlpPrice = async(lpName) => {
    const res = await axios.get(lpPriceUrl);
    if(res.data[lpName]) {
        return res.data[lpName]
    } else {
        return 0;
    }
}

module.exports = {
    farmAbi,
    farmContract,
    getMyFarmInfo
}