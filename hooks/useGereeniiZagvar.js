import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, { search, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      params: {
        query: {},
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiZagvar(token) {
  const [khuudaslalt, setGereeniiZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });

  const { data, mutate } = useSWR(null, fetcher, { revalidateOnFocus: false });
  return {
    setGereeniiZagvarKhuudaslalt,
    gereeniiZagvarGaralt: data,
    gereeniiZagvarMutate: mutate,
  };
}

export default useGereeniiZagvar;
