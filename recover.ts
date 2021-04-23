import axios from "axios";
import { bsc } from "./bsc";

const run = async () => {
  for (const transferId of bsc) {
    console.log(`Retrying transfer: ${transferId}`);
    const res = await axios.post("http://localhost:8002/withdraw/retry", {
      adminToken: process.env.ADMIN_TOKEN,
      transferId,
    });
    console.log(`Retried transfer: `, res.data);
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
};

run();
