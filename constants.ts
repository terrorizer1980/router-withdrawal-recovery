import { Option } from "./types";

// Directory where we store output files, like flagged transfers, etc.
export const OUTPUT_DIR = "output";
export const ROUTER_IDENTIFIER =
  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC";
export const BASE_URL = "http://localhost:8002";

export const STATUS = {
  UNSUBMITTED: "unsubmitted",
  UNMINED: "unmined",
};

export const TARGET = {
  USER: "user",
  ROUTER: "router",
};

// Chains we handle, for convenient iteration.
export const HANDLED_CHAINS = {
  bsc: 56,
  matic: 137,
  xdai: 100,
  ftm: 250,
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
  // {
  //   status: STATUS.UNSUBMITTED,
  //   target: TARGET.ROUTER,
  // },
  // {
  //   status: STATUS.UNSUBMITTED,
  //   target: TARGET.USER,
  // },
];
// Timeout in ms between withdrawal retry attempts.
export const RETRY_PARITY = 1000;
