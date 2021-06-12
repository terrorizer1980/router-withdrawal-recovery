import { exec, execSync } from "child_process";

export const QUERY = {
  GET: {
    SINGLE_SIGNED: `select transfer."amountA", transfer."amountB", update."assetId", channel."chainId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transferResolver" is null and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`,
  },
};

export const sendQuery = async (query: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      query = query.replace(/"/g, `\\\\"`);
      const result = execSync(
        `docker exec -t db-node bash -c $'psql vector --username=vector -c "${query}" -x'`,
        {
          stdio: ["ignore", "ignore", "pipe"],
        }
      );
      if (result) {
        resolve(result.toString());
      } else {
        throw new Error(`Result was not valid: ${result}`);
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

  // let child = exec(
  //   `docker exec -t db-node bash -c "psql vector --username=vector -c \"${query}\" -x"`
  // );
  // child.stderr.on("data", function(data) {
  //   console.error("STDERR:", data.toString());
  // });
  // child.stdout.on("data", function(data) {
  //   const stdout: string = data.toString();
  // });
  // child.on("exit", function(exitCode) {
  //   console.log("Child exited with code: " + exitCode);
  // });
};
