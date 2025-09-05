import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, { search, jagsaalt, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      params: {
        query: { $or: [{ barKod: { $regex: search, $options: "i" } }] },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useButeegdekhuunJagsaalt(token) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/em", token, khuudaslalt] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    buteegdekhuunGaralt: data,
    buteegdekhuunMutate: mutate,
  };
}

export default useButeegdekhuunJagsaalt;
