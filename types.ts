import { TransactionReceipt } from "ethers/providers";

export type FlaggedTransfer = {
  transactionHash: string;
  channelAddress: string;
  transferId: string;
  receipt: TransactionReceipt | undefined;
  error: string;
};

export type ChainTransferData = {
  unsubmitted: {
    router: string[][];
    user: any[];
  };
  unmined: {
    user: any[];
    router: any[];
  };
};

export type Option = {
  forCase: "unsubmitted" | "unmined";
  forTarget: "user" | "router";
};
