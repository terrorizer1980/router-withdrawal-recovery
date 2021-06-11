import axios from "axios";
import { constants, providers } from "ethers";
import { config as dotEnvConfig } from "dotenv";

import bsc from "./input/bsc";
import matic from "./input/matic";
import xdai from "./input/xdai";
import ftm from "./input/ftm";

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
  channelAddress: string,
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
    if (commitment.transactionHash === constants.HashZero) {
      return;
    }
    const receipt = await provider.getTransactionReceipt(
      commitment.transactionHash
    );
    if (receipt) {
      console.log("Tx receipt available", transferId);
    }
  } else {
    console.log("Commitment missing hash");
  }
  console.log(
    `Reattempting withdrawal: ${transferId} for channel ${commitment.channelAddress}`
  );
  try {
    const res = await axios.post(`${baseUrl}/withdraw/retry`, {
      publicIdentifier: routerIdentitifer,
      channelAddress,
      transferId,
    });
    console.log(`Retried transfer: `, {
      ...res.data,
      channelAddress: commitment.channelAddress,
    });
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
  console.log("Trying bsc.unsubmitted.router");
  let count = 0;
  for (const [transferId, channelAddress] of bsc.unsubmitted.router) {
    console.log(`${count} / ${bsc.unsubmitted.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished bsc.unsubmitted.router");

  console.log("Trying bsc.unsubmitted.user");
  count = 0;
  for (const [transferId, channelAddress] of bsc.unsubmitted.user) {
    console.log(`${count} / ${bsc.unsubmitted.user.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished bsc.unsubmitted.user");

  console.log("Trying bsc.unmined.router");
  count = 0;
  for (const [transferId, channelAddress] of bsc.unmined.router) {
    console.log(`${count} / ${bsc.unmined.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished bsc.unmined.router");

  // MATIC
  provider = new providers.JsonRpcProvider(process.env.MATIC_PROVIDER_URL);
  console.log("Trying matic.unsubmitted.router");
  count = 0;
  for (const [transferId, channelAddress] of matic.unsubmitted.router) {
    console.log(`${count} / ${matic.unsubmitted.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished matic.unsubmitted.router");

  console.log("Trying matic.unsubmitted.user");
  count = 0;
  for (const [transferId, channelAddress] of matic.unsubmitted.user) {
    console.log(`${count} / ${matic.unsubmitted.user.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished matic.unsubmitted.user");

  console.log("Trying matic.unmined.router");
  count = 0;
  for (const [transferId, channelAddress] of matic.unmined.router) {
    console.log(`${count} / ${matic.unmined.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished matic.unmined.router");

  // XDAI
  provider = new providers.JsonRpcProvider(process.env.XDAI_PROVIDER_URL);
  console.log("Trying xdai.unsubmitted.router");
  count = 0;
  for (const [transferId, channelAddress] of xdai.unsubmitted.router) {
    console.log(`${count} / ${xdai.unsubmitted.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished xdai.unsubmitted.router");

  console.log("Trying xdai.unsubmitted.user");
  count = 0;
  for (const [transferId, channelAddress] of xdai.unsubmitted.user) {
    console.log(`${count} / ${xdai.unsubmitted.user.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished xdai.unsubmitted.user");

  console.log("Trying xdai.unmined.router");
  count = 0;
  for (const [transferId, channelAddress] of xdai.unmined.router) {
    console.log(`${count} / ${xdai.unmined.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished xdai.unmined.router");

  // FTM
  provider = new providers.JsonRpcProvider(process.env.FTM_PROVIDER_URL);
  console.log("Trying ftm.unsubmitted.router");
  count = 0;
  for (const [transferId, channelAddress] of ftm.unsubmitted.router) {
    console.log(`${count} / ${ftm.unsubmitted.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished ftm.unsubmitted.router");

  console.log("Trying ftm.unsubmitted.user");
  count = 0;
  for (const [transferId, channelAddress] of ftm.unsubmitted.user) {
    console.log(`${count} / ${ftm.unsubmitted.user.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished ftm.unsubmitted.user");

  console.log("Trying ftm.unmined.router");
  count = 0;
  for (const [transferId, channelAddress] of ftm.unmined.router) {
    console.log(`${count} / ${ftm.unmined.router.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
  console.log("Finished ftm.unmined.router");
  //////////
};

run();
