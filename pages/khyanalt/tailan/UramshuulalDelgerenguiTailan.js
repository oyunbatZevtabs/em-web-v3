import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { Children, useEffect, useMemo, useRef, useState } from "react";
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
// import useUramshuulalDelgerengui from "hooks/tailan";
import useUramshuulalDelgerengui from "hooks/tailan/useUramshuulalDelgerengui";
import useBaraa from "hooks/useBaraa";

const order = { createdAt: -1 };

function UramshuulalDelgerenguiTailan({ token }) {
  const [songosonBaraa, setSongosonBaraa] = useState([]);
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
    };
    return query;
  }, [ognoo, salbariinId, salbariinId, songosonBaraa]);

  const { uramshuulalGaralt, unshijBaina } = useUramshuulalDelgerengui(
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
    setLoading(true);
    await posUilchilgee(token)
      .post("/uramshuulliinDelgerenguiTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: uramshuulalGaralt?.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Урамшууллын дэлгэрэнгүй тайлан")
          .setTHeadStyle({
            background: "ffccf8f8",
            borderColor: "ff73e6e7",
          })
          .setTBodyStyle({
            background: "FFFFFFFF",
            border: 0,
          })
          .drawCell(0, 0, {
            hMerge: 7,
            vMerge: 3,
            value: "Урамшууллын товчоо тайлан",
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
              __style__: {
                border: 0,
                background: "ffffffff",
              },
              children: [
                {
                  title: "Огноо",
                  dataIndex: "ognoo",
                  render: (_id, data) => {
                    return (
                      <div>{moment(data?._id?.ognoo).format("YYYY-MM-DD")}</div>
                    );
                  },
                },
                {
                  title: "БДугаар",
                  dataIndex: "barimtiinDugaar",
                  render: (a) => {
                    // console.log("aaaa", a);
                    return a;
                  },
                },
                {
                  title: "Дотоод код",
                  dataIndex: "code",
                  __style__: { h: "left", width: 30 },
                  render: (a) => {
                    // console.log("aaaa", a);
                    return a;
                  },
                },
                {
                  title: "Барааны нэр",
                  dataIndex: "ner",
                  __style__: { h: "left" },
                  render: (ner) => {
                    return <div className="text-left">{ner}</div>;
                  },
                },
              ],
            },

            {
              title: `Салбар: ${salbaruud?.map((v) =>
                salbariinId === v._id ? v.ner : undefined
              )}`,
              __style__: {
                border: 0,
                background: "ffffffff",
              },
              children: [
                {
                  title: "Нэгж үнэ",
                  dataIndex: "negjUrtug",
                  __style__: { h: "right" },
                  render: (a) => {
                    return formatNumber(a || 0, 2);
                  },
                },
                {
                  title: "Тоо хэмжээ",
                  dataIndex: "too",
                  __style__: { h: "center" },
                  render: (too) => {
                    return formatNumber(too || 0, 2);
                  },
                },
                {
                  title: "Нийт үнэ",
                  dataIndex: "niitUrtug",
                  __style__: { h: "right" },
                  render: (butsaaltiinDun) => {
                    return formatNumber(butsaaltiinDun || 0, 2);
                  },
                },
                {
                  title: "Урамшууллын нэр",
                  dataIndex: "uramshuulal",
                  __style__: { h: "center" },
                  render: (uramshuulal, data) => {
                    return <div>{data.uramshuulal[0]}</div>;
                  },
                },
              ],
            },
          ])
          .addDataSource(data)
          .saveAs("Урамшууллын дэлгэрэнгүй тайлан.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        // aldaaBarigch(err);
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
        title: "Огноо",
        dataIndex: "ognoo",
        ellipsis: true,
        width: "125px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (ner) => {
          return <div>{moment(ner).format("YYYY-MM-DD")}</div>;
        },
      },
      {
        title: "БДугаар",
        dataIndex: "barimtiinDugaar",
        key: "code",
        ellipsis: true,
        align: "center",
        width: "11rem",
        render: (barimtiinDugaar, data) => {
          return <div className="text-center">{barimtiinDugaar}</div>;
        },
      },
      {
        title: "Дотоод код",
        dataIndex: "code",
        key: "code",
        ellipsis: true,
        width: "11rem",
        align: "center",
        render: (code) => {
          return <div className="text-center">{code}</div>;
        },
      },
      {
        title: "Барааны нэр",
        dataIndex: "ner",
        key: "ner",
        ellipsis: true,
        width: "11rem",
        render: (ner) => {
          return <div className=" truncate text-left">{ner}</div>;
        },
      },
      {
        title: "Нэгж үнэ",
        dataIndex: "negjUrtug",
        key: "une",
        ellipsis: true,
        width: "7rem",
        render: (une) => {
          return <div className="text-right">{formatNumber(une || 0, 2)}₮</div>;
        },
      },
      {
        title: "Тоо хэмжээ",
        dataIndex: "too",
        key: "too",
        ellipsis: true,
        width: "7rem",
        align: "center",
        // className: " text-center",
        render: (too) => {
          return <div className="text-center">{too}</div>;
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
      {
        title: "Урамшууллын нэр",
        dataIndex: "uramshuulal",
        ellipsis: true,
        width: "12rem",
        render: (uramshuulal) => {
          return <div className=" truncate text-center">{uramshuulal[0]}</div>;
        },
      },
    ];

    return jagsaalt;
  }, [
    shineBagana,
    salbaruud,
    uramshuulalGaralt,
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
      title="Урамшууллын дэлгэрэнгүй тайлан"
      khuudasniiNer="UramshuulalDelgerenguiTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <div className="flex">
          <div className="flex w-full gap-2">
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
            dataSource={uramshuulalGaralt || []}
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
                <AntdTable.Summary.Cell colSpan={2}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>

                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {e?.reduce((a, b) => a + (b?.too || 0), 0)}ш
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
                  Урамшууллын дэлгэрэнгүй тайлан
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
                    <th className="border text-mashJijigiinJijig">Огноо</th>
                    <th className="border text-mashJijigiinJijig">БДугаар</th>
                    <th className="border text-mashJijigiinJijig">
                      Дотоод код
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Барааны нэр
                    </th>
                    <th className="border text-mashJijigiinJijig">Нэгж үнэ</th>
                    <th className="border text-mashJijigiinJijig">
                      Тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">Нийт үнэ</th>
                    <th className="border text-mashJijigiinJijig">
                      Урамшууллын нэр
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uramshuulalGaralt?.map((mur, index) => {
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
                            {mur?.ognoo}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.barimtiinDugaar}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.code}
                          </td>
                          <td className="border pl-2 text-left text-mashJijigiinJijig">
                            {mur?.ner}
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.negjUrtug || 0, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.too}
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.niitUrtug || 0, 2)}₮
                          </td>
                          <td className="border pl-2 text-left text-mashJijigiinJijig">
                            {mur?.uramshuulal[0]}
                          </td>
                          {/* <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.borluulaltiinNoat || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.niitBorluulalt, 2)}
                          </td> */}
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

export default UramshuulalDelgerenguiTailan;
