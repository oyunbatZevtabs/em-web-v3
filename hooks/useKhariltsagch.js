import { useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

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
        query: {
          $or: searchGenerator(searchKeys, search),
          ...query,
        },
        order: order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

// const fetcherToololt = (url, token) =>
//   axios(token)
//     .get(`${url}`)
//     .then((res) => res.data)
//     .catch(aldaaBarigch);

function useKhariltsagch(token, khuudasniiKhemjee, query, order, searchKeys) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token
      ? ["khariltsagch", token, khuudaslalt, query, order, searchKeys]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    khariltsagchiinGaralt: data,
    khariltsagchMutate: mutate,
  };
}
export function useKhariltsagchToololt(token) {
  // const { data, mutate } = useSWR(
  //   token ? ["/khariltsagch", token] : null,
  //   fetcherToololt,
  //   {
  //     revalidateOnFocus: false,
  //   }
  // );
  return {
    khariltsagchToololt: [],
    khariltsagchToololtMutate: () => console.log("a"),
  };
}

export default useKhariltsagch;
