import axios, { aldaaBarigch } from "services/posUilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useState } from "react";

const fetcher = (
  url,
  token,
  ognoo,
  salbariinId,
  baraaniiCode,
  { search, jagsaalt, ...khuudaslalt },
  order
) => {
  return axios(token)
    .post(url, {
      ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
      baraaniiCode: baraaniiCode,
      ...khuudaslalt,
      order,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function usebaraagaarAvsanTailan(
  token,
  ognoo,
  salbariinId,
  baraaniiCode,
  order
) {
  const [khuudaslalt, setBaraagaarAvsanTailanKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token
      ? [
          "/baraagaarTailanAvya",
          token,
          ognoo,
          salbariinId,
          baraaniiCode,
          khuudaslalt,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    baraagaarAvsanTailan: data,
    baraagaarAvsanTailanMutate: mutate,
    setBaraagaarAvsanTailanKhuudaslalt,
    khuudaslalt,
  };
}

export default usebaraagaarAvsanTailan;
