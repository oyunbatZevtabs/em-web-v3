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
import useBusadZarlaga from "hooks/tailan/useBusadZarlaga";
import useBaraa from "hooks/useBaraa";

import useData from "hooks/useData";

import BusadZarlagaDelgerengui from "components/modalBody/tailan/busadZarlaga/BusadZarlagaDelgerengui";
import { Tooltip } from "@mui/material";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import uilchilgee from "services/uilchilgee";

const order = { createdAt: -1 };
const zarlagaSearchKeys = ["baiguullagiinId", "salbariinId"];

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
        const tooKhemjeeSum =
          mur.summary &&
          garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
        const niitDunSum =
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
              mur.title === "№" ? (
                <div className="text-left">Нийт</div>
              ) : mur.title === "Тоо хэмжээ" ? (
                tooKhemjeeSum
              ) : mur.title === "Нийт" ? (
                <div className="flex justify-end">
                  {formatNumber(niitDunSum || 0, 2) + "₮"}
                </div>
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

function Zarlaga({ token, setOgnoo, ognoo }) {
  const [loading, setLoading] = useState(false);
  const { baiguullaga, ajiltan, baiguullagiinId, salbariinId } = useAuth();
  const [shineBagana, setShineBagana] = useState([]);
  const [filterSalbariinId, setFilterSalbariinId] = useState();
  const [baraanuud, setBaraanuud] = useState();
  const [filterKHariltsagch, setFilterKHariltsagch] = useState();
  const [baraaniiNer, setBaraaniiNer] = useState();
  const [open, setOpen] = useState(false);
  const [songosonBaraa, setSongosonBaraa] = useState();
  const [tailanKhuudaslalt, setTailanKhuudaslalt] = useState();

  const printRef = useRef(null);

  const { data: salbaruud } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );
  const zarlagaShuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo?.[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo?.[1].format("YYYY-MM-DD 23:59:59"),
      baiguullagiinId: baiguullagiinId,
      baraanuud:
        songosonBaraa && songosonBaraa.length > 0 ? songosonBaraa : undefined,
      salbariinId: filterSalbariinId ? filterSalbariinId : [salbariinId],
      turul: "busadZarlaga",
    };
    return query;
  }, [
    ognoo,

    baraanuud,
    salbariinId,
    baiguullagiinId,
    filterSalbariinId,
    songosonBaraa,
  ]);

  const { tailanGaralt, unshijBaina } = useBusadZarlaga(
    token,
    zarlagaShuult,
    undefined,
    order
  );

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    if (!!salbariinId) {
      query.salbariinId = salbariinId;
    } else query.salbariinId = "shuuhgui";
    return query;
  }, [baiguullagiinId, salbariinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  async function exceleerTatya() {
    const excel = new Excel();
    setLoading(true);
    await posUilchilgee(token)
      .post("/zarlagaAktBaraaniiTailan", {
        ...shuult,
        khuudasniiKhemjee: tailanGaralt?.order?.khuudasniiKhemjee,
      })
      .then(({ data }) => {
        excel
          .addSheet("Бусад зарлага")
          .addColumns([
            {
              title: "№",
              dataIndex: "_id",
              render: (id) => {
                return id;
              },
            },
            {
              title: "Барааны нэр",
              dataIndex: ["_id", "baraaniiNer"],
              __style__: { h: "right" },
              render: (baraaniiNer) => {
                return baraaniiNer;
              },
            },
            {
              title: "Дотоод код",
              dataIndex: ["_id", "dotoodCode"],
              __style__: { h: "right" },
              render: (dotoodCode) => {
                return dotoodCode;
              },
            },
            {
              title: "Салбар",
              dataIndex: ["_id", "salbariinId"],
              render: (salbariinId) => {
                return salbariinId;
              },
            },
            {
              title: "Тоо хэмжээ",
              dataIndex: "tooKhemjee",
              __style__: { h: "right" },
              render: (tooKhemjee) => {
                return tooKhemjee;
              },
            },

            {
              title: "Нийт",
              dataIndex: "niitDun",
              __style__: { h: "right" },
              render: (niitDun) => {
                return formatNumber(niitDun || 0, 2);
              },
            },
            {
              title: "Ажилтан",
              dataIndex: ["_id", "ajiltaniiNer"],
              __style__: { h: "right" },
              render: (ajiltan) => {
                return ajiltan;
              },
            },
          ])
          .addDataSource(tailanGaralt)
          .saveAs("Бусад зарлагын тайлан.xlsx");
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
          className: "text-center ",
          align: "center",
          width: "3rem",
          summary: true,
          // fixed: "left",
          render: (text, record, index) =>
            (tailanGaralt?.khuudasniiDugaar || 0) *
              (tailanGaralt?.khuudasniiKhemjee || 0) -
            (tailanGaralt?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Барааны нэр",
          dataIndex: ["_id", "baraaniiNer"],
          key: "baraaniiNer",
          width: "12rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (text) => {
            return (
              <Popover content={<div>{text}</div>}>
                <div type="primary" className="truncate text-left">
                  {text}
                </div>
              </Popover>
            );
          },
        },
        {
          title: "Дотоод код",
          dataIndex: ["_id", "dotoodCode"],
          key: "dotoodCode",
          width: "5rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (b) => {
            return <div className="text-center">{b}</div>;
          },
        },
        {
          title: "Салбар",
          dataIndex: "_id",
          key: "salbariinId",
          className: "text-mashJijig",
          width: "10rem",
          align: "center",
          ellipsis: true,
          render: (b) => {
            return (
              <div className="flex justify-start overflow-hidden">
                {salbaruud?.find((a) => b?.salbariinId === a._id)?.ner}
              </div>
            );
          },
        },
      ],
      jagsaalt = [...jagsaalt, ...shineBagana];
    jagsaalt.push(
      {
        title: "Тоо хэмжээ",
        className: "text-mashJijig",
        dataIndex: "tooKhemjee",
        key: "tooKhemjee",
        width: "7rem",
        ellipsis: true,
        summary: true,
        align: "center",
        render: (a, data) => {
          return (
            <BusadZarlagaDelgerengui
              buttonData={a}
              butenData={data}
              salbariinId={filterSalbariinId}
              baiguullagiinId={baiguullagiinId}
              ognoo={ognoo}
              token={token}
              tailanGaralt={tailanGaralt}
            />
          );
        },
      },

      {
        title: "Нийт",
        dataIndex: "niitDun",
        key: "niitDun",
        className: "text-mashJijig",
        width: "8rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a) => {
          const formatted = new Intl.NumberFormat("en-US").format(a);
          return <div className="flex justify-end">{formatted}₮</div>;
        },
      },
      {
        title: "Ажилтан",
        dataIndex: ["_id", "ajiltaniiNer"],
        key: "ajiltanNer",
        className: "text-mashJijig",
        width: "10rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (e) => {
          return <div className="text-center">{e}</div>;
        },
      }
    );
    return jagsaalt;
  }, [shineBagana, , tailanGaralt, filterSalbariinId, ognoo]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });
  function getValueByDataIndex(record, dataIndex) {
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce(
        (obj, key) => (obj ? obj[key] : undefined),
        record
      );
    }
    return record[dataIndex];
  }

  return (
    <div>
      <div className=" flex flex-col pb-2 md:flex-row">
        <div className="mb-5 flex w-full   gap-2 md:w-[50%] md:flex-row">
          <DatePicker.RangePicker
            locale={local}
            value={ognoo}
            onChange={setOgnoo}
            allowClear={false}
            className="flex w-[50%] gap-2 !rounded-md p-5 md:w-[40%]"
          />
          <div className="flex w-[50%] gap-2">
            <Select
              allowClear
              showSearch
              mode="multiple"
              filterOption={(a) => a}
              size="medium"
              bordered={false}
              className="!h-[36px] w-[50%] !rounded-md border-[1px] border-[#4fd1c5]  dark:bg-black md:w-[50%]"
              placeholder={
                salbaruud?.find((x) => x._id === salbariinId)?.ner ||
                "Салбар сонгох"
              }
              onChange={(v) => {
                setFilterSalbariinId(v);
              }}
              onClear={() => setFilterSalbariinId(salbariinId)}
            >
              {salbaruud?.map((v) => (
                <Select.Option key={v?._id} value={v?._id}>
                  <div className="flex flex-row  dark:text-gray-200 dark:bg-gray-800 overflow-hidden ">{v?.ner}</div>
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              placeholder="Бараа сонгох"
              allowClear
              mode="multiple"
              className="!h-[36px] w-[50%] rounded-md  border-[1px] border-[#4fd1c5]  bg-white md:w-40"
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
                setSongosonBaraa(undefined);
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
                        className="flex flex-row truncate text-gray-600  dark:text-gray-300"
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
          unshijBaina={unshijBaina}
          size="small"
          pagination={{
            current:
              tailanGaralt &&
              Array.isArray(tailanGaralt) &&
              tailanGaralt.length > 0 &&
              tailanGaralt.khuudasniiDugaar
                ? tailanGaralt.khuudasniiDugaar
                : 1,
            pageSize: tailanGaralt?.khuudasniiKhemjee,
            total: tailanGaralt?.length > 0 && tailanGaralt.tooKhemjee,
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
          dataSource={tailanGaralt}
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
                    Огноо: {moment(ognoo?.[0]).format("YYYY-MM-DD")}-{" "}
                    {moment(ognoo?.[1]).format("YYYY-MM-DD")}
                  </div>
                ) : (
                  <div>{""}</div>
                )}
              </div>
              <div className="w-1/3 text-center text-sm font-bold"></div>
              <div className="w-1/3 text-right text-sm">
                {filterSalbariinId ? (
                  <div>
                    Салбар:{" "}
                    {
                      tailanGaralt?.find((a) => a?._id === filterSalbariinId)
                        ?.ner
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
                  <th className="border text-mashJijigiinJijig">Барааны нэр</th>
                  <th className="border text-mashJijigiinJijig">Дотоод код</th>
                  <th className="border text-mashJijigiinJijig">Салбар</th>
                  <th className="border text-mashJijigiinJijig">Тоо хэмжээ</th>
                  <th className="border text-mashJijigiinJijig">Нэгж өртөг</th>
                  <th className="border text-mashJijigiinJijig">Ажилтан</th>
                </tr>
              </thead>

              <tbody>
                {tailanGaralt?.map((mur, index) => (
                  <tr key={index}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="border text-center text-mashJijigiinJijig"
                      >
                        {col.render
                          ? col.render(
                              getValueByDataIndex(mur, col.dataIndex),
                              mur,
                              index
                            )
                          : getValueByDataIndex(mur, col.dataIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
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

export default Zarlaga;
