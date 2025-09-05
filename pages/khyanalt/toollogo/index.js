import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import Table from "components/ant/AntdTable";
import { Button, DatePicker, Select, Checkbox, Table as AntdTable } from "antd";
import useData from "hooks/useData";
import { useAuth } from "services/auth";
import local from "antd/lib/date-picker/locale/mn_MN";
import moment from "moment";
import ToollogoEkhluulekhModal from "components/modalBody/toollogo/toollogoEkhluulekhModal";
import TooBichihModal from "components/modalBody/toollogo/tooBichihModal";
import TuukhDelgerenguiKharakhModal from "components/modalBody/toollogo/tuukhDelgernguiKharakhModal";
import useEkhelsenToollogoAvya from "hooks/useEkhelsenToollogoAvya";
import useToollogoAvya from "hooks/useToollogoAvya";
import useToollogiinJagsaaltAvya from "hooks/useToollogiinJagsaaltAvya";
import formatNumber from "tools/function/formatNumber";
import { Popover } from "components/ant/AntdPopover";
import { Modal } from "components/ant/AntdModal";
import { aldaaBarigch } from "services/uilchilgee";
import posUilchilgee from "services/posUilchilgee";
import { UnorderedListOutlined, CheckOutlined } from "@ant-design/icons";
import UstgahdaaItgelteibainaModal from "components/modalBody/ustgahdaaItgelteibainaModal";
import useEkhelsenToollogiinDashboardAvya from "hooks/useEkhelsenToollogiinDashboardAvya";
import { isArray } from "lodash";
import { Excel } from "antd-table-saveas-excel";
import { DownloadOutlined } from "@ant-design/icons";
import useBaraa from "hooks/useBaraa";
import useOrder from "tools/function/useOrder";

const shuultuud = [
  {
    key: "1",
    garchig: "Нийт бараа",
    too: "3800",
    // shuult: "Нийт",
    jijigUg: "Тоо",
  },
  {
    key: "4",
    garchig: "Нийт барааны ширхэг",
    too: "2500",
    jijigUg: "Тоо",
    // shuult: "Хугацаа дууссан",
  },
  {
    key: "5",
    garchig: "Нийт барааны үнэ",
    too: "2500",
    jijigUg: "Тоо",
    // shuult: "Хугацаа дууссан",
  },
  {
    key: "2",
    garchig: "Тоологдоогүй бараа",
    too: "2500",
    jijigUg: "Тоо",
    // shuult: "Хугацаа дууссан",
  },
  {
    key: "3",
    garchig: "Тоологдсон бараа",
    too: "1300",
    jijigUg: "Тоо",
    // shuult: "Хугацаа дуусаж байгаа",
  },
];

