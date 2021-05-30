const Web3Service = require("./services/web3Service");
const pancakeBunny = require("./farmPlatforms/pancakebunny/pancakebunny");
const autofarm = require('./farmPlatforms/autofarm/autofarm');
const alpaca = require('./farmPlatforms/alpaca/alpaca');
const dopple = require('./farmPlatforms/dopple/dopple');
const alpha = require('./farmPlatforms/alpha/alpha');
const grow = require('./farmPlatforms/grow/grow');
const beefyPolygon = require('./farmPlatforms/beefy-polygon/beefyPolygon');
const walletService = require('./services/walletService');
const priceService = require('./services/priceService');
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

const bunnyCakeContract = Web3Service.getBunnyCakeContract();
const autofarmContract = Web3Service.getAutofarmContract();
const alpacaWorkerContract = Web3Service.getAlpacaWorkerContract();
const alpacaFairlaunchContract = Web3Service.getAlpacaFairlaunchContract();
const doppleFairlaunchContract = Web3Service.getDoppleFairlaunchContract();
const doppleDopPoolContract = Web3Service.getDoppleDopPoolContract();
const alphaContract = Web3Service.getAlphaContract();
// const growFarmContract = Web3Service.getGrowFarmContract();
// const growMinterContract = Web3Service.getGrowMinterContract();
const beefyPolygonContract = Web3Service.getBeefyPolygonContract();

app.get('/', async (req, res) => {
    try {
        //Init Data
        console.log("Init Data /");
        autofarm.initFarmData();
        priceService.getAllCoinPrice();
        const myAddress = req.query.address;
        let response = {};
        let farms = [];

        //Bunny - Cake
        console.log("Getting Bunny - Cake");
        const cakeBunnyPoolInfo = await bunnyCakeContract.methods.poolsOf(myAddress, [Web3Service.cakePoolContract]).call();
        const bunnyCakeInfo = await pancakeBunny.getMyFarmInfo(cakeBunnyPoolInfo, "Cake - PancakeBunny");
        farms.push(bunnyCakeInfo);

        //Autofarm - Cake
        console.log("Getting Autofarm - Cake");
        const pendingAutofarmCake = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[0], myAddress).call();
        const depositAutofarmCake = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[0], myAddress).call();
        const autofarmCakeInFo = await autofarm.getMyFarmInfo(pendingAutofarmCake, depositAutofarmCake, autofarm.myFarmsPid[0]);
        farms.push(autofarmCakeInFo);

        //Autofarm - ibnb
        console.log("Getting Autofarm - ibnb");
        const pendingAutofarmibnb = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[1], myAddress).call();
        const depositAutofarmibnb = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[1], myAddress).call();
        const autofarmibnbInFo = await autofarm.getMyFarmInfo(pendingAutofarmibnb, depositAutofarmibnb, autofarm.myFarmsPid[1]);
        farms.push(autofarmibnbInFo);

        //Autofarm - banana-busd
        console.log("Getting Autofarm - banana-busd");
        const pendingAutofarmbanana = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[2], myAddress).call();
        const depositAutofarmbanana = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[2], myAddress).call();
        const autofarmbananaInFo = await autofarm.getMyFarmInfo(pendingAutofarmbanana, depositAutofarmbanana, autofarm.myFarmsPid[2]);
        farms.push(autofarmbananaInFo);

        //Alpaca - BNB-BUSD
        console.log("Getting Alpaca - BNB-BUSD");
        const alpacaPoolInfo = await alpacaWorkerContract.methods.positionInfo(alpaca.myFarmConfig.positionId).call();
        const pendingAlpaca = await alpacaFairlaunchContract.methods.pendingAlpaca(alpaca.myFarmConfig.pid, myAddress).call();
        const alpacaInfo = await alpaca.getMyFarmInfo(alpacaPoolInfo, pendingAlpaca, "Alpaca - BNB-BUSD");
        farms.push(alpacaInfo);

        //Dopple - DOP Pool
        console.log("Getting Dopple - DOP Pool");
        const doppleLp = await doppleFairlaunchContract.methods.userInfo(dopple.myFarmConfig.pid, myAddress).call();
        const pendingDopple = await doppleFairlaunchContract.methods.pendingDopple(dopple.myFarmConfig.pid, myAddress).call();
        const doppleLpPrice = await doppleDopPoolContract.methods.getVirtualPrice().call();
        const doppleInfo = await dopple.getMyFarmInfo(doppleLp.amount, pendingDopple, doppleLpPrice, "Dopple - DOP Pool");
        farms.push(doppleInfo);

        //Alpha Homora - BNB-BUSD
        console.log("Getting Alpha Homora - BNB-BUSD");
        const alphaPoolInfo = await alphaContract.methods.positionInfo(alpha.myFarmConfig.positionId).call();
        const alphaInfo = await alpha.getMyFarmInfo(alphaPoolInfo, "Alpha Homora - BNB-BUSD");
        farms.push(alphaInfo);

        //Grow - BUSD farm
        // console.log("Getting Grow - BUSD farm");
        // const growPoolBalance = await growFarmContract.methods.balanceOf(myAddress).call();
        // const pendingGrow = await growMinterContract.methods.strategyUsers(grow.growFarmContract, myAddress).call();
        // const growInfo = await grow.getMyFarmInfo(growPoolBalance, pendingGrow, "Grow - BUSD");
        // farms.push(growInfo);

        //Beefy Polygon - Iron-BUSD farm
        console.log("Getting Beefy Polygon - Iron-BUSD farm");
        const beefyShareBalance = await beefyPolygonContract.methods.balanceOf(myAddress).call();
        const beefySharePrice = await beefyPolygonContract.methods.getPricePerFullShare().call();
        const BeefyPolygonInfo = await beefyPolygon.getMyFarmInfo(beefyShareBalance, beefySharePrice, "Beefy Polygon - Iron-BUSD");
        farms.push(BeefyPolygonInfo);

        //Get Wallet
        const walletData = await walletService.getWalletValue(myAddress);

        console.log("Done - send response");
        let farmValue = 0;
        let walletValue = walletData.totalValue;
        for (const farm of farms) {
            farmValue += farm.totalValue;
        }

        if (req.query.detail == "summary") {
            response.totalValue = farmValue + walletValue;
            response.farmValue = farmValue;
            response.walletValue = walletValue;
        } else {
            response.summary = {};
            response.summary.totalValue = farmValue + walletValue;
            response.summary.farmValue = farmValue;
            response.summary.walletValue = walletValue;
            response.farms = farms;
            response.wallet = walletData;

        }

        res.send(response);
    } catch {
        res.status(500);
        res.send('failed');
    }

});

app.get('/wallet', async (req, res) => {
    try {
        //Init Data
        console.log("Init Data /wallet");
        priceService.getAllCoinPrice();
        const myAddress = req.query.address;

        //Get Wallet Value
        const walletData = await walletService.getWalletValue(myAddress);

        res.send(walletData);
    } catch {
        res.status(500);
        res.send('failed');
    }
});

app.get('/tokens/:token', async (req, res) => {
    try {
        let response = {}
        console.log('token =', req.params.token)
        const price = await priceService.getPrice(req.params.token);
        console.log(price);
        response.price = price;
        res.send(response);

    } catch {
        res.status(500);
        res.send('failed');
    }

});

app.get('/all-tokens', async (req, res) => {
    try {
        priceService.getAllCoinPrice();
        res.send('OK');
    } catch {
        res.status(500);
        res.send('failed');
    }
})


app.listen(PORT, () => {
    console.log(`Server is running at : http://localhost:${PORT}`)
})