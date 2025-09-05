import Admin from "components/Admin";
import { Select, Table as AntdTable, Button, Popover } from "antd";
import { DatePicker } from "antd";
import { useAuth } from "services/auth";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import Table from "components/ant/AntdTable";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import useTailan from "hooks/tailan/useTailan";
import { Excel } from "antd-table-saveas-excel";
import useJagsaalt from "hooks/useJagsaalt";
import useBaraa from "hooks/useBaraa";
import {
  FileExcelOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import useKhudaldagchiinTailan from "hooks/tailan/useKhudaldagchiinTailan";
import useOrder from "tools/function/useOrder";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

const searchKeysTailan = [
  "baraanuud.baraa.code",
  "baraanuud.baraa.ner",
  "baraanuud.baraa.barCode",
];

function KhudaldagchiinTailan() {
  const { order, onChangeTable } = useOrder({ createAt: -1 });
  const { token, salbariinId, baiguullaga, ajiltan, baiguullagiinId } =
    useAuth();
  const [songogdsonAjiltan, setsongogdsonAjiltan] = useState();
  const [songogdsonBaraa, setSongogdsonBaraa] = useState([]);
  const [songogdsonUilchilgee, setSongogdsonUilchilgee] = useState([]);
  const [ognoo, setOgnoo] = useState([moment(), moment()]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();
  const { RangePicker } = DatePicker;

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [turul, setTurul] = useState("delgerengui");
  const query = useMemo(() => {
    return {
      ekhlekhOgnoo: !!ognoo
        ? ognoo[0].format("YYYY-MM-DD 00:00:00")
        : undefined,
      duusakhOgnoo: !!ognoo
        ? ognoo[1].format("YYYY-MM-DD 23:59:59")
        : undefined,
      salbariinId,
      ajiltniiId: songogdsonAjiltan,
      baraaniiCode: songogdsonBaraa.length === 0 ? null : songogdsonBaraa,
      turul: turul,
    };
  }, [
    ognoo,
    salbariinId,
    songogdsonAjiltan,
    songogdsonBaraa,
    songogdsonUilchilgee,
    turul,
  ]);

  async function exceleerTatya() {
    setLoading(true);

    const excel = new Excel();

    try {
      const { data } = await posUilchilgee(token).post(
        "/delgerenguiTailanAvya",
        {
          ...query,
        }
      );

      var ognoo =
        turul === "delgerengui"
          ? [
              {
                title: "Огноо",
                dataIndex: "_id",
                render: (_id, data) => {
                  return (
                    <div>
                      {moment(data?._id?.ognoo).format("YYYY-MM-DD HH:mm")}
                    </div>
                  );
                },
              },
            ]
          : [];

      excel
        .addSheet(`Худалдагчийн тайлан`)
        .addColumns([
          ...ognoo,
          {
            title: "Барааны нэр",
            dataIndex: "_id",
            render: (id, data) => {
              return <div>{data._id?.baraaniiNer}</div>;
            },
          },
          {
            title: "Ажилтан",
            dataIndex: "_id",
            render: (_ajiltniiNer, data) => {
              return <div>{data._id?.ajiltniiNer}</div>;
            },
          },
          {
            title: "Бар код",
            dataIndex: ["_id", "baraaniiBarCode"],
          },
          {
            title: "Дотоод код",
            dataIndex: ["_id", "baraaniiCode"],
          },
          {
            title: "Тоо ш",
            dataIndex: "tooShirkheg",
            __numFmt__: "#,##0.00",
            __cellType__: "TypeNumeric",
          },
          {
            title: "Барааны үнэ",
            dataIndex: ["_id", "baraaniiUne"],
            __numFmt__: "#,##0.00",
            __cellType__: "TypeNumeric",
          },
          {
            title: "Нийт үнэ",
            dataIndex: "niitUne",
            __numFmt__: "#,##0.00",
            __cellType__: "TypeNumeric",
            render: (data) => {
              return <div className="text-right">{formatNumber(data, 2)}</div>;
            },
          },
        ])
        .addDataSource(data);
      excel.saveAs("ХудалдагчийнТайлан.xlsx");

      setLoading(false);
    } catch (err) {
      setLoading(false);
      // aldaaBarigch(err);
    }
  }

  const { tailanGaralt, unshijBaina, setTailanKhuudaslalt } =
    useKhudaldagchiinTailan(token, query, undefined, searchKeysTailan, order);
  const emZuichQuery = useMemo(
    () => ({
      emiinSanId: baiguullaga?._id,
    }),
    [baiguullagiinId]
  );
  console.log(baiguullagiinId);
  const { data, setKhuudaslalt: setEmzuichKhuudaslalt } = useJagsaalt(
    "/emZuich",
    emZuichQuery,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullaga?._id,
    undefined,
    undefined,
    order
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);

    const totalSum = garalt?.reduce((sum, obj) => sum + obj?.niitUne, 0);
    const totalShirkheg = garalt?.reduce(
      (sum, obj) => sum + obj?.tooShirkheg,
      0
    );
    const baraaniiUneTotal = garalt?.reduce(
      (sum, obj) => sum + obj?._id?.baraaniiUne,
      0
    );

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right"
          >
            {mur.summary ? (
              mur.dataIndex === "niitUne" ? (
                <div className="flex justify-end print:text-buurJijig">
                  <div>{formatNumber(totalSum, 2)}</div>
                  <div>₮</div>
                </div>
              ) : mur.key === "dugaarlalt" ? (
                "Нийт"
              ) : mur.dataIndex === "tooShirkheg" ? (
                <div className="flex items-center justify-center print:text-buurJijig">
                  {tooOronKhyazgaarliy(totalShirkheg, 2)}ш
                </div>
              ) : mur.key === "baraaniiUne" ? (
                formatNumber(baraaniiUneTotal, 2) + " ₮"
              ) : mur.key === "ognoo" ? (
                <div className="text-left print:text-buurJijig">Нийт</div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

  var columns = useMemo(() => {
    var ognoo =
      turul === "delgerengui"
        ? [
            {
              title: (
                <div className="font-semibold print:text-buurJijig">Огноо</div>
              ),
              dataIndex: "_id.ognoo",
              align: "center",
              key: "_id.ognoo",
              ellipsis: true,
              showSorterTooltip: false,
              sorter: () => 0,
              width: "150px",
              summary: true,
              className: "print:text-buurJijig border-r border-gray-300",
              showSorterTooltip: false,
              render: (_id, data) => {
                return (
                  <div>
                    {moment(data?._id?.ognoo).format("YYYY-MM-DD HH:mm")}
                  </div>
                );
              },
            },
          ]
        : [];
    var result = [
      {
        title: <div className="print:text-buurJijig">№</div>,
        key: "dugaarlalt",
        className: "text-center",
        align: "center",
        width: "2rem",
        summary: true,
        className: "print:text-buurJijig border-r border-gray-200",
        fixed: "left",
        render: (text, record, index) => index + 1,
      },
      ...ognoo,
      {
        title: (
          <div className="text-center print:text-buurJijig">Барааны нэр</div>
        ),
        width: "200px",
        dataIndex: "_id",
        className: "print:text-buurJijig border-r border-gray-200",
        showSorterTooltip: false,
        render: (id) => {
          return <div>{id?.baraaniiNer}</div>;
        },
      },
      {
        title: (
          <div className="font-semibold print:text-buurJijig">Ажилтан</div>
        ),
        dataIndex: "ajiltniiNer",
        className: "print:text-buurJijig border-r border-gray-200",
        align: "left",
        width: "150px",
        render: (_ajiltniiNer, data) => {
          return <div>{data?._id?.ajiltniiNer}</div>;
        },
      },
      {
        title: (
          <div className="font-semibold print:text-buurJijig">Бар код</div>
        ),
        dataIndex: "_id",
        className: "print:text-buurJijig border-r border-gray-200",
        align: "center",
        width: "150px",
        showSorterTooltip: false,
        render: (id) => {
          return <div>{id?.baraaniiBarCode}</div>;
        },
      },
      {
        title: (
          <div className="text-center font-semibold print:text-buurJijig">
            Дотоод код
          </div>
        ),
        dataIndex: "_id",
        align: "left",
        className: "print:text-buurJijig border-r border-gray-200",
        width: "150px",
        showSorterTooltip: false,
        render: (id) => {
          return <div>{id?.baraaniiCode}</div>;
        },
      },
      {
        title: <div className="font-semibold print:text-buurJijig">Тоо ш</div>,
        dataIndex: "tooShirkheg",
        key: "tooShirkheg",
        align: "center",
        className: "print:text-buurJijig border-r border-gray-200",
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        width: "150px",
        summary: true,
        showSorterTooltip: false,
        render: (tooShirkheg, data) => {
          return <div>{tooOronKhyazgaarliy(tooShirkheg, 2)}</div>;
        },
      },
      {
        title: (
          <div className="text-center print:text-buurJijig">Барааны үнэ</div>
        ),
        dataIndex: "_id.baraaniiUne",
        key: "_id.baraaniiUne",
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        width: "180px",
        className: "print:text-buurJijig border-r border-gray-200",
        align: "right",
        showSorterTooltip: false,
        render: (id, data) => {
          return <div>{formatNumber(data._id.baraaniiUne, 2)}</div>;
        },
      },
      {
        title: (
          <div className=" font-semibold print:text-buurJijig">Нийт үнэ</div>
        ),
        dataIndex: "niitUne",
        align: "center",
        className: "print:text-buurJijig",
        width: "180px",
        ellipsis: true,
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        showSorterTooltip: false,
        render: (data) => {
          return <div className="text-right">{formatNumber(data, 2)}</div>;
        },
      },
    ];
    return result;
  }, [order, turul]);

  const borluulaltiinTailanKhelbereerAvya = useTailan(
    "borluulaltiinTailanKhelbereerAvya",
    token,
    query
  );

  return (
    <Admin
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      title="Худалдагчийн тайлан"
      khuudasniiNer="KhudaldagchiinTailan"
      className="p-0 md:p-4"
      tsonkhniiId={"649009d209767d8b108c77ee"}
    >
      <div className="col-span-12 mb-4 flex h-full flex-col gap-5 px-5 md:px-3">
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full">
              <div className="flex w-[100%] items-center gap-2 ">
                <RangePicker
                  size="large"
                  suffixIcon=""
                  className="!h-[36px] w-64 !rounded-md bg-white"
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  value={ognoo}
                  onChange={(v) => setOgnoo(v)}
                />
                <Select
                  showSearch
                  filterOption={false}
                  bordered={false}
                  onSearch={(search) => {
                    setEmzuichKhuudaslalt((a) => ({ ...a, search }));
                  }}
                  allowClear
                  onChange={(value) => {
                    setsongogdsonAjiltan(value);
                  }}
                  className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800"
                  placeholder="Ажилтан"
                >
                  {data?.jagsaalt?.map((a, i) => {
                    return (
                      <Select.Option key={i} value={a._id}>
                        <div className="dark:bg-gray-800 dark:text-gray-200">
                          {a.ner}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
                <Select
                  showSearch
                  allowClear
                  placeholder="Бараа"
                  optionFilterProp="children"
                  className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white "
                  filterOption={(o) => o}
                  onSearch={(search) =>
                    setBaraaniiKhuudaslalt((a) => ({ ...a, search }))
                  }
                  mode="multiple"
                  onChange={(value) => {
                    setSongogdsonBaraa(value);
                  }}
                >
                  {baraaGaralt?.jagsaalt?.map((mur) => (
                    <Select.Option key={mur._id}>
                      <div>
                        <div className="dark:bg-gray-800 dark:text-gray-200">
                          {mur.ner}
                        </div>
                        <div className="text-xs font-thin text-gray-400">
                          {mur.id}
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  value={turul}
                  showSearch
                  allowClear
                  placeholder="Төрөл"
                  className="!h-[36px] w-40 rounded-md border-[1px] border-[#4FD1C5] bg-white"
                  onChange={(value) => {
                    setTurul(value);
                  }}
                >
                  <Select.Option key={"delgerengui"}>Дэлгэрэнгүй</Select.Option>
                  <Select.Option key={"huraangui"}>Хураангуй</Select.Option>
                </Select>
              </div>
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
            <Table
              pagination={false}
              className="m-0 w-full"
              scroll={{ y: "calc(100vh - 25rem)", x: "calc(100vw - 25rem)" }}
              columns={columns}
              unshijBaina={unshijBaina}
              dataSource={tailanGaralt || []}
              onChange={onChangeTable}
              summary={() => (
                <AntdTable.Summary fixed>
                  <UilgelAvya garalt={tailanGaralt} columns={columns} />
                </AntdTable.Summary>
              )}
            />
          </div>
          <div className="w-full">
            <div className="hidden">
              <div className="flex flex-col gap-3" ref={printRef}>
                <div className="flex w-full items-center justify-between text-sm">
                  <div className="w-[350px] text-left text-xs">
                    {ognoo ? (
                      <div>
                        Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")}-{" "}
                        {moment(ognoo[1]).format("YYYY-MM-DD")}
                      </div>
                    ) : (
                      <div>{""}</div>
                    )}
                  </div>
                  <div className="w-full  text-center text-sm font-bold">
                    Худалдагчийн тайлан
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border bg-gray-400 text-white">
                      <th className="border text-mashJijigiinJijig">№</th>
                      <th
                        className="border text-mashJijigiinJijig"
                        style={{
                          display: turul === "delgerengui" ? "" : "none",
                        }}
                      >
                        Огноо
                      </th>
                      <th className="border text-mashJijigiinJijig"></th>
                      <th className="border text-mashJijigiinJijig">Ажилтан</th>
                      <th className="border text-mashJijigiinJijig">Бар код</th>
                      <th className="border text-mashJijigiinJijig">
                        Дотоод код
                      </th>
                      <th className="border text-mashJijigiinJijig">
                        Тоо ширхэг
                      </th>
                      <th className="border text-mashJijigiinJijig">
                        Барааны үнэ
                      </th>
                      <th className="border text-mashJijigiinJijig">
                        Нийт үнэ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tailanGaralt?.map((mur, index) => {
                      return (
                        <React.Fragment>
                          <tr className="border">
                            <td
                              className="border text-center text-mashJijigiinJijig"
                              key={index}
                            >
                              {index + 1}
                            </td>
                            <td
                              className="w-28 border text-mashJijigiinJijig"
                              style={{
                                display: turul === "delgerengui" ? "" : "none",
                              }}
                            >
                              {moment(mur?._id?.ognoo).format(
                                "YYYY-MM-DD HH:mm"
                              )}
                            </td>
                            <td className="border text-mashJijigiinJijig">
                              {mur?._id?.baraaniiNer}
                            </td>
                            <td className="border text-mashJijigiinJijig">
                              {mur?._id?.ajiltniiNer}
                            </td>
                            <td className="border text-center text-mashJijigiinJijig">
                              {mur?._id?.baraaniiBarCode}
                            </td>
                            <td className="border text-center text-mashJijigiinJijig">
                              {mur?._id?.baraaniiCode}
                            </td>
                            <td className="border text-center text-mashJijigiinJijig">
                              {formatNumber(mur?.tooShirkheg, 2)}
                            </td>
                            <td className="border text-right text-mashJijigiinJijig">
                              {formatNumber(mur?._id?.baraaniiUne, 2)}
                            </td>
                            <td
                              className={`border text-right text-mashJijigiinJijig`}
                            >
                              {formatNumber(mur?.niitUne, 2)}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    <tr>
                      <td className="text-center text-mashJijigiinJijig font-bold">
                        Нийт
                      </td>
                      <td
                        colSpan={turul === "delgerengui" ? 5 : 4}
                        className="text-center text-mashJijigiinJijig font-bold"
                      ></td>
                      <td className="text-center text-mashJijigiinJijig font-bold">
                        {formatNumber(
                          tailanGaralt?.reduce(
                            (a, b) => a + (b.tooShirkheg || 0),
                            0
                          ),
                          2
                        )}
                      </td>
                      <td></td>
                      <td
                        className={`text-right text-mashJijigiinJijig font-bold`}
                      >
                        {formatNumber(
                          tailanGaralt?.reduce(
                            (a, b) => a + (b.niitUne || 0),
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
            <div className="w-full">
              <div className="ml-1 mt-1">Хүлээн авсан байдал</div>
              <div className={"col-span-4 grid grid-cols-12 gap-x-2"}>
                {borluulaltiinTailanKhelbereerAvya?.tailanGaralt?.map((a) => {
                  var nershil;
                  switch (a._id) {
                    case "belen":
                      nershil = "Бэлэн";
                      break;
                    case "khariltsakh":
                      nershil = "Харилцах";
                      break;
                    case "zeel":
                      nershil = "Зээл";
                      break;
                    case "khaan":
                      nershil = "Хаан банк";
                      break;
                    case "tdb":
                      nershil = "TDB";
                      break;
                    case "khas":
                      nershil = "Хас банк";
                      break;
                    case "golomt":
                      nershil = "Голомт банк";
                      break;
                    case "kapitron":
                      nershil = "Капитрон банк";
                      break;
                    case "qpay":
                      nershil = "QPay";
                      break;
                    case "tur":
                      nershil = "Төрийн банк";
                      break;
                    case "khungulult":
                      nershil = "Хөнгөлөлт";
                      break;
                    case "khyamdral":
                      nershil = "Хямдрал";
                      break;
                    case "cart":
                      nershil = "Карт";
                      break;
                    case "hunglult":
                      nershil = "Хөнгөлөлт";
                      break;
                    default:
                      nershil = a._id;
                      break;
                  }
                  return (
                    <div className="col-span-3 block">
                      <div className="col-span-3 flex w-full  justify-between border-b-2 border-gray-400 p-2">
                        <div className="col-span-1 font-bold print:text-mashJijigiinJijig">
                          {nershil}:
                        </div>
                        <div className="col-span-1 text-green-500 print:text-mashJijigiinJijig print:font-[600]">
                          {formatNumber(a?.niitDun)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default KhudaldagchiinTailan;
