import { useMemo, useState } from "react";
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
  query,
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = []
  // order = {}
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: searchGenerator(searchKeys, search),
          ...query,
        },
        ...khuudaslalt,
      },
      // order,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function onSearch(search) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    setKhuudaslalt((a) => {
      a.search = search;
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return {
        ...a,
      };
    });
  }, 300);
}

function useTogtmol(
  token,
  query,
  khuudasniiKhemjee,
  searchKeys
  // order
) {
  const [khuudaslalt, setTogtmolKhuudaslalt] = useState({
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    khuudasniiDugaar: 1,
  });
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/togtmol",
          token,
          query,
          khuudaslalt,
          searchKeys,
          // order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    togtmolGaralt: data,
    togtmolMutate: mutate,
    jagsaalt,
    onSearch,
    unshijBaina: isValidating,
    setTogtmolKhuudaslalt,
  };
}

export default useTogtmol;
