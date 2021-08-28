import {
  FullChannelState,
  jsonifyError,
  VectorErrorJson,
} from "@connext/vector-types";
import { validateChannelUpdateSignatures } from "@connext/vector-utils";
import axios from "axios";
import { config as dotEnvConfig } from "dotenv";
import { BASE_URL, ROUTER_IDENTIFIER } from "./constants";

dotEnvConfig();

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

const channelAddresses = [
  "0x3Fd3759C096932a9bBE1C4B6aaA4677536A4B4e7",
  "0x45231a431E722063A3E75bF7118a324BCc12b881",
  "0xE585db8E76eE2DD3915e8a208239FcCCD8Afa5C3",
  "0x97D1221C54E1a4862196705883b4b076d2E2dfb5",
  "0x71f2707eEC5aA8e4Ac259fEF3284bEe7cBa5dE42",
  "0x3236a9e51A44E3e55ca2DD7CA73D56da3B2b1991",
  "0x6c258C4b510373e2d868c9f10846e8D339e48230",
  "0x95bd041aF3135779bDDd7F9FB0539A4929D05b98",
  "0xaB5222466287a15adb778374FB490c07c14740aa",
  "0xF0AA612D7340dB9e4d8bB3AB4508A289c3F63596",
  "0xC8137424ab9A1760328e9538D1CCd701bF17A796",
  "0xE3DDF2C5aE73bB6abaB02AB6393Cf1A8AbbA42f3",
  "0xB90d5770bc2d6AE5f791a24847C1F71E3aF92493",
  "0xBCa1A0d69f303644ab9bDf33D6ba3413A31bB89B",
  "0x253931bE11bE8b15461bD83dFF25790207A1F565",
  "0xde1e8b641c1e688047F2CF5723F5879E7aD41b1A",
  "0x40148716F470814005c0F329625545FF2274750e",
  "0xeD54fE7F4F0FD673B20d2bc7EDE19556c0d655D0",
  "0x0A27969c459ff28FD7B72E8fD68a33159052c38A",
  "0xbEfb11F57efD08e1634eb005687d793d3789D4B2",
  "0xA93E5D2ab8631A134261f9B2b22e7e1372bddA2D",
  "0x9a5abd9aBdf98189bACFDB474b140d866bec85f3",
  "0x9BFBfE5935db59387a8e2ba1F671716Bc73d5502",
  "0xDDE85f57879832704b3AcBC34E1cbD8887dD1bDf",
  "0x74391455dA98F85cce0Fbf5246949Dc5Ccb8299f",
  "0xD94361B0b2E38a19a2cE8624B31D6b09FD94B57F",
  "0xEA0eF4D7b8Da6A89ad1b0C60145024d60A79179a",
  "0x0DdeA7e0E5640c7E49fd3505bc4527A77CFCBbA1",
  "0xC2F20776E71Baf86701090059fFF0cFdA8bFD73A",
  "0xCf7728952b0FD43FB2f9B823090e0c9bea0177af",
];

const undefinedChannels: string[] = [];
const errored: { channel: FullChannelState; err: VectorErrorJson }[] = [];

const checkSigs = async () => {
  const channels: FullChannelState[] = await Promise.all(
    channelAddresses.map(async (c) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/${ROUTER_IDENTIFIER}/channels/${c}`
        );
        return res.data;
      } catch (e) {
        logAxiosError(e);
        return undefined;
      }
    })
  );
  for (const addr of channelAddresses) {
    const channel = channels.find((c) => c.channelAddress === addr);
    if (!channel) {
      console.error(`${addr} not found in channels`);
      undefinedChannels.push(addr);
      continue;
    }

    const result = await validateChannelUpdateSignatures(
      channel,
      channel.latestUpdate.aliceSignature,
      channel.latestUpdate.bobSignature,
      "both"
    );
    if (result.isError) {
      const err = jsonifyError(result.getError()!);
      errored.push({ channel, err });
      console.error("Signature invalid:", err);
    }
  }

  console.log("-------------------------");
  console.log(`Complete. ${errored.length} / ${channels.length} incorrect`);
  console.log(`Errored: ${errored.map((e) => e.channel.channelAddress)}`);
};
checkSigs();
