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
            if (tokens[address].source == "pancake") {
                const res = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${address}`);
                data = res.data;
                console.log(data);
                if (data.data.price) {
                    coinPriceData.set(address, data.data.price);
                    return data.data.price;
                } else {
                    throw new Error(`Price for ${tokens[address].id} is not found`);
                }
                
            }

            id = tokens[address].id;
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
            );
            data = res.data;
            if (data[id || address]) {
                if(tokens[address].stable) {
                    if(data[id || address].usd <= 1.05 && data[id || address].usd >= 0.95){
                        coinPriceData.set(address, 1);
                        return 1;
                    }
                }
                coinPriceData.set(address, data[id || address].usd);
                return data[id || address].usd;
            } else {
                throw new Error(`Price for ${id} is not found`);
            }
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