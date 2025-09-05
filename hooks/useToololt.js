import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";

const fetcher = (url, token, body) =>
  axios(token)
    .post(url, body)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useToololt(token, url, body) {
  const { data, mutate } = useSWR(
    !!token ? [url, token, body] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    toololtGaralt: data,
    toololtMutate: mutate,
  };
}
export default useToololt;
