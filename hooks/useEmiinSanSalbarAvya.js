import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useEmiinSanSalbarAvya(token) {
  const { data: emiinSanSalbarData, mutate: emiinSanSalbarMutate } = useSWR(
    ["/emiinSanSalbarAvya", token],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return { emiinSanSalbarData, emiinSanSalbarMutate };
}

export default useEmiinSanSalbarAvya;
