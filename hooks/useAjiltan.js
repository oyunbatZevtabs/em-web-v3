import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcherJagsaalt = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  baiguullagiinId,
  query = {}
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
          baiguullagiinId: baiguullagiinId,

          ...query,
        },
        ...khuudaslalt,
        baiguullagiinId: baiguullagiinId,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAjiltniiJagsaalt(token, query) {
  const { baiguullagiinId } = useAuth();

  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/ajiltan", token, khuudaslalt, baiguullagiinId, query] : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    ajilchdiinGaralt: data,
    ajiltniiJagsaaltMutate: mutate,
    setAjiltniiKhuudaslalt,
  };
}

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAjiltan(token) {
  const { data, error, mutate } = useSWR(
    !!token ? [`/tokenoorEmZuichAvya`, token] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return { ajiltan: data, error, isLoading: !data, ajiltanMutate: mutate };
}

// function useAjiltan(token) {
//   const { data, error, mutate } = useSWR(
//     !!token ? [`/tokenoorAjiltanAvya`, token] : null,
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   return { ajiltan: data, error, isLoading: !data, ajiltanMutate: mutate };
// }

export default useAjiltan;
