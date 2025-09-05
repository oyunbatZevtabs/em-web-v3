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
        // {createdAt:{$gte:("2021-01-01"),$lt:ISODate("2020-05-01"}},
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAvlaga(token, khuudasniiKhemjee, query, order) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
  });
  const { data, mutate, isValidating } = useSWR(
    !!token ? ["/avlaga", token, khuudaslalt, query, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    avlagaGaralt: data,
    avlagaMutate: mutate,
    avlagaUnshijBaina: isValidating,
  };
}
export default useAvlaga;
