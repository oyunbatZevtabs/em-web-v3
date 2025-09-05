import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import getConfig from "next/config";
import AldaaAlert from "components/alert/AldaaAlert";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const posUrl = process.env.NEXT_PUBLIC_POS_API_URL;
export const socketUrl = "https://pharma.zevtabs.mn/api/";

export const socket = () =>
  socketIOClient("wss://pharma.zevtabs.mn/", {
    path: "/api/socket.io",
    transports: ["websocket"],
  });

export const aldaaBarigch = (e) => {
  if (e?.response?.data?.aldaa === "TokenExpiredError: jwt expired") {
    window.location.href = "/";
  } else if (!!e?.response?.data?.aldaa) AldaaAlert(e?.response?.data?.aldaa);
  else if (!!e?.response?.errors)
    AldaaAlert(JSON.stringify(e?.response?.errors));
  else AldaaAlert(JSON.stringify(e));
};

const posUilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_POS_API_URL,
    headers,
  });
};

export default posUilchilgee;
