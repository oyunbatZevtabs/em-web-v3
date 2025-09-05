import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  Select,
  Dropdown,
  Menu,
  Spin,
  Popover,
  Checkbox,
  Button,
  Table as AntdTable,
} from "antd";
import local from "antd/lib/date-picker/locale/mn_MN";
import moment from "moment";
import { useAuth } from "services/auth";
import { useReactToPrint } from "react-to-print";
import formatNumber from "tools/function/formatNumber";
import { Excel } from "antd-table-saveas-excel";

import BaganiinSongolt from "components/baganaNemekh";
import Table from "components/ant/AntdTable";
import OrlogoZarlagaDelegrengui from "components/modalBody/tailan/baraaMatrial/OrlogoZarlagaDelegrengui";
import useEmdKhungulult from "hooks/tailan/useEmdKhungulult";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import useTailan from "hooks/tailan/useTailan";
import useData from "hooks/useData";
import useBaraa from "hooks/useBaraa";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import useOrder from "tools/function/useOrder";

const searchBaraaKeys = [
  "ebarimtDetails.code",
  "ebarimtDetails.barCode",
  "ebarimtDetails.ner",
  "ebarimtDetails.productName",
];
const searchKeys = ["patientRegNo", "patientFirstName", "patientLastName"];
const order = { createdAt: -1 };

