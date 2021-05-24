const Web3Service = require("./services/web3Service");
const pancakeBunny = require("./farmPlatforms/pancakebunny/pancakebunny");
const autofarm = require('./farmPlatforms/autofarm/autofarm');
const alpaca = require('./farmPlatforms/alpaca/alpaca');
const dopple = require('./farmPlatforms/dopple/dopple');
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8080

const bunnyCakeContract = Web3Service.getBunnyCakeContract();
const autofarmContract = Web3Service.getAutofarmContract();
const alpacaWorkerContract = Web3Service.getAlpacaWorkerContract();
const alpacaFairlaunchContract = Web3Service.getAlpacaFairlaunchContract();
const doppleFairlaunchContract = Web3Service.getDoppleFairlaunchContract();
const doppleDopPoolContract = Web3Service.getDoppleDopPoolContract();

app.get('/', async (req, res) => {
    try {
        //Init Data
        console.log("Init Data");
        autofarm.initFarmData();
        const myAddress = req.query.address;
        let response = [];
        //Bunny - Cake
        console.log("Getting Bunny - Cake");
        const cakeBunnyPoolInfo = await bunnyCakeContract.methods.poolsOf(myAddress, [Web3Service.cakePoolContract]).call();
        const bunnyCakeInfo = await pancakeBunny.getMyFarmInfo(cakeBunnyPoolInfo, "Cake - PancakeBunny");
        response.push(bunnyCakeInfo);

        //Autofarm - Cake
        console.log("Getting Autofarm - Cake");
        const pendingAutofarmCake = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[0], myAddress).call();
        const depositAutofarmCake = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[0], myAddress).call();
        const autofarmCakeInFo = await autofarm.getMyFarmInfo(pendingAutofarmCake, depositAutofarmCake, autofarm.myFarmsPid[0]);
        response.push(autofarmCakeInFo);

        //Autofarm - ibnb
        console.log("Getting Autofarm - ibnb");
        const pendingAutofarmibnb = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[1], myAddress).call();
        const depositAutofarmibnb = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[1], myAddress).call();
        const autofarmibnbInFo = await autofarm.getMyFarmInfo(pendingAutofarmibnb, depositAutofarmibnb, autofarm.myFarmsPid[1]);
        response.push(autofarmibnbInFo);

        //Autofarm - banana-busd
        console.log("Getting Autofarm - banana-busd");
        const pendingAutofarmbanana = await autofarmContract.methods.pendingAUTO(autofarm.myFarmsPid[2], myAddress).call();
        const depositAutofarmbanana = await autofarmContract.methods.stakedWantTokens(autofarm.myFarmsPid[2], myAddress).call();
        const autofarmbananaInFo = await autofarm.getMyFarmInfo(pendingAutofarmbanana, depositAutofarmbanana, autofarm.myFarmsPid[2]);
        response.push(autofarmbananaInFo);

        //Alpaca - BNB-BUSD
        console.log("Getting Alpaca - BNB-BUSD");
        const alpacaPoolInfo = await alpacaWorkerContract.methods.positionInfo(alpaca.myFarmConfig.positionId).call();
        const pendingAlpaca = await alpacaFairlaunchContract.methods.pendingAlpaca(alpaca.myFarmConfig.pid, myAddress).call();
        const alpacaInfo = await alpaca.getMyFarmInfo(alpacaPoolInfo,pendingAlpaca,"Alpaca - BNB-BUSD");
        response.push(alpacaInfo);

        //Dopple - DOP Pool
        console.log("Getting Dopple - DOP Pool");
        const doppleLp = await doppleFairlaunchContract.methods.userInfo(dopple.myFarmConfig.pid, myAddress).call();
        const pendingDopple = await doppleFairlaunchContract.methods.pendingDopple(dopple.myFarmConfig.pid, myAddress).call();
        const doppleLpPrice = await doppleDopPoolContract.methods.getVirtualPrice().call();
        const doppleInfo = await dopple.getMyFarmInfo(doppleLp.amount,pendingDopple,doppleLpPrice, "Dopple - DOP Pool");
        response.push(doppleInfo);

        console.log("Done - send response");
        res.send(response);
    } catch {
        res.send('failed');
    }

})

app.listen(PORT, () => {
    console.log(`Server is running at : http://localhost:${PORT}`)
})