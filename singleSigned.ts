import { sendQuery, QUERY } from "./query";
import { parseGenericQuery, saveJsonFile } from "./utils";

const run = async () => {
  const response = await sendQuery(QUERY.SINGLE_SIGNED(-1));
  const data = parseGenericQuery(response);
  saveJsonFile("single-signed.json", data);
};

run();
