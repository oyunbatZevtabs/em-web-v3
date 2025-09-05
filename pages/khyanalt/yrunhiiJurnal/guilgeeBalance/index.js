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
import Table from "components/ant/AntdTable";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import useData from "hooks/useData";
import useBaraa from "hooks/useBaraa";
import useUglugTailan from "hooks/tailan/useUglugTailan";
import UglugDelgerengui from "components/modalBody/uglug/uglugDelgerengui";
import useKhariltsagch from "hooks/useKhariltsagch";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import Delgerengui from "components/modalBody/guilgeeBalance/delgerengui";

const searchKeys = ["code", "ner"];
const order = { code: 1 };
const guilgeeBalansAvyaOrder = { dansniiDugaar: 1 };

var timeout = null;

function GuilgeeBalance({ token, salbariinId, khariltsagchiinId }) {
  const [songosonSalbar, setSongosonSalbar] = useState(salbariinId);
  const [songogdsonNer, setSongogdsonNer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan } = useAuth();
  const [haihDans, setHaihDans] = useState([]);

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

  const queryJurnalDans = useMemo(() => {
    var result = {
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
    };
    return result;
  }, [salbariinId, baiguullagiinId]);

  const {
    data: jurnalDansData,
    refresh,
    setKhuudaslalt: setJurnalDansKhuudaslalt,
  } = posUseJagsaalt(
    "/jurnalDans",
    queryJurnalDans,
    order,
    undefined,
    searchKeys
  );

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: !!songosonSalbar ? songosonSalbar : undefined,
      khariltsagchiinId: songogdsonNer.length > 0 ? songogdsonNer : undefined,
      baiguullagiinId: baiguullagiinId,
    };
    if (haihDans.length > 0) {
      query.dansniiDugaar = haihDans;
    }
    return query;
  }, [
    ognoo,
    salbariinId,
    khariltsagchiinId,
    songogdsonNer,
    songosonSalbar,
    haihDans,
  ]);

  const {
    data: tailan,
    isValidating: unshijBaina,
    setKhuudaslalt: setTailanKhuudaslalt,
  } = posUseJagsaalt(
    "/guilgeeBalansAvya",
    shuult,
    guilgeeBalansAvyaOrder,
    undefined,
    undefined,
    undefined,
    99999,
    undefined
  );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    setLoading(true);
    await posUilchilgee(token)
      .get("/guilgeeBalansAvya", {
        params: {
          query: {
            ...shuult,
          },
          khuudasniiKhemjee: tailan?.khuudasniiKhemjee,
        },
      })
      .then(({ data }) => {
        excel
          .addSheet("Гүйлгээ баланс тайлан")
          .addColumns([
            {
              title: "Дансны нэр",
              dataIndex: "dansniiNer",
              render: (b) => {
                return b;
              },
            },
            {
              title: "Дансны дугаар",
              dataIndex: "dansniiDugaar",
              render: (dansniiDugaar) => {
                return dansniiDugaar;
              },
            },
            {
              title: "Валют",
              dataIndex: "valyut",
              width: "15em",
              className: "text-mashJijig",
              align: "center",
              ellipsis: true,
              render: (valyut) => {
                return valyut;
              },
            },
            {
              title: "Эхний үлдэгдэл",
              dataIndex: "ekhniiUldegdel",
              render: (ekhniiUldegdel) => {
                return ekhniiUldegdel;
              },
              // children: [
              //   {
              //     title: "Дт",
              //     dataIndex: "ekhniiUldegdelDebit",
              //     render: (ekhniiUldegdelDebit) => {
              //       return ekhniiUldegdelDebit;
              //     },
              //   },
              //   {
              //     title: "Кт",
              //     dataIndex: "ekhniiUldegdelKredit",
              //     render: (ekhniiUldegdelKredit) => {
              //       return ekhniiUldegdelKredit;
              //     },
              //   },
              // ],
            },
            {
              title: "Гүйлгээ",
              children: [
                {
                  title: "Дт",
                  dataIndex: "debit",
                  render: (debit) => {
                    return (
                      <Delgerengui
                        token={token}
                        baiguullagiinId={baiguullagiinId}
                        dans={data}
                        ognoo={ognoo}
                        buttonText={debit}
                      />
                    );
                  },
                },
                {
                  title: "Кт",
                  dataIndex: "kredit",
                  render: (kredit) => {
                    return (
                      <Delgerengui
                        token={token}
                        baiguullagiinId={baiguullagiinId}
                        dans={data}
                        ognoo={ognoo}
                        buttonText={kredit}
                      />
                    );
                  },
                },
              ],
            },
            {
              title: "Эцсийн үлдэгдэл",
              children: [
                {
                  title: "Дт",
                  dataIndex: "etssiinUldegdelDebit",
                  render: (etssiinUldegdelDebit) => {
                    return etssiinUldegdelDebit;
                  },
                },
                {
                  title: "Кт",
                  dataIndex: "etssiinUldegdelDebit",
                  render: (etssiinUldegdelDebit) => {
                    return etssiinUldegdelDebit;
                  },
                },
              ],
            },
          ])
          .addDataSource(data)
          .saveAs("Гүйлгээ баланс тайлан.xlsx");
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
        width: "2.5rem",
        className: "text-center",
        align: "center",
        summary: true,
        fixed: "left",
        render: (text, record, index) =>
          (tailan?.khuudasniiDugaar || 0) * (tailan?.khuudasniiKhemjee || 0) -
          (tailan?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Дансны нэр",
        dataIndex: "dansniiNer",
        className: "text-mashJijig",
        ellipsis: true,
        width: "10rem",
        align: "center",
        render: (b) => {
          return (
            <Popover content={<div>{b}</div>}>
              <div type="primary" className="truncate text-left">
                <Popover title={false} content={<div> {b}</div>}>
                  <div className="truncate">{b}</div>
                </Popover>
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Дансны дугаар",
        dataIndex: "dansniiDugaar",
        className: "text-mashJijig",
        width: "7rem",
        ellipsis: true,
        align: "center",
        render: (dansniiDugaar) => {
          return <div className="">{dansniiDugaar}</div>;
        },
      },
      {
        title: "Валют",
        dataIndex: "valyut",
        width: "4rem",
        className: "text-mashJijig",
        align: "center",
        ellipsis: true,
        render: (valyut) => {
          return <div className="truncate">{valyut}</div>;
        },
      },
      {
        title: "Эхний үлдэгдэл",
        // dataIndex: "ekhniiUldegdel",
        className: "text-mashJijig",
        align: "center",
        width: "6rem",
        title: "Эхний үлдэгдэл",
        dataIndex: "ekhniiUldegdel",
        render: (ekhniiUldegdel) => {
          return (
            <div className="text-right">{formatNumber(ekhniiUldegdel, 2)}</div>
          );
        },
      },
      {
        title: "Гүйлгээ",
        className: "text-mashJijig dark:text-white",
        align: "center",
        ellipsis: true,
        children: [
          {
            title: <span className="dark:text-white">Дт</span>,
            width: "5rem",
            align: "center",
            dataIndex: "debit",
            render: (debit, data) => {
              return (
                <div className="text-right dark:text-white">
                  <Delgerengui
                    token={token}
                    baiguullagiinId={baiguullagiinId}
                    dans={data}
                    ognoo={ognoo}
                    buttonText={debit}
                  />
                </div>
              );
            },
          },
          {
            title: <span className="dark:text-white">Кт</span>,
            width: "5rem",
            align: "center",
            dataIndex: "kredit",
            render: (kredit, data) => {
              return (
                <div className="text-right dark:text-white">
                  <Delgerengui
                    token={token}
                    baiguullagiinId={baiguullagiinId}
                    dans={data}
                    ognoo={ognoo}
                    buttonText={kredit}
                  />
                </div>
              );
            },
          },
        ],
      },
      {
        title: "Эцсийн үлдэгдэл",
        dataIndex: "etssiinUldegdel",
        className: "text-mashJijig",
        align: "center",
        width: "5rem",
        ellipsis: true,
        render: (etssiinUldegdel) => {
          return (
            <div className="text-right">{formatNumber(etssiinUldegdel, 2)}</div>
          );
        },
      },
      // {
      //   title: "",
      //   width: "8rem",
      //   align: "center",
      //   render: (v, data) => {
      //     return (
      // <Delgerengui
      //   token={token}
      //   baiguullagiinId={baiguullagiinId}
      //   dans={data}
      //   ognoo={ognoo}
      // />
      //     );
      //   },
      // },
    ];

    return jagsaalt;
  }, [salbaruud, tailan, songosonSalbar, ognoo, salbariinId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  return (
    <Admin
      loading={loading}
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      title="Гүйлгээ баланс"
      khuudasniiNer="GuilgeeBalanceTailan"
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
              className="!h-[40px] w-64 !rounded-md bg-white"
            />
            <Select
              bordered={false}
              onChange={(v) => setHaihDans(v)}
              placeholder="Данс сонгох"
              className="w-64 overflow-hidden rounded-md border-[1px] border-[#4FD1C5] bg-white"
              showSearch
              mode="multiple"
              filterOption={(o) => o}
              allowClear={true}
              onClear={() => {
                setJurnalDansKhuudaslalt((e) => ({
                  ...e,
                  khuudasniiDugaar: 1,
                  search: "",
                }));
              }}
              onSearch={(v) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  setJurnalDansKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: v,
                  }));
                }, 500);
              }}
            >
              {jurnalDansData?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?.code}>
                    <div className={`flex justify-start dark:text-gray-200 dark:bg-gray-800`}>
                      {mur.code} - {mur.ner}
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

        <div className="text-mashJijig col-span-12 mt-12 flex flex-col items-center justify-center xl:mt-0">
          <Table
            bordered={true}
            scroll={{ y: "calc(100vh - 17rem)" }}
            tableLayout="fixed"
            style={{
              height: "75vh",
            }}
            unshijBaina={unshijBaina}
            size="small"
            pagination={false}
            dataSource={tailan || []}
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
                  Гүйлгээ Баланс
                </div>
                <div className="w-1/3 text-right text-sm">
                  {songosonSalbar ? (
                    <div>
                      Салбар:{" "}
                      {
                        baiguullaga?.salbaruud?.find(
                          (a) => a?._id === songosonSalbar
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
                    <th rowSpan="2" className="border text-mashJijigiinJijig">
                      №
                    </th>
                    <th rowSpan="2" className="border text-mashJijigiinJijig">
                      Дансны нэр
                    </th>
                    <th rowSpan="2" className="border text-mashJijigiinJijig">
                      Дансны дугаар
                    </th>
                    <th rowSpan="2" className="border text-mashJijigiinJijig">
                      Валют
                    </th>
                    <th colSpan="2" className="border text-mashJijigiinJijig">
                      Эхний үлдэгдэл
                    </th>
                    <th colSpan="2" className="border text-mashJijigiinJijig">
                      Гүйлгээ
                    </th>
                    <th colSpan="2" className="border text-mashJijigiinJijig">
                      Эцсийн үлдэгдэл
                    </th>
                  </tr>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">Дт</th>
                    <th className="border text-mashJijigiinJijig">Кт</th>
                    <th className="border text-mashJijigiinJijig">Дт</th>
                    <th className="border text-mashJijigiinJijig">Кт</th>
                    <th className="border text-mashJijigiinJijig">Дт</th>
                    <th className="border text-mashJijigiinJijig">Кт</th>
                  </tr>
                </thead>
                <tbody>
                  {tailan?.map((mur, index) => {
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
                            {mur?.dansniiNer}
                          </td>
                          <td className="border text-mashJijigiinJijig">
                            {mur?.dansniiDugaar}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {mur?.valyut}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.debit, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.kredit, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.debit, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.kredit, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.debit, 2)}₮
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.kredit, 2)}₮
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

export default GuilgeeBalance;
