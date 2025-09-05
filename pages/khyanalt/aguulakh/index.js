import {
  DeleteOutlined,
  DownloadOutlined,
  DropboxOutlined,
  DropboxSquareFilled,
  EditOutlined,
  FormOutlined,
  MoreOutlined,
  PrinterOutlined,
  SettingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Image,
  Popconfirm,
  Popover,
  Select,
  Spin,
  Tooltip,
  message,
  notification,
} from "antd";
import Admin from "components/Admin";
import React, { useMemo, useRef, useState } from "react";
import formatNumber from "tools/function/formatNumber";
import Table from "components/ant/AntdTable";
import BaraaBurtgekh from "components/modalBody/aguulakh/baraaBurtgekh";
import useBaraa from "hooks/useBaraa";
import { useAuth } from "services/auth";
import BaraaOrlogodoh from "components/modalBody/aguulakh/baraaOrlogodoh";
import { AiOutlineEye } from "react-icons/ai";
import { BiHistory } from "react-icons/bi";
import AguulakhExcel from "components/modalBody/aguulakh/aguulakhExcel";
import BaganiinSongolt from "components/baganaNemekh";
import BaraaZasakh from "components/modalBody/aguulakh/baraaZasakh";
import UstgahdaaItgelteibainaModal from "components/modalBody/ustgahdaaItgelteibainaModal";
import _, { wrap } from "lodash";
import { useRouter } from "next/router";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import posUilchilgee, { aldaaBarigch, posUrl } from "services/posUilchilgee";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import useOrder from "tools/function/useOrder";
import { useReactToPrint } from "react-to-print";
import useAguulakhTooAvya from "hooks/useAguulakhTooAvya";
import uilchilgee from "services/uilchilgee";
import { Tabs } from "antd";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { Excel } from "antd-table-saveas-excel";

const order = { createdAt: -1 };

const shuultuud = [
  {
    key: "1",
    garchig: "Нийт бараа",
    too: "3800",
    kharuulakh: "Тоо",
    shuult: "Нийт",
  },
  // {
  //   key: "2",
  //   garchig: "Хугацаа дууссан",
  //   too: "2500",
  //   // shuult: "Хугацаа дууссан",
  // },
  // {
  //   key: "1",
  //   garchig: "Хугацаа дуусаж байгаа",
  //   too: "1300",
  //   // shuult: "Хугацаа дуусаж байгаа",
  // },
  {
    key: "2",
    garchig: "Үлдэгдэлтэй",
    too: "2700",
    kharuulakh: "Тоо",
    shuult: "Үлдэгдэл",
  },
  {
    key: "3",
    garchig: "Дууссан бараа",
    too: "1100",
    kharuulakh: "Тоо",
    shuult: "Дууссан бараа",
  },
  {
    key: "4",
    garchig: "Нийт үнэ",
    too: "2500",
    kharuulakh: "Үнэ",
    // shuult: "Нийт үнэ",
  },
  {
    key: "5",
    garchig: "Нийт өртөг үнэ",
    too: "1300",
    kharuulakh: "Үнэ",
    // shuult: "Нийт өртөг",
  },
];

