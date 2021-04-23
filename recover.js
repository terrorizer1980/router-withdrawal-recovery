const axios = require("axios");
const { bsc } = require("./bsc");

const run = async () => {
  for (const transferId of bsc) {
    console.log(`Retrying transfer: ${transferId}`);
    const res = await axios.post("http://localhost:8002/withdraw/retry", {
      adminToken: process.env.ADMIN_TOKEN,
      transferId,
    });
    console.log(`Retried transfer: `, res.data);
    await new Promise((res) => setTimeout(() => res(), 1000));
  }
};

run();
