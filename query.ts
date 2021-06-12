import { exec } from "child_process";

export const QUERY = {
  GET: {
    SINGLE_SIGNED: `select transfer."amountA", transfer."amountB", update."assetId", channel."chainId" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transferResolver" is null and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC' limit 1;`,
  },
};

export const sendQuery = (query: string) => {
  let child = exec(
    `docker exec -t db-node bash -c "psql vector --username=vector -c \"${query}\" -x"`
  );
  child.stderr.on("data", function(data) {
    console.error("STDERR:", data.toString());
  });
  child.stdout.on("data", function(data) {
    const stdout: string = data.toString();
    console.log(stdout);
  });
  child.on("exit", function(exitCode) {
    console.log("Child exited with code: " + exitCode);
  });
};
