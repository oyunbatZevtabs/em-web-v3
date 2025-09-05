import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
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

function useGuilgee(token, khuudasniiKhemjee, query, order) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token ? ["/geree/guilgee", token, khuudaslalt, query, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    guilgeeGaralt: data,
    guilgeeMutate: mutate,
  };
}
export default useGuilgee;
