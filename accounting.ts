import { sendQuery, QUERY } from "./query";
import { parseGenericQuery, saveJsonFile } from "./utils";
import { ASSET_MAP } from "./constants";

const run = async () => {
  let sum = 0;
  for (const asset in ASSET_MAP) {
    const info = ASSET_MAP[asset];
    const response = await sendQuery(QUERY.SUM_VALUE(-1, asset), false);
    try {
      console.log(response);
      const data = parseGenericQuery(response);
      sum += parseFloat(data["sum"]) / info.decimals;
    } catch (e) {
      console.log(`Could not parse for assetId: ${asset}`);
    }
  }
  // saveJsonFile("single-signed.json", data);

  console.log("Total usd:", sum);
};

run();