const searchKeys = ["angilal"];
const emdSearchKey = [
  "tbltNameMon",
  "tbltBarCode",
  "tbltNameInter",
  "tbltNameSales",
];
const index = () => {
  const { token, baiguullagiinId, salbariinId, ajiltan } = useAuth();
  const [shineBagana, setShineBagana] = useState([]);
  const [shuult, setShuult] = useState("Нийт");
  const [ustgahBaraaniiId, setUstgahBaraaniiId] = useState();
  const [ModalBaraaZasakhModalData, setModalBaraaZasakhModalData] = useState();
  const [songogdsonBulguud, setSongogdsonBulguud] = useState([]);
  const [songogdsonTurul, setSongogdsonTurul] = useState();
  const [songogdsonKhungulult, setSongogdsonKhungulult] = useState();
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [loading, setLoading] = useState(false);
  const ToololtQuery = useMemo(() => {
    return {
      salbariinId: salbariinId,
    };
  }, [salbariinId]);
  const { aguulakhToololt, aguulakhToololtMutate } = useAguulakhTooAvya(
    token,
    ToololtQuery
  );

  const printRef = useRef(null);

  const baraaQuery = useMemo(() => {
    var query = {};
    if (songogdsonBulguud && songogdsonBulguud?.length > 0) {
      query.angilal = { $in: songogdsonBulguud };
    }
    if (!!shuult) {
      if (shuult === "Дууссан бараа") {
        query.uldegdel = { $lte: 0 };
      } else if (shuult === "Үлдэгдэл") {
        query.uldegdel = { $gt: 0 };
      }
    }
    return query;
  }, [songogdsonBulguud, shuult]);

  // const hungulultBaraaQuery = useMemo(() => {
  //   var query = {};
  //   if (songogdsonBulguud && songogdsonBulguud?.length > 0) {
  //     query.angilal = { $in: songogdsonBulguud };
  //   }
  //   if (!!hungulultShuult) {
  //     if (hungulultShuult === "Дууссан бараа") {
  //       query.uldegdel = { $lte: 0 };
  //     } else if (hungulultShuult === "Үлдэгдэл") {
  //       query.uldegdel = { $gt: 0 };
  //     }
  //   }
  //   return query;
  // }, [songogdsonBulguud, hungulultShuult]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt, isLoading } =
    useBaraa(token, baiguullagiinId, undefined, baraaQuery, order);

  // const {emdData, emdMutate}

  const query = useMemo(() => {
    return { baiguullagiinId: baiguullagiinId };
  }, [baiguullagiinId]);

  const hunglultteiEsekhQuery = useMemo(() => {
    var query = {};
    query.tbItIsDiscount = { $gt: 0 };
    return query;
  }, [query]);

  const engiinEMQuery = useMemo(() => {
    var query = {};
    if (!!songogdsonTurul) query.dispensingType = songogdsonTurul;
    if (!!songogdsonKhungulult) query.tbltIsDiscount = songogdsonKhungulult;
    return query;
  }, [query, songogdsonTurul, songogdsonKhungulult]);

  // const khunglultQuery = useMemo(()=>{
  //   var query ={};
  //   return {}
  // })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });
  const [key, setKey] = useState("1");

  const { jagsaalt, setKhuudaslalt: setAngilalKhuudaslalt } = posUseJagsaalt(
    key === "1" && "BaraaniiAngilal",
    query,
    undefined,
    undefined,
    searchKeys,
    undefined,
    undefined,
    true
  );

  const {
    data: emdData,
    mutate: emdMutate,
    setKhuudaslalt: emdSetKhuudaslalt,
  } = posUseJagsaalt(
    key === "3" && "khungulultteiEm",
    hunglultteiEsekhQuery,
    undefined,
    undefined,
    emdSearchKey,
    undefined,
    undefined,
    true
  );

  const {
    data: emdEngiinData,
    mutate: emdEngiinMutate,
    setKhuudaslalt: emdEngiinSetKhuudaslalt,
  } = posUseJagsaalt(
    key === "2" && "emdEngiinEm",
    engiinEMQuery,
    undefined,
    undefined,
    emdSearchKey,
    undefined,
    undefined,
    true
  );

  // const {
  //   jagsaalt,
  //   setKhuudaslalt: setAngilalKhuudaslalt,
  //   mutate: emdMutate,
  //   setKhuudaslalt: emdSetKhuudaslalt,
  //   data: emdData,
  // } = key === "1"
  //   ? posUseJagsaalt(
  //       "BaraaniiAngilal",
  //       query,
  //       undefined,
  //       undefined,
  //       searchKeys,
  //       undefined,
  //       undefined,
  //       true
  //     )
  //   : posUseJagsaalt(
  //       "khungulultteiEm",
  //       hunglultteiEsekhQuery,
  //       undefined,
  //       undefined,
  //       emdSearchKey,
  //       undefined,
  //       undefined,
  //       true
  //     );

  const router = useRouter();

  function orlogoruuOryo() {
    router.push("/khyanalt/aguulakh/baraaOrlogokh");
  }

  function zahialgiinTuukhKhariya() {
    router.push("/khyanalt/jagsaalt/baraaOrlogdojAvsanTuukh?e=true");
  }

  function onChangeBuleg(v) {
    setSongogdsonBulguud(v);
  }

  function salbariinBaraaTatakh(params) {
    setLoading(true);
    posUilchilgee(token)
      .post("/undsenSalbaraasBaraaniiMedeelelTatya", {
        salbariinId,
        baiguullagiinId,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          baraaMutate();
          setLoading(false);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
        baraaMutate();
      });
  }

  // const { data, setKhuudaslalt, mutate, isValidating } = posUseJagsaalt(
  //   "tsahimJor",
  //   query,
  //   order
  // );

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: <div className="dark:bg-gray-900">№</div>,
        key: "index",
        className: "text-center border-r border-gray-300",
        align: "center",
        width: "1rem",
        fixed: "left",
        render: (text, record, index) =>
          (baraaGaralt?.khuudasniiDugaar || 0) *
            (baraaGaralt?.khuudasniiKhemjee || 0) -
          (baraaGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className="text-center font-semibold">Зураг</div>,
        dataIndex: "zurgiinId",
        width: "1rem",
        ellipsis: true,
        key: "zurgiinId",
        className: "border-r border-gray-300",
        align: "center",
        render: (e) => {
          return (
            <div className="flex h-full items-center justify-center">
              <Image
                height={"34px"}
                src={!!e ? `${posUrl}/file?path=baraa/${e}` : "/drugs.svg"}
                alt=""
                preview={{
                  mask: (
                    <div className="flex items-center justify-center gap-1">
                      <AiOutlineEye className="text-black" />
                    </div>
                  ),
                }}
              />
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Нэр</div>,
        dataIndex: "ner",
        width: "3rem",
        ellipsis: true,
        key: "ner",
        align: "center",
        className: "border-r border-gray-300",
        render: (e) => {
          return (
            <Popover
              content={<div className="dark:text-white">{e}</div>}
              title={false}
              overlayClassName="text-white"
            >
              <div className="truncate">{e}</div>
            </Popover>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Бар код</div>,
        dataIndex: "barCode",
        className: "border-r border-gray-300",
        align: "center",
        ellipsis: true,
        width: "2rem",
        key: "barKod",
        render: (data) => (
          <Tooltip
            title={
              <div>
                <div className="flex items-center justify-center text-[16px] text-black">
                  {data}
                </div>
              </div>
            }
          >
            <div className="flex justify-center">
              <div className="truncate text-[14px]">{data}</div>
            </div>
          </Tooltip>
        ),
      },
      {
        title: <div className="text-center font-semibold">Дотоод код</div>,
        dataIndex: "code",
        align: "left",
        ellipsis: true,
        width: "2rem",
        key: "code",
        className: "border-r border-gray-300",
        showSorterTooltip: false,
        align: "center",
        sorter: () => 0,
      },
      {
        title: <div className={`text-center font-semibold`}>Үлдэгдэл</div>,
        dataIndex: "uldegdel",
        align: "center",
        width: "1rem",
        ellipsis: true,
        className: "border-r border-gray-300",
        showSorterTooltip: false,
        sorter: () => 0,
        key: "uldegdel",
        render: (e = 0) => {
          return (
            <div className={`${e < 0 && "text-red-500"}`}>
              {tooOronKhyazgaarliy(e, 2)}
            </div>
          );
        },
      },
      ...shineBagana,

      {
        title: <div className="text-center font-semibold">Худалдах үнэ</div>,
        dataIndex: "niitUne",
        align: "right",
        width: "1.5rem",
        ellipsis: true,
        showSorterTooltip: false,
        className: "border-r border-gray-300",
        sorter: () => 0,
        key: "niitUne",
        render: (e = 0) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: <div className="text-center font-semibold">Нийт үнэ</div>,
        dataIndex: "niitUne",
        align: "right",
        width: "1rem",
        ellipsis: true,
        className: "border-r border-gray-300",
        key: "niitUne",
        render: (e, data) => {
          return formatNumber(
            data.uldegdel ? data.niitUne * data.uldegdel : data.uldegdel,
            2
          );
          // formatNumber(
          //   (data.shirkheglekhEsekh ? data.shirkheginUne : data.niitUne) *
          //     data.uldegdel
          // ) + "₮"
        },
      },
      {
        title: () => (
          <div className="flex justify-center text-center font-semibold dark:bg-gray-900">
            <SettingOutlined />
          </div>
        ),
        key: "action",
        align: "center",
        width: "1rem",
        render: (_text, record) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="dark:bg-gray-6 00 flex w-24 flex-col space-y-2">
                    {record?.zarlagdsanEsekh === true ||
                    record?.orlogdsonEsekh === true ? null : (
                      <a
                        onClick={() => {
                          setUstgahBaraaniiId(record?._id);
                        }}
                        className="ant-dropdown-link flex w-full items-center justify-between  rounded-lg p-2 hover:bg-green-100 "
                      >
                        <DeleteOutlined
                          style={{ fontSize: "18px", color: "red" }}
                        />
                        <label className="text-[#ff0000]">Устгах</label>
                      </a>
                    )}

                    <BaraaZasakh
                      setModalBaraaZasakhModalData={
                        setModalBaraaZasakhModalData
                      }
                      baraaData={record}
                      mutate={baraaMutate}
                    />
                  </div>
                )}
              >
                <a className="flex items-center justify-center rounded-full hover:bg-gray-400">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            </div>
          );
        },
      },
    ];

    return jagsaalt;
  }, [token, shineBagana, baraaGaralt]);

  const columns2 = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "3rem",
        render: (text, record, index) =>
          (emdData?.khuudasniiDugaar || 0) * (emdData?.khuudasniiKhemjee || 0) -
          (emdData?.khuudasniiKhemjee || 0) +
          index +
          1,
      },

      {
        title: (
          <div className="text-center font-semibold">Эмийн монгол нэршил</div>
        ),
        dataIndex: "tbltNameMon",
        align: "left",
        width: "15rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "ner",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold">Эмийн ОУ-ын нэршил</div>
        ),
        dataIndex: "tbltNameInter",
        align: "left",
        width: "15rem",
        ellipsis: true,
        className: "border-r border-gray-200",
        key: "nerAngli",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold">Худалдааны нэршил</div>
        ),
        dataIndex: "tbltNameSales",
        align: "left",
        width: "15rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "salesNer",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Бар код</div>,
        dataIndex: "tbltBarCode",
        align: "center",
        width: "10rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "barKod",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Эмийн тоо</div>,
        dataIndex: "tbltSizeUnit",
        align: "center",
        className: "border-r border-gray-200",
        width: "7rem",
        ellipsis: true,
        key: "emToo",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Эмийн хэмжээ</div>,
        dataIndex: "tbltSizeMixture",
        align: "left",
        width: "7rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "emKhemjee",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Эмийн хэлбэр</div>,
        dataIndex: "tbltTypeName",
        align: "left",
        width: "7rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "emKhelber",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold">
            Эмийн ширхгийн дээд үнэ
          </div>
        ),
        dataIndex: "tbltUnitPrice",
        text: "wrap",
        align: "right",
        className: "border-r border-gray-200",
        width: "10rem",
        ellipsis: true,
        key: "emKhelber",
        render: (e) => {
          return <div className="truncate">{e} ₮</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Хөнгөлөх дүн</div>,
        dataIndex: "tbltUnitDisAmt",
        align: "right",
        width: "10rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        key: "khungulultDun",
        render: (e) => {
          return <div className="truncate">{e} ₮</div>;
        },
      },
      // {
      //   title: (
      //     <div className="text-center font-semibold">Хүчинтэй хугацаа</div>
      //   ),
      //   dataIndex: "tbItLifeDate",
      //   align: "left",
      //   width: "15rem",
      //   ellipsis: true,
      //   key: "emKhugatsaa",
      //   render: (e) => {
      //     return { e };
      //   },
      // },
      // {
      //   title: (
      //     <div className="text-center font-semibold">Хөнгөлөлтийн хувь</div>
      //   ),
      //   dataIndex: "tbItDiscountPerc",
      //   align: "right",
      //   width: "7rem",
      //   ellipsis: true,
      //   showSorterTooltip: false,
      //   sorter: () => 0,
      //   key: "khungulultKhuvi",
      //   render: (e) => {
      //     return <div className="truncate">{e}</div>;
      //   },
      // },

      // {
      //   title: (
      //     <div className="text-center font-semibold">Үнийн дээд хязгаар</div>
      //   ),
      //   dataIndex: "tbItMaxPrice",
      //   align: "right",
      //   width: "7rem",
      //   ellipsis: true,
      //   key: "uniinDeed",
      //   render: (e) => {
      //     return { e };
      //     // formatNumber(
      //     //   (data.shirkheglekhEsekh ? data.shirkheginUne : data.niitUne) *
      //     //     data.uldegdel
      //     // ) + "₮"
      //   },
      // },
      // {
      //   title: (
      //     <div className="text-center font-semibold">Эмийн багцын дугаар</div>
      //   ),
      //   dataIndex: "packGroup",
      //   align: "right",
      //   width: "7rem",
      //   ellipsis: true,
      //   key: "packGroup",
      //   render: (e) => {
      //     return { e };
      //   },
      // },
    ];

    return jagsaalt;
  }, [token, shineBagana, emdData]);

  const columns3 = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "2rem",
        render: (text, record, index) =>
          (emdData?.khuudasniiDugaar || 0) * (emdData?.khuudasniiKhemjee || 0) -
          (emdData?.khuudasniiKhemjee || 0) +
          index +
          1,
      },

      {
        title: (
          <div className="text-center font-semibold">Эмийн монгол нэршил</div>
        ),
        dataIndex: "tbltNameMon",
        align: "left",
        width: "8rem",
        ellipsis: true,
        className: "border-r border-gray-200",
        key: "ner",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold">Эмийн ОУ-ын нэршил</div>
        ),
        dataIndex: "tbltNameInter",
        align: "left",
        className: "border-r border-gray-200",
        width: "8rem",
        ellipsis: true,
        key: "nerAngli",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold">Худалдааны нэршил</div>
        ),
        dataIndex: "tbltNameSales",
        align: "left",
        className: "border-r border-gray-200",
        width: "8rem",
        ellipsis: true,
        key: "salesNer",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Бар код</div>,
        dataIndex: "tbltBarCode",
        align: "center",
        width: "6rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "barKod",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Төрөл</div>,
        dataIndex: "dispensingType",
        align: "center",
        width: "5rem",
        ellipsis: true,
        className: "border-r border-gray-200",
        key: "emKhelber",
        render: (e) => {
          return (
            <div className="truncate">{e === "Жороор" ? "Жортой" : e}</div>
          );
        },
      },
      {
        title: (
          <div className="text-center font-semibold">Хөнгөлөлттэй эсэх</div>
        ),
        dataIndex: "tbltIsDiscount",
        align: "center",
        className: "border-r border-gray-200",
        width: "5rem",
        ellipsis: true,
        key: "tbltIsDiscount",
        render: (e) => {
          return <div className="truncate">{e === 1 ? "Тийм" : "Үгүй"}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Эмийн хэмжээ</div>,
        dataIndex: "tbltSizeMixture",
        align: "left",
        width: "5rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "emKhemjee",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Эмийн хэлбэр</div>,
        dataIndex: "tbltTypeName",
        align: "left",
        width: "5rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "tbltTypeName",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Үйлдвэр</div>,
        dataIndex: "tbltManufacture",
        align: "left",
        width: "5rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        key: "tbltManufacture",
        render: (e) => {
          return <div className="truncate">{e}</div>;
        },
      },
    ];

    return jagsaalt;
  }, [token, shineBagana, emdEngiinData]);

  const [popoverOngoison, setPopoverOngoison] = useState(false);

  const items = [
    {
      key: "1",
      label: <div className="">Агуулах</div>,
      children: (
        <div className="col-span-12 flex flex-col gap-4">
          <div className="grid h-fit w-full grid-cols-1 place-items-center gap-6 md:grid-cols-3 xl:grid-cols-5">
            {shuultuud.map((item) => {
              return (
                <div
                  onClick={() => !!item.shuult && setShuult(item.shuult)}
                  className={`col-span-1 ${
                    !!item.shuult && "cursor-pointer"
                  } flex w-full flex-col items-start justify-center rounded-lg border border-[#4FD1C5] p-4 shadow-lg ${
                    shuult === item.shuult && "bg-[#4FD1C5] bg-opacity-10"
                  }`}
                >
                  <div className="font-[500] text-gray-400">{item.garchig}</div>
                  <div className="flex w-full justify-end gap-[4px]">
                    <div className="font-thin text-gray-400">
                      {item.kharuulakh}:
                    </div>
                    <div className="font-[700] dark:text-gray-300">
                      {item.garchig === "Нийт бараа"
                        ? aguulakhToololt?.[0]?.niitToo || 0
                        : item.garchig === "Үлдэгдэлтэй"
                        ? aguulakhToololt?.[0]?.uldegdeltei || 0
                        : item.garchig === "Дууссан бараа"
                        ? aguulakhToololt?.[0]?.uldegdelgui || 0
                        : item.garchig === "Нийт үнэ"
                        ? formatNumber(aguulakhToololt?.[0]?.niitUne, 2)
                        : item.garchig === "Нийт өртөг үнэ"
                        ? formatNumber(aguulakhToololt?.[0]?.niitUrtug, 2)
                        : 0}
                    </div>
                  </div>
                  <div></div>
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-col flex-wrap justify-end gap-2 sm:flex-row">
            <div className="mr-auto flex w-full justify-center gap-2  sm:w-fit ">
              <Select
                onChange={(v) => onChangeBuleg(v)}
                placeholder="Барааны ангилал"
                showSearch
                mode="multiple"
                className="h-9 w-48 overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white "
                filterOption={(o) => o}
                allowClear={true}
                onClear={() => {
                  setAngilalKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: "",
                  }));
                }}
                loading={!jagsaalt}
                onSearch={(v) =>
                  setAngilalKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: v,
                  }))
                }
              >
                {jagsaalt?.map((mur) => {
                  return (
                    <Select.Option
                      key={mur?._id}
                      value={mur?.angilal}
                      className="dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <div className={`flex justify-start`}>
                        <div className="font-bold">{mur?.angilal}</div>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
              <div className="w-fit">
                <Button
                  onClick={zahialgiinTuukhKhariya}
                  className="w-full gap-2"
                  type="gol"
                >
                  <BiHistory />
                  Орлогын жагсаалт
                </Button>
              </div>
            </div>

            <div className="w-full overflow-x-auto sm:w-28">
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: (
                      <div className="text-center font-semibold">Ангилал</div>
                    ),
                    dataIndex: "angilal",
                    key: "angilal",
                    align: "left",
                    width: "1rem",
                    className: "border-r border-gray-300",
                    render: (e) => {
                      return (
                        <Popover
                          content={<div className="dark:text-white">{e}</div>}
                          title={false}
                          overlayClassName="text-white"
                        >
                          <div className="truncate">{e}</div>
                        </Popover>
                      );
                    },
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">Цуврал</div>
                    ),
                    dataIndex: "tsuvraliinDugaartaiEsekh",
                    key: "tsuvraliinDugaartaiEsekh",
                    align: "center",
                    className: "border-r border-gray-300",
                    width: "1rem",
                    render: (e) => {
                      return e ? <div>Тийм</div> : <div>Үгүй</div>;
                    },
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">
                        Богино нэр
                      </div>
                    ),
                    dataIndex: "boginoNer",
                    key: "boginoNer",
                    align: "center",
                    width: "1.5rem",
                    className: "border-r border-gray-300",
                    render: (boginoNer) => (
                      <div className="truncate">{boginoNer}</div>
                    ),
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">НӨАТ</div>
                    ),
                    dataIndex: "noatBodohEsekh",
                    key: "noatiinDun",
                    align: "center",
                    className: "border-r border-gray-300",
                    width: "2rem",
                    render: (e) => {
                      return e ? <div>Тийм</div> : <div>Үгүй</div>;
                    },
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">
                        Нэгж өртөг
                      </div>
                    ),
                    dataIndex: "urtugUne",
                    key: "urtugUne",
                    align: "right",
                    showSorterTooltip: false,
                    className: "border-r border-gray-300",
                    sorter: () => 0,
                    width: "1.5rem",
                    render: (e) => {
                      return <div>{formatNumber(e, 2)}</div>;
                    },
                  },
                  {
                    title: (
                      <div className="text-center font-semibold">
                        Хайрцаг дахь/ш
                      </div>
                    ),
                    dataIndex: "negKhairtsaganDahiShirhegiinToo",
                    key: "negKhairtsaganDahiShirhegiinToo",
                    align: "center",
                    showSorterTooltip: false,
                    className: "border-r border-gray-300",
                    sorter: () => 0,
                    width: "2rem",
                    render: (e) => {
                      return <div>{tooOronKhyazgaarliy(e, 2)}</div>;
                    },
                  },
                ]}
              />
            </div>
            <div className="w-full sm:w-28">
              <Popover
                trigger={"click"}
                placement="bottom"
                open={popoverOngoison}
                onOpenChange={(v) => setPopoverOngoison(v)}
                content={
                  <div
                    onClick={() => setPopoverOngoison(false)}
                    className="flex flex-col gap-2 dark:text-gray-200"
                  >
                    <div>
                      <BaraaBurtgekh
                        aguulakhToololtMutate={aguulakhToololtMutate}
                        mutate={baraaMutate}
                      />
                    </div>
                    {/* <div>
                          <BaraaOrlogodoh
                            aguulakhToololtMutate={aguulakhToololtMutate}
                            mutate={baraaMutate}
                          />
                        </div> */}
                    <div>
                      <Button onClick={orlogoruuOryo} type="gol">
                        <InboxOutlined className="text-sm" />
                        Орлого
                      </Button>
                    </div>
                  </div>
                }
              >
                <Button className="w-full sm:w-28" type="primary">
                  <DropboxOutlined />
                  Бараа
                </Button>
              </Popover>
            </div>
            <div className="w-full sm:w-28">
              <AguulakhExcel
                aguulakhToololtMutate={aguulakhToololtMutate}
                baraaGaralt={baraaGaralt}
                aguulahMutate={baraaMutate}
                baraaQuery={baraaQuery}
              />
            </div>
            <div className="w-full sm:w-28">
              <Button onClick={handlePrint} className="w-full" type="gol">
                <PrinterOutlined />
                Хэвлэх
              </Button>
            </div>
          </div>
          <div className="h-[70vh]">
            <Table
              className={"h-[40vh]"}
              scroll={{ y: "calc(100vh - 23rem)", x: "10vh" }}
              columns={columns}
              unshijBaina={loading}
              dataSource={baraaGaralt?.jagsaalt}
              emptyText={
                baraaGaralt?.jagsaalt?.length === 0 &&
                salbariinId !== baiguullagiinId ? (
                  <div>
                    <Button
                      loading={loading}
                      onClick={() => salbariinBaraaTatakh()}
                      icon={<DownloadOutlined />}
                    >
                      Үндсэн салбараас бараа татах
                    </Button>
                  </div>
                ) : (
                  <div>Агуулах хоосон байна</div>
                )
              }
              tableLayout="fixed"
              onChange={onChangeTable}
              rowKey={(row) => row._id}
              rowClassName={(record, index) =>
                record?.idevkhteiEsekh === false ? "text-red-400" : ""
              }
              pagination={{
                current: baraaGaralt?.khuudasniiDugaar,
                pageSize: baraaGaralt?.khuudasniiKhemjee,
                total: baraaGaralt?.niitMur,
                pageSizeOptions: [
                  "10",
                  "50",
                  "100",
                  "250",
                  "500",
                  "1000",
                  "2000",
                ],
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setBaraaniiKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
          <div className="hidden">
            <div ref={printRef}>
              <table className="w-full">
                <thead>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">№</th>
                    <th className="border text-mashJijigiinJijig">Нэр</th>
                    <th className="border text-mashJijigiinJijig">Бар код</th>
                    <th className="border text-mashJijigiinJijig">
                      Дотоод код
                    </th>
                    <th className="border text-mashJijigiinJijig">Үлдэгдэл</th>
                    <th className="border text-mashJijigiinJijig">
                      Худалдах үнэ
                    </th>
                    <th className="border text-mashJijigiinJijig">Нийт үнэ</th>
                  </tr>
                </thead>
                <tbody>
                  {baraaGaralt?.jagsaalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr>
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-mashJijigiinJijig">
                            {mur?.ner}
                          </td>
                          <td className="border text-mashJijigiinJijig">
                            {mur?.barCode}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {mur?.code}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.uldegdel || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.niitUne || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(
                              mur.uldegdel
                                ? mur.niitUne * mur.uldegdel
                                : mur.uldegdel,
                              2
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: <div className="">Эмийн жагсаалт</div>,
      children: (
        <div className="col-span-12 flex flex-col gap-4">
          <div className="h-full">
            <div className="mb-3 flex w-full">
              <div className="flex w-full justify-start gap-4">
                <Select
                  className="w-full rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200 md:w-36"
                  placeholder="Төрөл"
                  allowClear
                  onChange={(v) => setSongogdsonTurul(v)}
                >
                  <Select.Option value={"Жороор"}>Жортой</Select.Option>
                  <Select.Option value={"Жоргүй"}>Жоргүй</Select.Option>
                  <Select.Option value={"Эмнэлгийн нөхцөлд хэрэглэнэ"}>
                    Эмнэлгийн нөхцөлд хэрэглэнэ
                  </Select.Option>
                </Select>
                <Select
                  className="w-full rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200 md:w-36"
                  placeholder="Хөнгөлөлт"
                  allowClear
                  onChange={(v) => setSongogdsonKhungulult(v)}
                >
                  <Select.Option value={1}>Тийм</Select.Option>
                  <Select.Option value={0}>Үгүй</Select.Option>
                </Select>
              </div>
              <div className="flex justify-end gap-4">
                <Button onClick={() => !loading && exceleerTatya()} type="gol">
                  <DownloadOutlined className="pr-3 text-lg" />
                  <div className="pr-3">Татах</div>
                </Button>
                <Button
                  onClick={() => !loading && emdEngiinDataRefresh()}
                  className="w-full justify-end"
                  type="gol"
                >
                  Мэдээлэл татах
                </Button>
              </div>
            </div>
            <Table
              scroll={{ x: "calc(100px + 50%)", y: "calc(100vh - 18rem)" }}
              columns={columns3}
              unshijBaina={loading}
              dataSource={emdEngiinData?.jagsaalt}
              emptyText={
                emdEngiinData?.jagsaalt?.length === 0 && (
                  <div>Агуулах хоосон байна</div>
                )
              }
              tableLayout="fixed"
              onChange={onChangeTable}
              rowKey={(row) => row._id}
              rowClassName={(record, index) =>
                record?.idevkhteiEsekh === false ? "text-red-400" : ""
              }
              pagination={{
                current: emdEngiinData?.khuudasniiDugaar,
                pageSize: emdEngiinData?.khuudasniiKhemjee,
                total: emdEngiinData?.niitMur,
                pageSizeOptions: ["10", "50", "100", "250", "500"],
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  emdEngiinSetKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: <div className="">ЭМД</div>,
      children: (
        <div className="col-span-12 flex flex-col gap-4">
          <div className="h-full">
            <div className="mb-3 flex w-full flex-col flex-wrap justify-end gap-4 sm:flex-row">
              <Button onClick={() => !loading && exceleerTatyaEMD()} type="gol">
                <DownloadOutlined className="pr-3 text-lg" />
                <div className="pr-3">Татах</div>
              </Button>
              <Button
                onClick={() => !loading && emdKhunglultiinDataRefresh()}
                type="gol"
              >
                Мэдээлэл татах
              </Button>
            </div>
            <Table
              scroll={{ x: "calc(100px + 50%)", y: "calc(100vh - 18rem)" }}
              columns={columns2}
              unshijBaina={loading}
              dataSource={emdData?.jagsaalt}
              emptyText={
                emdData?.jagsaalt?.length === 0 && (
                  <div>Агуулах хоосон байна</div>
                )
              }
              tableLayout="fixed"
              onChange={onChangeTable}
              rowKey={(row) => row._id}
              rowClassName={(record, index) =>
                record?.idevkhteiEsekh === false ? "text-red-400" : ""
              }
              pagination={{
                current: emdData?.khuudasniiDugaar,
                pageSize: emdData?.khuudasniiKhemjee,
                total: emdData?.niitMur,
                pageSizeOptions: ["10", "50", "100", "250", "500"],
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  emdSetKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const onChange = (key) => {
    setKey(key);
  };

  function emdEngiinDataRefresh() {
    setLoading(true);
    posUilchilgee(token)
      .post("/EMYEngiinEmJagsaaltAvya")
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай татлаа");
          emdEngiinMutate();
          setLoading(false);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  }

  function emdKhunglultiinDataRefresh() {
    setLoading(true);
    posUilchilgee(token)
      .post("/EMYKhunglultiinJagsaaltAvya")
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай татлаа");
          emdMutate();
          setLoading(false);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  }

  function exceleerTatya() {
    setLoading(true);
    const excel = new Excel();
    posUilchilgee(token)
      .get("/emdEngiinEm", {
        params: {
          query: {
            ...engiinEMQuery,
          },
          order: order,
          khuudasniiKhemjee: emdEngiinData?.niitMur,
        },
      })
      .then(({ data }) => {
        excel
          .addSheet("Эмийн жагсаалт")
          .addColumns([
            {
              title: "Эмийн монгол нэршил",
              dataIndex: "tbltNameMon",
              key: "tbltNameMon",
            },
            {
              title: "Эмийн ОУ-ын нэршил",
              dataIndex: "tbltNameInter",
              key: "tbltNameInter",
            },
            {
              title: "Худалдааны нэршил",
              dataIndex: "tbltNameSales",
              key: "tbltNameSales",
            },
            {
              title: "Бар код",
              dataIndex: "tbltBarCode",
              key: "tbltBarCode",
              __style__: { h: "center" },
            },
            {
              title: "Төрөл",
              dataIndex: "dispensingType",
              key: "dispensingType",
              __style__: { h: "center" },
              render: (e) => {
                return e === "Жороор" ? "Жортой" : e;
              },
            },
            {
              title: "Хөнгөлөлттэй эсэх",
              dataIndex: "tbltIsDiscount",
              key: "tbltIsDiscount",
              __style__: { h: "center" },
              render: (e) => {
                return e === 1 ? "Тийм" : "Үгүй";
              },
            },
            {
              title: "Эмийн хэмжээ",
              dataIndex: "tbltSizeMixture",
              key: "tbltSizeMixture",
            },
            {
              title: "Эмийн хэлбэр",
              dataIndex: "tbltTypeName",
              key: "tbltTypeName",
            },
            {
              title: "Үйлдвэр",
              dataIndex: "tbltManufacture",
              key: "tbltManufacture",
            },
          ])
          .addDataSource(data?.jagsaalt)
          .saveAs("ЭмийнЖагсаалт.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        aldaaBarigch(err);
      });
  }

  function exceleerTatyaEMD() {
    setLoading(true);
    const excel = new Excel();
    posUilchilgee(token)
      .get("/khungulultteiEm", {
        params: {
          query: {
            ...hunglultteiEsekhQuery,
          },
          order: order,
          khuudasniiKhemjee: emdData?.niitMur,
        },
      })
      .then(({ data }) => {
        excel
          .addSheet("Хөнгөлөлттэй эм")
          .addColumns([
            {
              title: "Эмийн монгол нэршил",
              dataIndex: "tbltNameMon",
              key: "tbltNameMon",
            },
            {
              title: "Эмийн ОУ-ын нэршил",
              dataIndex: "tbltNameInter",
              key: "tbltNameInter",
            },
            {
              title: "Худалдааны нэршил",
              dataIndex: "tbltNameSales",
              key: "tbltNameSales",
            },
            {
              title: "Бар код",
              dataIndex: "tbltBarCode",
              key: "tbltBarCode",
              __style__: { h: "center" },
            },
            {
              title: "Эмийн тоо",
              dataIndex: "tbltSizeUnit",
              key: "tbltSizeUnit",
              __style__: { h: "center" },
            },
            {
              title: "Эмийн хэмжээ",
              dataIndex: "tbltSizeMixture",
              key: "tbltSizeMixture",
            },
            {
              title: "Эмийн хэлбэр",
              dataIndex: "tbltTypeName",
              key: "tbltTypeName",
            },
            {
              title: "Эмийн ширхгийн дээд үнэ",
              dataIndex: "tbltUnitPrice",
              key: "tbltUnitPrice",
              __style__: { h: "right" },
            },
            {
              title: "Хөнгөлөх дүн",
              dataIndex: "tbltUnitDisAmt",
              key: "tbltUnitDisAmt",
              __style__: { h: "right" },
            },
          ])
          .addDataSource(data?.jagsaalt)
          .saveAs("ХөнгөлөлттэйЭм.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        aldaaBarigch(err);
      });
  }

  return (
    <Admin
      loading={isLoading}
      khuudasniiNer={"baraaMatrial"}
      className={"p-4"}
      title={"Агуулах"}
      onClear={() => {
        if (key === "1") {
          setBaraaniiKhuudaslalt((e) => ({
            ...e,
            search: "",
            khuudasniiDugaar: 1,
          }));
        } else if (key === "2") {
          emdEngiinSetKhuudaslalt((e) => ({
            ...e,
            search: "",
            khuudasniiDugaar: 1,
            field,
          }));
        } else if (key === "3") {
          emdSetKhuudaslalt((e) => ({
            ...e,
            search: "",
            khuudasniiDugaar: 1,
            field,
          }));
        }
      }}
      onSearch={(search) => {
        if (key === "1") {
          setBaraaniiKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        } else if (key === "2") {
          emdEngiinSetKhuudaslalt((kh) => ({
            ...kh,
            search,
            khuudasniiDugaar: 1,
          }));
        } else if (key === "3") {
          emdSetKhuudaslalt((kh) => ({ ...kh, search, khuudasniiDugaar: 1 }));
        }
      }}
    >
      <Tabs
        tabPosition="top"
        size="large"
        animated
        className="col-span-12"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
      <UstgahdaaItgelteibainaModal
        url={"baraaUstgay"}
        ustgahBaraaniiId={ustgahBaraaniiId}
        setUstgahBaraaniiId={setUstgahBaraaniiId}
        baraaMutate={baraaMutate}
      />
    </Admin>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default index;
