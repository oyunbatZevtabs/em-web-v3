import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url) =>
  axios()
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useBaiguullaga(emiinSanId) {
  const { data, mutate } = useSWR(
    !!emiinSanId ? [`/emiinsan/${emiinSanId}`] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { baiguullaga: data, baiguullagaMutate: mutate };
}

export default useBaiguullaga;
