import useSWR from "swr";
import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

function fetcher(
  token,
  url,
  query,
  order,
  select,
  searchKeys,
  { search, ...khuudaslalt },
  customUrl,
  baiguullagiinId
) {
  return uilchilgee(token)
    .get(url, {
      params: {
        // query: {
        //   $or: [{ khNer: { $regex: search, $options: "i" } }],
        //   $or: [{ barKod: { $regex: search, $options: "i" } }],
        // },
        query:
          search && searchKeys
            ? {
                $or: searchGenerator(searchKeys, search),
                ...query,
              }
            : { ...query },
        order,
        select,
        baiguullagiinId,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

var timeout = null;

function useJagsaalt(
  url,
  query,
  order,
  select,
  searchKeys,
  customServer,
  khuudasniiKhemjee
) {
  const { token, baiguullagiinId } = useAuth();

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee ? khuudasniiKhemjee : 100,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate, isValidating } = useSWR(
    url
      ? [
          token,
          url,
          query,
          order,
          select,
          searchKeys,
          khuudaslalt,
          customServer,
          baiguullagiinId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  function next() {
    if (!!data)
      setKhuudaslalt((a) => {
        a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return { ...a };
      });
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
  }

  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt((a) => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    data,
    mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
    setKhuudaslalt,
    isValidating,
  };
}

export default useJagsaalt;
