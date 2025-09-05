import { useState } from "react";
import posUilchilgee from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR, { mutate } from "swr";

function searchGenerator(keys, search) {
  if (keys.length > 0) {
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  }
  return undefined;
}

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  order,
  searchKeys = []
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: searchGenerator(searchKeys, search),
        },
        ...query,
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useToollogoAvya(
  _id,
  token,
  khuudaslaltAnkhniiUtga = {},
  query,
  order,
  searchKeys
) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
    ...khuudaslaltAnkhniiUtga,
  });

  const { data, mutate } = useSWR(
    !!token
      ? [`/toollogoAvya/${_id}`, token, khuudaslalt, query, order, searchKeys]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    toollogoBaraa: data,
    toollogoBaraaMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
  };
}

export default useToollogoAvya;
