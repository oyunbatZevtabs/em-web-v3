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
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import useBorluulaltiinTailan from "hooks/tailan/useBorluulaltiinTailan";
import AshigTailanDelegrengui from "components/modalBody/tailan/ashigTailanDelgerengui/AshigTailanDelegrengui";
const order = { createdAt: -1 };

function Ashig({
  unshijBaina,
  token,
  setOgnoo,
  ognoo,
  songosonBaraa,
  setSongosonBaraa,
  tailanGaralt,
  shuult,
}) {
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [shineBagana, setShineBagana] = useState([]);

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);

  const [ashigTailanKhuudaslalt, setAshigTailanKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
  });
  //   const [ognoo, setOgnoo] = useState([
  //     moment().startOf("day"),
  //     moment().endOf("day"),
  //   ]);

  const { data: salbaruud } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  console.log(tailanGaralt, "tailanGaralt");

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

  //   const shuult = useMemo(() => {
  //     const query = {
  //       ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
  //       duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
  //       salbariinId: salbariinId ? salbariinId : undefined,
  //       baiguullagiinId: baiguullagiinId,
  //       code: songosonBaraa?.length > 0 ? songosonBaraa : undefined,
  //     };
  //     return query;
  //   }, [ognoo, salbariinId, songosonBaraa, salbariinId]);

  //   const { tailanGaralt, unshijBaina, setTailanKhuudaslalt } =
  //     useBorluulaltiinTailan(token, shuult, undefined, searchKeys, order);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    setLoading(true);
    await posUilchilgee(token)
      .post("/ashigiinTailanAvya", {
        ...shuult,
      })
      .then(({ data }) => {
        excel
          .addSheet("Борлуулалт")
          .addColumns([
            {
              title: "№",
              dataIndex: "_id",
              key: "index",
              render: (text, record, index) => {
                return index + 1;
              },
            },
            {
              title: "Нэр",
              dataIndex: "ner",
              key: "ner",
              render: (text, data) => {
                return text;
              },
            },
            {
              title: "Ширхэг",
              dataIndex: "niitToo",
              key: "niitToo",
              render: (niitToo) => {
                return formatNumber(niitToo || 0, 2);
              },
            },
            {
              title: "Ашиг",
              dataIndex: "zarsanNiitUne",
              key: "zarsanNiitUne",
              render: (text, record) => {
                return formatNumber(record.niitAshig || 0, 2);
              },
            },
          ])
          .addDataSource(data)
          .saveAs("АшгийнТайлан.xlsx");
        setLoading(false);
      });
    //   .catch((err) => {
    //     aldaaBarigch(err);
    //     setLoading(false);
    //   });
  }

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        // className: "text-center dark:bg-gray-900 dark:text-white",
        align: "center",
        summary: true,
        width: "0.5rem",
        className: "border-r border-gray-200",

        render: (text, record, index) => {
          return <div className="dark:">{index + 1}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Нэр</div>,
        dataIndex: "ner",
        align: "left",
        key: "",
        className: "border-r border-gray-200 text-center",
        width: "4rem",
        render: (text, data) => {
          return (
            <div>
              {
                <Popover
                  title={false}
                  content={
                    <div className="dark:text-white">{data._id.ner}</div>
                  }
                >
                  <div className="truncate text-left">{data._id.ner}</div>
                </Popover>
              }
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Дотоод код</div>,
        dataIndex: "code",
        align: "left",
        key: "",
        className: "border-r border-gray-200 text-center",
        width: "2rem",
        render: (text, data) => {
          return (
            <div>
              {
                <Popover
                  title={false}
                  content={
                    <div className="dark:text-white">{data._id.code}</div>
                  }
                >
                  <div className="truncate text-center">{data._id.code}</div>
                </Popover>
              }
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold ">Ширхэг</div>,
        // title: (
        //   <div className="color-amber-700 text-center font-semibold">Ширхэг</div>
        // ),
        dataIndex: "niitToo",
        align: "center",
        key: "niitToo",
        className: "border-r border-gray-200",
        width: "2rem",
        summary: true,
        render: (a, data) => {
          return (
            <AshigTailanDelegrengui
              buttonData={a}
              butenData={data}
              salbariinId={salbariinId}
              baiguullagiinId={baiguullagiinId}
              ognoo={ognoo}
              token={token}
              baiguullaga={baiguullaga}
              ajiltan={ajiltan}
              khariltsagchNer={data?._id}
            />
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Ашиг</div>,
        dataIndex: "zarsanNiitUne",
        align: "right",
        key: "zarsanNiitUne",
        summary: true,
        width: "3rem",
        render: (text, record) => {
          return <div>{formatNumber(record.niitAshig || 0, 2)}₮</div>;
        },
      },
    ];
    return jagsaalt;
  }, [shineBagana, salbaruud, tailanGaralt, salbariinId, ognoo, salbariinId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  return (
    // <Admin
    //   loading={loading}
    //   onSearch={(search) =>
    //     setTailanKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
    //   }
    //   title="Борлуулалтын тайлан"
    //   khuudasniiNer="BorluulaltTailan"
    //   className="p-0 md:p-4"
    //   tsonkhniiId={"644729fa28c37d7cdda1169d"}>
    //   <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
    <div>
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
            className="!h-[36px] w-48  rounded-md border-[1px] border-[#4FD1C5] bg-white"
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
              setAshigTailanKhuudaslalt({
                khuudasniiDugaar: 1,
                khuudasniiKhemjee: 100,
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
              setAshigTailanKhuudaslalt({
                khuudasniiDugaar: 1,
                khuudasniiKhemjee: 100,
              });
            }}
          >
            {baraaGaralt?.jagsaalt?.map((mur) => {
              return (
                <Select.Option key={mur?.code} value={mur?.code}>
                  <div className="flex w-full justify-between">
                    <div
                      className="flex flex-row truncate text-gray-600  dark:bg-gray-800 dark:text-gray-200"
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {mur?.ner}- {mur?.code}
                    </div>
                    <div className="flex justify-end truncate font-semibold dark:bg-gray-800 dark:text-gray-200">
                      {mur?.id}
                    </div>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="flex h-8 gap-2 mb-3">
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
          unshijBaina={unshijBaina}
          size="small"
          pagination={false}
          dataSource={tailanGaralt || []}
          summary={(e) => (
            <AntdTable.Summary className="border " fixed={"bottom"}>
              <AntdTable.Summary.Cell colSpan={1}>
                <div className="space-x-2 truncate text-base font-semibold ">
                  Нийт
                </div>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell></AntdTable.Summary.Cell>

              <AntdTable.Summary.Cell>
                <div className="truncate text-center font-semibold ">
                  {formatNumber(
                    e?.reduce((a, b) => a + (b?.niitToo || 0), 0),
                    2
                  )}
                  ш
                </div>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell>
                <div className="truncate text-right font-semibold ">
                  {formatNumber(
                    e?.reduce((a, b) => a + (b?.niitAshig || 0), 0),
                    2
                  )}
                  ₮
                </div>
              </AntdTable.Summary.Cell>
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
                Ашгийн тайлан
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
                  <th className="border text-mashJijigiinJijig">Нэр</th>
                  <th className="border text-mashJijigiinJijig">Ширхэг</th>
                  <th className="border text-mashJijigiinJijig">Ашиг</th>
                </tr>
              </thead>
              <tbody>
                {tailanGaralt?.map((mur, index) => {
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
                          {mur._id.ner}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur.niitToo, 2)}
                        </td>
                        <td className="border text-right text-mashJijigiinJijig">
                          {formatNumber(mur?.niitAshig || 0, 2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                <tr className="border">
                  <td className="border text-center text-mashJijigiinJijig font-bold">
                    Нийт
                  </td>
                  <td className="border text-center text-mashJijigiinJijig"></td>
                  <td className="border text-center text-mashJijigiinJijig font-bold">
                    {formatNumber(
                      tailanGaralt?.reduce((a, b) => a + (b?.niitToo || 0), 0),
                      2
                    )}
                  </td>
                  <td className="border text-right text-mashJijigiinJijig font-bold">
                    {formatNumber(
                      tailanGaralt?.reduce(
                        (a, b) => a + (b?.niitAshig || 0),
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
    // </Admin>
  );
}

export default Ashig;
