import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  order,
  salbariinId
) =>
  axios(token)
    .post(url, {
      ...query,
      salbariinId,
      order,
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useEkhelsenToollogoAvya(token, query, order) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { salbariinId } = useAuth();
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? ["/ekhelsenToollogoAvya", token, khuudaslalt, query, order, salbariinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    ekhelsenToollogo: data,
    ekhelsenToollogoMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
    toollogoUnshijBaina: isValidating,
  };
}

export default useEkhelsenToollogoAvya;
