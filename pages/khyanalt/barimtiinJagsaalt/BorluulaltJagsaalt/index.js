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
import { useEffect, useMemo, useState, useRef } from "react";
import JagsaaltDelgerenguiTuukh from "components/modalBody/jagsaalt/jagsaaltDelgerenguiTuukh/jagsaaltDelgerenguiTuukh";
import useJagsaalt from "hooks/useJagsaalt";
import useBaraa from "hooks/useBaraa";
import useData from "hooks/useData";
import { useReactToPrint } from "react-to-print";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import { IoReturnUpBack } from "react-icons/io5";
import { Modal } from "components/ant/AntdModal";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { useRouter } from "next/router";
import useEBarimt from "hooks/useEBarimt";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import ShaltgaanModal from "components/modalBody/jagsaalt/shalgtaanModal";
import useGuilgeeniiToololtAvya from "hooks/useGuilgeeniiToololtAvya";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import BaganiinSongolt from "components/baganaNemekh";
import useOrder from "tools/function/useOrder";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { mutate as globalMutate } from "swr";

import QRCode from "react-qr-code";
import { MdQueryBuilder } from "react-icons/md";
import EBarimtModal from "components/modalBody/posSystem/eBarimt";
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];
const order = { ognoo: -1 };

function BorluulaltiinJagsaalt({
  ognoo,
  setOgnoo,
  guilgeeniiTuukhGaralt,
  guilgeeniiTuukhGaraltMutate,
  songosonBaraa,
  setSongosonBaraa,
  songosonSalbar,
  ajiltan,
  setAjiltan,
  baiguullagiinId,
  songogdsonBulguud,
  setSongogdsonBulguud,
  setSongosonSalbar,
  turul,
  setTurul,
  songosonJagsaalt,
  onChangeTable,
}) {
  const { RangePicker } = DatePicker;

  const [butsaahdaaItgelteiBaina, setButsaahdaaItgelteiBaina] = useState(false);
  const [butsaahGuilgee, setButsaahGuilgee] = useState();
  const [shaltgaan, setShaltgaan] = useState("");
  const [shineBagana, setShineBagana] = useState([]);
  const [songosnoiSalbar, setSongosnoiSalbar] = useState(null);
  const [butsaagdsanBaraanuud, setButsaagdsanBaraanuud] = useState([]);

  const [baiguullagaEsekh, setBaiguullagaEsekh] = useState(false);
  const [belneer, setBelneer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guilgeeniiId, setGuilgeeniiId] = useState();
  const [guilgeeniiDugaar, setGuilgeeniiDugaar] = useState("");
  const [khevlekh, setKhevlekh] = useState(false);
  const [eBarimt, setEbarimt] = useState();
  const [showEbarimtModal, setShowEbarimtModal] = useState(false);
  const [dahinHewleh, setDahinHewleh] = useState(false);
  const [tulburTurul, setTulburTurul] = useState([]);
  const { baiguullaga, salbariinId, token } = useAuth();
  const [qpayModal, setQpayModal] = useState(false);
  const router = useRouter();
  const [shuudTulukh, setShuudTulukh] = useState(false);
  const [baiguullagaTatvar, setBaiguullagaTatvar] = useState();
  const [
    hynaltiinDugaaraarLavlagaaAvakhData,
    setHynaltiinDugaaraarLavlagaaAvakhData,
  ] = useState();
  const params = router.query.params;
  // const { order, onChangeTable } = useOrder({ ognoo: -1 });\
  const { order: emZuichOrder, onChangeTable: onChangeTableEmZuich } = useOrder(
    { ognoo: -1 }
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

  const { data: salbaruud } = useData(
    token,
    "/emiinSanSalbarAvya",
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
  const queryEmZuich = useMemo(
    () => ({
      emiinSanId: baiguullaga?._id,
    }),
    [baiguullaga]
  );

  const { data: emzuichData, setKhuudaslalt: setEmzuichKhuudaslalt } =
    useJagsaalt(
      songosonJagsaalt === "borluulaltJagsaalt" && "/emZuich",
      queryEmZuich,
      emZuichOrder,
      undefined,
      searchKeys,
      undefined,
      undefined
    );

  const [guilgeeniiTuukhDelgerengui, setGuilgeeniiTuukhDelgerengui] =
    useState();

  const angilalQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullagiinId,
    };
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

  const eBarimtRef = useRef(null);
  // const queryData = useMemo(() => {
  //   return {
  //     guilgeeniiDugaar,
  //     baiguullagiinId,
  //     salbariinId,
  //   };
  // }, [guilgeeniiDugaar, baiguullagiinId, salbariinId]);

  const hevlehHandle = () => {
    setLoading(true);
    posUilchilgee(token)
      .post("/ebarimtShineAvya", {
        guilgeeniiDugaar,
        baiguullagiinId,
        salbariinId,
      })
      .then(({ data }) => {
        setEbarimt(data);
        handlePrint();
        setKhevlekh(false);
        setTimeout(() => {
          handlePrint();
        }, 100);
      })
      .catch((err) => {
        if (err || Object.keys(err).length >= 0) {
          console.warn("Empty error caught:", err);

          aldaaBarigch(err);
        }
        setLoading(false);
      });
  };
  useEffect(() => {
    if (khevlekh && guilgeeniiDugaar) {
      hevlehHandle();
    }
  }, [khevlekh, guilgeeniiDugaar]);
  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
    onAfterPrint: () => {
      setLoading(false);
    },
  });

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
              className: "border-r border-gray-200",
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
              className: "border-r border-gray-200",
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
              className: "border-r border-gray-200",
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
              className: "border-r border-gray-200",
              align: "center",
              render: (butsaaltiinTurul) => {
                return <div className="truncate">{butsaaltiinTurul}</div>;
              },
            },
            {
              title: <div className=" font-semibold">Тайлбар</div>,
              dataIndex: "tsutslagdsanShaltgaan",
              align: "center",
              className: "border-r border-gray-200",
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
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "3rem",
        fixed: "left",
        render: (text, record, index) =>
          (guilgeeniiTuukhGaralt?.khuudasniiDugaar || 0) *
            (guilgeeniiTuukhGaralt?.khuudasniiKhemjee || 0) -
          (guilgeeniiTuukhGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className=" font-semibold">Огноо</div>,
        dataIndex: "createdAt",
        width: "10rem",
        align: "center",
        className: "border-r border-gray-200",
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
        className: "border-r border-gray-200",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: <div className="text-center font-semibold">Кассер</div>,
        dataIndex: "kasser",
        width: "10rem",
        className: "border-r border-gray-200",
        align: "center",
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
        className: "border-r border-gray-200",
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
        className: "border-r border-gray-200",
        summary: true,
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data, e) => {
          return (
            <div className="text-end">
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
        className: "border-r border-gray-200",
        summary: true,
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data, e) => {
          return (
            <div className="text-end">
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
        className: "border-r border-gray-200",
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
                          <a
                            onClick={() => {
                              if (!record?.ebarimtAvsanEsekh) {
                                setGuilgeeniiDugaar(record.guilgeeniiDugaar);
                                setShowEbarimtModal(true);
                                setQpayModal(true);
                                setDahinHewleh(true);
                                setTulburTurul(record.tulbur);
                                setGuilgeeniiId(record?._id);
                                if (!!record?.data?.receiptNumber) {
                                  const body = {
                                    salbariinId,
                                    baiguullagiinId,
                                  };
                                  posUilchilgee(token)
                                    .post(
                                      "/hynaltiinDugaaraarLavlagaaAvakh",
                                      body
                                    )
                                    .then(({ data }) => {
                                      if (data) {
                                        setHynaltiinDugaaraarLavlagaaAvakhData(
                                          data
                                        );
                                      } else {
                                        AnkhaaruulgaAlert("Лавлагаа олдсонгүй");
                                        setHynaltiinDugaaraarLavlagaaAvakhData();
                                      }
                                    })
                                    .catch((e) => {
                                      if (err || Object.keys(err).length >= 0) {
                                        console.warn(
                                          "Empty error caught:",
                                          err
                                        );

                                        aldaaBarigch(err);
                                      }
                                      aldaaBarigch(e);
                                    });
                                }
                              } else {
                                setGuilgeeniiDugaar(record.guilgeeniiDugaar);
                                setShowEbarimtModal(false);
                                setKhevlekh(true);
                              }
                            }}
                            className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                          >
                            <label className="text-[#4fc1d5]">
                              {record?.ebarimtAvsanEsekh === true
                                ? "Дахин хэвлэх"
                                : "И-баримт"}
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
    <>
      {showEbarimtModal && (
        <EBarimtModal
          qpayModal={qpayModal}
          setQpayModal={setQpayModal}
          turul={tulburTurul}
          setTurul={setTulburTurul}
          dahinHewleh={dahinHewleh}
          setGuilgeeniiId={setGuilgeeniiId}
          guilgeeniiId={guilgeeniiId}
          guilgeeniiDugaar={guilgeeniiDugaar}
          baiguullaga={baiguullaga}
          salbariinId={salbariinId}
          setBaiguullagaTatvar={setBaiguullagaTatvar}
          baiguullagaTatvar={baiguullagaTatvar}
          token={token}
          shuudTulukh={shuudTulukh}
          setShuudTulukh={setShuudTulukh}
          baiguullagiinId={baiguullagiinId}
          eBarimtShine={baiguullaga?.tokhirgoo?.eBarimtShine}
          hynaltiinDugaaraarLavlagaaAvakhData={
            hynaltiinDugaaraarLavlagaaAvakhData
          }
          guilgeeniiTuukhGaraltMutate={guilgeeniiTuukhGaraltMutate}
          setHynaltiinDugaaraarLavlagaaAvakhData={
            setHynaltiinDugaaraarLavlagaaAvakhData
          }
        />
      )}
      {eBarimt && (
        <div className="hidden">
          <div
            className="flex w-full min-w-[58mm] flex-col font-mono text-sm font-normal text-black"
            ref={eBarimtRef}
          >
            <div className="flex justify-between">
              <div>Борлуулагч:</div>
              <div className="text-base font-bold">{baiguullaga?.ner}</div>
            </div>
            <div className="flex justify-between">
              <div>Огноо:</div>
              <div>{moment(Date.now()).format("YYYY-MM-DD, HH:mm")}</div>
            </div>
            <div className="flex justify-between">
              <div>ТТД:</div>
              <div>{eBarimt?.merchantTin}</div>
            </div>
            <div className="flex justify-between">
              <div>Касс:</div>
              <div>{eBarimt?.posNo}</div>
            </div>
            <div className="flex justify-between">
              <div>Кассчин:</div>
              <div>{ajiltan?.ner}</div>
            </div>
            <div className="flex justify-between">
              <div>Баримтын дугаар:</div>
              <div>{guilgeeniiDugaar}</div>
            </div>
            <div>
              <div>ДДТД:{eBarimt?.billId ? eBarimt?.billId : eBarimt?.id}</div>
            </div>
            <div>
              <div>
                <br />
              </div>
            </div>
            <div className="grid grid-cols-3 border-t-2 border-dashed border-gray-800">
              <div className="col-span-3">/ Бараа /</div>
              <div className="text-center">Тоо</div>
              <div>Үнэ</div>
              <div>Дүн</div>
            </div>
            {eBarimt?.receipts?.map((e, i) => {
              return (
                <div
                  className={`
                  border-b-2 border-dashed border-black ${
                    i === 0 && "border-t-2"
                  }`}
                >
                  <div className="font-bold">
                    {e.taxType === "VAT_ABLE"
                      ? "НӨАТ-тэй бараа"
                      : e.taxType === "VAT_FREE" && "НӨАТ-гүй бараа"}
                  </div>
                  {e.items.map((mur, index) => (
                    <div
                      className={`grid grid-cols-3 items-stretch justify-between border-b-2 border-dashed border-black ${
                        index === e?.items?.length - 1 && "border-b-0"
                      } `}
                      key={`${index}-zakhialga`}
                    >
                      <div className="col-span-3">/ {mur.name} /:</div>
                      <div className="text-center">{mur.qty}</div>{" "}
                      <div>{formatNumber(mur.unitPrice, 2)}</div>
                      <div>{formatNumber(mur.qty * mur.unitPrice, 2)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
            <div>
              <div>
                <br />
              </div>
            </div>
            {!!eBarimt?.khariltsagch?.id ? (
              <div>
                <div>Харилцагчийн урамшуулал</div>
                <div className="mx-2 rounded-md border border-black p-1">
                  {eBarimt?.khariltsagch?.bonus?.nemegdsen > 0 ? (
                    <div className="mt-2">
                      <div className="border-b border-dashed border-black font-semibold">
                        Бонус
                      </div>
                      <div>
                        Ашигласан:{" "}
                        {formatNumber(
                          eBarimt?.khariltsagch?.bonus?.ashiglasan || 0,
                          2
                        )}
                      </div>
                      <div>
                        Өмнөх:{" "}
                        {formatNumber(
                          eBarimt?.khariltsagch?.bonus?.umnukh || 0,
                          2
                        )}
                      </div>
                      <div>
                        Нэмэгдсэн:{" "}
                        {formatNumber(
                          eBarimt?.khariltsagch?.bonus?.nemegdsen || 0,
                          2
                        )}
                      </div>
                    </div>
                  ) : null}
                  {(eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                    "Хувь" &&
                    eBarimt?.khariltsagch?.khunglult?.khuvi > 0) ||
                  (eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                    "Мөнгөн дүн" &&
                    eBarimt?.khariltsagch?.khunglult?.dun > 0) ? (
                    <div className="mt-2">
                      <div className="border-b border-dashed border-black font-semibold">
                        Хөнгөлөлт
                      </div>
                      <div>
                        Хөнгөлөлтийн төрөл:{" "}
                        {eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul}
                      </div>
                      <div>
                        {eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                        "Хувь"
                          ? "Хөнгөлсөн хувь"
                          : "Хөнгөлсөн дүн"}
                        :{" "}
                        {eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                        "Хувь"
                          ? `${eBarimt?.khariltsagch?.khunglult?.khuvi}%`
                          : formatNumber(
                              eBarimt?.khariltsagch?.khunglult?.dun,
                              0
                            )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div>
                  <div>
                    <br />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex justify-between text-base">
              <div className="w-1/2 text-right font-bold">Нийт дүн:</div>
              <div className="text-right">
                {eBarimt.type === "B2C_INVOICE" ||
                eBarimt.type === "B2B_INVOICE"
                  ? formatNumber(
                      Number(
                        eBarimt?.amount
                          ? eBarimt?.amount
                          : eBarimt?.totalAmount || 0
                      ),
                      2
                    )
                  : formatNumber(Number(eBarimt?.totalAmount), 2)}
              </div>
            </div>
            {!!eBarimt?.khungulukhDun && (
              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">Хөнгөлсөн дүн:</div>
                <div className="text-right">
                  {formatNumber(eBarimt?.khungulukhDun || 0, 2)}
                </div>
              </div>
            )}
            <div className="flex justify-between text-base">
              <div className="w-1/2 text-right font-bold">НӨАТ-гүй дүн:</div>
              <div className="text-right">
                {formatNumber(
                  +(eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount) -
                    +(eBarimt?.vat ? eBarimt?.vat : eBarimt?.totalVAT) -
                    +(eBarimt?.cityTax
                      ? eBarimt?.cityTax
                      : eBarimt?.totalCityTax),
                  2
                )}
              </div>
            </div>
            <div className="flex justify-between text-base">
              <div className="w-1/2 text-right font-bold">НӨАТ:</div>
              <div className="text-right">
                {formatNumber(
                  eBarimt?.vat ? eBarimt?.vat : eBarimt?.totalVAT,
                  2
                )}
              </div>
            </div>
            <div className="flex justify-between text-base">
              <div className="w-1/2 text-right font-bold">Төлөх дүн:</div>
              <div className="text-right">
                {formatNumber(
                  eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount,
                  2
                )}
              </div>
            </div>
            {belneer && (
              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">Бэлэн бусаар:</div>
                <div className="text-right">
                  {turul.reduce((acc, item) => {
                    if (item.turul !== "belen" && item.une !== "") {
                      return acc + parseInt(item.une);
                    }
                    return acc;
                  }, 0)}
                </div>
              </div>
            )}
            <div className="flex items-end justify-between">
              <div className="w-1/2 text-right font-bold">
                {`Е-Баримт дүн`}:
              </div>
              <div className="text-end">
                {formatNumber(
                  eBarimt?.totalAmount
                    ? eBarimt?.totalAmount - eBarimt?.khungulukhDun
                    : eBarimt?.totalAmount,
                  2
                )}
              </div>
            </div>
            {!baiguullagaEsekh && (
              <div className="flex items-end justify-between text-base">
                <div className="w-1/2 text-right font-bold">
                  Сугалааны дугаар:
                </div>
                <div className="text-end text-base font-bold">
                  {eBarimt?.lottery}
                </div>
              </div>
            )}
            <div>
              <div>
                <div className="flex w-full justify-center p-5">
                  <div>
                    <QRCode level="L" value={eBarimt?.qrData} size={200} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    className={`flex w-full justify-end truncate font-[700] dark:text-white ${
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
              allowClear
              showSearch
              filterOption={false}
              size="large"
              bordered={false}
              className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white"
              placeholder="Салбар сонгох"
              onChange={(v) => setSongosonSalbar(v)}
            >
              {salbaruud?.map((v) => {
                return (
                  <Select.Option key={v?._id} value={v?._id}>
                    <div
                      className="flex flex-row overflow-hidden whitespace-nowrap text-gray-600  dark:bg-gray-800 dark:text-gray-300"
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
              {emzuichData?.jagsaalt?.map((a, i) => {
                return (
                  <Select.Option key={i} value={a._id}>
                    <div className="dark:bg-gray-800 dark:text-gray-300">
                      {a.ner}
                    </div>
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
                        className="flex flex-row truncate text-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
                      <div className="dark: font-bold dark:bg-gray-800 dark:text-gray-300">
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
            scroll={{ y: "calc(100vh - 31rem)", x: "10vh" }}
            dataSource={guilgeeniiTuukhGaralt?.jagsaalt || []}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: parseFloat(guilgeeniiTuukhGaralt?.khuudasniiDugaar),
              total: guilgeeniiTuukhGaralt?.niitMur,
              pageSize: guilgeeniiTuukhGaralt?.khuudasniiKhemjee,
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
                <UilgelAvya garalt={guilgeeniiTuukhGaralt} columns={columns} />{" "}
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
        guilgeeniiTuukhGaraltMutate={guilgeeniiTuukhGaraltMutate}
        guilgeeniiToololtMutate={guilgeeniiToololtMutate}
        token={token}
        setShaltgaan={setShaltgaan}
        shaltgaan={shaltgaan}
        setButsaahGuilgee={setButsaahGuilgee}
        butsaahGuilgee={butsaahGuilgee}
      />
    </>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default BorluulaltiinJagsaalt;
