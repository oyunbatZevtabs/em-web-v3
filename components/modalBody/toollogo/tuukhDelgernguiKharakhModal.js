import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import React, { useEffect, useRef, useState } from "react";
import { Button, Table as AntdTable, DatePicker } from "antd";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import locale from "antd/lib/date-picker/locale/mn_MN";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";
import { Input } from "../antdInput";
import { SearchOutlined } from "@ant-design/icons";
import useToollogoAvya from "hooks/useToollogoAvya";
import useOrder from "tools/function/useOrder";
import { aldaaBarigch } from "services/uilchilgee";
import posUilchilgee from "services/posUilchilgee";

const searchKeys = [
  "baraanuud.ner",
  "baraanuud.code",
  "baraanuud.barCode",
  "barimtiinDugaar",
];

function TuukhDelgerenguiKharakhModal({ data, token }) {
  const { order, onChangeTable } = useOrder({
    "baraanuud.createdAt": 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { baiguullaga, salbariinId } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [baraaniiHuwisagch, setBaraaniiHuwisagch] = useState();
  const [sortHiisenData, setSortHiisenData] = useState(
    data.baraanuud.sort((a, b) => {
      return b.toolsonToo - a.toolsonToo;
    })
  );

  function haihFunction(v) {
    setSearchText(v);
  }

  useEffect(() => {
    if (searchText.length > 0) {
      setSortHiisenData(
        data?.baraanuud?.filter(
          (item) =>
            item?.ner?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.code?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.barCode?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setSortHiisenData(
        data?.baraanuud.sort((a, b) => {
          return b.toolsonToo - a.toolsonToo;
        })
      );
    }
  }, [searchText]);

  const openModal = () => {
    setIsModalOpen(true);
    // posUilchilgee(token)
    //   .get(`/toollogoAvya/${data._id}`, {
    //     params: {
    //       toolson: true,
    //       order,
    //     },
    //   })
    //   .then(({ data }) => {
    //     setToollogiinBaraanuud(data);
    //   })
    //   .catch((e) => {
    //     aldaaBarigch(e);
    //   });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchText("");
  };

  const {
    toollogoBaraa,
    toollogoBaraaMutate,
    setKhuudaslalt: setToololtKhuudaslalt,
  } = useToollogoAvya(
    data._id,
    isModalOpen && token,
    undefined,
    undefined,
    order,
    searchKeys
  );

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function HulDunDelgerengui({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => {
          if (mur?.children?.length > 0 && mur?.key !== "Барааны мэдээлэл") {
            return mur?.children.map((data, i) => {
              const niitEkhniiUldegdel = data?.summary
                ? formatNumber(
                    garalt?.reduce(
                      (sum, obj) =>
                        sum +
                        (mur.title === "Илүү" || mur.title === "Дутуу"
                          ? !!obj.zoruu
                            ? obj?.zoruu[`${data?.key}`]
                            : 0
                          : obj[`${data?.key}`] || 0),
                      0
                    ),
                    2
                  )
                : "";
              if (data.children?.length > 0) {
                return data.children.map((data1, i1) => {
                  const niitEkhniiUldegdel1 = data1?.summary
                    ? formatNumber(
                        garalt?.reduce(
                          (sum, obj) =>
                            sum +
                            (mur.title === "Зөрүү"
                              ? !!obj.zoruu
                                ? obj?.zoruu[`${data1?.key}`]
                                : 0
                              : obj[`${data1?.key}`] || 0),
                          0
                        ),
                        2
                      )
                    : "";
                  return (
                    <AntdTable.Summary.Cell
                      className={`${
                        data1?.summary !== true ? "border-none " : "font-bold "
                      }`}
                      index={i1 + "r"}
                      align="center">
                      {niitEkhniiUldegdel1}
                    </AntdTable.Summary.Cell>
                  );
                });
              } else {
                return (
                  <AntdTable.Summary.Cell
                    className={`${
                      data?.summary !== true ? "border-none " : "font-bold "
                    }`}
                    index={i + "d"}
                    align="center">
                    {niitEkhniiUldegdel}
                  </AntdTable.Summary.Cell>
                );
              }
            });
          } else {
            return (
              <AntdTable.Summary.Cell
                colSpan={mur?.key === "Барааны мэдээлэл" ? 4 : 1}
                className={"border-none font-bold"}
                index={index}
                align="center">
                {mur?.key === "Барааны мэдээлэл" ? "Нийт дүн" : ""}
              </AntdTable.Summary.Cell>
            );
          }
        })}
      </AntdTable.Summary.Row>
    );
  }
  const columnsDelgerengui = [
    {
      title: "Барааны мэдээлэл",
      key: "Барааны мэдээлэл",
      align: "center",
      children: [
        {
          title: "№",
          key: "",
          align: "center",
          width: "50px",
          render: (text, record, index) =>
            (toollogoBaraa?.khuudasniiDugaar || 0) *
              (toollogoBaraa?.khuudasniiKhemjee || 0) -
            (toollogoBaraa?.khuudasniiKhemjee || 0) +
            index +
            1,
        },
        {
          title: "Барааны нэр",
          align: "center",
          dataIndex: "ner",
          key: "",
          render: (ner, data, index) => {
            return <div className="text-left">{ner}</div>;
          },
        },
        {
          title: "Дотоод код",
          align: "center",
          dataIndex: "baraanuud.code",
          showSorterTooltip: false,
          sorter: (a, b) => a - b,
          key: "",
          render: (code, data, index) => {
            return <div className="text-left">{data?.code}</div>;
          },
        },
        {
          title: "Бар код",
          align: "center",
          dataIndex: "barCode",
          key: "",
          render: (barCode, data, index) => {
            return <div className="text-left">{barCode}</div>;
          },
        },
      ],
    },
    {
      title: "Тоо хэмжээ",
      align: "center",
      key: "",
      children: [
        {
          title: "Эцсийн үлдэгдэл",
          summary: true,
          align: "center",
          dataIndex: "etssiinUldegdel",
          key: "etssiinUldegdel",
          render: (etssiinUldegdel, data, index) => {
            return <div>{formatNumber(etssiinUldegdel, 2)}</div>;
          },
        },
        {
          title: "Тоолсон",
          dataIndex: "baraanuud.toolsonToo",
          summary: true,
          align: "center",
          showSorterTooltip: false,
          sorter: (a, b) => (a.zoruu?.dutuuToo || 0) - (b.zoruu?.dutuuToo || 0),
          key: "toolsonToo",
          render: (toolsonToo, data, index) => {
            return (
              <div>
                {" "}
                <div
                  className={`${
                    !!data.zoruu?.iluuToo || data?.zoruu?.iluuToo > 0
                      ? "text-green-500"
                      : !!data.zoruu?.dutuuToo || data?.zoruu?.dutuuToo > 0
                      ? "text-red-500"
                      : ""
                  }`}>
                  {formatNumber(data.toolsonToo, 2)}
                </div>
              </div>
            );
          },
        },
      ],
    },
    {
      title: "Илүү",
      align: "center",
      key: "",
      children: [
        {
          title: "Тоо",
          dataIndex: "baraanuud.zoruu.iluuToo",
          align: "center",
          summary: true,
          showSorterTooltip: false,
          sorter: (a, b) => (a.zoruu?.iluuToo || 0) - (b.zoruu?.iluuToo || 0),

          key: "iluuToo",
          render: (zoruu, record) => (
            <div className="text-center">
              {formatNumber(record?.zoruu?.iluuToo, 2)}
            </div>
          ),
        },
        {
          title: "Үнэ",
          dataIndex: "baraanuud.zoruu.iluuDun",
          summary: true,
          align: "center",
          key: "iluuDun",
          render: (zoruu, record) => (
            <div className="text-right">
              {formatNumber(record?.zoruu?.iluuDun, 2)}
            </div>
          ),
        },
      ],
    },
    {
      title: "Дутуу",
      align: "center",
      key: "",
      children: [
        {
          title: "Тоо",
          align: "center",
          dataIndex: "baraanuud.zoruu.dutuuToo",
          summary: true,
          showSorterTooltip: false,
          sorter: (a, b) => (a.zoruu?.dutuuToo || 0) - (b.zoruu?.dutuuToo || 0),

          key: "dutuuToo",
          render: (zoruu, record) => (
            <div className="text-center">
              {formatNumber(record.zoruu?.dutuuToo, 2)}
            </div>
          ),
        },
        {
          title: "Үнэ",
          align: "center",
          dataIndex: "baraanuud.zoruu.dutuuDun",
          summary: true,
          key: "dutuuDun",
          render: (zoruu, record) => (
            <div className="text-right">
              {formatNumber(record?.zoruu?.dutuuDun, 2)}
            </div>
          ),
        },
      ],
    },
  ];
  return (
    <>
      <Button onClick={openModal} type="primary">
        Дэлгэрэнгүй
      </Button>
      <Modal
        width={"2038px"}
        okText="Эхлүүлэх"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handlePrint} className="w-[5%]">
              <PrinterOutlined />
              Хэвлэх
            </Button>
            <Button
              type="primary"
              onClick={handleCancel}
              style={{ width: "100px" }}>
              Хаах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Дэлгэрэнгүй
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <DatePicker.RangePicker
              disabled
              locale={locale}
              value={
                !!data?.ekhlekhOgnoo && !!data?.duusakhOgnoo
                  ? [moment(data?.ekhlekhOgnoo), moment(data?.duusakhOgnoo)]
                  : [moment().startOf("day"), moment().endOf("day")]
              }
              className="!h-[36px] w-[20%] !rounded-md bg-white"
            />
            <div className="w-[200px]">
              <Input
                placeholder="Хайх"
                onChange={(e) => {
                  setToololtKhuudaslalt((a) => ({
                    ...a,
                    search: e.target.value,
                    khuudasniiDugaar: 1,
                  }));
                }}
                prefix={<SearchOutlined />}
              />
            </div>
          </div>
          <div>
            <Table
              scroll={{ y: "calc(80vh - 25rem)" }}
              columns={columnsDelgerengui}
              dataSource={toollogoBaraa?.jagsaalt}
              onChange={onChangeTable}
              bordered={true}
              pagination={{
                current: parseFloat(toollogoBaraa?.khuudasniiDugaar),
                pageSize: parseFloat(toollogoBaraa?.khuudasniiKhemjee),
                total: parseFloat(toollogoBaraa?.niitMur),
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
                  setToololtKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  }));
                },
              }}
              summary={() => (
                <AntdTable.Summary fixed>
                  <HulDunDelgerengui
                    garalt={data.baraanuud}
                    columns={columnsDelgerengui}
                  />
                </AntdTable.Summary>
              )}
            />
          </div>
        </div>
        <div className="hidden">
          <div ref={printRef}>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="w-full text-center text-sm font-bold">
                  Тооллого
                </div>
                <div className="flex w-full justify-between">
                  <div className="w-full text-left text-sm">
                    <div>
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
                    <div>
                      <div>Төрөл: Худалдах үнээр</div>
                    </div>
                    {/* <div>
                      <div>Нэр: {data?.ner}</div>
                    </div> */}
                  </div>
                  <div className="w-full text-right text-sm">
                    <div>
                      {data?.ekhlekhOgnoo && !!data?.duusakhOgnoo && (
                        <div>
                          Огноо:{" "}
                          {moment(data?.ekhlekhOgnoo).format("YYYY-MM-DD")} -{" "}
                          {moment(data?.duusakhOgnoo).format("YYYY-MM-DD")}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="inline-flex">
                        Нэр:{" "}
                        <div className="ml-[4px] font-bold">{data?.ner}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="w-full border bg-gray-300 text-black">
                  <td
                    colspan="4"
                    className="border text-center text-mashJijigiinJijig">
                    Барааны мэдээлэл
                  </td>
                  <td
                    colspan="2"
                    className="border text-center text-mashJijigiinJijig">
                    Тоо хэмжээ
                  </td>
                  <td
                    colspan="2"
                    className="border text-center text-mashJijigiinJijig">
                    Илүү
                  </td>
                  <td
                    colspan="2"
                    className="border text-center text-mashJijigiinJijig">
                    Дутуу
                  </td>
                </tr>
                <tr className="border bg-gray-300 text-black">
                  <td className="border text-center text-mashJijigiinJijig">
                    №
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Барааны нэр
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Дотоод код
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Бар код
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Эцсийн үлдэгдэл
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Тоолсон
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Тоо
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Үнэ
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Тоо
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Үнэ
                  </td>
                </tr>
              </thead>
              <tbody>
                {toollogoBaraa?.jagsaalt?.map((mur, index) => {
                  return (
                    <React.Fragment>
                      <tr>
                        <td
                          className="border text-center text-mashJijigiinJijig"
                          key={index}>
                          {index + 1}
                        </td>
                        <td className="border pl-4 text-mashJijigiinJijig">
                          {mur?.ner}
                        </td>
                        <td className="border text-mashJijigiinJijig">
                          {mur?.code}
                        </td>
                        <td className="border text-right text-mashJijigiinJijig">
                          {mur?.barCode}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.etssiinUldegdel || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.toolsonToo || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.zoruu?.iluuToo || 0, 2)}
                        </td>
                        <td className="border text-right text-mashJijigiinJijig">
                          {formatNumber(mur?.zoruu?.iluuDun || 0, 2)}
                        </td>
                        <td className="border text-center text-mashJijigiinJijig">
                          {formatNumber(mur?.zoruu?.dutuuToo || 0, 2)}
                        </td>{" "}
                        <td className="border text-right text-mashJijigiinJijig">
                          {formatNumber(mur?.zoruu?.dutuuDun || 0, 2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TuukhDelgerenguiKharakhModal;
