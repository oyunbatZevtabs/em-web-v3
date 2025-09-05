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
import BorluulaltTailanDelegrengui from "components/modalBody/tailan/borluulaltTailan/BorluulaltTailanDelegrengui";
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
        const niitButsaaltiinTooKhemjee =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        const niitButsaaltiinDun =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        const niitBorluulaltiinNOAT =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        const niitBorluulalt =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        return (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align={mur.title === "Буцаалтын тоо хэмжээ" ? "center" : "right"}
          >
            {mur.summary ? (
              mur.title === "№" ? (
                <div className="text-left">Нийт</div>
              ) : mur.title === "Буцаалтын тоо хэмжээ" ? (
                formatNumber(niitButsaaltiinTooKhemjee || 0, 2) + "ш"
              ) : mur.title === "Буцаалтын дүн" ? (
                formatNumber(niitButsaaltiinDun || 0, 2) + "₮"
              ) : mur.title === "Борлуулалтын НӨАТ" ? (
                formatNumber(niitBorluulaltiinNOAT || 0, 2) + "₮"
              ) : mur.title === "Нийт борлуулалт" ? (
                formatNumber(niitBorluulalt || 0, 2) + "₮"
              ) : (
                ""
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

function Borluulalt({
  unshijBaina,
  token,
  setOgnoo,
  ognoo,
  tailanGaralt,
  shuult,
  songosonSalbar,
  setSongosonSalbar,
}) {
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const [shineBagana, setShineBagana] = useState([]);

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
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
      .post("/borluulaltiinTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: tailanGaralt?.jagsaalt?.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Борлуулалт")
          .addColumns([
            {
              title: "Барааны ангилал",
              dataIndex: "_id",
              render: (id) => {
                return id;
              },
            },
            {
              title: "Тоо хэмжээ",
              dataIndex: "tooKhemjee",
              render: (tooKhemjee) => {
                return formatNumber(tooKhemjee || 0, 2);
              },
            },
            {
              title: "Борлуулалтын дүн",
              dataIndex: "butsaaltiinTooKhemjee",
              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0);
              },
            },
            {
              title: "Буцаалтын тоо",
              dataIndex: "butsaaltiinDun",
              render: (butsaaltiinDun) => {
                return formatNumber(butsaaltiinDun || 0, 2);
              },
            },
            {
              title: "Буцаалтын дүн",
              dataIndex: "butsaaltiinDun",
              render: (butsaaltiinDun) => {
                return formatNumber(butsaaltiinDun || 0, 2);
              },
            },
            {
              title: "Буцаалтын НӨАТ",
              dataIndex: "borluulaltiinNoat",
              __style__: { h: "right" },
              render: (borluulaltiinNoat) => {
                return formatNumber(borluulaltiinNoat || 0, 2);
              },
            },
            {
              title: "Нийт борлуулалт",
              dataIndex: "niitBorluulalt",
              __style__: { h: "right" },
              render: (urtug) => {
                return formatNumber(urtug || 0, 2);
              },
            },
          ])
          .addDataSource(data?.jagsaalt)
          .saveAs("БорлуулалтТайлан.xlsx");
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
          fixed: "left",
          render: (text, record, index) =>
            (tailanGaralt?.khuudasniiDugaar || 0) *
              (tailanGaralt?.khuudasniiKhemjee || 0) -
            (tailanGaralt?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Барааны ангилал",
          dataIndex: "_id",
          width: "12rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return (
              <Popover content={<div>{b}</div>}>
                <div type="primary" className="truncate text-left">
                  {b}
                </div>
              </Popover>
            );
          },
        },
        {
          title: "Тоо хэмжээ",
          dataIndex: "tooKhemjee",
          width: "10rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return <div className="text-center">{formatNumber(b, 2)}</div>;
          },
        },
        {
          title: "Борлуулалтын дүн",
          dataIndex: "borluulaltiinDun",
          className: "text-mashJijig",
          width: "10rem",
          align: "center",
          ellipsis: true,
          render: (a) => {
            return (
              <div className="truncate text-right">{formatNumber(a, 2)}</div>
            );
          },
        },
      ],
      jagsaalt = [...jagsaalt, ...shineBagana];
    jagsaalt.push(
      {
        title: "Буцаалтын тоо хэмжээ",
        className: "text-mashJijig",
        dataIndex: "butsaaltiinTooKhemjee",
        width: "7rem",
        ellipsis: true,
        summary: true,
        align: "center",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: "Буцаалтын дүн",
        className: "text-mashJijig",
        dataIndex: "butsaaltiinDun",
        width: "10rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a, data) => {
          return <div className="text-right">{formatNumber(a, 2)}</div>;
        },
      },
      {
        title: "Борлуулалтын НӨАТ",
        dataIndex: "borluulaltiinNoat",
        className: "text-mashJijig",
        width: "8rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a, data) => {
          return <div className="text-right">{formatNumber(a, 2)}</div>;
        },
      },
      {
        title: "Нийт борлуулалт",
        dataIndex: "niitBorluulalt",
        className: "text-mashJijig",
        width: "10rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a, data) => {
          return (
            <div className="flex justify-end">
              <BorluulaltTailanDelegrengui
                buttonData={a}
                butenData={data}
                songosonSalbar={songosonSalbar}
                baiguullagiinId={baiguullagiinId}
                ognoo={ognoo}
                token={token}
                baiguullaga={baiguullaga}
                ajiltan={ajiltan}
                khariltsagchNer={data?._id}
              />
            </div>
          );
        },
      }
    );
    return jagsaalt;
  }, [
    shineBagana,
    salbaruud,
    tailanGaralt,
    salbariinId,
    ognoo,
    salbariinId,
    songosonSalbar,
  ]);

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
            allowClear
            showSearch
            mode="multiple"
            filterOption={(o) => o}
            size="medium"
            bordered={false}
            className="!h-[36px] w-1/3 rounded-md border-[1px] border-[#4fd1c5] bg-white md:w-40"
            placeholder="Салбар сонгох"
            onChange={(v) => {
              setSongosonSalbar(v);
            }}
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

      <div className="text-mashJijig col-span-12 mt-12 flex flex-col items-center justify-center 2xl:mt-0 pt-2">
        <Table
          scroll={{ y: "calc(100vh - 17rem)" }}
          tableLayout="fixed"
          style={{
            height: "75vh",
          }}
          unshijBaina={unshijBaina}
          size="small"
          pagination={{
            current:
              tailanGaralt?.jagsaalt?.length > 0 &&
              tailanGaralt?.khuudasniiDugaar
                ? tailanGaralt?.khuudasniiDugaar
                : 1,
            pageSize: tailanGaralt?.khuudasniiKhemjee,

            total:
              tailanGaralt?.jagsaalt?.length > 0 &&
              tailanGaralt?.niitMur?.tooKhemjee,
            defaultPageSize: 20,
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
          summary={() => (
            <AntdTable.Summary fixed>
              <HulDun garalt={tailanGaralt?.jagsaalt || []} columns={columns} />
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
                Борлуулалт тайлан
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
                    Барааны ангилал
                  </th>
                  <th className="border text-mashJijigiinJijig">Тоо хэмжээ</th>
                  <th className="border text-mashJijigiinJijig">
                    Борлуулалтын дүн
                  </th>
                  <th className="border text-mashJijigiinJijig">
                    Буцаалтын тоо хэмжээ
                  </th>
                  <th className="border text-mashJijigiinJijig">
                    Буцаалтын дүн
                  </th>
                  <th className="border text-mashJijigiinJijig">
                    Буцаалтын НӨАТ
                  </th>
                  <th className="border text-mashJijigiinJijig">
                    Нийт борлуулалт
                  </th>
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
                        <td className="border pl-4 text-mashJijigiinJijig">
                          {mur?._id}
                        </td>
                        <td className="border text-mashJijigiinJijig">
                          {formatNumber(mur?.tooKhemjee || 0, 2)}
                        </td>
                        <td className="border text-right text-mashJijigiinJijig">
                          {formatNumber(mur?.borluulaltiinDun || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.butsaaltiinTooKhemjee || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.butsaaltiinDun || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.borluulaltiinNoat || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.niitBorluulalt, 2)}
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
    // </Admin>
  );
}

export default Borluulalt;
