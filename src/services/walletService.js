const priceService = require('./priceService');
const web3Service = require('./web3Service');

const walletCoins = require('./walletCoins.json');
const erc20Abi = require('./erc20Abi.json');

const getWalletValue = async (address) => {
    let response = {};
    let tokens = [];
    let totalValue = 0;

    for (const coin of walletCoins) {
        const val = await getCoinValueinAddress(address, coin);
        if(val != null){
            totalValue += val.value;
            tokens.push(val);
        }
        
    }
    response.totalValue = totalValue;
    response.tokens = tokens;

    return response
}

const getCoinValueinAddress = async (address, coin) => {
    const response = {};
    response.name = coin.name;

    //Get coin balance
    if (coin.name == 'BNB') {
        const balance = await web3Service.web3.eth.getBalance(address);
        response.balance = balance / 1e18;
    } else {
        const tokenContract = await web3Service.getContract(erc20Abi, coin.address);
        const balance = await tokenContract.methods.balanceOf(address).call();
        response.balance = balance / 1e18;
        if (response.balance == 0) {
            return null;
        }
    }

    //Get price
    response.price = await priceService.getPrice(coin.address);
    response.value = response.balance * response.price;

    return response;
}

module.exports = {
    getWalletValue
}