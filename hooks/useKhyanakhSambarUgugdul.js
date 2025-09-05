import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (posUrl, token, baiguullagiinId, query = {}) =>
  axios(token)
    .post(posUrl, {
      ...query,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useKhyanakhSambarUgugdul(token, query) {
  const { baiguullagiinId } = useAuth();

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [`${posUrl}/khyanakhSambarUgugdulAvya`, token, baiguullagiinId, query]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    KhyanakhSambarData: data,
    KhyanakhSambarMutate: mutate,
  };
}

export default useKhyanakhSambarUgugdul;
