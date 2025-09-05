import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useBarimtToollolt(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/ebarimtToololtAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    ebarimtiinToololt: data,
    ebarimtiinToololtMutate: mutate,
  };
}

export default useBarimtToollolt;
