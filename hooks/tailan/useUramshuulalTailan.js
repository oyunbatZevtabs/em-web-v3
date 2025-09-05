import { useMemo, useState } from "react";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (url, token, shuult, order) =>
  axios(token)
    .post(url, {
      ...shuult,
      order: order,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useUramshuulalTailan(token, shuult, order) {
  // const [khailt, setKhailt] = useState({ search: [] });

  const { data, mutate, isValidating } = useSWR(
    !!token ? ["/uramshuulliinTovchooTailanAvya", token, shuult, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    uramshuulalGargalt: data,
    tailanMutate: mutate,
    unshijBaina: isValidating,
  };
}

export default useUramshuulalTailan;
