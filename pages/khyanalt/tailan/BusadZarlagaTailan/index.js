import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "antd";
import Zarlaga from "./zarlaga";
import { useAuth } from "services/auth";
import moment from "moment";
import useActTailan from "hooks/tailan/useActTailan";
import { useRouter } from "next/router";

import useZarlagaActKhariltsagch from "hooks/tailan/useZarlagaActKhariltsagch";
import Act from "./act";
import Khariltsagch from "./khariltsagch";

const zarlagaSearchKeys = ["baiguullagiinId", "salbariinId"];

const ashigSearchKeys = ["_id.ner", "_id.code"];

const order = { createdAt: -1 };

function BusadZarlagaTailan() {
  const { token, salbariinId, baiguullagiinId } = useAuth();
  const [songogdsonTab, setSongogdsonTab] = useState("borluulalt");

  function tabsOnchange(e) {
    setSongogdsonTab(e);
  }

  const router = useRouter();

  const { tab } = router.query;

  useEffect(() => {
    if (tab === "zarlaga") {
      setSongogdsonTab(tab);
    }
  }, [tab]);

  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [songosonSalbar, setSongosonSalbar] = useState([]);
  const [borluulaltSongosonBaraa, setBorluulaltSongosonBaraa] = useState([]);

  const [ashigSongosonBaraa, setAshigSongosonBaraa] = useState([]);

  // Харилцагч шүүлт

  const items = [
    {
      key: "zarlaga",
      label: "Бусад зарлага",
      children: (
        <Zarlaga
          token={token}
          ognoo={ognoo}
          setOgnoo={setOgnoo}
          baiguullagiinId={baiguullagiinId}
        />
      ),
    },
    {
      key: "act",
      label: "Акт",
      children: (
        <Act
          token={token}
          ognoo={ognoo}
          setOgnoo={setOgnoo}
          baiguullagiinId={baiguullagiinId}
        />
      ),
    },
    {
      key: "khariltsagch",
      label: "Харилцагч",
      children: (
        <Khariltsagch token={token} ognoo={ognoo} setOgnoo={setOgnoo} />
      ),
    },
  ];

  return (
    <Admin
      onSearch={(search) => {
        if (songogdsonTab === "zarlaga") {
          setBorluulaltTailanKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        } else if (songogdsonTab === "act") {
          setAshigTailanKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        }
      }}
      title="Бусад зарлага"
      khuudasniiNer="BusadZarlagaTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"68ac1efd28e09bd334fa07e1"}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <Tabs
          defaultActiveKey={!!songogdsonTab ? "zarlaga" : "act"}
          items={items}
          onChange={(e) => tabsOnchange(e)}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BusadZarlagaTailan;