function HulDun({ garalt, columns }) {
  const [uldegdel, setUldegdel] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setUldegdel(uldegdel + 1);
    }, 500);
  }, [garalt, columns]);

  return (
    <AntdTable.Summary.Row>
      {columns.map((mur, index) => {
        const totalSum =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        return (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align={mur.title === "Тоо" ? "center" : "right"}
          >
            {mur.summary ? (
              mur.title === "Жорын №" ? (
                <div className="truncate text-left">Нийт</div>
              ) : (
                tooOronKhyazgaarliy(totalSum, 2)
              )
            ) : (
              ""
            )}
          </AntdTable.Summary.Cell>
        );
      })}
    </AntdTable.Summary.Row>
  );
}
function EmdKhungulultTailan({ token }) {
  const [shineBagana, setShineBagana] = useState([]);
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const { order: orderTailan, onChangeTable } = useOrder({ createdAt: -1 });
  const [loading, setLoading] = useState(false);
  const [turul, setTurul] = useState("baraa");

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  // const onChange = (e) => {
  //   setHuraanguiExcelTatakh(e);
  // };

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
    if (!!salbariinId) {
      query.salbariinId = salbariinId;
    } else query.salbariinId = "shuuhgui";
    return query;
  }, [salbariinId, baiguullagiinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId ? salbariinId : undefined,
      baiguullagiinId: baiguullagiinId,
      code: songosonBaraa?.length > 0 ? songosonBaraa : undefined,
      turul: turul,
    };
    return query;
  }, [ognoo, salbariinId, songosonBaraa, turul]);

  const { tailanGaralt, unshijBaina, setTailanKhuudaslalt } = useEmdKhungulult(
    token,
    shuult,
    undefined,
    turul === "baraa" ? searchBaraaKeys : searchKeys,
    orderTailan
  );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    setLoading(true);
    const excel = new Excel();

    excel
      .addSheet("Бараа")
      .addColumns([
        {
          title: "Үзүүлэлт",
          dataIndex: "_id",
          render: (id) => {
            return turul === "baraa"
              ? id?.baraaCode +
                  ", " +
                  id?.baraaBarCode +
                  ", " +
                  id?.baraaProductName
              : id?.patientRegNo +
                  ", " +
                  id?.patientFirstName +
                  ", " +
                  id?.patientLastName;
          },
        },
        {
          title: "CIP №",
          dataIndex: "_id",
          __style__: { h: "center" },
          render: (id) => {
            return id?.cipherCode;
          },
        },
        {
          title: "Онон",
          dataIndex: "_id",
          render: (id) => {
            return id?.receiptDiag;
          },
        },
        {
          title: "ЭМБайгууллага",
          dataIndex: "_id",
          render: (id) => {
            return id?.hosName;
          },
        },
        {
          title: "Жорын №",
          dataIndex: "_id",
          __style__: { h: "center" },
          render: (id) => {
            return id?.receiptNumber;
          },
        },
        {
          title: "Тоо",
          dataIndex: "quantity",
          __style__: { h: "center" },
          render: (quantity) => {
            return formatNumber(quantity || 0, 2);
          },
        },
        {
          title: "Нийт дүн",
          dataIndex: "niitAmt",
          __style__: { h: "right" },
          render: (niitAmt) => {
            return formatNumber(niitAmt || 0, 2);
          },
        },
        {
          title: "Хөнгөлөлт",
          dataIndex: "niitInsAmt",
          __style__: { h: "right" },
          render: (niitInsAmt) => {
            return formatNumber(niitInsAmt || 0, 2);
          },
        },
        {
          title: "Цэвэр дүн",
          dataIndex: "netNiitAmt",
          __style__: { h: "right" },
          render: (a) => {
            return formatNumber(a || 0, 2);
          },
        },
      ])
      .addDataSource(tailanGaralt)
      .saveAs("ЭМД-н хөнгөлөлтийн тайлан.xlsx");
    setLoading(false);
  }

  const columns = useMemo(() => {
    var tempColumn = [
      turul === "baraa"
        ? {
            title: "Үзүүлэлт",
            dataIndex: "_id",
            className: "text-mashJijig border-r border-gray-200",
            width: "16rem",
            maxWidth: "24rem",
            align: "left",
            ellipsis: true,
            render: (a) => {
              return (
                <div className="flex justify-start truncate">
                  {a?.baraaCode +
                    ", " +
                    a?.baraaBarCode +
                    ", " +
                    a?.baraaProductName}
                </div>
              );
            },
          }
        : {
            title: "Үзүүлэлт",
            dataIndex: "_id",
            className: "text-mashJijig border-r border-gray-200",
            width: "16rem",
            maxWidth: "24rem",
            align: "left",
            ellipsis: true,
            render: (a) => {
              return (
                <div className="flex justify-start truncate">
                  {a?.patientRegNo +
                    ", " +
                    a?.patientFirstName +
                    ", " +
                    a?.patientLastName}
                </div>
              );
            },
          },
    ];
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "50px",
        fixed: "center",
        render: (text, record, index) => index + 1,
      },
      ...tempColumn,
      ...shineBagana,
      {
        title: "Жор",
        dataIndex: ["_id", "receiptNumber"],
        width: "5rem",
        className: "text-mashJijig border-r border-gray-200",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (e) => {
          return <div className="flex justify-start">{e}</div>;
        },
      },
      {
        title: "Тоо",
        dataIndex: "quantity",
        className: "text-mashJijig border-r border-gray-200",
        width: "5rem",
        key: "quantity",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        ellipsis: true,
        align: "center",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: "Нийт дүн",
        dataIndex: "niitAmt",
        className: "text-mashJijig border-r border-gray-200",
        width: "5rem",
        key: "niitAmt",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        ellipsis: true,
        align: "right",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: "Хөнгөлөлт",
        dataIndex: "niitInsAmt",
        className: "text-mashJijig border-r border-gray-200",
        width: "5rem",
        key: "niitInsAmt",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        ellipsis: true,
        align: "right",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: "Цэвэр дүн",
        dataIndex: "netNiitAmt",
        className: "text-mashJijig",
        width: "5rem",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        ellipsis: true,
        align: "right",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
    ];
    // jagsaalt = [...jagsaalt];
    return jagsaalt;
  }, [shineBagana, salbaruud, tailanGaralt, salbariinId, ognoo, salbariinId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  const davtagdashguiKeyUusgey = (id, index) => {
    return `${id.id}-${index}`;
  };

  return (
    <Admin
      loading={loading}
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      title="ЭМД-н хөнгөлөлтийн тайлан"
      khuudasniiNer="EmdKhungulultTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <div className="grid w-full grid-cols-2 gap-2  lg:flex">
          <DatePicker.RangePicker
            locale={local}
            value={ognoo}
            onChange={setOgnoo}
            className="!h-[36px] w-64 !rounded-md bg-white"
          />
          <Select
            value={turul}
            showSearch
            allowClear
            placeholder="Төрөл"
            className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white"
            onChange={(value) => {
              setTurul(value);
              setSongosonBaraa([]);
              setTailanKhuudaslalt({
                khuudasniiDugaar: 1,
                khuudasniiKhemjee: 100,
                search: "",
                jagsaalt: [],
              });
            }}
          >
            <Select.Option key={"baraa"}>Бүтээгдэхүүн</Select.Option>
            <Select.Option key={"uilchluulegch"}>Үйлчлүүлэгч</Select.Option>
          </Select>
          {turul == "baraa" ? (
            <Select
              showSearch
              placeholder="Бараа сонгох"
              className="!h-[36px] w-48 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800"
              allowClear
              mode="multiple"
              value={songosonBaraa}
              filterOption={(o) => o}
              onClear={() => {
                setBaraaniiKhuudaslalt({
                  khuudasniiDugaar: 1,
                  khuudasniiKhemjee: 100,
                  search: "",
                  jagsaalt: [],
                });
                setTailanKhuudaslalt({
                  khuudasniiDugaar: 1,
                  khuudasniiKhemjee: 100,
                  search: "",
                  jagsaalt: [],
                });
                baraaMutate();
              }}
              onChange={(v) => {
                setSongosonBaraa(v);
                v === undefined &&
                  setBaraaniiKhuudaslalt((a) => ({ ...a, search: "" }));
              }}
              onSearch={(search) => {
                setBaraaniiKhuudaslalt((a) => ({ ...a, search }));
              }}
              onSelect={() => {
                setTailanKhuudaslalt({
                  khuudasniiDugaar: 1,
                  khuudasniiKhemjee: 100,
                });
              }}
            >
              {baraaGaralt?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?.code} value={mur?.code}>
                    <div className="flex w-full justify-between dark:bg-gray-800">
                      <div
                        className="flex flex-row truncate text-gray-600  dark:text-gray-300 dark:bg-gray-800"
                        style={{ textOverflow: "ellipsis" }}
                      >
                        {mur?.ner}- {mur?.code}
                      </div>
                      <div className="flex  justify-end truncate font-semibold">
                        {mur?.id}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          ) : (
            ""
          )}
          <div className="ml-auto flex gap-2">
            <div className="flex h-8 gap-2">
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: "Салбар",
                    dataIndex: ["_id", "salbariinId"],
                    key: ["_id", "salbariinId"],
                    width: "150px",
                    className: "text-mashJijig",
                    ellipsis: true,
                    align: "center",
                    render: (b) => {
                      return (
                        <div className="flex justify-start">
                          {salbaruud?.find((a) => b === a._id)?.ner}
                        </div>
                      );
                    },
                  },
                  {
                    title: "CIP №",
                    dataIndex: ["_id", "cipherCode"],
                    key: ["_id", "cipherCode"],
                    width: "80px",
                    className: "text-mashJijig",
                    ellipsis: true,
                    align: "center",
                    render: (cipherCode) => (
                      <div className="flex justify-start">{cipherCode}</div>
                    ),
                  },
                  {
                    title: "Онош",
                    dataIndex: ["_id", "receiptDiag"],
                    key: ["_id", "receiptDiag"],
                    width: "150px",
                    className: "text-mashJijig",
                    ellipsis: true,
                    align: "left",
                    render: (b) => {
                      return <div className="flex justify-start">{b}</div>;
                    },
                  },
                  {
                    title: "ЭМБайгууллага",
                    dataIndex: ["_id", "hosName"],
                    key: ["_id", "hosName"],
                    width: "150px",
                    className: "text-mashJijig",
                    ellipsis: true,
                    align: "left",
                    render: (b) => {
                      return <div className="flex justify-start">{b}</div>;
                    },
                  },
                ]}
              />
              <Button onClick={handlePrint} className="w-28" type="gol">
                <PrinterOutlined />
                Хэвлэх
              </Button>
              <div className="dropdown h-8 w-1/2 sm:w-auto">
                <Popover
                  placement="bottom"
                  content={
                    <div className="flex flex-col gap-4">
                      {/* <div className="flex items-center justify-center gap-2 self-baseline">
                        <Checkbox
                          className="flex flex-row-reverse"
                          onChange={onChange}>
                          <div className="dark:text-gray-50">Хураангүй</div>
                        </Checkbox>
                      </div> */}
                      <Button
                        onClick={() => exceleerTatya()}
                        className="dark:border-green-500 dark:bg-gray-900 dark:text-gray-300"
                      >
                        <DownloadOutlined className="pr-3 text-lg dark:text-[#4fd1c5]" />
                        <div className="pr-3 dark:text-[#4fd1c5]">Татах</div>
                      </Button>
                    </div>
                  }
                  title={false}
                  trigger="click"
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <Button className="w-28" type="gol">
                    <FileExcelOutlined className="text-sm" />
                    Excel
                  </Button>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div className="text-mashJijig col-span-12  flex items-center justify-center 2xl:mt-0">
          <Table
            scroll={{ y: "calc(100vh - 18rem)" }}
            tableLayout="fixed"
            unshijBaina={unshijBaina}
            onChange={onChangeTable}
            rowKey={(row) => row._id}
            size="small"
            pagination={false}
            dataSource={tailanGaralt || []}
            summary={() => (
              <AntdTable.Summary fixed>
                <HulDun garalt={tailanGaralt || []} columns={columns} />
              </AntdTable.Summary>
            )}
            columns={columns}
          />
          <div className="hidden">
            <div ref={printRef}>
              <div className="flex w-full items-center justify-between text-sm">
                <div className="w-1/3 text-left text-sm">
                  {ognoo ? (
                    <div>
                      Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")}-{" "}
                      {moment(ognoo[1]).format("YYYY-MM-DD")}
                    </div>
                  ) : (
                    <div>{""}</div>
                  )}
                </div>
                <div className="w-1/3 text-center text-sm font-bold">
                  ЭМД-н хөнгөлөлтийн тайлан
                </div>
                <div className="w-1/3 text-right text-sm">
                  {salbariinId ? (
                    <div>
                      Салбар:{" "}
                      {
                        baiguullaga?.salbaruud?.find(
                          (a) => a?._id === salbariinId
                        )?.ner
                      }
                    </div>
                  ) : (
                    <div>{""}</div>
                  )}
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">№</th>
                    <th className="border text-mashJijigiinJijig">Үзүүлэлт</th>
                    <th className="border text-mashJijigiinJijig">CIP №</th>
                    <th className="border text-mashJijigiinJijig">Онош</th>
                    <th className="border text-mashJijigiinJijig">
                      ЭМБайгууллага
                    </th>
                    <th className="border text-mashJijigiinJijig">Жорын №</th>
                    <th className="border text-mashJijigiinJijig">Тоо</th>
                    <th className="border text-mashJijigiinJijig">Нийт дүн</th>
                    <th className="border text-mashJijigiinJijig">Хөнгөлөлт</th>
                    <th className="border text-mashJijigiinJijig">Цэвэр дүн</th>
                  </tr>
                </thead>
                <tbody>
                  {tailanGaralt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr className="border">
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-left text-mashJijigiinJijig">
                            {turul === "baraa"
                              ? mur?._id?.baraaCode +
                                ", " +
                                mur?._id?.baraaBarCode +
                                ", " +
                                mur?._id?.baraaProductName
                              : mur?._id?.patientRegNo +
                                ", " +
                                mur?._id?.patientFirstName +
                                ", " +
                                mur?._id?.patientLastName}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?._id?.cipherCode}
                          </td>
                          <td className="border text-left text-mashJijigiinJijig">
                            {mur?._id?.receiptDiag}
                          </td>
                          <td className="border text-left text-mashJijigiinJijig">
                            {mur?._id?.hosName}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?._id?.receiptNumber}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.quantity, 2)}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.niitAmt, 2)}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.niitInsAmt, 2)}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.netNiitAmt, 2)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                  <tr className="border">
                    <td className="border text-center text-mashJijigiinJijig font-bold">
                      Нийт
                    </td>
                    <td
                      colSpan={5}
                      className="border text-center text-mashJijigiinJijig"
                    ></td>
                    <td className="border text-center text-mashJijigiinJijig font-bold">
                      {formatNumber(
                        tailanGaralt?.reduce(
                          (a, b) => a + (b?.quantity || 0),
                          0
                        ),
                        2
                      )}
                    </td>
                    <td className="border text-right text-mashJijigiinJijig font-bold">
                      {formatNumber(
                        tailanGaralt?.reduce(
                          (a, b) => a + (b?.niitAmt || 0),
                          0
                        ),
                        2
                      )}
                    </td>
                    <td className="border text-right text-mashJijigiinJijig font-bold">
                      {formatNumber(
                        tailanGaralt?.reduce(
                          (a, b) => a + (b?.niitInsAmt || 0),
                          0
                        ),
                        2
                      )}
                    </td>
                    <td className="border text-right text-mashJijigiinJijig font-bold">
                      {formatNumber(
                        tailanGaralt?.reduce(
                          (a, b) => a + (b?.netNiitAmt || 0),
                          0
                        ),
                        2
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="ml-4 mt-4">
                <tfoot>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Тайлан гаргасан:
                    </td>
                    <td>
                      ................................/
                      {ajiltan?.ovog && ajiltan?.ovog[0]}
                      {ajiltan?.ovog && "."}
                      {ajiltan?.ner}/
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Хянасан нягтлан бодогч:
                    </td>
                    <td> ................................</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default EmdKhungulultTailan;
