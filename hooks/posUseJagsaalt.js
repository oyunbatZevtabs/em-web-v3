import useSWR from "swr";
import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import posUilchilgee from "services/posUilchilgee";
import { useEffect } from "react";

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
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = []
) {
  return posUilchilgee(token)
    .get(url, {
      params: {
        query: {
          $or: searchGenerator(searchKeys, search),
          ...query,
        },
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

var timeout = null;

function posUseJagsaalt(
  url,
  query,
  order,
  select,
  searchKeys,
  supToken,
  khuudasniiKhemjee,
  salbaraarShuukhgui
) {
  const { token, salbariinId } = useAuth();
  if (!salbaraarShuukhgui && !!salbariinId) {
    if (!query) {
      var query = {};
    }
    query.salbariinId = salbariinId;
  }

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate, isValidating } = useSWR(
    (token || supToken) && url && query !== "jagsaaltAvahgui"
      ? [token || supToken, url, query, order, select, khuudaslalt, searchKeys]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    mutate();
  }, [salbariinId]);

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
    mutate();
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
    isValidating,
    setKhuudaslalt,
    khuudaslalt,
  };
}

export default posUseJagsaalt;
