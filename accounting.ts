import { sendQuery, QUERY } from "./query";
import { parseGenericQuery, saveJsonFile } from "./utils";
import { ASSET_MAP } from "./constants";

type SumData = {
  sum: string;
};

const run = async () => {
  let sum = 0;
  for (const asset in ASSET_MAP) {
    const info = ASSET_MAP[asset];
    const response = await sendQuery(QUERY.SUM_VALUE(-1, asset), false);
    try {
      const data = parseGenericQuery<SumData>(response)[0];
      const amount = parseFloat(data.sum) / Math.pow(10, info.decimals);
      console.log(data, data.sum, parseFloat(data.sum));
      console.log(info.token, ":", amount);
      if (amount) {
        sum += amount;
      }
    } catch (e) {
      console.log(`Could not parse for assetId: ${asset}`);
    }
  }
  // saveJsonFile("single-signed.json", data);

  console.log("Total usd:", sum);
};

run();
