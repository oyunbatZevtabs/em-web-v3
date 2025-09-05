import Admin from "components/Admin";
import { Popover, Progress, Select, Table as AntdModal, Button } from "antd";
import { DatePicker, Space } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  SettingOutlined,
  MoreOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useGuilgeeniiTuukh from "hooks/useGuilgeeniiTuukh";
import { useAuth } from "services/auth";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import Table from "components/ant/AntdTable";
import { useEffect, useMemo, useState } from "react";
import JagsaaltDelgerenguiTuukh from "components/modalBody/jagsaalt/jagsaaltDelgerenguiTuukh/jagsaaltDelgerenguiTuukh";
import useJagsaalt from "hooks/useJagsaalt";
import useBaraa from "hooks/useBaraa";
import useData from "hooks/useData";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import { IoReturnUpBack } from "react-icons/io5";
import { Modal } from "components/ant/AntdModal";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { useRouter } from "next/router";

import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import ShaltgaanModal from "components/modalBody/jagsaalt/shalgtaanModal";
import useGuilgeeniiToololtAvya from "hooks/useGuilgeeniiToololtAvya";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import BaganiinSongolt from "components/baganaNemekh";
import useOrder from "tools/function/useOrder";

const searchKeys = ["angilal"];

function Jagsaalt() {
  const { RangePicker } = DatePicker;
  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [ajiltan, setAjiltan] = useState();
  const [songosonSalbar, setSongosonSalbar] = useState(salbariinId);
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const [songogdsonBulguud, setSongogdsonBulguud] = useState();
  const [butsaahdaaItgelteiBaina, setButsaahdaaItgelteiBaina] = useState(false);
  const [butsaahGuilgee, setButsaahGuilgee] = useState();
  const [shaltgaan, setShaltgaan] = useState("");
  const [turul, setTurul] = useState("Борлуулалт");
  const [shineBagana, setShineBagana] = useState([]);
  const [butsaagdsanBaraanuud, setButsaagdsanBaraanuud] = useState([]);
  const { order, onChangeTable } = useOrder({ ognoo: -1 });

  const router = useRouter();

  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const queryEmZuich = useMemo(
    () => ({
      emiinSanId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  function turulHurwuulelt(turul) {
    switch (turul) {
      case "belen":
        return "Бэлэн";
      case "zeel":
        return "Зээл";
      case "qpay":
        return "QPay";
      case "khungulult":
        return "Хөнгөлөлт";
      case "cart":
        return "Карт";
      case "khariltsakh":
        return "Харилцах";
      default:
        return turul;
    }
  }

  const {
    data,
    setKhuudaslalt,
    mutate,
    onSearch,
    setKhuudaslalt: setEmzuichKhuudaslalt,
  } = useJagsaalt(
    "/emZuich",
    queryEmZuich,
    order,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const { data: salbaruud } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    if (!!songosonSalbar) {
      query.salbariinId = songosonSalbar;
    } else query.salbariinId = "shuuhgui";
    return query;
  }, [songosonSalbar, baiguullagiinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);

    garalt?.jagsaalt?.map((e) => {
      if (e.khungulukhKhuvi > 0 && e.khungulukhTurul === "khuvi") {
        e.khungulukhKhuvi = e.niitUndsenDun - e.niitDun;
      }
    });

    return (
      <AntdModal.Summary.Row>
        {columns.map((mur, index) => (
          <AntdModal.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right"
          >
            {mur.summary
              ? mur.dataIndex === "niitUne"
                ? formatNumber(
                    garalt?.jagsaalt?.reduce(
                      (a, b) => a + (b["niitUne"] || 0),
                      0
                    ),
                    2
                  ) + " ₮"
                : formatNumber(
                    garalt?.jagsaalt?.reduce(
                      (a, b) => a + (b[mur.dataIndex] || 0),
                      0
                    ),
                    2
                  ) + " ₮ "
              : ""}
          </AntdModal.Summary.Cell>
        ))}
      </AntdModal.Summary.Row>
    );
  }

  const ToololtQuery = useMemo(() => {
    return {
      ekhlekhOgnoo: ognoo?.length > 0 ? ognoo[0] : undefined,
      duusakhOgnoo: ognoo?.length > 0 ? ognoo[1] : undefined,
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
      ...(turul === "Борлуулалт"
        ? { tsutsalsanOgnoo: { $exists: false } }
        : { tsutsalsanOgnoo: { $exists: true } }),
    };
  }, [turul, ognoo, baiguullagiinId, salbariinId]);

  const { guilgeeniiToololt, guilgeeniiToololtMutate } =
    useGuilgeeniiToololtAvya(token, ToololtQuery);

  const shuultuud = [
    {
      key: 1,
      garchig: "Борлуулалт",
      too: guilgeeniiToololt?.idevkhiteiToo,
      shuult: "Борлуулалт",
    },
    {
      key: 2,
      garchig: "Буцаалт",
      too: guilgeeniiToololt?.tsutslagdsanToo,
      shuult: "Буцаалт",
    },
    {
      key: 3,
      garchig: "Хөнгөлөлттэй",
      too: "Тун удахгүй...",
      shuult: "Хөнгөлөлттэй",
    },
    {
      key: 4,
      garchig: "Урамшуулалтай",
      too: "Тун удахгүй...",
      shuult: "Урамшуулалтай",
    },
  ];
  const query = useMemo(() => {
    const baseQuery = {
      ognoo: !!ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      "ajiltan.id": !!ajiltan ? ajiltan : undefined,
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
  }, [ognoo, ajiltan, songosonBaraa, songogdsonBulguud, turul]);

  const {
    guilgeeniiTuukhKhGaralt,
    guilgeeniiTuukhKhGaraltMutate,
    setGuilgeeniiTuukhKhuudaslalt,
    loading,
  } = useGuilgeeniiTuukh(token, undefined, query, order);

  const [guilgeeniiTuukhDelgerengui, setGuilgeeniiTuukhDelgerengui] =
    useState();

  const angilalQuery = useMemo(() => {
    return { baiguullagiinId: baiguullagiinId };
  }, [baiguullagiinId]);

  const { jagsaalt, setKhuudaslalt: setAngilalKhuudaslalt } = posUseJagsaalt(
    "BaraaniiAngilal",
    angilalQuery,
    undefined,
    undefined,
    searchKeys,
    undefined,
    undefined,
    true
  );

  const columns = useMemo(() => {
    var suuldNemekhs = shineBagana.filter(
      (item) =>
        item.dataIndex === "ashiglasan" ||
        item.dataIndex === "nemegdsen" ||
        item.dataIndex === "hungulsunDun"
    );

    var dundNemekh = shineBagana.filter(
      (item) =>
        item.dataIndex === "khariltsagch" || item.dataIndex === "registr"
    );

    var nemekhMur3 =
      turul === "Буцаалт"
        ? [
            {
              title: <div className=" font-semibold">Буцаалт төлбөр</div>,
              dataIndex: "tulbur",
              align: "center",
              width: "8rem",
              showSorterTooltip: false,
              render: (tulbur, data) => {
                return (
                  <div>
                    {data.tulbur.length > 1 ? (
                      <Popover
                        content={
                          <div className="flex flex-col">
                            {data.tulbur.map((e) => {
                              return (
                                <div className="flex justify-between gap-2">
                                  <div>{turulHurwuulelt(e.turul)}:</div>
                                  <div>{formatNumber(e.une)}</div>
                                </div>
                              );
                            })}
                          </div>
                        }
                      >
                        <div className="flex w-full items-center justify-center">
                          <div className="w-full cursor-pointer rounded-lg border border-[#48BB78] px-2 text-[#48BB78] hover:bg-[#48BB78] hover:text-white">
                            <EyeOutlined />
                          </div>
                        </div>
                      </Popover>
                    ) : data.tulbur.length > 0 ? (
                      <div className="flex w-full items-center justify-between">
                        <div>{turulHurwuulelt(data?.tulbur?.[0]?.turul)}</div>
                        <div>{formatNumber(data?.tulbur?.[0]?.une)}</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              },
            },
          ]
        : [];
    var nemekhMur4 =
      turul !== "Буцаалт"
        ? [
            {
              title: <div className=" font-semibold">Төлбөр</div>,
              dataIndex: "tulbur",
              align: "center",
              width: "8rem",
              showSorterTooltip: false,
              render: (tulbur, data) => {
                return (
                  <div>
                    {data.tulbur.length > 1 ? (
                      <Popover
                        content={
                          <div className="flex flex-col">
                            {data.tulbur.map((e) => {
                              return (
                                <div className="flex justify-between gap-2">
                                  <div>{turulHurwuulelt(e.turul)}:</div>
                                  <div>{formatNumber(e.une)}</div>
                                </div>
                              );
                            })}
                          </div>
                        }
                      >
                        <div className="flex w-full items-center justify-center">
                          <div className="w-full cursor-pointer rounded-lg border border-[#48BB78] px-2 text-[#48BB78] hover:bg-[#48BB78] hover:text-white">
                            <EyeOutlined />
                          </div>
                        </div>
                      </Popover>
                    ) : data.tulbur.length > 0 ? (
                      <div className="flex w-full items-center justify-between">
                        <div>{turulHurwuulelt(data?.tulbur?.[0]?.turul)}</div>
                        <div>{formatNumber(data?.tulbur?.[0]?.une)}</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              },
            },
          ]
        : [];

    var nemekhMur1 =
      turul === "Буцаалт"
        ? [
            {
              title: <div className=" font-semibold">Буцаалт огноо</div>,
              dataIndex: "tsutsalsanOgnoo",
              align: "center",
              showSorterTooltip: false,
              render: (ognoo) => {
                return <div>{moment(ognoo).format("YYYY-MM-DD, HH:mm")}</div>;
              },
            },
          ]
        : [];

    var nemekhMur =
      turul === "Буцаалт"
        ? [
            {
              title: <div className=" font-semibold">Буцаалт төрөл</div>,
              dataIndex: "butsaaltiinTurul",
              align: "center",
              render: (butsaaltiinTurul) => {
                return <div className="truncate">{butsaaltiinTurul}</div>;
              },
            },
            {
              title: <div className=" font-semibold">Тайлбар</div>,
              dataIndex: "tsutslagdsanShaltgaan",
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
              render: (tsutslagdsanShaltgaan) => {
                return (
                  <Popover content={<div>{tsutslagdsanShaltgaan}</div>}>
                    <div className="truncate">{tsutslagdsanShaltgaan}</div>
                  </Popover>
                );
              },
            },
          ]
        : [];
    return [
      {
        title: "№",
        key: "index",
        className: "text-center",
        align: "center",
        width: "3rem",
        fixed: "left",
        render: (text, record, index) =>
          (guilgeeniiTuukhKhGaralt?.khuudasniiDugaar || 0) *
            (guilgeeniiTuukhKhGaralt?.khuudasniiKhemjee || 0) -
          (guilgeeniiTuukhKhGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className=" font-semibold">Огноо</div>,
        dataIndex: "createdAt",
        width: "10rem",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (ognoo) => {
          return <div>{moment(ognoo).format("YYYY-MM-DD, HH:mm")}</div>;
        },
      },
      {
        title: <div className=" font-semibold">Баримтын дугаар</div>,
        dataIndex: "guilgeeniiDugaar",
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: <div className="text-center font-semibold">Кассер</div>,
        dataIndex: "kasser",
        width: "10rem",
        align: "left",
        showSorterTooltip: false,
        render: (ognoo, data) => {
          return <div>{data.ajiltan.ner}</div>;
        },
      },
      ...dundNemekh,
      {
        title: <div>Тоо хэмжээ</div>,
        dataIndex: "tooKhemjee",
        width: "8rem",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (_a, b) => {
          const niitToo =
            turul === "Буцаалт"
              ? b?.butsaagdsanBaraanuud?.reduce((a, b) => a + b?.too || 0, 0)
              : b?.baraanuud?.reduce((a, b) => a + b?.too || 0, 0);
          return <div>{tooOronKhyazgaarliy(niitToo, 2)}</div>;
        },
      },
      ...nemekhMur4,
      {
        title: <div>Нөат</div>,
        dataIndex: "noatiinDun",
        width: "8rem",

        summary: true,
        align: "right",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data, e) => {
          return (
            <div>
              {formatNumber(data, 2)}
              {/* {turul === "Борлуулалт"
                ? formatNumber(data, 2)
                : formatNumber(
                    e.butsaagdsanBaraanuud.reduce(
                      (sum, item) => sum + item.niitUne,
                      0
                    ) /
                      1.1 /
                      10,
                    2
                  )} */}
            </div>
          );
        },
      },
      ...suuldNemekhs,
      {
        title: <div className=" font-semibold">Нийт дүн</div>,
        dataIndex: "niitUne",
        align: "center",
        width: "8rem",

        summary: true,
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data, e) => {
          return (
            <div className="text-right">
              {formatNumber(data, 2)}
              {/* {turul === "Борлуулалт"
                ? formatNumber(data, 2)
                : formatNumber(
                    e.butsaagdsanBaraanuud.reduce(
                      (sum, item) => sum + item.niitUne,
                      0
                    ),
                    2
                  )} */}
            </div>
          );
        },
      },
      ...nemekhMur3,
      ...nemekhMur1,
      ...nemekhMur,

      {
        title: () => (
          <div className="flex justify-center text-center font-semibold">
            <SettingOutlined />
          </div>
        ),
        width: "80px",
        key: "action",
        align: "center",
        render: (_text, record) => {
          return (
            <div className="flex items-center justify-center gap-2">
              {record?.zarlagdsanEsekh !== true && (
                <div className="flex w-fit items-center justify-center">
                  <a
                    onClick={() => {
                      setGuilgeeniiTuukhDelgerengui({
                        baraa: !!record?.tsutsalsanOgnoo
                          ? record?.butsaagdsanBaraanuud
                          : record?.baraanuud,
                        khariltsagch: record?.khariltsagch,
                      });
                    }}
                    className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                  >
                    <EyeOutlined
                      style={{ fontSize: "18px", color: "#4fc1d5" }}
                    />
                  </a>
                  {!record?.tsutsalsanOgnoo && (
                    <Popover
                      placement="bottom"
                      trigger="hover"
                      content={() => (
                        <div className="flex w-fit flex-col space-y-2">
                          <a
                            onClick={() =>
                              setButsaahGuilgee({
                                ...record,
                                butsaaltiinTuluv: "Бараа сонгох",
                              })
                            }
                            className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                          >
                            <label className="text-[#4fc1d5]">
                              Бараа сонгож буцаах
                            </label>
                          </a>
                          <a
                            onClick={() =>
                              setButsaahGuilgee({
                                ...record,
                                butsaaltiinTuluv: "Бүгд",
                              })
                            }
                            className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                          >
                            <label className="text-[#4fc1d5]">
                              Бүх барааг буцаах
                            </label>
                          </a>
                        </div>
                      )}
                    >
                      <a className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
                        <IoReturnUpBack
                          style={{ fontSize: "18px", color: "#4fc1d5" }}
                        />
                      </a>
                    </Popover>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [turul, shineBagana]);

  return (
    <Admin
      loading={loading}
      onSearch={(v) =>
        setGuilgeeniiTuukhKhuudaslalt((a) => ({
          ...a,
          search: v,
          khuudasniiDugaar: 1,
        }))
      }
      title="Борлуулалт"
      khuudasniiNer={"jagsaalt"}
      className="pt-5"
    >
      <div className="col-span-12 mb-4 flex h-full flex-col gap-2 px-4">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="grid h-fit w-full grid-cols-6 place-items-center gap-6 lg:grid-cols-12">
            {shuultuud.map((item) => {
              return (
                <div
                  onClick={() =>
                    item.too !== "Тун удахгүй..." &&
                    setTurul(turul === item.shuult ? "Борлуулалт" : item.shuult)
                  }
                  className={`${
                    turul === item.shuult && "bg-green-500 bg-opacity-5 "
                  } col-span-3 flex w-full cursor-pointer flex-col items-start justify-center overflow-hidden rounded-lg border border-[#4FD1C5] p-4 shadow-lg`}
                >
                  <div className="truncate font-[500] text-gray-400">
                    {item.garchig}
                  </div>
                  <div
                    className={`flex w-full justify-end truncate font-[700] ${
                      item.too === "Тун удахгүй..." && "text-gray-300"
                    }`}
                  >
                    {item.too}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex w-[100%] items-center gap-2 ">
            <RangePicker
              size="large"
              suffixIcon=""
              allowClear={false}
              className="!h-[36px] w-64 !rounded-md bg-white"
              placeholder={["Эхлэх огноо", "Дуусах огноо"]}
              value={ognoo}
              onChange={(v) => setOgnoo(v)}
            />
            <Select
              showSearch
              filterOption={false}
              size="large"
              bordered={false}
              className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white"
              placeholder="Салбар сонгох"
            >
              {salbaruud?.map((v) => {
                return (
                  <Select.Option key={v?._id} value={v?._id}>
                    <div
                      className="flex flex-row overflow-hidden whitespace-nowrap text-gray-600  dark:text-gray-300"
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {v?.ner}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              bordered={false}
              className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300"
              showSearch
              filterOption={false}
              size="large"
              allowClear
              onChange={(v) => {
                setAjiltan(v);
              }}
              onSearch={(search) => {
                setEmzuichKhuudaslalt((a) => ({ ...a, search }));
              }}
              placeholder="Ажилтан сонгох"
            >
              {data?.jagsaalt?.map((a, i) => {
                return (
                  <Select.Option key={i} value={a._id}>
                    <div className="dark:text-gray-300">{a.ner}</div>
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              showSearch
              placeholder="Бараа сонгох"
              className="w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white"
              allowClear
              mode="multiple"
              value={songosonBaraa}
              filterOption={(o) => o}
              onChange={(v) => {
                setSongosonBaraa(v);
                v === undefined &&
                  setBaraaniiKhuudaslalt((a) => ({ ...a, search: "" }));
              }}
              onSearch={(search) => {
                setBaraaniiKhuudaslalt((a) => ({ ...a, search }));
              }}
            >
              {baraaGaralt?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option
                    key={mur?.code}
                    value={mur?.code}
                    className="dark:hover:bg-gray-800"
                  >
                    <div className="flex w-full justify-between">
                      <div
                        className="flex flex-row truncate text-gray-600  dark:text-gray-300"
                        style={{ textOverflow: "ellipsis" }}
                      >
                        {mur?.ner}
                      </div>
                      <div className="flex justify-end truncate font-semibold">
                        {mur?.id}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              onChange={(v) => setSongogdsonBulguud(v)}
              showSearch
              filterOption={false}
              size="large"
              bordered={false}
              allowClear
              onSearch={(search) => {
                setAngilalKhuudaslalt((a) => ({ ...a, search }));
              }}
              className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300 "
              placeholder="Ангилал"
            >
              {jagsaalt?.map((mur) => {
                return (
                  <Select.Option
                    key={mur?._id}
                    value={mur?.angilal}
                    className="dark:hover:bg-gray-900 dark:active:bg-gray-800"
                  >
                    <div className={`flex justify-start dark:text-gray-300`}>
                      <div className="dark: font-bold dark:text-gray-300">
                        {mur?.angilal}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
            <div className="ml-auto flex justify-end dark:text-gray-300">
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: (
                      <div className="text-center font-semibold">Харилцагч</div>
                    ),
                    dataIndex: "khariltsagch",
                    key: "khariltsagch",
                    // showSorterTooltip: false,
                    // sorter: () => 0,
                    width: "10rem",
                    render: (khariltsagch) => {
                      return (
                        <div className="text-left dark:text-gray-300">
                          {khariltsagch?.ner}
                        </div>
                      );
                    },
                  },
                  {
                    title: (
                      <div className="text-center font-semibold ">Регистр</div>
                    ),
                    dataIndex: "registr",
                    key: "registr",
                    align: "center",
                    width: "10rem",

                    render: (registr) => (
                      <div className="truncate">{registr}</div>
                    ),
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">Ашигласан</div>
                    ),
                    dataIndex: "ashiglasan",
                    key: "ashiglasan",
                    align: "right",
                    width: "150px",
                    render: (khariltsagch, data) => (
                      <div className="truncate">
                        {formatNumber(
                          data?.khariltsagch?.bonus?.ashiglasan,
                          2
                        ) || ""}
                      </div>
                    ),
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">Нэмэгдсэн</div>
                    ),
                    dataIndex: "nemegdsen",
                    key: "nemegdsen",
                    align: "right",
                    width: "150px",
                    render: (registr, data) => (
                      <div className="truncate">
                        {formatNumber(
                          data?.khariltsagch?.bonus?.nemegdsen,
                          2
                        ) || ""}
                      </div>
                    ),
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">Хөнгөлөлт</div>
                    ),
                    dataIndex: "hungulsunDun",
                    width: "8rem",
                    align: "right",
                    render: (hungulsunDun, data) => {
                      return (
                        <div className="truncate">
                          {!!data?.khariltsagch?.khunglult?.khuvi
                            ? formatNumber(hungulsunDun, 2)
                            : ""}
                        </div>
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>

          <Table
            scroll={{ y: "calc(100vh - 23rem)", x: "10vh" }}
            dataSource={guilgeeniiTuukhKhGaralt?.jagsaalt || []}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: parseFloat(guilgeeniiTuukhKhGaralt?.khuudasniiDugaar),
              total: guilgeeniiTuukhKhGaralt?.niitMur,
              pageSize: guilgeeniiTuukhKhGaralt?.khuudasniiKhemjee,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setGuilgeeniiTuukhKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            summary={() => (
              <AntdModal.Summary fixed>
                <UilgelAvya
                  garalt={guilgeeniiTuukhKhGaralt}
                  columns={columns}
                />{" "}
              </AntdModal.Summary>
            )}
          />
        </div>
        <JagsaaltDelgerenguiTuukh
          guilgeeniiTuukhDelgerengui={guilgeeniiTuukhDelgerengui}
          setGuilgeeniiTuukhDelgerengui={setGuilgeeniiTuukhDelgerengui}
        />
      </div>
      <ShaltgaanModal
        guilgeeniiTuukhKhGaraltMutate={guilgeeniiTuukhKhGaraltMutate}
        guilgeeniiToololtMutate={guilgeeniiToololtMutate}
        token={token}
        setShaltgaan={setShaltgaan}
        shaltgaan={shaltgaan}
        setButsaahGuilgee={setButsaahGuilgee}
        butsaahGuilgee={butsaahGuilgee}
      />
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Jagsaalt;
