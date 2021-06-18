import * as fs from "fs";
import { OUTPUT_DIR } from "./constants";
import { TransferData } from "./types";
import { safeJsonParse } from "@connext/vector-utils";

export function parseGenericQuery<T = object>(response: string): T[] {
  const records = response
    .split(/-. RECORD [0-9]+ .-{1,}.-{1,}\n/)
    .map((s) => s.trim())
    .filter((x) => !!x);
  return records.map((r) => {
    let entry: any = {};
    const lines = r.split("\n");
    for (let line of lines) {
      if (line.length === 0) {
        continue;
      }
      const [key, value] = line.split(" | ");
      const trimmed = value.trim();
      entry[key.trim()] =
        trimmed.startsWith("{") && trimmed.endsWith("}")
          ? safeJsonParse(value)
          : trimmed;
    }
    return entry;
  });
}

export const parseStuckTransfersQuery = (response: string): TransferData[] => {
  /*   One record looks like this:
   *   -[ RECORD 67 ]-+-------------------------------------------------------------------
   *   transferId     | 0x0000000000000000000000000000000000000000000000000000000000000000
   *   channelAddress | 0x0000000000000000000000000000000000000000
   *
   * And with misc chars removed:
   * [ RECORD 50 ]transferId     | 0xb158a9aeae2f87a593fd960f986a55b33674ec907f5df43f83b06e7acfd9df01channelAddress | 0x133C9B3f9FBe9a99da8eE0F7853A9CfAdaDb57dc
   */
  // Check to see which is the transferId/channelAddress using regex matching.
  // This is to ensure if it's ever mixed up in the way postgres returns it,
  // we'll always handle it correctly./^/
  const r = /\[ RECORD \d+ \]transferId\s+?\| (0x[a-fA-F0-9]{64})channelAddress\s+?\| (0x[a-fA-F0-9]{40})/g;
  response = response.replace(/\n/g, "");
  response = response.replace(/-/g, "");
  response = response.replace(/\+/g, "");
  let records: TransferData[] = [];
  let match: any;
  do {
    match = r.exec(response);
    if (match) {
      const transferId = match[1];
      const channelAddress = match[2];
      records.push({
        transferId,
        channelAddress,
      } as TransferData);
    }
  } while (match);
  console.log(`Found ${records.length} records.`);
  return records;
};

export const saveJsonFile = (filename: string, data: any) => {
  let filepath = `./${OUTPUT_DIR}/${filename}.json`;
  fs.writeFile(filepath, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File ${filepath} written successfully.`);
    }
  });
  return;
};

/// Helper to mkdir for output files if needed.
export const makeOutputDir = () => {
  const dir = `./${OUTPUT_DIR}`;
  try {
    // Check if directory already exists.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`Directory ${dir} is created.`);
    }
  } catch (err) {
    console.log(err);
  }
};
