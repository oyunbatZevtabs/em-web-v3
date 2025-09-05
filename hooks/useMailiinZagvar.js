import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, { search, turul, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      params: {
        order: { createdAt: -1 },
        query: {
          turul,
          $or: [{ ner: { $regex: search, $options: "i" } }],
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useMailiinZagvar(token, turul) {
  const [khuudaslalt, setMailiinZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    turul,
  });
  const { data, mutate } = useSWR(null, fetcher, { revalidateOnFocus: false });
  return {
    setMailiinZagvarKhuudaslalt,
    mailiinZagvarGaralt: data,
    mailiinZagvarMutate: mutate,
  };
}

export default useMailiinZagvar;
