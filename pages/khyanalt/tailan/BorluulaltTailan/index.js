import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "antd";
import Ashig from "./ashig";
import Borluulalt from "./borluulalt";
import { useAuth } from "services/auth";
import useBorluulaltiinTailan from "hooks/tailan/useBorluulaltiinTailan";
import moment from "moment";
import useTailan from "hooks/tailan/useTailan";
import useAshgiinTailan from "hooks/tailan/useAshgiinTailan";
import { useRouter } from "next/router";

const borluulaltSearchKeys = [
  "baraanuud.baraa.angilal",
  "baraanuud.baraa.code",
];
const ashigSearchKeys = ["baraanuud.baraa.ner", "baraanuud.baraa.code"];

const borluulaltOrder = { createdAt: -1 };
const ashigOrder = { createdAt: -1 };
function BorluulaltTailan() {
  const { token, salbariinId, baiguullagiinId } = useAuth();
  const [songogdsonTab, setSongogdsonTab] = useState("borluulalt");

  function tabsOnchange(e) {
    setSongogdsonTab(e);
  }

  const router = useRouter();

  const { tab } = router.query;

  useEffect(() => {
    if (tab === "ashig") {
      setSongogdsonTab(tab);
    }
  }, [tab]);

  // borluulalt
  const [borluulaltOgnoo, setBorluulaltOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [borluulaltSongosonBaraa, setBorluulaltSongosonBaraa] = useState([]);
  const borluulaltShuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo:
        borluulaltOgnoo && borluulaltOgnoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo:
        borluulaltOgnoo && borluulaltOgnoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId ? salbariinId : undefined,
      baiguullagiinId: baiguullagiinId,
      code:
        borluulaltSongosonBaraa?.length > 0
          ? borluulaltSongosonBaraa
          : undefined,
    };
    return query;
  }, [borluulaltOgnoo, borluulaltSongosonBaraa, salbariinId]);

  const {
    tailanGaralt,
    unshijBaina,
    setTailanKhuudaslalt: setBorluulaltTailanKhuudaslalt,
  } = useBorluulaltiinTailan(
    token,
    borluulaltShuult,
    undefined,
    borluulaltSearchKeys,
    borluulaltOrder
  );

  // ashig
  const [ashigOgnoo, setAshigOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [ashigSongosonBaraa, setAshigSongosonBaraa] = useState([]);
  const ashigShuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ashigOgnoo && ashigOgnoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ashigOgnoo && ashigOgnoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId ? salbariinId : undefined,
      baiguullagiinId: baiguullagiinId,
      code: ashigSongosonBaraa?.length > 0 ? ashigSongosonBaraa : undefined,
    };
    return query;
  }, [ashigOgnoo, ashigSongosonBaraa, baiguullagiinId, salbariinId]);

  const {
    tailanGaralt: ashigTailanGaralt,
    unshijBaina: ashigUnshijBaina,
    setTailanKhuudaslalt: setAshigTailanKhuudaslalt,
  } = useAshgiinTailan(
    token,
    ashigShuult,
    undefined,
    ashigSearchKeys,
    ashigOrder
  );

  const items = [
    {
      key: "borluulalt",
      label: "Борлуулалт",
      children: (
        <Borluulalt
          unshijBaina={unshijBaina}
          token={token}
          songosonBaraa={borluulaltSongosonBaraa}
          setSongosonBaraa={setBorluulaltSongosonBaraa}
          ognoo={borluulaltOgnoo}
          setOgnoo={setBorluulaltOgnoo}
          tailanGaralt={tailanGaralt}
          shuult={borluulaltShuult}
        />
      ),
    },
    {
      key: "ashig",
      label: "Ашиг",
      children: (
        <Ashig
          unshijBaina={ashigUnshijBaina}
          token={token}
          songosonBaraa={ashigSongosonBaraa}
          setSongosonBaraa={setAshigSongosonBaraa}
          ognoo={ashigOgnoo}
          setOgnoo={setAshigOgnoo}
          tailanGaralt={ashigTailanGaralt}
          shuult={ashigShuult}
        />
      ),
    },
  ];

  return (
    <Admin
      onSearch={(search) => {
        if (songogdsonTab === "borluulalt") {
          setBorluulaltTailanKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        } else if (songogdsonTab === "ashig") {
          setAshigTailanKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        }
      }}
      title="Борлуулалтын тайлан"
      khuudasniiNer="BorluulaltTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <Tabs
          defaultActiveKey={!!songogdsonTab ? "ashig" : "borluulalt"}
          items={items}
          onChange={(e) => tabsOnchange(e)}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BorluulaltTailan;
