import { providers } from "ethers";

export type TransferData = {
  transferId: string;
  channelAddress: string;
};

export type FlaggedTransfer = {
  transactionHash: string;
  channelAddress: string;
  transferId: string;
  receipt: providers.TransactionReceipt | undefined;
  error: string;
};

export type Option = {
  status: string;
  target: string;
};
