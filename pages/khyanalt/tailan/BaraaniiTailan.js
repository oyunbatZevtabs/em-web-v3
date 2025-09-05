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
import useOrder from "tools/function/useOrder";

const searchKeys = ["baraanuud.code", "baraanuud.ner", "baraanuud.barCode"];

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
            align="center"
          >
            {mur.summary ? (
              mur.title === "Барааны нэр" ? (
                <div className="truncate text-left">Нийт</div>
              ) : (
                tooOronKhyazgaarliy(totalSum, 2) + "ш"
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
function BaraaniiTailan({ token }) {
  const [shineBagana, setShineBagana] = useState([]);
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const { baiguullaga, baiguullagiinId, ajiltan } = useAuth();
  const { order: orderTailan, onChangeTable } = useOrder({ createdAt: -1 });
  const [loading, setLoading] = useState(false);
  const [huraanguiExcelTatakh, setHuraanguiExcelTatakh] = useState(false);

  const { salbariinId } = useAuth();

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const onChange = (e) => {
    setHuraanguiExcelTatakh(e);
  };

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
    useBaraaMaterialiinTailan(
      token,
      shuult,
      undefined,
      searchKeys,
      orderTailan
    );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    setLoading(true);
    const excel = new Excel();
    await posUilchilgee(token)
      .post("/baraaMaterialiinTailanAvya", {
        ...shuult,
        khuudasniiKhemjee: tailanGaralt[0]?.niitMur[0]?.too,
      })
      .then(({ data }) => {
        excel
          .addSheet("Бараа")
          .addColumns(
            huraanguiExcelTatakh
              ? [
                  {
                    title: "Бар код",
                    dataIndex: "_id",
                    render: (id) => {
                      return id?.id;
                    },
                  },
                  {
                    title: "Барааны нэр",
                    dataIndex: "_id",
                    render: (id) => {
                      return id?.ner;
                    },
                  },
                  {
                    title: "Худалдах үнэ",
                    dataIndex: "une",
                    __style__: { h: "right" },
                    render: (une) => {
                      return formatNumber(une?.[0] || 0);
                    },
                  },
                  {
                    title: "Эцсийн үлдэгдэл",
                    dataIndex: "etssiinUldegdel",
                  },
                  {
                    title: "Нэгж өртөг",
                    dataIndex: "urtug",
                    __style__: { h: "right" },
                    render: (une) => {
                      return formatNumber(une?.[0] || 0);
                    },
                  },
                ]
              : [
                  {
                    title: "Бар код",
                    dataIndex: "_id",
                    render: (id) => {
                      return id?.id;
                    },
                  },
                  {
                    title: "Барааны нэр",
                    dataIndex: "_id",
                    render: (id) => {
                      return id?.ner;
                    },
                  },
                  {
                    title: "Худалдах үнэ",
                    dataIndex: "une",
                    __style__: { h: "right" },
                    render: (une) => {
                      return formatNumber(une?.[0] || 0);
                    },
                  },
                  {
                    title: "Эхний үлдэгдэл",
                    dataIndex: "ekhniiUldegdel",
                  },
                  {
                    title: "Орлого",
                    dataIndex: "orlogo",
                  },
                  {
                    title: "Зарлага",
                    dataIndex: "zarlaga",
                  },
                  {
                    title: "Эцсийн үлдэгдэл",
                    dataIndex: "etssiinUldegdel",
                  },
                  {
                    title: "Нэгж өртөг",
                    dataIndex: "urtug",
                    __style__: { h: "right" },
                    render: (une) => {
                      return formatNumber(une?.[0] || 0);
                    },
                  },
                ]
          )
          .addDataSource(data?.[0]?.jagsaalt)
          .saveAs("БарааТайлан.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        aldaaBarigch(err);
      });
  }

  const columns = useMemo(() => {
    var jagsaalt = [
        {
          title: "№",
          key: "index",
          className: "text-center",
          align: "center",
          width: "50px",
          fixed: "left",
          className: "border-r border-gray-300",
          render: (text, record, index) =>
            (tailanGaralt[0]?.khuudasniiDugaar || 0) *
              (tailanGaralt[0]?.khuudasniiKhemjee || 0) -
            (tailanGaralt[0]?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Барааны нэр",
          dataIndex: "_id",
          className: "text-mashJijig border-r border-gray-300",
          width: "16rem",
          summary: true,
          maxWidth: "24rem",
          align: "center",
          ellipsis: true,
          render: (a) => {
            return <div className="flex justify-start truncate">{a?.ner}</div>;
          },
        },
        {
          title: "Дотоод код",
          dataIndex: "_id",
          className: "text-mashJijig border-r border-gray-300",
          ellipsis: true,
          align: "center",
          width: "250px",
          render: (b) => {
            return <div className="flex justify-start">{b?.code}</div>;
          },
        },
        {
          title: "Салбар",
          dataIndex: "_id",
          width: "150px",
          className: "text-mashJijig border-r border-gray-300",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return (
              <div className="flex justify-start">
                {salbaruud?.find((a) => b?.salbariinId === a._id)?.ner}
              </div>
            );
          },
        },
        // ...shineBagana,
      ],
      jagsaalt = [...jagsaalt];
    jagsaalt.push(
      {
        title: "Эх/үлдэгдэл",
        className: "text-mashJijig border-r border-gray-300",
        dataIndex: "ekhniiUldegdel",
        width: "7rem",
        ellipsis: true,
        summary: true,
        align: "center",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: "Орлого",
        className: "text-mashJijig border-r border-gray-300",
        dataIndex: "orlogo",
        width: "5rem",
        summary: true,
        key: "orlogo",
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        align: "center",
        render: (a, data) => {
          return (
            <OrlogoZarlagaDelegrengui
              buttonData={a}
              butenData={data}
              salbariinId={salbariinId}
              ognoo={ognoo}
              token={token}
              salbariinNer={
                salbaruud?.find((a) => data?._id?.salbariinId === a._id)?.ner
              }
            />
          );
        },
      },
      {
        title: "Зарлага",
        dataIndex: "zarlaga",
        className: "text-mashJijig border-r border-gray-300",
        width: "5rem",
        key: "zarlaga",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a, data) => {
          return (
            <OrlogoZarlagaDelegrengui
              buttonData={a}
              butenData={data}
              salbariinId={salbariinId}
              ognoo={ognoo}
              token={token}
              salbariinNer={
                salbaruud?.find((a) => data?._id?.salbariinId === a._id)?.ner
              }
            />
          );
        },
      },
      {
        title: "Эц/үлдэгдэл",
        dataIndex: "etssiinUldegdel",
        className: "text-mashJijig border-r border-gray-300",
        width: "7rem",
        key: "etssiinUldegdel",
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
        title: "Нэгж өртөг",
        key: "urtug",
        dataIndex: "urtug",
        className: "text-mashJijig border-r border-gray-300",
        width: "5rem",
        ellipsis: true,
        align: "center",
        render: (une) => {
          return <div className="flex justify-end"></div>;
        },
      }
    );
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
      title="Барааны дэлгэрэнгүй тайлан"
      khuudasniiNer="BaraaniiTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"644729fa28c37d7cdda1169d"}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <div className="grid w-full grid-cols-2 gap-2  lg:flex">
          <DatePicker.RangePicker
            locale={local}
            value={ognoo}
            onChange={setOgnoo}
            className="!h-[36px] w-64 !rounded-md bg-white dark:bg-gray-800"
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
              setTailanKhuudaslalt({
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
                      className="flex flex-row truncate text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {mur?.ner}- {mur?.code}
                    </div>
                    <div className="flex dark:bg-gray-800 justify-end truncate font-semibold">
                      {mur?.id}
                    </div>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
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
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center gap-2 self-baseline">
                        <Checkbox
                          className="flex flex-row-reverse"
                          onChange={onChange}
                        >
                          <div className="dark:text-gray-50">Хураангүй</div>
                        </Checkbox>
                      </div>
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
            {/* <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  title: "Эх/үлдэгдэл",
                  className: "text-mashJijig",
                  dataIndex: "ekhniiUldegdel",
                  width: "7rem",
                  ellipsis: true,
                  summary: true,
                  align: "center",
                  render: (e) => {
                    return formatNumber(e, 2);
                  },
                },
                {
                  title: "Орлого",
                  className: "text-mashJijig",
                  dataIndex: "orlogo",
                  width: "5rem",
                  summary: true,
                  key: "orlogo",
                  ellipsis: true,
                  showSorterTooltip: false,
                  sorter: () => 0,
                  align: "center",
                  render: (a, data) => {
                    return (
                      <OrlogoZarlagaDelegrengui
                        buttonData={a}
                        butenData={data}
                        salbariinId={salbariinId}
                        ognoo={ognoo}
                        token={token}
                        salbariinNer={
                          salbaruud?.find(
                            (a) => data?._id?.salbariinId === a._id
                          )?.ner
                        }
                      />
                    );
                  },
                },
                {
                  title: "Зарлага",
                  dataIndex: "zarlaga",
                  className: "text-mashJijig",
                  width: "5rem",
                  key: "zarlaga",
                  showSorterTooltip: false,
                  sorter: () => 0,
                  summary: true,
                  ellipsis: true,
                  align: "center",
                  render: (a, data) => {
                    return (
                      <OrlogoZarlagaDelegrengui
                        buttonData={a}
                        butenData={data}
                        salbariinId={salbariinId}
                        ognoo={ognoo}
                        token={token}
                        salbariinNer={
                          salbaruud?.find(
                            (a) => data?._id?.salbariinId === a._id
                          )?.ner
                        }
                      />
                    );
                  },
                },
                {
                  title: "Эц/үлдэгдэл",
                  dataIndex: "etssiinUldegdel",
                  className: "text-mashJijig",
                  width: "7rem",
                  key: "etssiinUldegdel",
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
                  title: "Нэгж өртөг",
                  key: "urtug",
                  dataIndex: "urtug",
                  className: "text-mashJijig",
                  width: "5rem",
                  ellipsis: true,
                  align: "center",
                  render: (une) => {
                    return <div className="flex justify-end"></div>;
                  },
                },
              ]}
            /> */}
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
            pagination={{
              pageSize: tailanGaralt?.[0]?.khuudasniiKhemjee,
              current:
                tailanGaralt?.length > 0 && tailanGaralt[0]?.khuudasniiDugaar
                  ? tailanGaralt[0].khuudasniiDugaar
                  : 1,
              total:
                tailanGaralt?.length > 0 &&
                tailanGaralt?.[0]?.niitMur?.[0]?.too,
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
            dataSource={tailanGaralt?.[0]?.jagsaalt || []}
            summary={() => (
              <AntdTable.Summary fixed>
                <HulDun
                  garalt={tailanGaralt?.[0]?.jagsaalt || []}
                  columns={columns}
                />
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
                  Барааны дэлгэрэнгүй тайлан
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
                    <th className="border text-mashJijigiinJijig">Бар код</th>
                    <th className="border text-mashJijigiinJijig">
                      Барааны нэр
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Худалдах үнэ
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Эхний үлдэгдэл
                    </th>
                    <th className="border text-mashJijigiinJijig">Орлого</th>
                    <th className="border text-mashJijigiinJijig">Зарлага</th>
                    <th className="border text-mashJijigiinJijig">
                      Эцсийн үлдэгдэл
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Нэгж өртөг
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tailanGaralt?.[0]?.jagsaalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr className="border">
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-mashJijigiinJijig">
                            {mur?._id?.id}
                          </td>
                          <td className="border text-mashJijigiinJijig">
                            {mur?._id?.ner}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.une[0])}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.ekhniiUldegdel, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.orlogo, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.zarlaga, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.etssiinUldegdel, 2)}
                          </td>
                          <td
                            className={`border text-right text-mashJijigiinJijig`}
                          >
                            {formatNumber(mur?.urtug[0])}
                          </td>
                        </tr>
                        <tr className="">
                          <td colSpan="9">
                            <table className="w-full">
                              <thead>
                                <tr className="border bg-gray-400 text-white">
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "30%" }}
                                  >
                                    Салбар
                                  </th>
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "30%" }}
                                  >
                                    Барааны нэр
                                  </th>
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "10%" }}
                                  >
                                    Эхний үлдэгдэл
                                  </th>
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "10%" }}
                                  >
                                    Орлого
                                  </th>
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "10%" }}
                                  >
                                    Зарлага
                                  </th>
                                  <th
                                    className="border text-mashJijigiinJijig"
                                    style={{ width: "10%" }}
                                  >
                                    Эцсийн үлдэгдэл
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {mur?.salbaruud?.map((shineMur) => {
                                  return (
                                    <tr>
                                      <td className="pl-4 text-mashJijigiinJijig">
                                        {
                                          baiguullaga?.salbaruud?.find(
                                            (a) =>
                                              a?._id ===
                                              shineMur?._id?.salbariinId
                                          )?.ner
                                        }
                                      </td>
                                      <td className="text-center text-mashJijigiinJijig">
                                        {shineMur?._id?.ner}
                                      </td>
                                      <td className="text-center text-mashJijigiinJijig">
                                        {formatNumber(
                                          shineMur?.ekhniiUldegdel,
                                          2
                                        )}
                                      </td>
                                      <td className="text-center text-mashJijigiinJijig">
                                        {formatNumber(shineMur?.orlogo, 2)}
                                      </td>
                                      <td className="text-center text-mashJijigiinJijig">
                                        {formatNumber(shineMur?.zarlaga, 2)}
                                      </td>
                                      <td className="text-center text-mashJijigiinJijig">
                                        {formatNumber(
                                          shineMur?.etssiinUldegdel,
                                          2
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
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

export default BaraaniiTailan;
