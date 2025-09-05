import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  posUrl,
  token,
  { search, jagsaalt, ...khuudaslalt },
  baiguullagiinId,
  salbariinId,
  query = {},
  order = {}
) =>
  axios(token)
    .get(posUrl, {
      params: {
        query: {
          $or: [
            { amount: { $regex: search, $options: "i" } },
            { guilgeeniiDugaar: { $regex: search, $options: "i" } },
            { billId: { $regex: search, $options: "i" } },
          ],
          ...query,
          salbariinId: salbariinId,
          baiguullagiinId: baiguullagiinId,
        },

        order,
        ...khuudaslalt,
        baiguullagiinId: baiguullagiinId,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useEBarimt(token, emiinSanId, khuudasniiKhemjee, query, order) {
  const { baiguullagiinId, salbariinId } = useAuth();

  const [khuudaslalt, setEBarimtKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
    jagsaalt: [],
  });

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setEBarimtKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  const { data, mutate } = useSWR(
    !!token && !!emiinSanId
      ? [
          `${posUrl}/ebarimtJagsaaltAvya`,
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
    setEBarimtKhuudaslalt,
    eBarimtGaralt: data,
    eBarimtMutate: mutate,
    jagsaalt,
    next,
  };
}

export default useEBarimt;
