import { useMemo, useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

const fetcher = (url, token, shuult, { search = "" }, searchKeys = [], order) =>
  axios(token)
    .post(url, {
      ...shuult,
      ...searchGenerator(searchKeys, search),
      order: order,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function onSearch(search) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    (a) => {
      return {
        ...a,
      };
    };
  }, 300);
}

function useUramshuulalDelgerengui(
  token,
  shuult,
  khuudasniiKhemjee,
  searchKeys,
  order
) {
  //   const [khuudaslalt, setTailanKhuudaslalt] = useState({
  //     khuudasniiKhemjee: khuudasniiKhemjee || 100,
  //     khuudasniiDugaar: 1,
  //   });
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? ["/uramshuulliinDelgerenguiTailanAvya", token, shuult, order]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  //   const  = useMemo(() => {
  //     console.log("data", data);
  //     return [...(data?. || [])];
  //   }, [data]);
  // console.log("data", data);
  return {
    uramshuulalGaralt: data,

    tailanMutate: mutate,
    // jagsaalt,
    onSearch,
    unshijBaina: isValidating,
  };
}

export default useUramshuulalDelgerengui;
