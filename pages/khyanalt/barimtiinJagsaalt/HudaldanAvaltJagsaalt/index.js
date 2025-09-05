import { DatePicker, Popover, Table as AntdTable, Select } from "antd";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import formatNumber from "tools/function/formatNumber";
import {
  SettingOutlined,
  EyeOutlined,
  FilterOutlined,
  CheckOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useAuth } from "services/auth";
import Table from "components/ant/AntdTable";
import moment from "moment";
import BaraOrlogdojAvsanDelgerengui from "components/modalBody/aguulakh/baraaOrlogdojAvsanTuukh/baraaOrlogdojAvsandelgerengui";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import { MdOutlineArrowBack } from "react-icons/md";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import Butsaalt from "components/modalBody/aguulakh/baraaOrlogdojAvsanTuukh/butsaalt";
import { IoReturnUpBack } from "react-icons/io5";
import ShaltgaanModal from "components/modalBody/orlogiinTuukh/shalgtaanModal/shineButsaalt.js";

import {
  BiDownArrow,
  BiDownArrowAlt,
  BiEditAlt,
  BiUpArrowAlt,
} from "react-icons/bi";
import { useRouter } from "next/router";
import Khariltsagch from "pages/khyanalt/khariltsagch";
import useOrder from "tools/function/useOrder";
import AldaaAlert from "components/alert/AldaaAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { Button } from "components/ant/AntdButton";
import _ from "lodash";

// const searchKeys = [
//   "khariltsagchiinNer",
//   "baraanuud.ner",
//   "baraanuud.code",
//   "baraanuud.barCode",
// ];

function turulHurwuulelt(turul) {
  switch (turul) {
    case "belen":
      return "Бэлэн";
    case "zeel":
      return "Зээл";
  }
}

// const searchKeysNiiluulegch = ["ner", "ovog", "utas", "mail", "register"];

