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
  Tooltip,
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
import useBaraaMaterialiinTailan from "hooks/tailan/useBaraaMaterialiinTailan";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import useTailan from "hooks/tailan/useTailan";
import useData from "hooks/useData";
import useBaraa from "hooks/useBaraa";
import useButsaaltiinTailan from "hooks/tailan/useButsaaltiinTailan";

const searchKeys = [
  "baraanuud.baraa.code",
  "baraanuud.baraa.ner",
  "baraanuud.baraa.barCode",
];

const order = { createdAt: -1 };

function ButsaaltTailan({ token }) {
  const [shineBagana, setShineBagana] = useState([]);
  const [songosonBaraa, setSongosonBaraa] = useState([]);

  const [excelUnshijBaina, setExcelUnshijBaina] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
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
      code: songosonBaraa?.length > 0 ? songosonBaraa : undefined,
    };
    return query;
  }, [ognoo, salbariinId, songosonBaraa, salbariinId]);

  const { tailanGaralt, unshijBaina, setTailanKhuudaslalt } =
    useButsaaltiinTailan(token, shuult, undefined, searchKeys);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    setExcelUnshijBaina(true);
    await posUilchilgee(token)
      .post("/butsaaltiinTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: tailanGaralt.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Буцаалт")
          .addColumns([
            {
              title: "Огноо",
              dataIndex: "ognoo",
              render: (ognoo) => {
                return ognoo;
              },
            },
            {
              title: "Төрөл",
              dataIndex: "turul",
              render: (turul) => {
                return turul;
              },
            },
            {
              title: "Баримтын дугаар",
              dataIndex: "barimtiinDugaar",
            },
            {
              title: "Барааны нэр",
              dataIndex: "ner",
            },
            {
              title: "Дотоод код",
              dataIndex: "code",
            },
            {
              title: "Бар код",
              dataIndex: "barCode",
            },
            {
              title: "Буцаалтын тоо хэмжээ",
              dataIndex: "too",
              render: (too) => {
                return formatNumber(too || 0, 2);
              },
            },
            {
              title: "Нэгж үнэ",
              dataIndex: "negjUne",
              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0, 2);
              },
            },
            {
              title: "Буцаалтын дүн",
              dataIndex: "butsaaltiinDun",
              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0, 2);
              },
            },
            {
              title: "Буцаалтын НӨАТ",
              dataIndex: "butsaaltiinNoat",
              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0, 2);
              },
            },
            {
              title: "Нийт дүн",
              dataIndex: "butsaaltiinDun",
              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0, 2);
              },
            },
          ])
          .addDataSource(data?.jagsaalt)
          .saveAs("БуцаалтТайлан.xlsx");
        setExcelUnshijBaina(false);
      })
      .catch((err) => {
        aldaaBarigch(err);
        setExcelUnshijBaina(false);
      });
  }

  const columns = useMemo(() => {
    var jagsaalt = [
        {
          title: "№",
          key: "index",
          className: "text-center border-r border-gray-200",
          align: "center",
          width: "3rem",
          fixed: "left",
          render: (text, record, index) =>
            (tailanGaralt?.khuudasniiDugaar || 0) *
              (tailanGaralt?.khuudasniiKhemjee || 0) -
            (tailanGaralt?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Огноо",
          key: "urtug",
          dataIndex: "ognoo",
          className: "text-mashJijig border-r border-gray-200",
          width: "8rem",
          ellipsis: true,
          align: "center",
          render: (ognoo) => {
            return (
              <div className="flex">
                {moment(ognoo).format("YYYY-MM-DD HH:mm")}
              </div>
            );
          },
        },
        {
          title: "Төрөл",
          key: "turul",
          dataIndex: "turul",
          className: "text-mashJijig border-r border-gray-200",
          width: "5rem",
          ellipsis: true,
          align: "center",
          render: (turul) => {
            return <div className="flex justify-center">{turul}</div>;
          },
        },
        {
          title: "Баримтын дугаар",
          dataIndex: "barimtiinDugaar",
          width: "10rem",
          className: "text-mashJijig border-r border-gray-200",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return <div className="flex justify-start">{b}</div>;
          },
        },
        {
          title: "Барааны нэр",
          dataIndex: "ner",
          width: "10rem",
          className: "text-mashJijig border-gray-200",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return <div className="flex justify-start">{b}</div>;
          },
        },
        {
          title: "Дотоод код",
          dataIndex: "code",
          className: "text-mashJijig border-r border-gray-200",
          width: "10rem",
          align: "center",
          ellipsis: true,
          render: (a) => {
            return <div className="flex justify-start truncate">{a}</div>;
          },
        },
      ],
      jagsaalt = [...jagsaalt, ...shineBagana];
    jagsaalt.push(
      {
        title: "Бар код",
        className: "text-mashJijig border-r border-gray-200",
        dataIndex: "barCode",
        width: "10rem",
        ellipsis: true,
        align: "center",
        render: (e) => {
          return <div className="text-left">{e}</div>;
        },
      },
      {
        title: "Буцаалтын тоо хэмжээ",
        className: "text-mashJijig border-r border-gray-200",
        dataIndex: "too",
        width: "10rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a, data) => {
          return <div>{formatNumber(a, 2)}</div>;
        },
      },
      {
        title: "Нэгж үнэ",
        dataIndex: "negjUne",
        className: "text-mashJijig border-r border-gray-200",
        width: "10rem",
        ellipsis: true,
        align: "center",
        render: (negjUne) => {
          return <div className="text-right">{formatNumber(negjUne, 2)}</div>;
        },
      },
      {
        title: "Буцаалтын дүн",
        dataIndex: "butsaaltiinDun",
        className: "text-mashJijig border-r border-gray-200",
        width: "10rem",
        ellipsis: true,
        render: (e) => {
          return <div className="text-right">{formatNumber(e, 2)}</div>;
        },
      },
      {
        title: "Буцаалтын НӨАТ ",
        key: "butsaaltiinNoat",
        dataIndex: "butsaaltiinNoat",
        className: "text-mashJijig border-r border-gray-200",
        width: "10rem",
        ellipsis: true,
        align: "center",
        render: (butsaaltiinNoat) => {
          return (
            <div className="flex justify-end">
              {formatNumber(butsaaltiinNoat, 2)}
            </div>
          );
        },
      },
      {
        title: "Нийт дүн",
        key: "butsaaltiinDun",
        dataIndex: "butsaaltiinDun",
        className: "text-mashJijig",
        width: "9rem",
        ellipsis: true,
        align: "center",
        render: (butsaaltiinDun) => {
          return (
            <div className="flex justify-end">
              {formatNumber(butsaaltiinDun, 2)}
            </div>
          );
        },
      }
    );
    return jagsaalt;
  }, [shineBagana, salbaruud, tailanGaralt, salbariinId, ognoo, salbariinId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  return (
    <Admin
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      title="Борлуулалтын буцаалтын тайлан"
      khuudasniiNer="ButsaaltTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
    >
      <div className="col-span-12  flex flex-col gap-6 px-5 md:px-3">
        <div className="grid w-full grid-cols-2 gap-2  lg:flex">
          <DatePicker.RangePicker
            locale={local}
            value={ognoo}
            onChange={setOgnoo}
            className="!h-[36px] w-64 !rounded-md bg-white"
          />

          <Select
            showSearch
            placeholder="Бараа сонгох"
            className="!h-[36px] w-40  rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800"
            allowClear
            mode="multiple"
            value={songosonBaraa}
            filterOption={(o) => o}
            onClear={() => {
              setBaraaniiKhuudaslalt({
                khuudasniiDugaar: 1,
                khuudasniiKhemjee: 50,
                search: "",
                jagsaalt: [],
              });
              setTailanKhuudaslalt({
                khuudasniiDugaar: 1,
                khuudasniiKhemjee: 20,
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
                khuudasniiKhemjee: 20,
              });
            }}
          >
            {baraaGaralt?.jagsaalt?.map((mur) => {
              return (
                <Select.Option key={mur?.code} value={mur?.code}>
                  <Tooltip title={<div>{mur?.ner}</div>}>
                    <div
                      className="flex flex-row truncate text-gray-600  dark:text-gray-300 dark:bg-gray-800"
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {mur?.ner}
                    </div>
                  </Tooltip>
                </Select.Option>
              );
            })}
          </Select>
          <div className="ml-auto flex gap-2">
            <Button className="w-28" onClick={handlePrint} type="gol">
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
        <div className="text-mashJijig col-span-12 mt-12 flex flex-col items-center justify-center  2xl:mt-0">
          <Table
            scroll={{ y: "calc(100vh - 17rem)" }}
            tableLayout="fixed"
            size="small"
            unshijBaina={unshijBaina}
            pagination={{
              current:
                tailanGaralt?.jagsaalt?.length > 0 &&
                tailanGaralt?.khuudasniiDugaar
                  ? tailanGaralt?.khuudasniiDugaar
                  : 1,
              total:
                tailanGaralt?.length > 0 && tailanGaralt?.niitMur?.[0]?.too,
              pageSize: tailanGaralt?.khuudasniiKhemjee,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
                setTailanKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }));
              },
            }}
            dataSource={tailanGaralt?.jagsaalt || []}
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
                  Буцаалтын тайлан
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
                    <th className="border text-mashJijigiinJijig">Төрөл</th>
                    <th className="border text-mashJijigiinJijig">
                      Баримтын дугаар
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Барааны нэр
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Дотоод код
                    </th>
                    <th className="border text-mashJijigiinJijig">Бар код</th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">Нэгж үнэ</th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын дүн
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын НӨАТ
                    </th>
                    <th className="border text-mashJijigiinJijig">Нийт дүн</th>
                  </tr>
                </thead>
                <tbody>
                  {tailanGaralt?.jagsaalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr>
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="w-[200px] border text-mashJijigiinJijig">
                            {moment(mur?.ognoo).format("YYYY-MM-DD HH:mm")}
                          </td>
                          <td className="border text-mashJijigiinJijig">
                            {mur?.turul}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.barimtiinDugaar}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.ner}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {mur?.code}
                          </td>
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {mur?.barCode}
                          </td>{" "}
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.too, 2)}
                          </td>{" "}
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.negjUne, 2)}
                          </td>{" "}
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.butsaaltiinDun, 2)}
                          </td>{" "}
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.butsaaltiinNoat, 2)}
                          </td>{" "}
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.butsaaltiinDun, 2)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
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

export default ButsaaltTailan;
