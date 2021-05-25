const Web3 = require("web3");
const pancakeBunny = require("../farmPlatforms/pancakebunny/pancakebunny");
const autofarm = require("../farmPlatforms/autofarm/autofarm");
const alpaca = require("../farmPlatforms/alpaca/alpaca");
const dopple = require("../farmPlatforms/dopple/dopple");
const alpha = require("../farmPlatforms/alpha/alpha");
const grow = require("../farmPlatforms/grow/grow");

// You can use any RPC endpoint from
// https://docs.binance.org/smart-chain/developer/rpc.html
const BSC_RPC = "https://bsc-dataseed1.defibit.io/";

const web3 = new Web3(
    new Web3.providers.HttpProvider(BSC_RPC, { keepAlive: true })
);

const getContract = (abi, address) => {
    return new web3.eth.Contract(abi, address);
}

const getBunnyCakeContract = () => {
    const masterBunnyContract = "0xb3c96d3c3d643c2318e4cdd0a9a48af53131f5f4";
    const cakePoolContract = pancakeBunny.farms.CAKE.address;
    const cakeToken = pancakeBunny.farms.CAKE.token;
    const bunnyCakeContract = getContract(pancakeBunny.farmAbi,masterBunnyContract);

    // console.log(bunnyCakeContract);
    return bunnyCakeContract;
}

const getAutofarmContract = () => {
    const autofarmContract = getContract(autofarm.farmAbi,autofarm.MASTER_CHEF);
    // console.log(autofarmContract);

    // const temp = autofarm.setupFarmData();

    return autofarmContract;
}

const getAlpacaWorkerContract = () => {
    const alpacaWorkerContract = getContract(alpaca.workerAbi, alpaca.workerContract);
    return alpacaWorkerContract;
}

const getAlpacaFairlaunchContract = () => {
    const alpacaFairlaunchContract = getContract(alpaca.fairlaunchAbi, alpaca.fairlaunchContract);
    return alpacaFairlaunchContract;
}

const getDoppleFairlaunchContract = () => {
    return getContract(dopple.fairlaunchAbi, dopple.fairlaunchContract);
}

const getDoppleDopPoolContract = () => {
    return getContract(dopple.dopPoolAbi, dopple.dopPoolContract);
}

const getAlphaContract = () => {
    return getContract(alpha.ibBNBAbi,alpha.alphaContract);
}

const getGrowFarmContract = () => {
    return getContract(grow.growFarmAbi, grow.growFarmContract);
}

const getGrowMinterContract = () => {
    return getContract(grow.growMinterAbi, grow.growMinterContract);
}

module.exports = {
    web3: web3,
    getContract,
    getBunnyCakeContract,
    getAutofarmContract,
    cakePoolContract: pancakeBunny.farms.CAKE.address,
    getAlpacaWorkerContract,
    getAlpacaFairlaunchContract,
    getDoppleFairlaunchContract,
    getDoppleDopPoolContract,
    getAlphaContract,
    getGrowFarmContract,
    getGrowMinterContract
}