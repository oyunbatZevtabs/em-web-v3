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
  { search = "" },
  searchKeys = [],
  order = {}
) =>
  axios(token)
    .post(url, {
      ...shuult,
      ...searchGenerator(search, searchKeys),
      order,
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

function useUglugTailan(token, shuult, searchKeys, order) {
  const { data, mutate, isValidating } = useSWR(
    !!token ? ["/uglugTovchooTailanAvya", token, shuult, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    tailan: data,
    tailanMutate: mutate,
    onSearch,
    unshijBaina: isValidating,
  };
}

export default useUglugTailan;
