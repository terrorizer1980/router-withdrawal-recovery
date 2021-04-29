const axios = require("axios");
const { getBalanceForAssetId } = require("@connext/vector-utils");
const { readFileSync, createWriteStream } = require("fs");
const { BigNumber, constants, providers, utils } = require("ethers");

const file = readFileSync("./clean.txt", "utf-8");
const lines = file.split(/\r?\n/);

const routerIdentitifer =
  "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8";
const baseUrl = "http://localhost:8002";

const chains = {
  56: {
    USDT: {
      address: "0x55d398326f99059ff775485246999027b3197955",
      decimals: 18,
    },
    USDC: {
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      decimals: 18,
    },
    DAI: {
      address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      decimals: 18,
    },
    provider: new providers.JsonRpcProvider(process.env.BSC_PROVIDER, 56),
  },
  137: {
    USDT: {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
    },
    USDC: {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
    },
    DAI: {
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
    },
    provider: new providers.JsonRpcProvider(process.env.MATIC_PROVIDER, 137),
  },
  100: {
    USDT: {
      address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
      decimals: 6,
    },
    USDC: {
      address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
      decimals: 6,
    },
    DAI: { address: constants.AddressZero, decimals: 18 },
    provider: new providers.JsonRpcProvider(process.env.XDAI_PROVIDER, 100),
  },
};

const logAxiosError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
};

const run = async () => {
  // let lineNumber = 0;
  const toWrite = [];
  for (const line of lines) {
    // console.log(`line ${lineNumber + 1} / ${lines.length}`);
    // lineNumber++;

    const [address, chainId, _usdt, _usdc, _dai] = line.split(",");
    if (!Object.keys(chains).includes(chainId)) {
      continue;
    }

    const chainInfo = chains[chainId];

    let channel;
    try {
      const res = await axios.get(
        `${baseUrl}/${routerIdentitifer}/channels/${address}`
      );
      channel = res.data;
    } catch (e) {
      console.log("Error fetching channel", address);
      logAxiosError(e);
      continue;
    }

    if (!channel) {
      continue;
    }

    const usdt = getBalanceForAssetId(channel, chainInfo.USDT.address, "alice");
    const usdc = getBalanceForAssetId(channel, chainInfo.USDC.address, "alice");
    const dai = getBalanceForAssetId(channel, chainInfo.DAI.address, "alice");

    if (usdc !== _usdt || usdc !== _usdc || dai !== _dai) {
      const usdtDiff = utils.formatUnits(
        BigNumber.from(usdt).sub(
          utils.parseUnits(_usdt, chainInfo.USDT.decimals)
        )
      );
      const usdcDiff = utils.formatUnits(
        BigNumber.from(usdc).sub(
          utils.parseUnits(_usdc, chainInfo.USDC.decimals)
        )
      );
      const daiDiff = utils.formatUnits(
        BigNumber.from(dai).sub(utils.parseUnits(_dai, chainInfo.DAI.decimals))
      );
      const _line = `${address},${chainId},${usdtDiff},${usdcDiff},${daiDiff}\n`;
      // console.log("_line: ", _line);
      toWrite.push(_line);
    }
  }
  console.log("To write:", toWrite.toString());
};

run();
