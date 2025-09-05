import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useSuuliinKhaaltOgnooAvya(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/suuliinKhaaltOgnooAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    suuliinKhaaltOgnooData: data,
    suuliinKhaaltOgnooAvyaMutate: mutate,
  };
}

export default useSuuliinKhaaltOgnooAvya;
