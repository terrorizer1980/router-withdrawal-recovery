const fs = require("fs");

function cleanQueryRecords(filename) {
  const contents = fs.readFileSync(filename, "utf8");
  const [empty, ...split] = contents.split("|");
  const records = split.map((str) => {
    const record = str.includes("-")
      ? str.substring(0, str.indexOf("-[ RECORD"))
      : str;
    return record.trim();
  });
  return records;
}

function writeCleanQueryFile(filename) {
  const contents = cleanQueryRecords(filename);
  const split = filename.split(".");
  const name = filename.startsWith(".") ? split[1] : split[0];
  const ext = filename.startsWith(".") ? split[2] : split[1];
  const prefix = filename.startsWith(".") ? "." : "";
  const cleanName = prefix + name + "-processed." + ext;
  fs.writeFileSync(cleanName, "'" + contents.join("','") + "'");
}

const bsc = cleanQueryRecords("./sql-output/bsc-not-mined.txt");
console.log(`bsc not mined records (total: ${bsc.length})`);
writeCleanQueryFile("./sql-output/bsc-not-mined.txt");

const xdai = cleanQueryRecords("./sql-output/xdai-not-mined.txt");
console.log(`xdai not mined records (total: ${xdai.length})`);
writeCleanQueryFile("./sql-output/xdai-not-mined.txt");

const matic = cleanQueryRecords("./sql-output/matic-not-mined.txt");
console.log(`matic not mined records (total: ${matic.length})`);
writeCleanQueryFile("./sql-output/matic-not-mined.txt");
