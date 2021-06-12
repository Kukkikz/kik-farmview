const axios = require("axios");

const farmAbi = require('./abi/farmAbi.json');
const farmContract = [
    '0x3e349b83A3E68bdD5BB71fAB63dDE123c478FEA4',
    '0xE63aCEbE35265896cC6E8BdB8eCC0640a1807141',
    '0xAA7C2879DaF8034722A0977f13c343aF0883E92e'
];

const lpPriceUrl = 'https://api.beefy.finance/lps'
const lpName = {
    '0x3e349b83A3E68bdD5BB71fAB63dDE123c478FEA4': 'iron-iron-usdc',
    '0xE63aCEbE35265896cC6E8BdB8eCC0640a1807141': 'iron-titan-matic',
    '0xAA7C2879DaF8034722A0977f13c343aF0883E92e': 'curve-am3crv'
    
};

const getMyFarmInfo = async (shareBalance, sharePrice, farmAddress, farmName) => {
    const result = {};
    result.farm = farmName;
    const lpPrice = await getlpPrice(lpName[farmAddress]);
    result.depositBalance = (shareBalance / 1e18) * (sharePrice / 1e18);
    result.totalValue = result.depositBalance * lpPrice;

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