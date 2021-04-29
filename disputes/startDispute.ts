import { channels } from "./input/routerBalanceGt1000";
import axios from "axios";

const routerIdentitifer =
  "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8";
const baseUrl = "http://localhost:8002";

const logAxiosError = (error: any) => {
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
};

const run = async () => {
  for (const channelAddress of channels) {
    try {
      const res = await axios.post(`${baseUrl}/send-dispute-channel-tx`, {
        channelAddress,
        publicIdentifier: routerIdentitifer,
      });
      console.log("res: ", res.data);
    } catch (e) {
      console.log("Error disputing channel", channelAddress);
      logAxiosError(e);
      continue;
    }
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
  }
};

run();
