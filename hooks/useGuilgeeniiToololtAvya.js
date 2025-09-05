import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useGuilgeeniiToololtAvya(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/guilgeeniiToololtAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    guilgeeniiToololt: data,
    guilgeeniiToololtMutate: mutate,
  };
}

export default useGuilgeeniiToololtAvya;
