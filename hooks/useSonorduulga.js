import { notification } from "antd";
import axios, { socket, aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import Sonorduulga from "components/sonorduulga";
import { useEffect, useState } from "react";

const fetcher = (url, token) =>
  axios(token)
    .get(url, { params: { query: {}, order: { createdAt: -1 } } })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const tooFetcher = (url, token) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

var sonorduulgaId = null;

function useSonorduulga(token) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    jagsaalt: [],
  });

  const { data, mutate } = useSWR(
    token ? ["/sonorduulga", token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const too = useSWR(null, tooFetcher, { revalidateOnFocus: false });

  useEffect(() => {
    token &&
      socket(":8001").on(`gereeniiKhuselt`, (sonorduulga) => {
        const key = `${Math.floor(Math.random() * 100)}+${Date.now()}`;
        mutate();
        too.mutate();
        if (!!sonorduulga && sonorduulgaId !== sonorduulga?._id) {
          function onClose() {
            notification.close(key);
          }

          notification.open({
            key: key,
            message: (
              <Sonorduulga token={token} {...sonorduulga} onClose={onClose} />
            ),
            closeIcon: () => null,
            duration: 100000,
          });

          sonorduulgaId = sonorduulga?._id;
        }
      });
    return () => {
      token && socket(":8001").off(`gereeniiKhuselt`);
    };
  }, [token]);

  return {
    setKhuudaslalt,
    sonorduulga: data,
    kharaaguiToo: too?.data?.niitMur,
    sonorduulgaMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
  };
}

export default useSonorduulga;