function Toollogo({ token }) {
  const { order, onChangeTable } = useOrder({ ognoo: -1 });
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [khaikhUtga, setKhaikhUtga] = useState("");
  const [delgerenguiKharakhEekh, setDelgerenguiKharakhEekh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [songosonBaraa, setSongosonBaraa] = useState([]);

  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const ToololtQuery = useMemo(() => {
    var query = {};
    if (khaikhUtga) {
      query = {
        khaikhUtga: khaikhUtga,
      };
    }
    if (songosonBaraa?.length > 0) {
      query.baraanuud = songosonBaraa;
    }
    return query;
  }, [khaikhUtga, songosonBaraa]);

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };

    return query;
  }, [baiguullagiinId, salbariinId]);

  const [modalNeekh, setModalNeekh] = useState(false);

  const [tsutlakhModalNeekh, setTsutlakhModalNeekh] = useState(false);

  const {
    ekhelsenToollogo,
    ekhelsenToollogoMutate,
    setKhuudaslalt,
    toollogoUnshijBaina,
  } = useEkhelsenToollogoAvya(token, ToololtQuery, order);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  useEffect(() => {
    if (!!ekhelsenToollogo) {
      setOgnoo([
        moment(ekhelsenToollogo?.ekhlekhOgnoo),
        moment(ekhelsenToollogo?.duusakhOgnoo),
      ]);
    }
  }, [ekhelsenToollogo]);

  function toollogoTsutslakh() {
    var yavuulakhData = {
      id: ekhelsenToollogo?._id,
    };

    posUilchilgee(token)
      .post("/toollogoTsutsalya", yavuulakhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setTsutlakhModalNeekh(false);
          setSongosonBaraa();
          ekhelsenToollogoMutate();
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
      });
  }

  function exceleerTatya() {
    const excel = new Excel();
    posUilchilgee(token)
      .post("/ekhelsenToollogoAvya", {
        order: order,
        salbariinId: salbariinId,
        khuudasniiKhemjee: ekhelsenToollogo?.niitMur,
      })
      .then(({ data }) => {
        const dataWithIndex = data?.baraanuud.map((item, index) => ({
          ...item,
          index: index + 1,
        }));

        excel
          .addSheet("Бараа")
          .addColumns([
            {
              title: "№",
              dataIndex: "index",
              key: "index",
            },
            {
              title: "Нэр",
              dataIndex: "ner",
              key: "ner",
            },
            {
              title: "Дотоод код",
              dataIndex: "code",
              key: "code",
            },
            {
              title: "Бар код",
              dataIndex: "barCode",
              key: "barCode",
            },
            {
              title: "Эхний үлдэгдэл",
              dataIndex: "ekhniiUldegdel",
              key: "ekhniiUldegdel",
            },
            {
              title: "Эцсийн үлдэгдэл",
              dataIndex: "etssiinUldegdel",
              key: "etssiinUldegdel",
            },
            {
              title: "Худалдах үнэ",
              dataIndex: "negjKhudaldakhUne",
              key: "negjKhudaldakhUne",
            },
            {
              title: "Тоолсон",
              dataIndex: "toolsonToo",
              key: "toolsonToo",
            },
          ])
          .addDataSource(dataWithIndex)
          .saveAs("Тооллого.xlsx");
      });
  }

  function toollogoDuusgakh() {
    setLoading(true);
    var yavuulakhData = {
      id: ekhelsenToollogo?._id,
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
    };

    posUilchilgee(token)
      .post("/toollogoDuusgay", yavuulakhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setModalNeekh(false);
          setSongosonBaraa();
          setLoading(false);
          ekhelsenToollogoMutate();
        }
      })
      .catch((err) => {
        setLoading(false);
        aldaaBarigch(err);
      });
  }

  function ToollogoEkhelsenHulDun({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => {
          if (mur.children?.length > 0 && mur.key !== "Барааны мэдээлэл") {
            return mur.children.map((data, i) => {
              const niitEkhniiUldegdel = data.summary
                ? formatNumber(
                    garalt?.reduce(
                      (sum, obj) => sum + (obj[`${data.dataIndex}`] || 0),
                      0
                    ),
                    2
                  )
                : 0;
              if (data.children?.length > 0) {
                return data.children.map((data1, i1) => {
                  const niitEkhniiUldegdel1 = data1.summary
                    ? formatNumber(
                        garalt?.reduce(
                          (sum, obj) =>
                            sum +
                            (mur.key === "Зөрүү"
                              ? !!obj.zoruu
                                ? obj?.zoruu[`${data1.dataIndex}`]
                                : 0
                              : obj[`${data1.dataIndex}`] || 0),
                          0
                        ),
                        2
                      )
                    : 0;
                  return (
                    <AntdTable.Summary.Cell
                      className={`${
                        data1.summary !== true ? "border-none " : "font-bold "
                      }`}
                      index={i1 + "r"}
                      align="center"
                    >
                      {niitEkhniiUldegdel1}
                    </AntdTable.Summary.Cell>
                  );
                });
              } else {
                return (
                  <AntdTable.Summary.Cell
                    className={`${
                      data.summary !== true ? "border-none " : "font-bold "
                    }`}
                    index={i + "d"}
                    align="center"
                  >
                    {niitEkhniiUldegdel}
                  </AntdTable.Summary.Cell>
                );
              }
            });
          } else {
            return (
              <AntdTable.Summary.Cell
                colSpan={mur.key === "Барааны мэдээлэл" ? 4 : 1}
                className={"border-none font-bold"}
                index={index}
                align="center"
              >
                {mur.key === "Барааны мэдээлэл" ? "Нийт дүн" : ""}
              </AntdTable.Summary.Cell>
            );
          }
        })}
      </AntdTable.Summary.Row>
    );
  }

  const columnsToollogoElhelsen = useMemo(() => {
    var delgerenguiBagana = delgerenguiKharakhEekh
      ? [
          {
            title: <div className="text-xs">Эхний</div>,
            align: "center",
            key: "",
            children: [
              {
                title: <div className="text-xs">Үлдэгдэл</div>,
                summary: true,
                dataIndex: "ekhniiUldegdel",
                width: "100px",
                align: "center",
                key: "",
                render: (ekhniiUldegdel) => (
                  <div className="text-xs">
                    {formatNumber(ekhniiUldegdel, 2)}
                  </div>
                ),
              },
              {
                title: <div className="text-xs">Мөнгөн дүн</div>,
                dataIndex: "ekhniiNiitUne",
                summary: true,
                width: "100px",
                align: "center",
                key: "",
                render: (ekhniiNiitUne, record) => (
                  <div className="text-right text-xs">
                    {formatNumber(ekhniiNiitUne, 2)}
                  </div>
                ),
              },
            ],
          },
          {
            title: <div className="text-xs">Орлого</div>,
            align: "center",
            key: "",
            children: [
              {
                title: <div className="text-xs">Тоо</div>,
                dataIndex: "orlogiinTooKhemjee",
                summary: true,
                align: "center",
                width: "100px",
                key: "",
                render: (too) => (
                  <div className="text-xs">{formatNumber(too, 2)}</div>
                ),
              },
              {
                title: <div className="text-xs">Мөнгөн дүн</div>,
                dataIndex: "orlogiinNiitUne",
                summary: true,
                align: "center",
                width: "100px",
                key: "",
                render: (orlogiinNiitUne, record) => (
                  <div className="text-right text-xs">
                    {formatNumber(orlogiinNiitUne, 2)}
                  </div>
                ),
              },
            ],
          },
          {
            title: <div className="text-xs">Зарлага</div>,
            align: "center",
            key: "",
            children: [
              {
                title: <div className="text-xs">Тоо</div>,
                dataIndex: "zarlagiinTooKhemjee",
                align: "center",
                summary: true,
                width: "100px",
                key: "",
                render: (too) => (
                  <div className="text-xs">{formatNumber(too, 2)}</div>
                ),
              },
              {
                title: <div className="text-xs">Мөнгөн дүн</div>,
                dataIndex: "zarlagiinNiitUne",
                summary: true,
                width: "100px",
                align: "center",
                key: "",
                render: (zarlagiinNiitUne, record) => (
                  <div className="text-right text-xs">
                    {formatNumber(zarlagiinNiitUne, 2)}
                  </div>
                ),
              },
            ],
          },
        ]
      : [];
    return [
      {
        title: <div className="text-xs">Барааны мэдээлэл</div>,
        key: "Барааны мэдээлэл",
        summary: true,
        align: "center",
        children: [
          {
            title: "№",
            key: "№",
            align: "center",
            width: "50px",
            render: (text, record, index) =>
              (ekhelsenToollogo?.khuudasniiDugaar || 0) *
                (ekhelsenToollogo?.khuudasniiKhemjee || 0) -
              (ekhelsenToollogo?.khuudasniiKhemjee || 0) +
              index +
              1,
          },
          {
            title: <div className="text-xs">Барааны нэр</div>,
            dataIndex: "ner",
            align: "center",
            width: "200px",
            key: "Барааны нэр",
            render: (text, record) => (
              <Popover
                content={<div className="text-left text-xs">{text}</div>}
              >
                <div className="w-[200px] truncate text-left text-xs">
                  {text}
                </div>
              </Popover>
            ),
          },
          {
            title: <div className="text-xs">Дотоод код</div>,
            dataIndex: "code",
            align: "center",
            width: "150px",
            key: "Дотоод код",
            render: (code, record) => (
              <div className="text-left text-xs">{code}</div>
            ),
          },
          {
            title: <div className="text-xs">Бар код</div>,
            dataIndex: "barCode",
            width: "150px",
            align: "center",
            key: "Бар код",
            render: (barCode, record) => (
              <div className="text-left text-xs">{barCode}</div>
            ),
          },
        ],
      },
      {
        title: <div className="text-xs">Барааны тоо хэмжээ дүн</div>,
        align: "center",
        summary: true,
        key: "Барааны тоо хэмжээ дүн",
        children: [
          ...delgerenguiBagana,
          {
            title: <div className="text-xs">Худалдах үнэ</div>,
            dataIndex: "baraanuud.negjKhudaldakhUne",
            key: "baraanuud.negjKhudaldakhUne",
            width: "150px",
            showSorterTooltip: false,
            sorter: (a, b) =>
              (a.negjKhudaldakhUne || 0) - (b.negjKhudaldakhUne || 0),
            summary: true,
            align: "center",
            render: (negjKhudaldakhUne, record) => (
              <div className="text-right text-xs">
                {formatNumber(record.negjKhudaldakhUne, 2)}
              </div>
            ),
          },
          {
            title: <div className="text-xs">Эцсийн үлдэгдэл</div>,
            dataIndex: "baraanuud.etssiinUldegdel",
            align: "center",
            showSorterTooltip: false,
            sorter: (a, b) => (a.toolsonToo || 0) - (b.toolsonToo || 0),
            summary: true,
            width: "100px",
            key: "",
            render: (etssiinUldegdel, record) => (
              <div className="text-right text-xs">
                {formatNumber(record?.etssiinUldegdel, 2)}
              </div>
            ),
          },
          {
            title: <div className="text-xs font-bold">Тоолсон</div>,
            showSorterTooltip: false,
            sorter: (a, b) => (a.toolsonToo || 0) - (b.toolsonToo || 0),
            width: "100px",
            align: "center",
            summary: true,
            dataIndex: "baraanuud.etssiinUldegdel",
            key: "toolsonToo",
            render: (toolsonToo, data) => (
              <div className="flex justify-between">
                <TooBichihModal
                  ekhelsenToollogo={ekhelsenToollogo}
                  salbariinId={salbariinId}
                  baiguullagiinId={baiguullagiinId}
                  ekhelsenToollogoMutate={ekhelsenToollogoMutate}
                  data={data}
                  toolsonToo={data?.toolsonToo}
                />
              </div>
            ),
          },
        ],
      },
      {
        title: <div className="text-xs">Зөрүү</div>,
        align: "center",
        key: "Зөрүү",
        children: [
          {
            title: <div className="text-xs">Илүү</div>,
            align: "center",
            key: "",
            children: [
              {
                title: <div className="text-xs">Тоо</div>,
                width: "100px",
                dataIndex: "iluuToo",
                summary: true,
                align: "center",
                key: "",
                render: (zoruu, record) => (
                  <div className="text-center text-xs">
                    {formatNumber(record.zoruu?.iluuToo, 2)}
                  </div>
                ),
              },
              {
                title: <div className="text-xs">Үнэ</div>,
                width: "100px",
                summary: true,
                dataIndex: "iluuDun",
                align: "center",
                key: "",
                render: (zoruu, record) => (
                  <div className="text-right text-xs">
                    {formatNumber(record.zoruu?.iluuDun, 2)}
                  </div>
                ),
              },
            ],
          },
          {
            title: <div className="text-xs">Дутуу</div>,
            align: "center",
            key: "",
            children: [
              {
                title: <div className="text-xs">Тоо</div>,
                align: "center",
                width: "100px",
                summary: true,
                dataIndex: "dutuuToo",
                key: "",
                render: (zoruu, record) => (
                  <div className="text-center">
                    {formatNumber(record.zoruu?.dutuuToo, 2)}
                  </div>
                ),
              },
              {
                title: <div className="text-xs">Үнэ</div>,
                summary: true,
                width: "100px",
                align: "center",
                dataIndex: "dutuuDun",
                key: "",
                render: (zoruu, record) => (
                  <div className="text-right text-xs">
                    {formatNumber(record?.zoruu?.dutuuDun, 2)}
                  </div>
                ),
              },
            ],
          },
        ],
      },
    ];
  }, [delgerenguiKharakhEekh, ekhelsenToollogo, salbariinId, baiguullagiinId]);

  return (
    <Admin
      onSearch={(search) => setKhaikhUtga(search)}
      loading={loading}
      title="Тооллого"
      khuudasniiNer="toollogo"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {ekhelsenToollogo?.tuluv === "ekhelsen" && (
            <div className="grid min-h-[100px] w-full grid-cols-3 place-items-center gap-6 xl:grid-cols-5">
              {shuultuud.map((item) => {
                return (
                  <div className="col-span-1 flex w-full flex-col items-start justify-center rounded-lg border border-[#4FD1C5] p-4 shadow-lg">
                    <div className="font-[500] text-gray-400">
                      {item.garchig}
                    </div>
                    <div className="flex w-full justify-end gap-2 font-[700]">
                      <div className="font-thin text-gray-400">Тоо: </div>
                      {item.garchig === "Нийт бараа"
                        ? ekhelsenToollogo?.niitMur || "0"
                        : item?.garchig === "Тоологдоогүй бараа"
                        ? ekhelsenToollogo?.toologdooguiBaraaniiToo || "0"
                        : item?.garchig === "Тоологдсон бараа"
                        ? ekhelsenToollogo?.niitMur -
                            ekhelsenToollogo?.toologdooguiBaraaniiToo || "0"
                        : item?.garchig === "Нийт барааны ширхэг"
                        ? formatNumber(ekhelsenToollogo?.niitTooKhemjee, 2)
                        : item?.garchig === "Нийт барааны үнэ"
                        ? formatNumber(ekhelsenToollogo?.niitMungunDun, 2) + "₮"
                        : "0"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex w-full justify-between gap-2">
            <div className="flex w-full items-baseline gap-2">
              {/* <DatePicker.RangePicker
                disabled={ekhelsenToollogo?.tuluv === "ekhelsen" ? true : false}
                locale={local}
                value={ognoo}
                onChange={setOgnoo}
                className="!h-[36px] w-64 !rounded-md bg-white"
              /> */}
              {ekhelsenToollogo?.tuluv === "ekhelsen" && (
                <Select
                  showSearch
                  placeholder="Бараа сонгох"
                  className="!h-[36px] w-[288px] rounded-md border-[1px] border-[#4FD1C5] bg-white"
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
                    setKhuudaslalt({
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
                    setKhuudaslalt({
                      khuudasniiDugaar: 1,
                      khuudasniiKhemjee: 20,
                    });
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
                            {mur?.ner}
                          </div>
                          <div className="flex justify-end truncate font-semibold">
                            {mur?.id}
                          </div>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </div>
            {ekhelsenToollogo?.tuluv === "ekhelsen" && (
              <div className="flex gap-2">
                <Popover
                  placement="bottom"
                  content={
                    <div className="flex flex-col gap-2">
                      <div
                        onClick={(e) =>
                          setDelgerenguiKharakhEekh(!delgerenguiKharakhEekh)
                        }
                        className={`mx-2 flex cursor-pointer items-center justify-between rounded-[10px] border-[1px] border-[#4FD1C5] px-2 py-2 ${
                          delgerenguiKharakhEekh ? "selected-option" : ""
                        }`}
                      >
                        <div className="flex !items-center justify-between px-2 !text-center">
                          Дэлгэрэнгүй
                        </div>
                        <div
                          className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] ${
                            delgerenguiKharakhEekh && "bg-[#4FD1C5]"
                          }`}
                        >
                          {delgerenguiKharakhEekh && (
                            <CheckOutlined
                              style={{ color: "white" }}
                              className="text-[8px]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  trigger="click"
                >
                  <Button type="primary">
                    <UnorderedListOutlined
                      className=" text-sm text-green-700"
                      style={{ color: "white" }}
                    />
                    Сонголт
                  </Button>
                </Popover>
                <Button onClick={() => exceleerTatya()} type="gol">
                  <DownloadOutlined className="pr-3 text-lg" />
                  <div className="pr-3">Excel</div>
                </Button>
                <Button onClick={() => setTsutlakhModalNeekh(true)}>
                  Цуцлах
                </Button>
                <Button onClick={() => setModalNeekh(true)}>
                  Тооллого дуусгах
                </Button>
              </div>
            )}
            {ekhelsenToollogo?.tuluv !== "ekhelsen" && (
              <ToollogoEkhluulekhModal
                salbariinId={salbariinId}
                baiguullagiinId={baiguullagiinId}
                ekhelsenToollogoMutate={ekhelsenToollogoMutate}
                setLoading={setLoading}
                loading={loading}
              />
            )}
          </div>

          <div>
            <div className="h-full">
              <Table
                emptyText="Тооллого эхлүүлээгүй байна"
                scroll={{ y: "calc(100vh - 30rem)", x: "50vh" }}
                bordered={true}
                dataSource={ekhelsenToollogo?.baraanuud}
                unshijBaina={toollogoUnshijBaina}
                columns={columnsToollogoElhelsen}
                tableLayout="fixed"
                onChange={onChangeTable}
                rowKey={(row) => row._id}
                pagination={{
                  current: ekhelsenToollogo?.khuudasniiDugaar,
                  pageSize: ekhelsenToollogo?.khuudasniiKhemjee,
                  total: ekhelsenToollogo?.niitMur,
                  pageSizeOptions: ["10", "50", "100", "250", "500"],
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee,
                    })),
                }}
                summary={() => (
                  <AntdTable.Summary fixed>
                    <ToollogoEkhelsenHulDun
                      garalt={ekhelsenToollogo?.baraanuud}
                      columns={columnsToollogoElhelsen}
                    />
                  </AntdTable.Summary>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center font-normal">
            Та хадгалахдаа итгэлтэй байна уу?
          </div>
        }
        open={modalNeekh}
        onCancel={() => setModalNeekh(false)}
      >
        {ekhelsenToollogo?.toologdooguiBaraaniiToo > 0
          ? `Тоологдоогүй ${ekhelsenToollogo?.toologdooguiBaraaniiToo} ширхэг бараа байна.`
          : ""}
        <div className="flex w-full justify-end gap-3">
          <Button type="default" onClick={() => setModalNeekh(false)}>
            Үгүй
          </Button>
          <Button onClick={toollogoDuusgakh} type="primary">
            Тийм
          </Button>
        </div>
      </Modal>

      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center font-normal">
            Та цуцлахдаа итгэлтэй байна уу?
          </div>
        }
        open={tsutlakhModalNeekh}
        onCancel={() => setTsutlakhModalNeekh(false)}
      >
        <div className="flex w-full justify-end gap-3">
          <Button type="default" onClick={() => setTsutlakhModalNeekh(false)}>
            Үгүй
          </Button>
          <Button onClick={toollogoTsutslakh} type="primary">
            Тийм
          </Button>
        </div>
      </Modal>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default Toollogo;
