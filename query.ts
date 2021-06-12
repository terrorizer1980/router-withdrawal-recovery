import { exec, spawnSync, execSync } from "child_process";

export const QUERY = {
  GET: {
    SINGLE_SIGNED: `select transfer."amountA", transfer."amountB", update."assetId", channel."chainId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transferResolver" is null and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC' limit 10;`,
  },
};

export const sendQuery = async (query: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      query = query.replace(/"/g, `\\\\"`);
      query = query.replace(/'/g, `\\\'`);
      const command = `docker exec -t db-node bash -c $'psql vector --username=vector -c \\"${query}\\" -x'`;
      console.log("Sending command:\n", command, "\n");

      let stdout = "";
      process.stdout.on("data", (data) => {
        stdout += data;
      });
      const result = execSync(command, {
        // stdio: "ignore",
        stdio: ["inherit", "inherit", "inherit"],
        shell: "/bin/bash",
        encoding: "utf8",
        maxBuffer: 50 * 1024 * 1024,
        timeout: 10000,
      });
      console.log("\n\n\n**********STDOUT CAPTURED:\n", stdout.toString());
      console.log(result);
      if (result) {
        resolve(result.toString());
      } else {
        throw new Error(`Result was not valid: ${result}`);
      }
    } catch (e) {
      console.error(e);
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
