import axios from "axios";
import { constants, providers } from "ethers";
import { config as dotEnvConfig } from "dotenv";
import * as fs from "fs";
import {
  HANDLED_CHAINS,
  OUTPUT_DIR,
  ROUTER_IDENTIFIER,
  BASE_URL,
  HANDLED_OPTIONS,
  RETRY_PARITY,
} from "./constants";
import { FlaggedTransfer, ChainTransferData } from "./types";
import { sendQuery, QUERY } from "./query";

dotEnvConfig();
console.log("config: ", process.env);

// All transfers that have been flagged for review due to errors.
// Includes transfers that will need to be disputed, etc. Saved to file at end of each
// iteration.
let flaggedTransfers: FlaggedTransfer[] = [];

// TODO:
// let rescuedFunds: { [chain: string]: number };

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
      `${BASE_URL}/${ROUTER_IDENTIFIER}/withdraw/transfer/${transferId}`
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

  let receipt: providers.TransactionReceipt | undefined = undefined;
  if (commitment.transactionHash) {
    console.log(
      "Commitment has existing transaction hash",
      commitment.transactionHash
    );
    if (commitment.transactionHash === constants.HashZero) {
      return;
    }
    receipt = await provider.getTransactionReceipt(commitment.transactionHash);
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
    const res = await axios.post(`${BASE_URL}/withdraw/retry`, {
      publicIdentifier: ROUTER_IDENTIFIER,
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
    flaggedTransfers.push({
      transactionHash: commitment.transactionHash,
      channelAddress: commitment.channelAddress,
      transferId,
      receipt,
      error,
    });
  }
};

/// Helper to mkdir for output files if needed.
const makeOutputDir = () => {
  const dir = `./${OUTPUT_DIR}`;
  try {
    // Check if directory already exists.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`Directory ${dir} is created.`);
    }
  } catch (err) {
    console.log(err);
  }
};

/// Helper for dumping flagged transfer info into a json file.
const saveFlaggedTransfers = async (forCase: string) => {
  if (flaggedTransfers.length === 0) {
    console.log("No transfers were flagged, nothing to save.");
    return;
  }
  // convert JSON object to a string
  const data = JSON.stringify(flaggedTransfers);
  makeOutputDir();
  // Write file to local disk in output directory.
  const filename = `./${OUTPUT_DIR}/${forCase}.json`;
  fs.writeFile(filename, data, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File ${filename} written successfully.`);
    }
  });
  // Clear flagged transfers.
  flaggedTransfers = [];
};

const handleRetries = async (
  provider: providers.JsonRpcProvider,
  chain: ChainTransferData,
  forCase: "unsubmitted" | "unmined",
  forTarget: "user" | "router"
) => {
  const chainName = Object.keys({ chain })[0];
  const executionName = [chainName, forCase, forTarget].join(".");
  console.log(`Trying ${forCase}`);
  const iterable = chain[forCase][forTarget];
  let count = 0;
  for (const [transferId, channelAddress] of iterable) {
    console.log(`${count} / ${iterable.length}`);
    count += 1;
    await retryWithdrawal(channelAddress, transferId, provider);
    await new Promise<void>((res) => setTimeout(() => res(), RETRY_PARITY));
  }
  saveFlaggedTransfers(executionName);
  console.log(`Finished ${forCase}`);
};

// "/:publicIdentifier/withdraw/transfer/:transferId"
const run = async () => {
  const result = await sendQuery(QUERY.GET.SINGLE_SIGNED);
  const records = result.split(/-\[ RECORD [0-9]+? \][-]+/);
  const data = records.map((r) => {
    let entry = {};
    const lines = r.split("\n");
    for (let line of lines) {
      if (line.length === 0) {
        continue;
      }
      const [key, value] = line.split(" | ");
      if (key === "amountA" || key === "amountB") {
        entry[key] = parseInt(value);
      } else {
        entry[key] = value;
      }
    }
    return entry;
  });
  const filename = "single-signed.json";
  fs.writeFile(filename, data, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File ${filename} written successfully.`);
    }
  });
  return;

  for (let chainName of Object.keys(HANDLED_CHAINS)) {
    const envVar = `${chainName.toUpperCase}_PROVIDER_URL`;
    const provider = new providers.JsonRpcProvider(process.env[envVar]);
    const chain = HANDLED_CHAINS[chainName];
    for (let option of HANDLED_OPTIONS) {
      await handleRetries(provider, chain, option.forCase, option.forTarget);
    }
  }
};

run();
