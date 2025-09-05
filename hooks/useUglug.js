import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (url, token, { search, ...khuudaslalt }, query, order) =>
  axios(token)
    .get(url, {
      params: {
        order: order,
        query: query,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useUglug(token, khuudasniiKhemjee, query, order) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token ? ["/uglug", token, khuudaslalt, query, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    uglugGaralt: data,
    uglugMutate: mutate,
  };
}
export default useUglug;
