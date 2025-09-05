import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (url, token, query, order) =>
  axios(token)
    .post(url, {
      query: {
        ...query,
      },
      order,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useBaraaniiTsuvralAviya(token, query, order) {
  const { data, mutate } = useSWR(
    !!token ? ["/baraaniiTsuvralAvya", token, query, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    baraaniiTsuvral: data,
    baraaniiTsuvralMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
  };
}

export default useBaraaniiTsuvralAviya;
