import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  { search, ...khuudaslalt },
  query,
  order,
  searchKeys = []
) =>
  axios(token)
    .get(url, {
      params: {
        query,
        order: order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhaaltTuukh(token, khuudasniiKhemjee, query, order, searchKeys) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token ? ["khaalt", token, khuudaslalt, query, order, searchKeys] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    khaaltTuukhiinGaralt: data,
    khaaltTuukhiinMutate: mutate,
  };
}

export default useKhaaltTuukh;
