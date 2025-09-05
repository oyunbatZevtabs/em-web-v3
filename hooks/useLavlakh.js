import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

function searchBuilder(keys, search) {
  if (keys)
    return keys?.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

const fetcher = (
  url,
  token,
  { search = "", ...khuudaslalt },
  query,
  order,
  select,
  filterKeys
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          ...query,
          $or: searchBuilder(filterKeys, search),
        },
        order: order,
        collation: {
          locale: "mn",
          numericOrdering: true,
          maxVariable: "space",
          alternate: "shifted",
        },
        select,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useLavlakh({ token, query, order, select, lavlakh, filterKeys }) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
  });

  const { data, mutate, isValidating } = useSWR(
    token && lavlakh
      ? [lavlakh, token, khuudaslalt, query, order, select, filterKeys]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  function onSearch(search) {
    setKhuudaslalt((v) => ({ ...v, search }));
  }

  return {
    data,
    mutate,
    setKhuudaslalt,
    onSearch,
    isValidating,
  };
}

export default useLavlakh;
