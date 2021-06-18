import { sendQuery, QUERY } from "./query";
import { parseGenericQuery } from "./utils";
import { ASSET_MAP } from "./constants";

type SumData = {
  sum: string;
};

export const run = async (): Promise<number> => {
  let sum = 0;
  for (const asset in ASSET_MAP) {
    const info = ASSET_MAP[asset];
    const response = await sendQuery(QUERY.SUM_VALUE(-1, asset), false);
    try {
      const data = parseGenericQuery<SumData>(response)[0];
      const amount = parseFloat(data.sum) / Math.pow(10, info.decimals);
      console.log(info.token, ":", amount);
      if (amount) {
        sum += amount;
      }
    } catch (e) {
      console.log(`Could not parse for assetId: ${asset}`);
    }
  }
  console.log("Total usd:", sum);
  return sum;
};

run();
