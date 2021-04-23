const axios = require("axios");
const { bsc } = require("./bsc");

const run = async () => {
  for (const transferId of bsc) {
    console.log(`Retrying transfer: ${transferId}`);
    try {
      const res = await axios.post("http://localhost:8002/withdraw/retry", {
        adminToken: process.env.ADMIN_TOKEN,
        transferId,
      });
      console.log(`Retried transfer: `, res.data);
    } catch (e) {
      console.log(`Error on transfer: ${transferId}`, e);
    }
    await new Promise((res) => setTimeout(() => res(), 5000));
  }
};

run();
