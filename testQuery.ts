import { ChildProcessWithoutNullStreams, spawn } from "child_process";

// const query = `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '56' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
const COMMAND = {
  BASE: `docker exec -t db-node bash -c "psql vector --username=vector"`,
  EXPANDED_DISPLAY: "\\x\n",
};

const execCommand = (
  child: ChildProcessWithoutNullStreams,
  command: string
) => {
  const writeCommand = command + "\r\n";
  console.log("Writing", writeCommand);
  child.stdin.write(writeCommand, (error) => {
    console.error("Error in writing:", error);
  });
  child.stdin.end();
};

const query = `select * from update limit 1;`;
let count = 0;
let child = spawn(COMMAND.BASE, {
  shell: true,
});
child.stdin.on("data", (data) => console.log("STDIN:", data.toString()));
child.stdin.on("close", () => console.log("STDIN CLOSED"));
child.stderr.on("data", function(data) {
  console.error("STDERR:", data.toString());
});
child.stdout.on("data", function(data) {
  const stdout = data.toString();
  console.log(count, stdout);
  switch (count) {
    case 0:
      break;
    case 1:
      execCommand(child, COMMAND.EXPANDED_DISPLAY);
      break;
    case 2:
      execCommand(child, query);
      break;
    default:
      child.kill();
      break;
  }
  count += 1;
});
child.on("exit", function(exitCode) {
  console.log("Child exited with code: " + exitCode);
});
