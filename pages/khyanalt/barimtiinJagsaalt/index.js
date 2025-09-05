import Admin from "components/Admin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Tabs } from "antd";
import ZarlagaJagsaalt from "./ZarlagaJagsaalt";
import ToollogoJagsaalt from "./ToollogoJagsaalt";
import HudaldanAvaltiinJagsaalt from "./HudaldanAvaltJagsaalt";
import BorluulaltiinJagsaalt from "./BorluulaltJagsaalt";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import { isArray, set } from "lodash";
import useToollogiinJagsaaltAvya from "hooks/useToollogiinJagsaaltAvya";
import useJagsaalt from "hooks/useJagsaalt";
import useBaraa from "hooks/useBaraa";
import HudulguunJagsaalt from "./HudulguunJagsaalt";
import { useRouter } from "next/router";
import useGuilgeeniiTuukh from "hooks/guilgeeniiTuukh";

const zarlagaSearchKeys = ["ner", "register"];

const zarlagaTableSearchKeys = [
  "khariltsagchiinNer",
  "baraanuud.ner",
  "baraanuud.code",
  "baraanuud.barCode",
];

const borluulaltJagsaaltSearchKey = [
  "guilgeeniiDugaar",
  "baraanuud.baraa.ner",
  "baraanuud.baraa.code",
  "baraanuud.baraa.barCode",
];

const toollogoSearchKeys = [
  "khariltsagchiinNer",
  "ner",
  "baraanuud.ner",
  "baraanuud.code",
  "baraanuud.barCode",
  "barimtiinDugaar",
];

