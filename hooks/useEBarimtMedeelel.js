import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";
import { useAuth } from "services/auth";

const fetcher = (url, token, salbariinId) =>
  axios(token)
    .post(url, { salbariinId: salbariinId })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useEBarimtMedeelel(token) {
  const { salbariinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token ? ["/ebarimtMedeelelAvya", token, salbariinId] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    eBarimtMedeelel: data,
    eBarimtMedeelelMutate: mutate,
  };
}

export default useEBarimtMedeelel;
