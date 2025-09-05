import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useEkhelsenToollogiinDashboardAvya(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/ekhelsenToollogiinDashboardAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    ekhelsenToollogiinDashboard: data,
    ekhelsenToollogiinDashboardMutate: mutate,
  };
}

export default useEkhelsenToollogiinDashboardAvya;
