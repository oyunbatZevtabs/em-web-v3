import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

function fetcher(
  posUrl,
  token,
  { search, jagsaalt, ...khuudaslalt },
  baiguullagiinId,
  emiinSanId,
  query,
  order
) {
  axios(token)
    .get(posUrl, {
      params: {
        query: {
          $or: [
            { amount: { $regex: search, $options: "i" } },
            { guilgeeniiDugaar: { $regex: search, $options: "i" } },
          ],
          ...query,
          baiguullagiinId: baiguullagiinId,
        },
        baiguullagiinId: baiguullagiinId,

        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
}

export function useBaraaOrlogdokh(
  token,
  emiinSanId,
  khuudasniiKhemjee,
  query,
  order
) {
  const { baiguullagiinId } = useAuth();

  const [khuudaslalt, setBaraaOrlogdokhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
    jagsaalt: [],
  });

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setBaraaOrlogdokhKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  const { data, mutate } = useSWR(
    !!token
      ? [
          `${posUrl}/orlogoZarlagiinTuukh`,
          token,
          khuudaslalt,
          baiguullagiinId,
          emiinSanId,
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
    baraaOrlogdokhGaralt: data,
    setBaraaOrlogdokhKhuudaslalt,
    baraaOrlogdokhMutate: mutate,
    jagsaalt,
    next,
  };
}

export default useBaraaOrlogdokh;
