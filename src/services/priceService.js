const axios = require("axios");
const tokens = require("./coinData.json");

const coinPriceData = new Map();

const getPrice = async (address) => {
    if (coinPriceData.has(address)) {
        return coinPriceData.get(address);
    }
    try {
        let data = {};
        let id = "";
        if (address in tokens) {
            id = tokens[address].id;
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
            );
            data = res.data;
        }
        if (data[id || address]) {
            if(address == "0xe9e7cea3dedca5984780bafc599bd69add087d56") {
                if(data[id || address].usd <= 1.05 && data[id || address].usd >= 0.95){
                    coinPriceData.set(address, 1);
                    return 1;
                }
            }
            coinPriceData.set(address, data[id || address].usd);
            return data[id || address].usd;
        } else {
            return 0;
        }
    } catch (e) {
        console.log("Error getting price", e);
    }
    return 0;
}

const getCoinPriceData = () => {
    return coinPriceData;
}

module.exports = {
    getPrice,
    getCoinPriceData
}