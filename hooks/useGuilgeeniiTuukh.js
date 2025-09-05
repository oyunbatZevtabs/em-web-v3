import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  posUrl,
  token,
  { search, jagsaalt, ...khuudaslalt },
  emiinSanId,
  salbariinId,
  query = {},
  order = {}
) =>
  axios(token)
    .get(posUrl, {
      params: {
        query: {
          $or: [{ guilgeeniiDugaar: { $regex: search, $options: "i" } }],
          ...query,
          salbariinId: salbariinId,
          baiguullagiinId: emiinSanId,
        },
        order,
        ...khuudaslalt,
        baiguullagiinId: emiinSanId,
      },
    })
    .then((res) => res.data)
    .catch((err) => aldaaBarigch(err));

export function useGuilgeeniiTuukh(token, khuudasniiKhemjee, query, order) {
  const { baiguullagiinId, salbariinId } = useAuth();

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
          salbariinId,
          query,
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
    setGuilgeeniiTuukhKhuudaslalt,
    guilgeeniiTuukhKhGaralt: data,
    guilgeeniiTuukhKhGaraltMutate: mutate,
    loading: !data,
    jagsaalt,
    next,
  };
}

export default useGuilgeeniiTuukh;
