import * as fs from "fs";
import { OUTPUT_DIR } from "./constants";
import { TransferData } from "./types";

export const parseGenericQuery = (response: string): object[] => {
  const records = response.split(/-\[ RECORD [0-9]+? \][-]+/);
  return records.map((r) => {
    let entry = {};
    const lines = r.split("\n");
    for (let line of lines) {
      if (line.length === 0) {
        continue;
      }
      const [key, value] = line.split(" | ");
      if (key === "amountA" || key === "amountB") {
        entry[key] = parseInt(value);
      } else {
        entry[key] = value;
      }
    }
    return entry;
  });
};

export const parseStuckTransfersQuery = (response: string): TransferData[] => {
  // console.log(response.trim());
  console.log(response.replace(/\n/g, ""));
  // const records = response.split(/-\[ RECORD [0-9]+? \][-+]+/);
  /*   One record looks like this:
   *   -[ RECORD 67 ]-+-------------------------------------------------------------------
   *   transferId     | 0x0000000000000000000000000000000000000000000000000000000000000000
   *   channelAddress | 0x0000000000000000000000000000000000000000
   *
   * -[ RECORD 50 ]-+-------------------------------------------------------------------transferId     | 0xb158a9aeae2f87a593fd960f986a55b33674ec907f5df43f83b06e7acfd9df01channelAddress | 0x133C9B3f9FBe9a99da8eE0F7853A9CfAdaDb57dc-
   */
  const records = response
    .replace(/\n/g, "")
    .match(
      /-\[ RECORD \d+? \]-\+-[-]+?transferId\s+?\| (0x[a-fA-F0-9]{40})channelAddress\s+?\| (0x[a-fA-F0-9]{64})-/
    );
  console.log(records);
  return records.map((line) => {
    line = line.trim();

    const items = line.split(" | ");
    // Check to see which is the transferId using regex matching.
    // This is to ensure if it's ever mixed up in the way postgres returns it,
    // we'll always handle it correctly./^/
    const transferId = items.splice(
      items.findIndex((item) => !!item.match(/^0x([a-fA-F0-9]{64})$/)),
      1
    )[0];
    const channelAddress = items[0];
    return {
      transferId,
      channelAddress,
    } as TransferData;
  });
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