function HudaldanAvaltiinJagsaalt({
  data,
  khariltsagchData,
  setOgnoo,
  ognoo,
  khariltsagchOnSearch,
  onChangeTable,
  token,
  khariltsagchiinId,
  setKhariltsagchiinId,
  setShuult,
  shuult,
  mutate,
}) {
  const [baraOrlogdojAvsanDelgerenguiModal, setBaraOrlogdojAvsanDelgerengui] =
    useState();
  const [baraaniiKhariltsagch, setBaraaniiKhariltsagch] = useState();
  // const [tuukhData, setTuukhData] = useState();
  const [zasakhData, setZasakhData] = useState();
  const [khelber, setKhelber] = useState();
  // const { order, onChangeTable } = useOrder({ ognoo: -1, createdAt: -1 });
  const router = useRouter();
  const params = router.query.e;
  const { baiguullaga, salbariinId, baiguullagiinId, ajiltan } = useAuth();

  const zasakh = (id) => {
    router.push(`/khyanalt/aguulakh/baraaOrlogokh?params=${id}`);
  };

  function orlogoruuOryo() {
    router.push("/khyanalt/aguulakh/baraaOrlogokh");
  }

  // const queryAguulakh = useMemo(() => {
  //   const qeury = {
  //     baiguullagiinId: baiguullagiinId,
  //     khariltsagchiinId: { $exists: true },
  //     salbariinId: salbariinId,
  //     zassanEsekh: { $ne: true },
  //     turul: { $nin: ["act", "busadZarlaga"] },
  //     ognoo: !!ognoo
  //       ? {
  //           $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
  //           $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
  //         }
  //       : undefined,
  //   };
  //   if (!!khariltsagchiinId) {
  //     qeury.khariltsagchiinId = khariltsagchiinId;
  //   }
  //   if (!!shuult) {
  //     if (shuult === "Засагдсан") {
  //       qeury.turul = "Орлого засвар";
  //       qeury.tsutsalsanOgnoo = { $exists: false };
  //     } else if (shuult === "Буцаасан") {
  //       qeury.ursgaliinTurul = "zarlaga";
  //       qeury.tsutsalsanOgnoo = { $exists: false };
  //     } else if (shuult === "Буцаалттай") {
  //       qeury.butsaagdsanEsekh = true;
  //     } else if (shuult === "Хэвийн") {
  //       qeury.butsaagdsanEsekh = { $ne: true };
  //       qeury.tsutsalsanOgnoo = { $exists: false };
  //       qeury.ursgaliinTurul = { $ne: "zarlaga" };
  //       qeury.turul = { $nin: ["Орлого засвар", "act", "busadZarlaga"] };
  //     } else if (shuult === "Цуцлагдсан") {
  //       qeury.$and = [
  //         { butsaagdsanEsekh: { $ne: true } },
  //         { tsutsalsanOgnoo: { $exists: true } },
  //       ];
  //     }
  //   }
  //   return qeury;
  // }, [baiguullagiinId, salbariinId, ognoo, shuult, khariltsagchiinId]);

  // const {
  //   data,
  //   setKhuudaslalt: setBaraaOrlogdokhKhuudaslalt,
  //   mutate,
  //   isValidating,
  // } = posUseJagsaalt(
  //   "/orlogoZarlagiinTuukh",
  //   queryAguulakh,
  //   order,
  //   undefined,
  //   searchKeys
  // );

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        key: "index",
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "3rem",
        fixed: "left",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className="w-full text-center font-semibold">Огноо</div>,
        dataIndex: "ognoo",
        showSorterTooltip: false,
        className: "border-r border-gray-200",
        align: "center",
        key: "ognoo",
        width: "80px",
        sorter: (a, b) => 0,
        render: (e) => {
          return moment(e).format("YYYY-MM-DD, HH:mm");
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Ажилтан</div>,
        dataIndex: "ajiltan",
        align: "left",
        key: "ajiltan",
        className: "border-r border-gray-200",
        width: "100px",
        render(mur) {
          return (
            <div className="flex flex-row space-x-2">
              <div>{mur?.ner}</div>
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Харилцагч</div>,
        dataIndex: "khariltsagchiinNer",
        align: "left",
        key: "khariltsagchiinNer",
        width: "100px",
        className: "border-r border-gray-200",
        render(text) {
          return <div>{text}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Тоо хэмжээ</div>,
        dataIndex: "ajiltan",
        align: "left",
        key: "too",
        className: "border-r border-gray-200",
        width: "80px",
        showSorterTooltip: false,
        sorter: () => 0,
        render(mur, data) {
          return (
            <div className="flex flex-row space-x-2">
              <div>
                {formatNumber(
                  data.baraanuud.reduce((a, b) => a + (b?.too || 0), 0),
                  2
                )}
              </div>
            </div>
          );
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Нийт үнэ</div>,
        dataIndex: "baraanuud",
        align: "right",
        key: "niitUne",
        width: "80px",
        className: "border-r border-gray-200",
        showSorterTooltip: false,
        sorter: () => 0,
        render(baraanuud) {
          return (
            <div>
              {formatNumber(
                baraanuud.reduce(
                  (acc, item) => acc + (item.urtugUne || 1) * (item.too || 1),
                  0
                ),
                2
              )}
            </div>
          );
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Хэлбэр</div>,
        dataIndex: "khelber",
        align: "center",
        className: "border-r border-gray-200",
        key: "khelber",
        width: "80px",
        render(text, data) {
          return (
            <div className="flex flex-col px-7">
              {text && (
                <div className="flex justify-between gap-2">
                  <div>{turulHurwuulelt(text)}</div>
                  <div>
                    {formatNumber(
                      data?.baraanuud?.reduce(
                        (acc, item) =>
                          acc + (item.urtugUne || 1) * (item.too || 1),
                        0
                      ),
                      2
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <div className="flex items-center justify-center gap-2 text-center font-semibold">
            Төлөв{" "}
            <Popover
              placement="bottom"
              content={
                <div className="flex flex-col">
                  {[
                    "Хэвийн",
                    "Засагдсан",
                    "Буцаасан",
                    "Буцаалттай",
                    "Цуцлагдсан",
                  ].map((garchig, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() =>
                          setShuult(shuult === garchig ? false : garchig)
                        }
                        className={` my-1 flex w-32 cursor-pointer select-none items-center justify-between rounded-[10px] border-[1px] border-[#4FD1C5] p-1 px-3 font-semibold hover:bg-[#4fd1c43b]`}
                      >
                        {garchig}
                        <div
                          className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] ${
                            shuult === garchig && "bg-[#4FD1C5]"
                          }`}
                        >
                          {shuult === garchig && (
                            <CheckOutlined
                              style={{ color: "white" }}
                              className="text-[8px]"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            >
              <div
                onClick={() => !!shuult && setShuult(false)}
                className={`cursor-pointer text-lg ${
                  shuult !== false && "text-green-500"
                }`}
              >
                <FilterOutlined />
              </div>
            </Popover>
          </div>
        ),
        dataIndex: "tsutsalsanOgnoo",
        align: "center",
        className: "border-r border-gray-200",
        key: "khariltsagchiinNer",
        width: "4rem",
        render(text, record) {
          return (
            <div className="flex w-full justify-center font-medium">
              {record.ursgaliinTurul === "zarlaga" ? (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-gray-900 bg-opacity-50 p-1 px-2 text-white">
                  Буцаасан
                </div>
              ) : record.butsaagdsanEsekh === true ? (
                <div
                  className={`flex w-32 items-center justify-center gap-1 rounded-lg 
                   bg-yellow-600 p-1 px-2 text-white`}
                >
                  Буцаалттай
                </div>
              ) : !record.tsutsalsanOgnoo &&
                record.turul === "Орлого засвар" ? (
                <div
                  className={`flex w-32 items-center justify-center gap-1 rounded-lg bg-green-600  p-1 px-2 text-white`}
                >
                  Засагдсан
                </div>
              ) : !text ? (
                <div
                  className={`flex w-32 items-center justify-center gap-1 rounded-lg 
                      bg-green-600
                  p-1 px-2 text-white`}
                >
                  Хэвийн
                </div>
              ) : (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-red-600 p-1 px-2 text-white">
                  цуцлагдсан
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Төрөл</div>,
        dataIndex: "ursgaliinTurul",
        align: "center",
        className: "border-r border-gray-200",
        key: "khariltsagchiinNer",
        width: "4rem",
        render(text) {
          var turul = "";
          switch (text) {
            case "orlogo":
              turul = "Орлого";
              break;
            case "zarlaga":
              turul = "Буцаалт";
              break;
            default:
              break;
          }
          return (
            <div className="flex w-full justify-center font-medium">
              {text === "orlogo" ? (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-green-600 p-1 px-2 text-white">
                  <BiDownArrowAlt />
                  {turul}
                </div>
              ) : (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-red-600 p-1 px-2 text-white">
                  <BiUpArrowAlt />
                  {turul}
                </div>
              )}
            </div>
          );
        },
      },
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
              {!record.tsutsalsanOgnoo && record.ursgaliinTurul === "orlogo" ? (
                <div className="flex w-fit items-center justify-center">
                  <a
                    onClick={() => {
                      setBaraOrlogdojAvsanDelgerengui(record?.baraanuud),
                        setBaraaniiKhariltsagch(record?.khariltsagchiinNer),
                        setKhelber(record?.khelber);
                    }}
                    className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                  >
                    <EyeOutlined
                      style={{ fontSize: "18px", color: "#4fc1d5" }}
                    />
                  </a>
                  <Popover
                    placement="bottom"
                    trigger="hover"
                    content={() => (
                      <div className="flex w-fit flex-col space-y-2">
                        <ShaltgaanModal
                          orlogiinTuukhKhGaraltMutate={mutate}
                          token={token}
                          // setTuukhData={setTuukhData}
                          tuukhData={record}
                        />
                        {/* <a
                          onClick={() => {
                            setTuukhData({
                              ...record,
                              butsaaltiinTuluv: "Бараа сонгох",
                            });
                          }}
                          className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
                          <label className="text-[#4fc1d5]">
                            Бараа сонгож буцаах
                          </label>
                        </a>
                        <a
                          onClick={() =>
                            setTuukhData({
                              ...record,
                              butsaaltiinTuluv: "Бүгд",
                            })
                          }
                          className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
                          <label className="text-[#4fc1d5]">
                            Бүх барааг буцаах
                          </label>
                        </a> */}
                      </div>
                    )}
                  >
                    <a className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100">
                      <IoReturnUpBack
                        style={{ fontSize: "18px", color: "#4fc1d5" }}
                      />
                    </a>
                  </Popover>
                  <a
                    onClick={() => {
                      // AnkhaaruulgaAlert("Шинэчлэлт хийгдэж байна");
                      zasakh(record._id);
                      // setZasakhData(record);
                    }}
                    className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                  >
                    <BiEditAlt style={{ fontSize: "18px", color: "#4fc1d5" }} />
                    {/* <label className='text-[#4fc1d5]'>Дэлгэрэнгүй</label> */}
                  </a>
                </div>
              ) : (
                <div className="flex justify-center">
                  <a
                    onClick={() => {
                      setBaraOrlogdojAvsanDelgerengui(record?.baraanuud),
                        setBaraaniiKhariltsagch(record?.khariltsagchiinNer);
                    }}
                    className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                  >
                    <EyeOutlined
                      style={{ fontSize: "18px", color: "#4fc1d5" }}
                    />
                    {/* <label className='text-[#4fc1d5]'>Дэлгэрэнгүй</label> */}
                  </a>
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [shuult, data?.jagsaalt]);

  const KhariltsagchQuery = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      turul: "Нийлүүлэгч",
    }),
    [baiguullagiinId]
  );

  // const {
  //   data: KhariltsagchData,
  //   setKhuudaslalt,
  //   onSearch,
  // } = posUseJagsaalt(
  //   "/khariltsagch",
  //   KhariltsagchQuery,
  //   order,
  //   undefined,
  //   searchKeysNiiluulegch,
  //   undefined,
  //   undefined
  // );

  const goBack = () => {
    window.history.go(-1);
  };

  function UilgelAvya({ garalt, columns, shuult }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);
    let totalSum = 0;
    let totalShirkeh = 0;
    if (garalt?.length > 0) {
      for (const array of garalt) {
        for (const obj of array.baraanuud) {
          const product = (obj.too || 1) * (obj.urtugUne || 1);
          if (shuult !== "Буцаасан" && array.ursgaliinTurul === "zarlaga") {
            totalShirkeh -= obj.too || 0;
            totalSum -= product;
          } else if (
            !array.tsutsalsanOgnoo ||
            array.butsaagdsanEsekh === true ||
            shuult === "Цуцлагдсан"
          ) {
            totalShirkeh += obj.too || 0;
            totalSum += product;
          }
        }
      }
    }
    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            key={index}
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right"
          >
            {mur.summary ? (
              mur.key === "niitUne" ? (
                formatNumber(totalSum, 2) + " ₮"
              ) : mur.key === "ognoo" ? (
                <div className="flex items-center justify-start">Нийт</div>
              ) : (
                <div className="text-left">
                  {tooOronKhyazgaarliy(totalShirkeh, 2) + "ш"}
                </div>
              )
            ) : (
              ""
            )}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

  // async function test(turul) {
  //   await setTuukhData((e) => ({ ...e, turul }));
  //   setModalOngoikh(true);
  // }

  return (
    <>
      <div className="col-span-12 flex flex-col gap-2">
        <div className="my-2 flex w-full items-center justify-between">
          {params && (
            <div className="w-8 ">
              <MdOutlineArrowBack
                onClick={goBack}
                className="cursor-pointer text-xl"
              />
            </div>
          )}
          <div className="flex w-full items-center justify-start ">
            <DatePicker.RangePicker
              className="!h-[36px] w-64 !rounded-md bg-white"
              format={"YYYY-MM-DD"}
              placeholder={["Эхлэх огноо", "Дуусах огноо"]}
              disabledTime
              value={ognoo}
              onChange={(v) => setOgnoo(v)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={orlogoruuOryo} type="gol">
              <InboxOutlined className="text-sm" />
              Орлого
            </Button>
            <Select
              bordered={false}
              value={khariltsagchiinId}
              onChange={(v) => {
                setKhariltsagchiinId(v);
              }}
              placeholder="Нийлүүлэгч сонгох"
              className="w-[200px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white  "
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onSearch={(v) =>
                setKhuudaslalt((e) => ({
                  ...e,
                  khuudasniiDugaar: 1,
                  search: v,
                }))
              }
            >
              {khariltsagchData?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur._id}>
                    <div className={`flex justify-start `}>
                      <div className="font-bold dark:text-gray-300">
                        {mur.ner}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div>
          <Table
            scroll={{ y: "calc(100vh - 20rem)", x: "calc(20vw - 25rem)" }}
            dataSource={data?.jagsaalt}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: parseFloat(data?.khuudasniiDugaar),
              pageSize: data?.khuudasniiKhemjee,
              total: data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setBaraaOrlogdokhKhuudaslalt((umnukh) => ({
                  ...umnukh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            summary={() => (
              <AntdTable.Summary fixed>
                <UilgelAvya
                  garalt={data?.jagsaalt && data?.jagsaalt}
                  columns={columns}
                  shuult={shuult}
                />{" "}
              </AntdTable.Summary>
            )}
          />
        </div>
        <BaraOrlogdojAvsanDelgerengui
          setKhelber={setKhelber}
          khelber={khelber}
          baraaniiKhariltsagch={baraaniiKhariltsagch}
          setBaraOrlogdojAvsanDelgerengui={setBaraOrlogdojAvsanDelgerengui}
          baraOrlogdojAvsanDelgerenguiModal={baraOrlogdojAvsanDelgerenguiModal}
          ajiltan={ajiltan}
          ognoo={ognoo}
        />
      </div>
    </>
  );
}

export default HudaldanAvaltiinJagsaalt;
