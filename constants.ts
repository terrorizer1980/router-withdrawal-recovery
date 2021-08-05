import { Values } from "@connext/vector-types";
import { Option } from "./types";

// Directory where we store output files, like flagged transfers, etc.
export const OUTPUT_DIR = "output";
export const ROUTER_IDENTIFIER =
  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC";
export const BASE_URL = "http://localhost:8002";

export const STATUS = {
  UNSUBMITTED: "unsubmitted",
  UNMINED: "unmined",
} as const;

export const TARGET = {
  USER: "user",
  ROUTER: "router",
} as const;

// Chains we handle, for convenient iteration.
export const HANDLED_CHAINS = {
  bsc: 56,
  matic: 137,
  xdai: 100,
  ftm: 250,
};

const asset = (token: string, decimals: number, price: number = 1) => ({
  token,
  decimals,
  price,
});

export const ASSET_MAP = {
  "0x55d398326f99059fF775485246999027B3197955": asset("B-USDT", 18),
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": asset("P-USDC", 6),
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": asset("P-USDT", 6),
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3": asset("B-DAI", 18),
  "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": asset("P-DAI", 18),
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": asset("B-USDC", 18),
  "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83": asset("X-USDC", 6),
  "0x4ECaBa5870353805a9F068101A40E0f32ed605C6": asset("X-USDT", 6),
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": asset("USDC", 6),

  /* INVALID
   * '0x0000000000000000000000000000000000000000',
   * '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': Asset("STAKE", 18),
   * '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': Asset("KIRA", 6, 0.4651),
   * '0x049d68029688eAbF473097a2fC38ef61633A3C7A': Asset("f-USDT", 6, 0.0),
   */
};

// 'Options' we handle, like each type of case - for convenient iteration.
export const HANDLED_OPTIONS: Option[] = [
  {
    status: STATUS.UNMINED,
    target: TARGET.ROUTER,
  },
  // TODO: Add these other cases to the list of handled cases.
  {
    status: STATUS.UNMINED,
    target: TARGET.USER,
  },
  {
    status: STATUS.UNSUBMITTED,
    target: TARGET.ROUTER,
  },
  {
    status: STATUS.UNSUBMITTED,
    target: TARGET.USER,
  },
];
// Timeout in ms between withdrawal retry attempts.
export const RETRY_PARITY = 1000;
