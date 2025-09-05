import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

const fetcher = (
  posUrl,
  token,
  { search, jagsaalt, ...khuudaslalt },
  baiguullagiinId,
  query,
  order,
  searchKeys = []
) =>
  axios(token)
    .get(posUrl, {
      params: {
        query: {
          $or: searchGenerator(searchKeys, search),
          baiguullagiinId: baiguullagiinId,
          ...query,
        },
        order,
        baiguullagiinId: baiguullagiinId,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useGuilgeeniiTuukh(
  token,
  khuudasniiKhemjee,
  query,
  order,
  searchKeys
) {
  const { baiguullagiinId } = useAuth();

  const [khuudaslalt, setGuilgeeniiTuukhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
    jagsaalt: [],
  });

  function next() {
    if (!!data)
      setGuilgeeniiTuukhKhuudaslalt((a) => {
        a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return { ...a };
      });
  }

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          `${posUrl}/guilgeeniiTuukh`,
          token,
          khuudaslalt,
          baiguullagiinId,
          query,
          order,
          searchKeys,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    setGuilgeeniiTuukhKhuudaslalt,
    guilgeeniiTuukhGaralt: data,
    guilgeeniiTuukhGaraltMutate: mutate,
    jagsaalt,
    next,
  };
}

export default useGuilgeeniiTuukh;
