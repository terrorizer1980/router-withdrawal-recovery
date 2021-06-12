import { spawnSync } from "child_process";

// const query = `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '56' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
const COMMAND = {
  BASE: "psql vector --username=vector",
  EXPANDED_DISPLAY: "hello\n",
};

const execCommand = (command: string) => {
  const writeCommand = command + "\r\n";
  console.log("Writing", writeCommand);
  process.stdin.write(writeCommand, (error) => {
    if (error) {
      console.error("Error in writing:", error);
    }
  });
};

process.stdin.on("data", (data) => console.log("STDIN:", data.toString()));
process.stdin.on("close", () => console.log("STDIN CLOSED"));
process.stderr.on("data", function(data) {
  console.error("STDERR:", data.toString());
});
process.stdout.on("data", function(data) {
  const stdout: string = data.toString();
  capturedStdout += stdout;
  if (!capturedStdout.includes("#")) {
    return;
  }
  console.log(count, capturedStdout);
  capturedStdout = "";
  switch (count) {
    case 0:
      execCommand(COMMAND.BASE);
      break;
    case 1:
      execCommand(COMMAND.EXPANDED_DISPLAY);
      break;
    // case 2:
    //   execCommand(child, query);
    //   break;
    default:
      break;
  }
  count += 1;
});

const query = `select * from update limit 1;`;
let count = 0;
let capturedStdout = "";
let child = spawnSync(
  "docker",
  ["exec", "-it", "db-node", "bash", "-it"],
  {
    stdio: "inherit",
  }
  // {
  //   shell: true,
  // }
);

// child.on("exit", function(exitCode) {
//   console.log("Child exited with code: " + exitCode);
// });

// child.stdin.on("data", (data) => console.log("STDIN:", data.toString()));
// child.stdin.on("close", () => console.log("STDIN CLOSED"));
// child.stderr.on("data", function(data) {
//   console.error("STDERR:", data.toString());
// });
// child.stdout.on("data", function(data) {
//   const stdout: string = data.toString();
//   capturedStdout += stdout;
//   if (!capturedStdout.includes("#")) {
//     return;
//   }
//   console.log(count, capturedStdout);
//   capturedStdout = "";
//   switch (count) {
//     case 0:
//       execCommand(child, COMMAND.BASE);
//       break;
//     case 1:
//       execCommand(child, COMMAND.EXPANDED_DISPLAY);
//       break;
//     // case 2:
//     //   execCommand(child, query);
//     //   break;
//     default:
//       child.kill();
//       break;
//   }
//   count += 1;
// });
// child.on("exit", function(exitCode) {
//   console.log("Child exited with code: " + exitCode);
// });
