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
  shuult,
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = [],
  order = {}
) =>
  axios(token)
    .post(url, {
      ...shuult,
      ...khuudaslalt,
      query: {
        $or: searchGenerator(searchKeys, search),
      },
      order,
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

function useBorluulaltDelegrengui(
  token,
  shuult,
  searchKeys,
  khuudasniiKhemjee,
  order
) {
  const [khuudaslalt, setTailanKhuudaslalt] = useState({
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    khuudasniiDugaar: 1,
  });
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/borluulaltiinTailanDelgerenguiAvya",
          token,
          shuult,
          khuudaslalt,
          searchKeys,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    borluulaltData: data?.jagsaalt,
    borluulaltMutate: mutate,
    jagsaalt,
    onSearch,
    unshijBaina: isValidating,
    setTailanKhuudaslalt,
  };
}

export default useBorluulaltDelegrengui;