const index = () => {
  const router = useRouter();
  const { token, baiguullagiinId, salbariinId, baiguullaga } = useAuth();

  const { tab } = router.query;

  const [songosonJagsaalt, setSongosonJagsaalt] = useState(
    tab ? tab : "borluulaltJagsaalt"
  );
  const [songosonSalbar, setSongosonSalbar] = useState(salbariinId);

  const {
    order: borluulaltTableOrder,
    onChangeTable: borluulaltOnChangeTable,
  } = useOrder({
    ognoo: -1,
  });

  const { order: orderZarlaga, onChangeTable: onChangeTableZarlaga } = useOrder(
    { ognoo: -1, createdAt: -1 }
  );
  const { order: orderToollogo, onChangeTable: onChangeTableToollogo } =
    useOrder({ ognoo: -1 });

  const { order: orderBorluulalt, onChangeTable: onChangeTableBorluulalt } =
    useOrder({ ognoo: -1 });

  const [songosonBaraa, setSongosonBaraa] = useState([]);

  const [songogdsonBulguud, setSongogdsonBulguud] = useState();

  const [turul, setTurul] = useState("Борлуулалт");

  const {
    order: orderKhudaldanAvalt,
    onChangeTable: onChangeTableHudaldanAvalt,
  } = useOrder({ ognoo: -1 });
  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [shuult, setShuult] = useState(false);
  const [zarlagaOgnoo, setZarlagaOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const [toollogoOgnoo, setToollogoOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const [hudaldanAvaltognoo, setHudaldanAvaltOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const [borluulaltOgnoo, setBorluulaltOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const [hudulguunOgnoo, setHudulguunOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const onChange = (key) => {
    setSongosonJagsaalt(key);

    router.push(`/khyanalt/barimtiinJagsaalt?tab=${key}`);
  };
  const [ajiltan, setAjiltan] = useState();

  // zarlaga

  const zarlagaQuery = useMemo(() => {
    const zarlagaQeury = {
      baiguullagiinId: baiguullagiinId,
      khariltsagchiinId: { $exists: true },
      turul: { $in: ["act", "busadZarlaga"] },
      salbariinId: salbariinId,
      ognoo: !!zarlagaOgnoo
        ? {
            $gte: moment(zarlagaOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(zarlagaOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
    if (!!khariltsagchiinId) {
      zarlagaQeury.khariltsagchiinId = khariltsagchiinId;
    }
    if (!!shuult) {
      zarlagaQeury.turul = shuult;
    }
    return zarlagaQeury;
  }, [baiguullagiinId, salbariinId, zarlagaOgnoo, shuult, khariltsagchiinId]);

  const {
    data: zarlagaData,
    setKhuudaslalt: setZarlagaKhuudaslalt,
    mutate: tuukhMutate,
  } = posUseJagsaalt(
    songosonJagsaalt === "zarlagiinJagsaalt" && "/orlogoZarlagiinTuukh",
    zarlagaQuery,
    orderZarlaga,
    undefined,
    zarlagaTableSearchKeys,
    token,
    50
  );

  const khariltsagchQuery = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  const { data: khariltsagchData, onSearch: khariltsagchOnSearch } =
    posUseJagsaalt(
      "/khariltsagch",
      khariltsagchQuery,
      undefined,
      undefined,
      zarlagaSearchKeys
    );

  // toollogo

  const toollogiinJagsaaltQuery = useMemo(() => {
    return {
      createdAt: isArray(toollogoOgnoo)
        ? {
            $gte: moment(toollogoOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(toollogoOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      id: salbariinId,
    };
  }, [salbariinId, toollogoOgnoo]);

  const { toollogiinJagsaalt, setKhuudaslalt: toololtKhuudaslalt } =
    useToollogiinJagsaaltAvya(
      songosonJagsaalt === "toollogiinJagsaalt" && token,
      undefined,
      toollogiinJagsaaltQuery,
      orderToollogo
    );

  // hudaldanAvaltJagsaalt

  const queryHudaldanAvalt = useMemo(() => {
    const qeury = {
      baiguullagiinId: baiguullagiinId,
      khariltsagchiinId: { $exists: true },
      salbariinId: salbariinId,
      zassanEsekh: { $ne: true },
      turul: { $nin: ["act", "busadZarlaga"] },
      ognoo: !!hudaldanAvaltognoo
        ? {
            $gte: moment(hudaldanAvaltognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(hudaldanAvaltognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
    if (!!khariltsagchiinId) {
      qeury.khariltsagchiinId = khariltsagchiinId;
    }
    if (!!shuult) {
      if (shuult === "Засагдсан") {
        qeury.turul = "Орлого засвар";
        qeury.tsutsalsanOgnoo = { $exists: false };
      } else if (shuult === "Буцаасан") {
        qeury.ursgaliinTurul = "zarlaga";
        qeury.tsutsalsanOgnoo = { $exists: false };
      } else if (shuult === "Буцаалттай") {
        qeury.butsaagdsanEsekh = true;
      } else if (shuult === "Хэвийн") {
        qeury.butsaagdsanEsekh = { $ne: true };
        qeury.tsutsalsanOgnoo = { $exists: false };
        qeury.ursgaliinTurul = { $ne: "zarlaga" };
        qeury.turul = { $nin: ["Орлого засвар", "act", "busadZarlaga"] };
      } else if (shuult === "Цуцлагдсан") {
        qeury.$and = [
          { butsaagdsanEsekh: { $ne: true } },
          { tsutsalsanOgnoo: { $exists: true } },
        ];
      }
    }
    return qeury;
  }, [
    baiguullagiinId,
    salbariinId,
    hudaldanAvaltognoo,
    shuult,
    khariltsagchiinId,
    songosonJagsaalt,
  ]);

  const {
    data: hudaldanAvaltData,
    setKhuudaslalt: setHudaldanAvaltKhuudaslalt,
    mutate: hudaldanAvaltMutate,
    isValidating,
  } = posUseJagsaalt(
    songosonJagsaalt === "hudaldanAvaltJagsaalt" && "/orlogoZarlagiinTuukh",
    queryHudaldanAvalt,
    orderKhudaldanAvalt,
    undefined,
    zarlagaTableSearchKeys
  );

  // borluulalt

  const borluulaltQuery = useMemo(() => {
    const baseQuery = {
      ognoo: !!borluulaltOgnoo
        ? {
            $gte: moment(borluulaltOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(borluulaltOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      "ajiltan.id": !!ajiltan ? ajiltan : undefined,
      salbariinId: songosonSalbar ? songosonSalbar : salbariinId,
      tuluv: { $ne: 0 },
      "baraanuud.baraa.code":
        songosonBaraa.length > 0 ? { $in: songosonBaraa } : undefined,
      "baraanuud.baraa.angilal": !!songogdsonBulguud
        ? songogdsonBulguud
        : undefined,
      ...(turul === "Борлуулалт"
        ? { tsutsalsanOgnoo: { $exists: false } }
        : { tsutsalsanOgnoo: { $exists: true } }),
    };

    const queryWithButsaagdsanBaraanuud = {
      ...baseQuery,
      ...(turul !== "Борлуулалт" && {
        butsaagdsanBaraanuud: { $exists: true, $not: { $size: 0 } },
      }),
    };

    return queryWithButsaagdsanBaraanuud;
  }, [
    borluulaltOgnoo,
    songosonBaraa,
    ajiltan,
    songogdsonBulguud,
    songosonSalbar,
    turul,
  ]);

  const {
    guilgeeniiTuukhGaralt,
    guilgeeniiTuukhGaraltMutate,
    setGuilgeeniiTuukhKhuudaslalt,
    loading,
  } = useGuilgeeniiTuukh(
    token,
    undefined,
    borluulaltQuery,
    borluulaltTableOrder,
    borluulaltJagsaaltSearchKey
  );

  // Hudulguun

  const hudulguunQuery = useMemo(() => {
    const hudulguun = {
      baiguullagiinId: baiguullagiinId,
      // khariltsagchiinId: { $exists: true },
      turul: { $in: "khudulguun" },
      // salbariinId: salbariinId,
      ognoo: !!hudulguunOgnoo
        ? {
            $gte: moment(hudulguunOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(hudulguunOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
    if (!!khariltsagchiinId) {
      hudulguun.khariltsagchiinId = khariltsagchiinId;
    }

    return hudulguun;
  }, [baiguullagiinId, salbariinId, hudulguunOgnoo, khariltsagchiinId]);

  const {
    data: hudulguunData,
    setKhuudaslalt: setHudulguunKhuudaslalt,
    mutate: hudulguunMutate,
  } = posUseJagsaalt(
    songosonJagsaalt === "hudulguun" && "/orlogoZarlagiinTuukh",
    hudulguunQuery,
    orderZarlaga,
    undefined,
    zarlagaTableSearchKeys,
    token,
    50
  );

  const items = [
    {
      key: "borluulaltJagsaalt",
      label: "Борлуулалт",
      children: (
        <BorluulaltiinJagsaalt
          token={token}
          baiguullagiinId={baiguullaga?._id}
          baiguullaga={baiguullaga}
          salbariinId={salbariinId}
          ognoo={borluulaltOgnoo}
          setOgnoo={setBorluulaltOgnoo}
          guilgeeniiTuukhGaralt={guilgeeniiTuukhGaralt}
          songosonSalbar={songosonSalbar}
          setSongosonSalbar={setSongosonSalbar}
          songosonBaraa={songosonBaraa}
          setSongosonBaraa={setSongosonBaraa}
          ajiltan={ajiltan}
          setAjiltan={setAjiltan}
          songogdsonBulguud={songogdsonBulguud}
          setSongogdsonBulguud={setSongogdsonBulguud}
          turul={turul}
          setTurul={setTurul}
          setGuilgeeniiTuukhKhuudaslalt={setGuilgeeniiTuukhKhuudaslalt}
          guilgeeniiTuukhGaraltMutate={guilgeeniiTuukhGaraltMutate}
          onChangeTable={borluulaltOnChangeTable}
          songosonJagsaalt={songosonJagsaalt}
          // baraaGaralt={baraaGaralt}
        />
      ),
    },
    {
      key: "hudaldanAvaltJagsaalt",
      label: "Худалдан авалт",
      children: (
        <HudaldanAvaltiinJagsaalt
          data={hudaldanAvaltData}
          ognoo={hudaldanAvaltognoo}
          setOgnoo={setHudaldanAvaltOgnoo}
          khariltsagchData={khariltsagchData}
          khariltsagchOnSearch={khariltsagchOnSearch}
          onChangeTable={onChangeTableZarlaga}
          token={token}
          khariltsagchiinId={khariltsagchiinId}
          setKhariltsagchiinId={setKhariltsagchiinId}
          setShuult={setShuult}
          shuult={shuult}
          mutate={hudaldanAvaltMutate}
        />
      ),
    },
    {
      key: "zarlagiinJagsaalt",
      label: "Зарлага",
      children: (
        <ZarlagaJagsaalt
          data={zarlagaData}
          khariltsagchData={khariltsagchData}
          setOgnoo={setZarlagaOgnoo}
          ognoo={zarlagaOgnoo}
          khariltsagchOnSearch={khariltsagchOnSearch}
          onChangeTable={onChangeTableZarlaga}
          token={token}
          khariltsagchiinId={khariltsagchiinId}
          setKhariltsagchiinId={setKhariltsagchiinId}
          setShuult={setShuult}
          shuult={shuult}
        />
      ),
    },
    {
      key: "toollogiinJagsaalt",
      label: "Тооллого",
      children: (
        <ToollogoJagsaalt
          toollogiinJagsaalt={toollogiinJagsaalt}
          toololtKhuudaslalt={toololtKhuudaslalt}
          onChangeTable={onChangeTableToollogo}
          ognoo={toollogoOgnoo}
          setOgnoo={setToollogoOgnoo}
          token={token}
        />
      ),
    },
    {
      key: "hudulguun",
      label: "Хөдөлгөөн",
      children: (
        <HudulguunJagsaalt
          hudulguunData={hudulguunData}
          setHudulguunKhuudaslalt={setHudulguunKhuudaslalt}
          onChangeTable={onChangeTableToollogo}
          ognoo={hudulguunOgnoo}
          setOgnoo={setHudulguunOgnoo}
          token={token}
          baiguullaga={baiguullaga}
        />
      ),
    },
  ];

  return (
    <Admin
      khuudasniiNer={"barimtiinJagsaalt"}
      className={"p-4"}
      title={"Баримтын жагсаалт"}
      onSearch={(search) =>
        songosonJagsaalt === "zarlagiinJagsaalt"
          ? setZarlagaKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          : songosonJagsaalt === "toollogiinJagsaalt"
          ? toololtKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          : songosonJagsaalt === "hudaldanAvaltJagsaalt"
          ? setHudaldanAvaltKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          : songosonJagsaalt === "borluulaltJagsaalt"
          ? setGuilgeeniiTuukhKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          : songosonJagsaalt === "hudulguun" &&
            setHudulguunKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
      }
    >
      <div className="col-span-full flex w-full flex-col">
        <Tabs
          onChange={onChange}
          defaultActiveKey={tab ? tab : "borluulaltJagsaalt"}
          items={items}
        />
      </div>
    </Admin>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default index;
