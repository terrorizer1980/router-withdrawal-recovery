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
    } catch (error) {
      console.log(`Error on transfer: ${transferId}`);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
    await new Promise((res) => setTimeout(() => res(), 5000));
  }
};

run();
