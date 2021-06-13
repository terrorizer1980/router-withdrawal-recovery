import { execSync } from "child_process";
import { TARGET, STATUS } from "./constants";

export const QUERY = {
  SINGLE_SIGNED: (chainId: number) => {
    return `select transfer."transferId", transfer."amountA", transfer."amountB", update."assetId", channel."chainId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transferResolver" is null and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
  },
  [TARGET.ROUTER]: {
    [STATUS.UNSUBMITTED]: (chainId: number) => {
      return `select transfer."transferId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" join onchain_transaction on transfer."onchainTransactionId" = onchain_transaction."transactionHash" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and channel."chainId" = '${chainId}' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC' and not onchain_transaction."status" = 'mined';`;
    },
    [STATUS.UNMINED]: (chainId: number) => {
      return `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '${chainId}' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
    },
  },
  [TARGET.USER]: {
    [STATUS.UNSUBMITTED]: (chainId: number) => {
      return `select transfer."transferId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" join onchain_transaction on transfer."onchainTransactionId" = onchain_transaction."transactionHash" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and channel."chainId" = '${chainId}' and "fromIdentifier" != 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC' and not onchain_transaction."status" = 'mined';`;
    },
    [STATUS.UNMINED]: (chainId: number) => {
      return `select transfer."transferId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '${chainId}' and "fromIdentifier" != 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
    },
  },
};

console.log("AVAILABLE_QUERIES", QUERY);

export const sendQuery = async (query: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      query = query.replace(/"/g, `\\\\"`);
      query = query.replace(/'/g, `\\\'`);
      const command = `docker exec db-node bash -c $'psql vector --username=vector -c \\"${query}\\" -x'`;
      console.log("Sending command:\n", command, "\n");

      const result = execSync(command, {
        shell: "/bin/bash",
        encoding: "utf8",
        maxBuffer: 50 * 1024 * 1024,
      });
      if (result) {
        resolve(result.toString());
      } else {
        throw new Error(`Result was not valid: ${result}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
};
