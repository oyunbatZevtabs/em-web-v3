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
import AvlagaDelgerengui from "components/modalBody/avlaga/avlagaDelgerengui";
import Table from "components/ant/AntdTable";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import useData from "hooks/useData";
import useBaraa from "hooks/useBaraa";
import useAvlagaTailan from "hooks/tailan/useAvlagaTailan";
import useOrder from "tools/function/useOrder";
import useKhariltsagch from "hooks/useKhariltsagch";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";

const searchKeys = ["ner"];

function AvlagaTailan({ token, khariltsagchiinId }) {
  const [songogdsonNer, setSongogdsonNer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

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

  // const khariltsagchQuery = useMemo(
  //   () => (
  //     {
  //       orlogo: { $gt: 0 },
  //       zarlaga: { $gt: 0 },
  //     }
  //   )
  //   // [modalOpen]
  // );

  const khariltsagchQuery = useMemo(() => {
    const query = {
      orlogo: { $gt: 0 },
      zarlaga: { $gt: 0 },
      // salbariinId ? salbariinId : salbariinId: undefined
    };
    return query;
  }, []);

  const { khariltsagchiinGaralt, setKhuudaslalt, khariltsagchMutate } =
    useKhariltsagch(
      token,
      100,
      khariltsagchQuery,
      order,
      undefined,
      searchKeys
    );

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: !!salbariinId ? salbariinId : undefined,
      khariltsagchiinId: songogdsonNer.length > 0 ? songogdsonNer : undefined,
      baiguullagiinId: baiguullagiinId,
    };
    return query;
  }, [ognoo, salbariinId, khariltsagchiinId, songogdsonNer]);

  const { tailanGargalt, unshijBaina, onSearch } = useAvlagaTailan(
    token,
    shuult,
    undefined,
    searchKeys,
    order
  );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    setLoading(true);
    await posUilchilgee(token)
      .post("/avlagaTovchooTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: tailanGargalt?.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Авлагын товчоо тайлан")
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
            value: "Авлагын товчоо тайлан",
            style: {
              bold: true,
              v: "center",
              h: "center",
            },
          })
          .addColumns([
            {
              title: "Харилцагч",
              dataIndex: "khariltsagchiinNer",
              // __style__: { h: "left" },
              render: (a) => {
                // console.log("aaaa", a);
                return a;
              },
            },
            {
              title: "Эхний үлдэгдэл",
              dataIndex: "ekhniiUldegdel",

              __style__: { h: "right" },
              render: (une) => {
                return formatNumber(une || 0);
              },
            },
            {
              title: "Дебет",
              dataIndex: "orlogo",
              __style__: { h: "right" },
              render: (butsaaltiinDun) => {
                return formatNumber(butsaaltiinDun || 0, 2);
              },
            },
            {
              title: "Кредит",
              dataIndex: "zarlaga",
              __style__: { h: "right" },
              render: (butsaaltiinDun) => {
                return formatNumber(butsaaltiinDun || 0, 2);
              },
            },
            {
              title: "Эцсийн үлдэгдэл",
              dataIndex: "etssiinUldegdel",
              __style__: { h: "right" },
              render: (butsaaltiinDun) => {
                return formatNumber(butsaaltiinDun || 0, 2);
              },
            },
          ])
          .addDataSource(data)
          .saveAs("Авлагын товчоо тайлан.xlsx");
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
        className: "text-center border-r border-gray-200",
        align: "center",
        width: "1rem",
        summary: true,
        // fixed: "left",
        render: (text, record, index) => index + 1,
      },

      // {
      //   title: "Харилцагч Id",
      //   dataIndex: "khariltsagchiinId",
      //   width: "5rem",
      //   className: "text-mashJijig",
      //   ellipsis: true,
      //   summary: true,
      //   showSorterTooltip: true,
      //   sorter: () => 0,
      //   align: "center",
      //   render: (text) => <div className="text-left">{text}</div>,
      // },
      {
        title: "Харилцагч",
        dataIndex: "khariltsagchiinNer",
        width: "2rem",
        className: "text-mashJijig border-r border-gray-200",
        ellipsis: true,
        summary: true,
        showSorterTooltip: true,
        sorter: () => 0,
        align: "center",
        render: (text) => <div className="text-left">{text}</div>,
      },
      {
        title: "Эхний үлдэгдэл",
        dataIndex: "ekhniiUldegdel",
        width: "2rem",
        className: "text-mashJijig border-r border-gray-200",
        ellipsis: true,
        align: "center",
        render: (b) => {
          return <div className="text-right">{formatNumber(b, 2)}₮</div>;
        },
      },
      {
        title: "Гүйлгээ",
        width: "3rem",
        children: [
          {
            title: "Дебет",
            dataIndex: "orlogo",
            align: "center",
            className: "text-mashJijig border-r border-gray-200",
            width: "2rem",
            render: (text, data) => {
              return (
                <div className="">
                  <AvlagaDelgerengui
                    buttonData={text}
                    token={token}
                    hariltsagchAjiltanMedeelel={data?._id}
                    turul="orlogo"
                    ognoo={ognoo}
                  />
                </div>
              );
            },
          },
          {
            title: "Кредит",
            dataIndex: "zarlaga",
            align: "center",
            className: "text-mashJijig border-r border-gray-200",
            width: "2rem",
            render: (text, data) => {
              return (
                <div className="text-right">
                  <AvlagaDelgerengui
                    buttonData={text}
                    token={token}
                    hariltsagchAjiltanMedeelel={data?._id}
                    turul="zarlaga"
                    // shuult={shuult}
                    ognoo={ognoo}
                  />
                </div>
              );
            },
          },
        ],
        dataIndex: "borluulaltiinDun",
        className: "text-mashJijig",
        width: "5rem",
        align: "center",
        ellipsis: true,
        render: (a) => {
          return (
            <div className="truncate text-right">{formatNumber(a, 2)}</div>
          );
        },
      },
    ];
    jagsaalt = [...jagsaalt, ...shineBagana];

    jagsaalt.push({
      title: "Эцсийн үлдэгдэл",
      className: "text-mashJijig",
      dataIndex: "etssiinUldegdel",
      width: "7rem",
      ellipsis: true,
      summary: true,
      align: "center",
      render: (e) => {
        return <div className="text-right"> {formatNumber(e, 2)}₮</div>;
      },
    });

    return jagsaalt;
  }, [
    shineBagana,
    salbaruud,
    tailanGargalt,

    songogdsonNer,
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
      title="Авлагын товчоо тайлан"
      khuudasniiNer="AvlagaTailan"
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
              className="!h-[40px] w-40  rounded-md border-[1px] border-[#4FD1C5] bg-white"
              style={{ textOverflow: "ellipsis" }}
              showSearch
              mode="multiple"
              filterOption={(o) => o}
              allowClear={true}
              onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
              onChange={(v) => {
                // var ajiltan = khariltsagchiinGaralt?.jagsaalt?.find(
                //   (a) => a._id === v
                // );
                // console.log(ajiltan, "ajiltan");
                setSongogdsonNer(v);
              }}
              placeholder="Харилцагч сонгох"
            >
              {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
                <Select.Option key={data?._id} className="dark:text-gray-300 dark:bg-gray-800">
                  {data?.ner}{" "}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="ml-auto flex gap-2">
            <div className="flex h-9 gap-2">
              <Button onClick={handlePrint} className="w-28" type="gol">
                <PrinterOutlined />
                Хэвлэх
              </Button>
              <div className="dropdown h-9 w-1/2 sm:w-auto">
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
            rowKey={(row) => row._id}
            dataSource={tailanGargalt || []}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell colSpan={1}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.ekhniiUldegdel || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.orlogo || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>

                {/* {console.log(e, "ee")} */}
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.zarlaga || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.etssiinUldegdel || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary>
            )}
            columns={columns}
            onChange={onChangeTable}
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
                  Авлагын товчоо тайлан
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
                    <th className="border text-mashJijigiinJijig">Харилцагч</th>
                    <th className="border text-mashJijigiinJijig">
                      Эхний үлдэгдэл
                    </th>
                    <th className="border text-mashJijigiinJijig">Дебет</th>
                    <th className="border text-mashJijigiinJijig">Кредит </th>
                    <th className="border text-mashJijigiinJijig">
                      Эцсийн үлдэгдэл
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tailanGargalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr>
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-left text-mashJijigiinJijig">
                            {mur?.khariltsagchiinNer}
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {mur?.ekhniiUldegdel}₮
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {mur?.orlogo}₮
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {mur?.zarlaga}₮
                          </td>
                          <td className="border pr-2 text-right text-mashJijigiinJijig">
                            {mur?.etssiinUldegdel}₮
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

export default AvlagaTailan;
