import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, query, baiguullagiinId) => {
  if (!!token) {
    return axios(token)
      .post(url, {
        query: query ? query : undefined,
        baiguullagiinId: baiguullagiinId,
      })
      .then((res) => res.data)
      .catch(aldaaBarigch);
  } else {
    return null;
  }
};

function useData(token, url, query, baiguullagiinId) {
  const { data, mutate } = useSWR(
    [url, token, query, baiguullagiinId],
    url ? fetcher : null,
    {
      revalidateOnFocus: false,
    }
  );

  return { data, mutate };
}

export default useData;
