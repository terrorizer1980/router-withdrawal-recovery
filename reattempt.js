const axios = require("axios");
const { bscAttempted } = require("./bsc");
const { xdaiAttempted } = require("./xdai");
const { providers } = require("ethers");

const routerIdentitifer =
  "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8";
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
  const test = bscAttempted[0];
  for (const transferId of [test]) {
    let commitment;
    console.log("testing with transfer", transferId);
    try {
      const res = await axios.get(
        `${baseUrl}/${routerIdentitifer}/withdraw/transfer/${transferId}`
      );
      commitment = res.data;
      console.log("commitment", commitment);
    } catch (e) {
      console.log("Error fetching transfer", transferId);
      logAxiosError(e);
    }
    if (commitment.transactionHash) {
      console.log(
        "Commitment has existing transaction hash",
        commitment.transactionHash
      );
      const receipt = provider.getTransactionReceipt(
        commitment.transactionHash
      );
      if (receipt) {
        console.log("Tx submitted, ignoring", transferId);
        continue;
      }
    } else {
      console.log("Commitment missing hash");
    }
    console.log(`Reattempting withdrawal: ${transferId}`);
    try {
      const res = await axios.post(`${baseUrl}/withdraw/retry`, {
        adminToken: process.env.ADMIN_TOKEN,
        transferId,
      });
      console.log(`Retried transfer: `, res.data);
    } catch (error) {
      console.log(`Error on transfer: ${transferId}`);
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
    }
    await new Promise((res) => setTimeout(() => res(), 2000));
  }
};

run();
