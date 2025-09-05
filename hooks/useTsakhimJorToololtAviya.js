import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function tsakhimJorToololt(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/tsakhimJorToololtAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    tsakhimJorToololt: data,
    tsakhimJorToololtMutate: mutate,
  };
}

export default tsakhimJorToololt;
