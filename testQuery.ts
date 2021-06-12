import { spawn } from "child_process";

const BSC_QUERY = `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '56' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
const command = `docker exec -it db-node bash -c "psql vector --username=vector"`;
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

let child = spawn(
  'docker exec -it db-node bash -c "psql vector --username=vector"',
  {
    shell: true,
  }
);
child.stderr.on("data", function(data) {
  console.error("STDERR:", data.toString());
});
child.stdout.on("data", function(data) {
  console.log("STDOUT:", data.toString());
  // child.stdin.write("\\x");
});
child.on("exit", function(exitCode) {
  console.log("Child exited with code: " + exitCode);
});
