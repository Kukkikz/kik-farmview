const farmAbi = require('./abi/0xb3c96d3c3d643c2318e4cdd0a9a48af53131f5f4.json');
const tokenAbi = require('./abi/0xe375a12a556e954ccd48c0e0d3943f160d45ac2e.json');
const Farms = require('./farms.json');
const priceService = require('../../services/priceService');

const getMyFarmInfo = async (poolInfo, farmName) => {
  const result = {};
  const cakeAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";
  const bunnyAddress = "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51";

  result.farm = farmName;

  result.depositedCake = poolInfo[0].balance / 1e18;
  result.pendingCake = poolInfo[0].pBASE / 1e18;
  result.pendingBunny = poolInfo[0].pBUNNY / 1e18;

  const cakePrice = await priceService.getPrice(cakeAddress);
  const bunnyPrice = await priceService.getPrice(bunnyAddress);

  result.depositValue = cakePrice * result.depositedCake;
  result.pendingCakeValue = cakePrice * result.pendingCake;
  result.pendingBunnyValue = bunnyPrice * result.pendingBunny;
  
  return result;
}

module.exports = {
  farms: Farms,
  farmAbi: farmAbi,
  tokenAbi: tokenAbi,
  getMyFarmInfo
};
