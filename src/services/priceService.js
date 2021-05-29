const axios = require("axios");
const tokens = require("./coinData.json");
const NodeCache = require("node-cache");

const coinPriceCache = new NodeCache({ stdTTL: 600, checkperiod: 300, useClones: false, deleteOnExpire: true });
const coinPriceData = new Map();

const getPrice = async (address) => {
    if (coinPriceCache.has(address)) {
        const price = coinPriceCache.get(address);
        if (price != undefined) {
            return price;
        }
    }
    try {
        console.log("Downloading ", tokens[address].id);
        let data = {};
        let id = "";
        if (address in tokens) {
            if (tokens[address].source == "pancake") {
                const res = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${address}`);
                data = res.data;
                if (data.data.price) {
                    coinPriceCache.set(address, parseFloat(data.data.price));
                    return parseFloat(data.data.price);
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
                if (tokens[address].stable) {
                    if (data[id || address].usd <= 1.05 && data[id || address].usd >= 0.95) {
                        coinPriceCache.set(address, 1);
                        return 1;
                    } else {
                        coinPriceCache.set(address, data[id || address].usd);
                        return data[id || address].usd;
                    }
                }
                coinPriceCache.set(address, data[id || address].usd);
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

const getAllCoinPrice = async () => {
    let coinIds = '';
    for (const tokenAddr in tokens) {
        if (tokens[tokenAddr].source !== "pancake") {
            coinIds += `${tokens[tokenAddr].id},`;
        }
    }
    try {
        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );
        data = res.data;
        for (const tokenAddr in tokens) {
            const id = tokens[tokenAddr].id;
            if (data[tokens[tokenAddr].id]) {
                console.log('Price for', id, '=', data[id].usd);
                if (tokens[tokenAddr].stable) {
                    if (data[id].usd <= 1.05 && data[id].usd >= 0.95) {
                        coinPriceCache.set(tokens[tokenAddr].address, 1);
                    } else {
                        coinPriceCache.set(tokens[tokenAddr].address, data[id].usd);
                    }
                } else {
                    coinPriceCache.set(tokens[tokenAddr].address, data[id].usd);
                }
            }

        }

    } catch (e) {
        console.log("Error getting price", e);
    }
}

module.exports = {
    getPrice,
    getAllCoinPrice
}