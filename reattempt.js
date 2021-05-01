const axios = require("axios");
const { providers } = require("ethers");

const bsc = require("./input/bsc");
const matic = require("./input/matic");
const xdai = require("./input/xdai");

const routerIdentitifer =
  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC";
const baseUrl = "http://localhost:8002";

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

// "/:publicIdentifier/withdraw/transfer/:transferId"
const run = async () => {
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL);
  for (const transferId of matic.unmined.router) {
    let commitment;
    try {
      const res = await axios.get(
        `${baseUrl}/${routerIdentitifer}/withdraw/transfer/${transferId}`
      );
      commitment = res.data;
    } catch (e) {
      console.log("Error fetching transfer", transferId);
      logAxiosError(e);
      continue;
    }
    console.log(
      `Checking withdrawal: ${transferId} for channel ${commitment.channelAddress}`
    );
    if (commitment.transactionHash) {
      console.log(
        "Commitment has existing transaction hash",
        commitment.transactionHash
      );
      const receipt = await provider.getTransactionReceipt(
        commitment.transactionHash
      );
      if (receipt) {
        console.log("Tx submitted, ignoring", transferId);
        continue;
      }
    } else {
      console.log("Commitment missing hash");
    }
    console.log(
      `Reattempting withdrawal: ${transferId} for channel ${commitment.channelAddress}`
    );
    try {
      const res = await axios.post(`${baseUrl}/withdraw/retry`, {
        adminToken: process.env.ADMIN_TOKEN,
        transferId,
      });
      console.log(`Retried transfer: `, {
        ...res.data,
        channelAddress: commitment.channelAddress,
      });
      const receipt = await provider.waitForTransaction(
        res.data.transactionHash
      );
      console.log(`Got receipt for tx ${receipt.transactionHash}`);
    } catch (error) {
      console.log(`Error on transfer: ${transferId}`);
      logAxiosError(error);
    }
    await new Promise((res) => setTimeout(() => res(), 1000));
  }
};

run();
