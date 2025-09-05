import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import getConfig from "next/config";
import AldaaAlert from "components/alert/AldaaAlert";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
// function hostnameAvya() {
//   return global.window?.location?.hostname
// }

//export const url = `http://${hostnameAvya() || 'localhost'}:8081`;
//export const url = `http://localhost:8081`;
//export const url = "http://192.168.0.103:8081"
export const url = process.env.NEXT_PUBLIC_API_URL;

export const socket = () =>
  socketIOClient(publicRuntimeConfig.SOCKET || url, {
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

/*axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
});*/

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL : "/api",
    headers,
  });
};

export default uilchilgee;
