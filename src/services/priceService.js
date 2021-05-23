const axios = require("axios");
const tokens = require("./coinData.json");

const getPrice = async (address) => {
    try {
        let data = {};
        let id = "";
        if (address in tokens) {
            id = tokens[address].id;
            console.log(id);
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
            );
            data = res.data;
        }
        return data[id || address] ? data[id || address].usd : 0;
    } catch (e) {
        console.log("Error getting price", e);
    }
    return 0;
}

module.exports = {
    getPrice
}