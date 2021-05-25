const farmAbi = require('./abi/0x0895196562C7868C5Be92459FaE7f877ED450452.json');
const axios = require("axios");
const priceService = require('../../services/priceService');

const MASTER_CHEF = "0x0895196562C7868C5Be92459FaE7f877ED450452"
const myFarmsPid = [
    "7",
    "137",
    "347"
]

let autoPrice = 0;
let autoFarmMap;

const getAddressFarms = async () => {
    try {
        let data = {};
        const res = await axios.get(
            "https://static.autofarm.network/bsc/farm_data.json"
        );
        data = res.data;
        autoPrice = await priceService.getPrice("0xa184088a740c695e156f91f5cc086a06bb78b827");
        
        return data;
    } catch (e) {
        console.log("Error getting price", e);
    }
    return 0;
}

const setupFarmData = async () => {
    const allFarmsInfo = await getAddressFarms();
    const myFarmsInfo = new Map();
    for (const key of Object.keys(allFarmsInfo.pools)) {
        if (myFarmsPid.includes(key)) {
            const farm = allFarmsInfo.pools[key];
            let farmInfo = {
                "pid": key,
                "farmName": `${farm.farmName}-${farm.wantName}`,
                "wantPrize": parseFloat(farm.wantPrice)
            }
            // myFarmsInfo[key] = farmInfo;
            myFarmsInfo.set(key, farmInfo);
        }
    }
    return myFarmsInfo;
}

const initFarmData = async () => {
    autoFarmMap = await setupFarmData();
}

const getMyFarmInfo = async (pendingAuto, deposit, pid) => {
    const farm = autoFarmMap.get(pid);
    const result = {
        "farm": `Auto - ${farm.farmName}`,
        "deposit": deposit / 1e18,
        "pendingAuto": pendingAuto / 1e18,
        "depositValue": (deposit / 1e18) * farm.wantPrize,
        "pendingValue": (pendingAuto / 1e18) * autoPrice
    };

    result.totalValue = result.depositValue + result.pendingValue;
    
    return result;
}




module.exports = {
    farmAbi: farmAbi,
    MASTER_CHEF: MASTER_CHEF,
    myFarmsPid: myFarmsPid,
    initFarmData,
    getMyFarmInfo
}

    




