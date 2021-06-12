import { spawn } from "child_process";

// const query = `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '56' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
const COMMAND = {
  BASE: `docker exec -t db-node bash -c "psql vector --username=vector"`,
  EXPANDED_DISPLAY: "\\x",
};
// exec(command, (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     console.log(err);
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });

const query = `select * from update limit 1;`;
let count = 0;
let child = spawn(COMMAND.BASE, {
  shell: true,
});
child.stderr.on("data", function(data) {
  console.error("STDERR:", data.toString());
});
child.stdout.on("data", function(data) {
  const stdout = data.toString();
  console.log("STDOUT:", stdout);
  switch (count) {
    case 0:
      child.stdin.write(COMMAND.EXPANDED_DISPLAY);
    case 1:
      child.stdin.write(query);
    default:
      child.kill();
  }
  count += 1;
});
child.on("exit", function(exitCode) {
  console.log("Child exited with code: " + exitCode);
});
