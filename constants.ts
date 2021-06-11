import bsc from "./input/bsc";
import matic from "./input/matic";
import xdai from "./input/xdai";
import ftm from "./input/ftm";
import { Option } from "./types";

// Chains we handle, for convenient iteration.
export const HANDLED_CHAINS = {
  bsc,
  matic,
  xdai,
  ftm,
};
// Directory where we store output files, like flagged transfers, etc.
export const OUTPUT_DIR = "output";
export const ROUTER_IDENTIFIER =
  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC";
export const BASE_URL = "http://localhost:8002";
export const UNSUBMITTED = "unsubmitted";
export const UNMINED = "unmined";
export const USER = "user";
export const ROUTER = "router";

// 'Options' we handle, like each type of case - for convenient iteration.
export const HANDLED_OPTIONS: Option[] = [
  {
    forCase: UNSUBMITTED,
    forTarget: ROUTER,
  },
  {
    forCase: UNSUBMITTED,
    forTarget: USER,
  },
  {
    forCase: UNMINED,
    forTarget: ROUTER,
  },
  {
    forCase: UNMINED,
    forTarget: USER,
  },
];
// Timeout in ms between withdrawal retry attempts.
export const RETRY_PARITY = 1000;
