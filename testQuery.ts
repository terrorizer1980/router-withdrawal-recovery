import { exec } from "child_process";

const BSC_QUERY = `select transfer."transferId", channel."channelAddress" from update join transfer on transfer."transferId" = update."transferId" join channel on update."channelAddressId" = channel."channelAddress" where update."transferDefinition" = '0xed911640fd86f92fD1337526010adda8F3Eb8344' and "transactionHash" is null and channel."chainId" = '56' and "fromIdentifier" = 'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';`;
const command =
  `docker exec -it db-node bash -c "psql vector --username=vector" ` +
  `"${BSC_QUERY}"`;
exec(command, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
