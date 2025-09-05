import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (url, token, shuult) =>
  axios(token)
    .post("/" + url, shuult)
    .then((res) => res.data);

function useTailan(ner, token, shuult) {
  const { data, mutate } = useSWR(
    !!ner && !!token ? [ner, token, shuult] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    tailanGaralt: data,
    tailanMutate: mutate,
  };
}

export default useTailan;
