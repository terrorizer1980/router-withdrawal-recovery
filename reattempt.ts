import axios from "axios";
import { providers } from "ethers";
import { config as dotEnvConfig } from "dotenv";

import bsc from "./input/bsc";
import matic from "./input/matic";
import xdai from "./input/xdai";

dotEnvConfig();

console.log("config: ", process.env);

const routerIdentitifer =
  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC";
const baseUrl = "http://localhost:8002";

const logAxiosError = (error: any) => {
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

const retryWithdrawal = async (
  transferId: string,
  provider: providers.JsonRpcProvider
) => {
  let commitment: {
    channelAddress: string;
    transactionHash: string;
  };
  try {
    const res = await axios.get(
      `${baseUrl}/${routerIdentitifer}/withdraw/transfer/${transferId}`
    );
    commitment = res.data;
  } catch (e) {
    console.log("Error fetching transfer", transferId);
    logAxiosError(e);
    return;
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
      console.log("Tx receipt available, ignoring", transferId);
      return;
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
    const receipt = await provider.waitForTransaction(res.data.transactionHash);
    console.log(`Got receipt for tx ${receipt.transactionHash}`);
  } catch (error) {
    console.log(`Error on transfer: ${transferId}`);
    logAxiosError(error);
  }
};

// "/:publicIdentifier/withdraw/transfer/:transferId"
const run = async () => {
  ////////// ROUTER
  // BSC
  let provider = new providers.JsonRpcProvider(process.env.BSC_PROVIDER_URL);
  for (const transferId of bsc.unsubmitted.router) {
    console.log("Trying bsc.unsubmitted.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished bsc.unsubmitted.router");
  }

  for (const transferId of bsc.unmined.router) {
    console.log("Trying bsc.unmined.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished bsc.unmined.router");
  }

  // MATIC
  provider = new providers.JsonRpcProvider(process.env.MATIC_PROVIDER_URL);
  for (const transferId of matic.unsubmitted.router) {
    console.log("Trying matic.unsubmitted.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished matic.unsubmitted.router");
  }

  for (const transferId of matic.unmined.router) {
    console.log("Trying matic.unmined.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished matic.unmined.router");
  }

  // XDAI
  provider = new providers.JsonRpcProvider(process.env.XDAI_PROVIDER_URL);
  for (const transferId of xdai.unsubmitted.router) {
    console.log("Trying xdai.unsubmitted.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished xdai.unsubmitted.router");
  }

  for (const transferId of xdai.unmined.router) {
    console.log("Trying xdai.unmined.router");
    await retryWithdrawal(transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    console.log("Finished xdai.unmined.router");
  }
  //////////
};

run();
