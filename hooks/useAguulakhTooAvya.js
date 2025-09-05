import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAguulakhTooAvya(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/aguulakhTooAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    aguulakhToololt: data,
    aguulakhToololtMutate: mutate,
  };
}

export default useAguulakhTooAvya;
