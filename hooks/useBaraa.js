import { useEffect } from "react";
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
            { ner: { $regex: search, $options: "i" } },
            { barCode: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
            { boginoNer: { $regex: search, $options: "i" } },
          ],
          ...query,
          baiguullagiinId: baiguullagiinId,
          salbariinId: salbariinId,
        },
        order,
        ...khuudaslalt,
        baiguullagiinId: baiguullagiinId,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useBaraa(token, emiinSanId, khuudasniiKhemjee, query, order) {
  const { baiguullagiinId, salbariinId } = useAuth();

  const [khuudaslalt, setBaraaniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
    jagsaalt: [],
  });

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setBaraaniiKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          `${posUrl}/aguulakh`,
          token,
          khuudaslalt,
          baiguullagiinId,
          query?.salbariinId === "shuuhgui"
            ? undefined
            : query?.salbariinId
            ? query.salbariinId
            : salbariinId,

          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    mutate();
  }, [salbariinId]);

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    setBaraaniiKhuudaslalt,
    khuudaslalt,
    baraaGaralt: data,
    baraaMutate: mutate,
    jagsaalt,
    isLoading: !data,
    next,
  };
}

export default useBaraa;
