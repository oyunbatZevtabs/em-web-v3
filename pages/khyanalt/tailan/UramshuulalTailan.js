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
  Button,
  Table as AntdTable,
} from "antd";
import local from "antd/lib/date-picker/locale/mn_MN";
import moment from "moment";
import { useAuth } from "services/auth";
import { useReactToPrint } from "react-to-print";
import formatNumber from "tools/function/formatNumber";
import { Excel } from "antd-table-saveas-excel";
// import UramshuulalDelgerengui from "components/modalBody/Uramshuulal/UramshuulalDelgerengui";
import Table from "components/ant/AntdTable";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import useData from "hooks/useData";
import useUramshuulalTailan from "hooks/tailan/useUramshuulalTailan";
import useBaraa from "hooks/useBaraa";

// const searchKeys = ["_id.ner"];

const order = { "_id.ner": 1 };

function UramshuulalTailan({ token }) {
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const [songosonTailan, setSongosonTailan] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, salbariinId } = useAuth();

  const [shineBagana, setShineBagana] = useState([]);

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

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
      code: songosonBaraa ? songosonBaraa : undefined,

      // code: ["ddsa", "dsadsa"],
    };
    return query;
  }, [ognoo, salbariinId, salbariinId, songosonBaraa]);

  const { uramshuulalGargalt, unshijBaina } = useUramshuulalTailan(
    token,
    shuult,
    undefined,
    undefined,
    order
  );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    // const styles = [
    //   {
    //     border: {
    // left: "1px solid black",
    // leftColor: "black",
    // right: "1px solid black",
    // rightColor: "black",
    // top: "1px solid black",
    // topColor: "black",
    // bottom: "1px solid black",
    // bottomColor: "black",
    //     },
    //     fill: {
    //       patternType: "solid",
    //       fgColor: "yellow",
    //       bgColor: "blue",
    //     },
    //   },
    // ];
    setLoading(true);
    await posUilchilgee(token)
      .post("/uramshuulliinDelgerenguiTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: uramshuulalGargalt?.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Урамшууллын товчоо тайлан")
          .setTHeadStyle({
            background: "ffccf8f8",
            borderColor: "ff73e6e7",
          })
          .setTBodyStyle({
            background: "FFFFFFFF",
            border: 0,
          })
          .drawCell(0, 0, {
            hMerge: 4,
            vMerge: 3,
            value: "Урамшууллын дэлгэрэнгүй тайлан",
            style: {
              bold: true,
              v: "center",
              h: "center",
            },
          })

          .addColumns([
            {
              title: `Огноо: ${moment(ognoo && ognoo[0]).format(
                "YYYY/MM/DD"
              )} - ${moment(ognoo && ognoo[1]).format("YYYY/MM/DD")}`,
              children: [
                {
                  title: "Дотоод код",
                  dataIndex: "code",
                  props: {
                    rowSpan: 10,
                  },
                  __style__: { h: "center", width: 30 },
                  render: (a) => {
                    // console.log("aaaa", a);
                    return a;
                  },
                },
                {
                  title: "Барааны нэр",
                  dataIndex: "ner",
                  __style__: { h: "left", width: 30 },
                  render: (ner) => {
                    return <div className="text-left">{ner}</div>;
                  },
                },
                {
                  title: "Худалдах үнэ",
                  dataIndex: "negjUrtug",
                  __style__: { h: "right", width: 30 },
                  render: (negjUrtug) => {
                    return formatNumber(negjUrtug || 0, 2);
                  },
                },
              ],
            },
            {
              title: `Салбар: ${salbaruud?.map((v) =>
                salbariinId === v._id ? v.ner : undefined
              )}`,
              children: [
                {
                  title: "Тоо хэмжээ",
                  dataIndex: "too",
                  __style__: { h: "center", width: 30 },
                  render: (too) => {
                    return formatNumber(too || 0, 2);
                  },
                },
                {
                  title: "Нийт үнэ",
                  dataIndex: "niitUrtug",
                  __style__: { h: "right", width: 30 },
                  render: (niitUrtug) => {
                    return formatNumber(niitUrtug);
                  },
                },
              ],
            },
          ])
          .addDataSource(data)
          .saveAs("Урамшууллын товчоо тайлан.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        aldaaBarigch(err);
        setLoading(false);
      });
  }

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center",
        align: "center",
        width: "3rem",
        summary: true,
        // fixed: "left",
        render: (text, record, index) => index + 1,
      },

      {
        title: "Дотоод код",
        dataIndex: "_id.code",
        // key: "code",
        ellipsis: true,
        align: " center",
        width: "11rem",
        render: (code, data) => {
          return <div>{data._id.code}</div>;
        },
      },

      {
        title: "Барааны нэр",
        dataIndex: "_id.ner",
        key: "ner",
        ellipsis: true,
        align: "left",
        width: "11rem",
        render: (ner, data) => {
          return <div className=" truncate text-left">{data._id.ner}</div>;
        },
      },
      {
        title: "Нэгж үнэ",
        dataIndex: "_id.negjUrtug",
        // key: "une",
        ellipsis: true,
        width: "7rem",
        render: (negjUrtug, data) => (
          <div className="text-right">
            {formatNumber(data._id.negjUrtug || 0, 2)}₮
          </div>
        ),
      },

      {
        title: "Тоо хэмжээ",
        key: "niitToo",
        dataIndex: "niitToo",
        ellipsis: true,
        align: "center",
        width: "12rem",
        render: (niitToo, data) => {
          return <div className="text-center">{niitToo}</div>;
        },
      },

      {
        title: "Нийт үнэ",
        dataIndex: "niitUrtug",
        key: "une",
        ellipsis: true,
        width: "7rem",
        render: (une) => {
          return <div className="text-right">{formatNumber(une || 0, 2)}₮</div>;
        },
      },
    ];

    return jagsaalt;
  }, [
    shineBagana,
    salbaruud,
    uramshuulalGargalt,
    salbariinId,
    ognoo,
    salbariinId,
  ]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  return (
    <Admin
      loading={loading}
      title="Урамшууллын товчоо тайлан"
      khuudasniiNer="UramshuulalTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
      // onSearch={(search) => setKhailt((a) => ({ ...a, search }))}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <div className="flex">
          <div className="flex w-full gap-2">
            {/* <Select
              showSearch
              placeholder="Урамшуулл тайлан сонгох"
              allowClear
              className="w-42 !h-[36px]  rounded-md border-[1px] border-[#4FD1C5] bg-white"
              filterOption={(a) => a}
              value={songosonTailan}
              onChange={(v) => setSongosonTailan(v)}>
              {salbaruud?.map((v) => {
                return (
                  <Select.Option key={v?._id} value={v?._id}>
                    <div
                      className="flex flex-row overflow-hidden whitespace-nowrap text-gray-600  dark:text-gray-300"
                      style={{ textOverflow: "ellipsis" }}>
                      {v?.ner}
                    </div>
                  </Select.Option>
                );
              })}
            </Select> */}
            <DatePicker.RangePicker
              locale={local}
              value={ognoo}
              onChange={setOgnoo}
              className="!h-[36px] w-64 !rounded-md bg-white"
            />

            <Select
              showSearch
              placeholder="Бараа сонгох"
              allowClear
              mode="multiple"
              className="!h-[36px] w-40  rounded-md border-[1px] border-[#4FD1C5] bg-white"
              filterOption={(a) => a}
              onChange={(v) => {
                setSongosonBaraa(v);
                v === undefined &&
                  setBaraaniiKhuudaslalt((a) => ({ ...a, search: "" }));
              }}
              onClear={() => {
                setBaraaniiKhuudaslalt({
                  khuudasniiDugaar: 1,
                  khuudasniiKhemjee: 100,
                  search: "",
                  jagsaalt: [],
                });
                baraaMutate();
              }}
              onSearch={(search) => {
                setBaraaniiKhuudaslalt((a) => ({ ...a, search }));
              }}
            >
              {baraaGaralt?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?.code} value={mur?.code}>
                    <div className="flex w-full justify-between">
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
          </div>
          <div className="ml-auto flex gap-2">
            <div className="flex h-8 gap-2">
              <Button onClick={handlePrint} className="w-28" type="gol">
                <PrinterOutlined />
                Хэвлэх
              </Button>
              <div className="dropdown h-8 w-1/2 sm:w-auto">
                <Popover
                  placement="bottom"
                  content={
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => exceleerTatya()} type="gol">
                        <DownloadOutlined className="pr-3 text-lg" />
                        <div className="pr-3">Татах</div>
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

        <div className="text-mashJijig col-span-12 mt-12 flex flex-col items-center justify-center 2xl:mt-0">
          <Table
            scroll={{ y: "calc(100vh - 17rem)" }}
            tableLayout="fixed"
            style={{
              height: "75vh",
            }}
            size="small"
            pagination={false}
            dataSource={uramshuulalGargalt || []}
            // summary={() => (
            //   <AntdTable.Summary fixed>
            //     <HulDun
            //       garalt={tailanGaralt? || []}
            //       columns={columns}
            //     />
            //   </AntdTable.Summary>
            // )}
            columns={columns}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell colSpan={1}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>

                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {e?.reduce((a, b) => a + (b?.niitToo || 0), 0)}ш
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.niitUrtug || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary>
            )}
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
                  Урамшууллын товчоо тайлан
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
                    <th className="border text-mashJijigiinJijig">
                      Дотоод код
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Барааны нэр
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Худалдах үнэ
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Тоо хэмжээ{" "}
                    </th>
                    <th className="border text-mashJijigiinJijig">Нийт үнэ</th>
                  </tr>
                </thead>
                <tbody>
                  {uramshuulalGargalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr>
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-center text-mashJijigiinJijig">
                            {mur?._id.code}
                          </td>
                          <td className="border pl-2 text-left text-mashJijigiinJijig">
                            {mur?._id.ner}
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {formatNumber(mur?._id.negjUrtug || 0, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.niitToo}
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.niitUrtug || 0, 2)}₮
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {/* <table className="ml-4 mt-4">
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
              </table> */}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default UramshuulalTailan;
