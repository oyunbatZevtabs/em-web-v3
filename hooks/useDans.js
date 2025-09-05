import { useState } from "react";
import posUilchilgee from "services/posUilchilgee";
import { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, query, { search, jagsaalt, ...khuudaslalt }) =>
  posUilchilgee(token)
    .get(url, {
      params: {
        query: { ...query },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useDans(token, query) {
  const [khuudaslalt, setDansKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    token ? ["/Dans", token, query, khuudaslalt] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setDansKhuudaslalt,
    dansGaralt: data,
    dansMutate: mutate,
  };
}

export default useDans;
