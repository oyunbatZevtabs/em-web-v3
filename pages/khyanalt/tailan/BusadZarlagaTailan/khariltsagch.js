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
import BusadZarlagaKhariltsagchDelgerengui from "components/modalBody/tailan/busadZarlagaKhariltsagch/busadZarlagaKhariltsagchDelgerengui";
import useZarlagaActKhariltsagch from "hooks/tailan/useZarlagaActKhariltsagch";
import useBaraa from "hooks/useBaraa";
import useKhariltsagch from "hooks/useKhariltsagch";
import uilchilgee from "services/uilchilgee";
const order = { createdAt: -1 };

const searchKeys = ["ner"];
const ashigSearchKeys = ["_id.ner", "_id.code"];

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
            className={`${mur.summary !== true ? "border-none" : "font-bold "}`}
            index={index}
            align="center"
          >
            {mur.summary ? (
              mur.title === "№" ? (
                <div className="text-left">Нийт</div>
              ) : mur.title === "Тоо хэмжээ" ? (
                formatNumber(tooKhemjeeSum)
              ) : mur.title === "Нийт дүн" ? (
                <div className="flex justify-end">
                  {formatNumber(niitDunSum)}₮
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

function Khariltsagch({
  unshijBaina,
  token,
  setOgnoo,
  ognoo,
  khariltsagchDelgerenguiData,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [shineBagana, setShineBagana] = useState([]);
  const [filterSalbariinId, setFilterSalbariinId] = useState();
  const [baraanuud, setBaraanuud] = useState();
  const [turul, setTurul] = useState([]);
  const [open, setOpen] = useState(false);
  const [songosonBaraa, setSongosonBaraa] = useState();
  const printRef = useRef(null);
  const [songogdsonNer, setSongogdsonNer] = useState([]);

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
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  console.log(salbaruud);

  const khariltsagchShuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo?.[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo?.[1].format("YYYY-MM-DD 23:59:59"),
      khariltsagchuud: songogdsonNer.length > 0 ? songogdsonNer : undefined,
      baiguullagiinId: baiguullagiinId,
      baraanuud:
        songosonBaraa && songosonBaraa.length > 0 ? songosonBaraa : undefined,
      salbariinId: filterSalbariinId ? filterSalbariinId : [salbariinId],
      turul: turul && turul.length > 0 ? turul : undefined,
    };

    return query;
  }, [
    ognoo,
    filterSalbariinId,
    songosonBaraa,
    turul,
    baiguullagiinId,
    songogdsonNer,
    baraanuud,
    salbariinId,
  ]);

  const khariltsagchQuery = useMemo(() => {
    const query = {
      orlogo: { $gt: 0 },
      zarlaga: { $gt: 0 },
    };
    return query;
  }, []);

  const { khariltsagchiinGaralt, setKhuudaslalt, khariltsagchMutate } =
    useKhariltsagch(token, 100, khariltsagchQuery, undefined, searchKeys);

  const { khariltsagchData } = useZarlagaActKhariltsagch(
    token,
    khariltsagchShuult,
    undefined,
    ashigSearchKeys,
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

  async function exceleerTatya() {
    const excel = new Excel();
    setLoading(true);
    await posUilchilgee(token)
      .post("/zarlagaAktKhariltsagchTailan", {
        ...khariltsagchShuult,
        khuudasniiKhemjee: khariltsagchData?.jagsaalt?.khuudasniiKhemjee,
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
              title: "Харилцагч",
              dataIndex: ["_id", "khariltsagchiinNer"],
              render: (baraaniiNer) => {
                return baraaniiNer;
              },
            },
            {
              title: "Салбар",
              dataIndex: ["_id", "dotoodCode"],
              __style__: { h: "right" },
              render: (dotoodCode) => {
                return dotoodCode;
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
            {
              title: "Төрөл",
              dataIndex: ["_id", "turul"],
              __style__: { h: "right" },
              render: (turul) => {
                return turul;
              },
            },
          ])
          .addDataSource(khariltsagchData)
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
          className: "text-center",
          align: "center",
          width: "3rem",
          summary: true,
          // fixed: "left",
          render: (text, record, index) =>
            (khariltsagchData?.khuudasniiDugaar || 0) *
              (khariltsagchData?.khuudasniiKhemjee || 0) -
            (khariltsagchData?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Харилцагч",
          dataIndex: ["_id", "khariltsagchiinNer"],
          key: "baraaniiNer",
          width: "12rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (text) => {
            return <div className="text-start">{text}</div>;
          },
        },
        {
          title: "Салбар",
          dataIndex: ["_id", "salbariinId"],
          key: "salbariinId",
          width: "10rem",
          className: "text-mashJijig",
          ellipsis: true,
          align: "center",
          render: (_, record) => (
            <div className="flex justify-start overflow-hidden">
              {salbaruud?.find((a) => a._id === record._id.salbariinId)?.ner ||
                "-"}
            </div>
          ),
        },
        {
          title: "Тоо хэмжээ",
          dataIndex: "tooKhemjee",
          key: "tooKhemjee",
          className: "text-mashJijig",
          width: "10rem",
          align: "center",
          summary: true,
          ellipsis: true,
          render: (a, data) => {
            return (
              <BusadZarlagaKhariltsagchDelgerengui
                buttonData={a}
                khariltsagchData={data}
                baiguullagiinId={baiguullagiinId}
                ognoo={ognoo}
                token={token}
              />
            );
          },
        },
      ],
      jagsaalt = [...jagsaalt, ...shineBagana];
    jagsaalt.push(
      {
        title: "Нийт дүн",
        className: "text-mashJijig",
        dataIndex: "niitDun",
        key: "niitDun",
        width: "7rem",
        ellipsis: true,
        summary: true,
        align: "center",
        render: (e) => {
          return <div className="flex justify-end">{formatNumber(e, 2)}₮</div>;
        },
      },

      {
        title: "Ажилтан",
        dataIndex: ["_id", "ajiltaniiNer"],
        key: "ajiltaniiNer",
        className: "text-mashJijig",
        width: "8rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (a) => {
          return <div className="text-center">{a}</div>;
        },
      },
      {
        title: "Төрөл",
        dataIndex: "turul",
        key: "turul",
        className: "text-mashJijig",
        width: "10rem",
        summary: true,
        ellipsis: true,
        align: "center",
        render: (turul, record) => {
          const turulValue = turul || record?._id?.turul || record?.turul;

          let label = turulValue;
          if (turulValue === "act") label = "Акт";
          else if (turulValue === "busadZarlaga") label = "Бусад";

          return (
            <div
              className="rounded px-2 py-1 text-center text-white dark:text-white"
              style={{
                backgroundColor:
                  turulValue === "busadZarlaga"
                    ? "#115911"
                    : turulValue === "act"
                    ? "#914a4a"
                    : "transparent",
              }}
            >
              {label || "N/A"}
            </div>
          );
        },
      }
    );
    return jagsaalt;
  }, [
    khariltsagchData,
    songogdsonNer,
    salbaruud,
    filterSalbariinId,
    ognoo,
    salbariinId,
  ]);

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
      <div className="mb-5 flex flex-col pb-2 md:flex-col xl:flex-row">
        <div className="mb-5 flex w-full justify-between gap-2">
          <DatePicker.RangePicker
            locale={local}
            value={ognoo}
            allowClear={false}
            onChange={setOgnoo}
            className="!h-[36px] w-[40%] !rounded-md bg-white md:w-[30%] xl:w-[25%]"
          />
          <div className="flex gap-2 md:w-[40%] xl:mr-5">
            <Select
              allowClear
              showSearch
              mode="multiple"
              filterOption={(a) => a}
              size="medium"
              bordered={false}
              className="!h-[36px] w-[25%] !rounded-md border-[1px] border-[#4fd1c5]  bg-white md:w-[50%]"
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
                  <div
                    className="white-gray-600 flex flex-row overflow-hidden dark:text-gray-300"
                    style={{ textOverflow: "ellipsis" }}
                  >
                    {v?.ner}
                  </div>
                </Select.Option>
              ))}
            </Select>
            <Select
              bordered={false}
              className="!h-[36px] w-[50%] rounded-md  border-[1px] border-[#4fd1c5] bg-white md:w-40"
              style={{ textOverflow: "ellipsis" }}
              showSearch
              mode="multiple"
              filterOption={(o) => o}
              allowClear={true}
              onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
              onChange={(v) => {
                setSongogdsonNer(v);

                v === undefined &&
                  setKhuudaslalt((a) => ({ ...a, search: "" }));
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
              placeholder="Харилцагч сонгох"
            >
              {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
                <Select.Option key={data?._id} className="dark:text-gray-300">
                  {data?.ner}{" "}
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              placeholder="Бараа сонгох"
              allowClear
              mode="multiple"
              className="!h-[36px] w-[25%] rounded-md border-[1px]  border-[#4fd1c5] bg-white md:w-40"
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
            <Select
              allowClear
              showSearch
              mode="multiple"
              filterOption={(o) => o}
              size="medium"
              onClear={() => setTurul([])}
              bordered={false}
              className="!h-[36px] w-[25%] rounded-md border-[1px] border-[#4fd1c5] bg-white md:w-[33%]"
              placeholder="Төрөл сонгох"
              value={turul}
              onChange={(v) => setTurul(v)}
            >
              <Select.Option key="act" value="act">
                <div className="white-gray-600  flex justify-center overflow-hidden dark:text-gray-300">
                  Акт
                </div>
              </Select.Option>
              <Select.Option
                key="busad"
                className="flex justify-center bg-[#fae0e4]"
                value="busadZarlaga"
              >
                <div className="white-gray-600 flex w-full flex-row  overflow-hidden  dark:text-gray-300">
                  Бусад
                </div>
              </Select.Option>
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
              khariltsagchData &&
              Array.isArray(khariltsagchData) &&
              khariltsagchData.length > 0 &&
              khariltsagchData.khuudasniiDugaar
                ? khariltsagchData.khuudasniiDugaar
                : 1,
            pageSize: khariltsagchData?.khuudasniiKhemjee,

            total: khariltsagchData?.length > 0 && khariltsagchData.tooKhemjee,
            defaultPageSize: 20,

            onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
              setTailanKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              }));
            },
          }}
          dataSource={khariltsagchData}
          summary={() => (
            <AntdTable.Summary fixed>
              <HulDun garalt={khariltsagchData || []} columns={columns} />
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
                {salbariinId ? (
                  <div>
                    Салбар:{" "}
                    {khariltsagchData?.find((a) => a?._id === salbariinId)?.ner}
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
                {khariltsagchData?.map((mur, index) => (
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

export default Khariltsagch;
