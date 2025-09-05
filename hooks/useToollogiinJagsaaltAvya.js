import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: [{ "baraanuud.ner": { $regex: search, $options: "i" } }],
          $or: [{ "baraanuud.barCode": { $regex: search, $options: "i" } }],
          $or: [{ "baraanuud.code": { $regex: search, $options: "i" } }],
          $or: [{ ner: { $regex: search, $options: "i" } }],
          ...query,
        },
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useToollogiinJagsaaltAvya(
  token,
  khuudaslaltAnkhniiUtga = {},
  query,
  order
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
      ? ["/toollogiinJagsaaltAvya", token, khuudaslalt, query, order]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    toollogiinJagsaalt: data,
    toollogiinJagsaaltMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
  };
}

export default useToollogiinJagsaaltAvya;
