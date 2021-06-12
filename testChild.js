const { spawn } = require("child_process");

console.log("spawning child")
let child = spawn("psql", ["-i"])
//{
  // shell: true,//"/bin/bash",
  // timeout: 5000,
  // stdio: "inherit",
  // stdin: "inherit"
  // stdio: ["pipe", "pipe", "pipe"]
// });


child.stdout.on("data", function(data) {
  const stdout = data.toString();
  console.log("stdout", stdout);
  if (count === 0) {
    child.stdin.write('2 + 2' + '\n');
  }
  count++;
});
let count = 0;
child.stderr.on("data", data => {
  console.error(data.toString());
  
});
child.on("exit", function(exitCode) {
  console.log("Child exited with code: " + exitCode);
});
child.stdin.write('2 + 3' + '\n');


