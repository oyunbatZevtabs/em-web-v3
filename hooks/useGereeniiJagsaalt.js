import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  { search = "", ...khuudaslalt },
  register,
  query,
  tooAvakhEsekh,
  order = { createAt: -1 },
  select
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          khariltsagchiinRegister: register,
          $or: [
            { khariltsagchiinRegister: { $regex: search, $options: "i" } },
            { khariltsagchiinNer: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { khariltsagchiinUtas: { $regex: search, $options: "i" } },
            { khariltsagchiinOvog: { $regex: search, $options: "i" } },
            { khariltsagchiinMail: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        order: order,
        collation: {
          locale: "mn",
          numericOrdering: true,
          maxVariable: "space",
          alternate: "shifted",
        },
        select,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token) =>
  axios(token)
    .post(url, {})
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiJagsaalt(
  token,
  register,
  query,
  tooAvakhEsekh,
  khuudasniiKhemjee,
  order,
  select
) {
  const [khuudaslalt, setGereeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
  });

  const { data, mutate } = useSWR(
    token
      ? [
          "/geree",
          token,
          khuudaslalt,
          register,
          query,
          tooAvakhEsekh,
          order,
          select,
        ]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    gereeniiMedeelel: data,
    gereeniiMedeelelMutate: mutate,
    setGereeniiKhuudaslalt,
  };
}
export function useGereeniiJagsaaltToollolt(token) {
  const { data, mutate } = useSWR(null, fetcherToololt, {
    revalidateOnFocus: false,
  });
  return {
    gereeToollolt: data,
    gereeToolloltMutate: mutate,
  };
}

export default useGereeniiJagsaalt;
