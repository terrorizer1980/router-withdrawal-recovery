import { sendQuery, QUERY } from "./query";
import { parseGenericQuery, saveJsonFile } from "./utils";
import { ASSET_MAP } from "./constants";

const run = async () => {
  for (const asset in ASSET_MAP) {
    const info = ASSET_MAP[asset];
    const response = await sendQuery(QUERY.SUM_VALUE(-1, asset));
    console.log(response);
    try {
      console.log(parseGenericQuery(response));
      const match = response.match(/sum \| (\d+)/);
      console.log(match);
    } catch (e) {
      console.log(`Could not parse for assetId: ${asset}`);
    }

    // console.log(parseGenericQuery(response));
    // const match = response.match(/sum \| (\d+)/);
    // console.log(match);
    // return;
    // const data = match[1];
  }
  // saveJsonFile("single-signed.json", data);
};

run();
