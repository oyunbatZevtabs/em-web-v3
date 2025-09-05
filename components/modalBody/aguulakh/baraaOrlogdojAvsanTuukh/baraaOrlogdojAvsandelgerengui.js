import {
  EditOutlined,
  PrinterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Popover,
  Select,
  Switch,
  Table as AntdTable,
} from "antd";
import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import { tsonkhnuud } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import { useReactToPrint } from "react-to-print";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import { useMemo } from "react";

function turulHurwuulelt(turul) {
  switch (turul) {
    case "belen":
      return "Бэлэн";
    case "zeel":
      return "Зээл";
  }
}

function BaraOrlogdojAvsanDelgerengui({
  setKhelber,
  khelber,
  baraaniiKhariltsagch,
  setBaraOrlogdojAvsanDelgerengui,
  baraOrlogdojAvsanDelgerenguiModal,
  ajiltan,
  ognoo,
}) {
  function handleCancel() {
    setKhelber();
    setBaraOrlogdojAvsanDelgerengui();
  }

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function unwindTsuvral(data) {
    const flattenedData = data?.flatMap((obj) =>
      obj.tsuvral.length > 0
        ? obj.tsuvral.map((item) => ({ ...obj, ...item }))
        : obj
    );

    return flattenedData;
  }

  const delgeruulsenData = useMemo(() => {
    if (baraOrlogdojAvsanDelgerenguiModal) {
      return unwindTsuvral(baraOrlogdojAvsanDelgerenguiModal);
    }
    return undefined;
  }, [baraOrlogdojAvsanDelgerenguiModal]);

  const columns = [
    {
      title: "№",
      key: "index",
      className: "text-center",
      align: "center",
      width: "3rem",
      fixed: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: <div className="text-center font-semibold">Харилцагч</div>,
      dataIndex: "baraaniiKhariltsagch",
      align: "left",
      key: "baraaniiKhariltsagch",
      ellipsis: true,
      render: () => baraaniiKhariltsagch,
      summary: true,
    },
    {
      title: <div className="text-center font-semibold">Бар код</div>,
      dataIndex: "barCode",
      align: "right",
      key: "barCode",
      width: "9rem",
    },
    {
      title: <div className="text-center font-semibold">Дотоод код</div>,
      dataIndex: "code",
      align: "center",
      key: "code",
      width: "9rem",
    },
    {
      title: <div className="text-center font-semibold">Нэр</div>,
      dataIndex: "ner",
      align: "left",
      key: "ner",
      ellipsis: true,
    },
    {
      title: <div className="text-center font-semibold">Зарах үнэ</div>,
      dataIndex: "zarakhUne",
      align: "right",
      key: "zarakhUne",
      width: "9rem",
      render: (zarakhUne, record, index) => {
        return <div>{formatNumber(zarakhUne, 2)}₮</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Нэгж өртөг</div>,
      dataIndex: "urtugUne",
      align: "right",
      key: "urtugUne",
      width: "9rem",
      render: (text, record, index) => {
        return <div>{formatNumber(text, 2)}₮</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Тоо хэмжээ</div>,
      dataIndex: "too",
      align: "center",
      summary: true,
      key: "too",
      width: "9rem",
      render: (text, record, index) => {
        return (
          <Popover
            content={record?.tsuvral?.map((e) => (
              <div className="flex w-[300px] justify-between">
                <div>
                  {record.ognooniiMedeelelBurtgekhEsekh
                    ? moment(e.duusakhOgnoo).format("YYYY-MM-DD")
                    : e.dugaar}
                </div>
                <div>{e.too}ш</div>
              </div>
            ))}
          >
            <div>{text}ш</div>
          </Popover>
        );
      },
    },
    {
      title: <div className="text-center font-semibold">Нийт үнэ</div>,
      dataIndex: "urtugUne",
      align: "right",
      key: "urtugUne",
      summary: true,
      width: "9rem",
      render: (text, record, index) => {
        return <div>{formatNumber(record.urtugUne * record.too, 2)}₮</div>;
      },
    },
  ];

  const khevlekhColumn = [
    {
      title: <div className="w-full text-mashJijigiinDundaj">№</div>,
      key: "index",
      className: "text-center",
      align: "center",
      width: "3rem",
      fixed: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Барааны нэр
        </div>
      ),
      dataIndex: "ner",
      align: "left",
      key: "baraaniiNer",
      summary: true,
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Дотоод код
        </div>
      ),
      dataIndex: "code",
      align: "center",
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Бар код
        </div>
      ),
      dataIndex: "barCode",
      align: "right",
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Тоо хэмжээ
        </div>
      ),
      dataIndex: "too",
      align: "center",
      key: "too",
      render: (text, record, index) => {
        return (
          <div>
            {tooOronKhyazgaarliy(text, 2)}
            {"ш"}
          </div>
        );
      },
      summary: true,
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Зарах үнэ
        </div>
      ),
      dataIndex: "zarakhUne",
      align: "right",
      key: "zarakhUne",
      width: "9rem",
      render: (zarakhUne, record, index) => {
        return <div>{formatNumber(zarakhUne, 2)}₮</div>;
      },
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Нэгж өртөг
        </div>
      ),
      dataIndex: "urtugUne",
      key: "negjUrtug",
      align: "right",
      render: (text, record, index) => {
        return <div>{formatNumber(text, 2)}₮</div>;
      },
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Нийт үнэ
        </div>
      ),
      dataIndex: "urtugUne",
      align: "right",
      key: "niitUne",
      render: (text, record, index) => {
        return <div>{formatNumber(record.urtugUne * record.too, 2)}₮</div>;
      },
      summary: true,
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Цуврал
        </div>
      ),
      dataIndex: "dugaar",
      align: "right",
    },
    {
      title: (
        <div className="text-center text-mashJijigiinDundaj font-semibold">
          Дуусах хугацаа
        </div>
      ),
      dataIndex: "duusakhOgnoo",
      align: "right",
      render: (a) => {
        return <div>{moment(a).format("YYYY-MM-DD")}</div>;
      },
    },
  ];

  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);
    let totalSum = 0;

    for (const obj of garalt) {
      const product = obj.too * obj.urtugUne;
      totalSum += product;
    }

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
              mur.dataIndex === "urtugUne" ? (
                formatNumber(totalSum, 2) + " ₮"
              ) : mur.dataIndex === "baraaniiKhariltsagch" ? (
                <div className="flex items-center justify-start">Нийт</div>
              ) : (
                tooOronKhyazgaarliy(
                  garalt?.reduce((a, b) => a + (b[mur.dataIndex] || 0), 0),
                  2
                ) + "ш"
              )
            ) : (
              ""
            )}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

  return (
    <div>
      <Modal
        bodyStyle={{
          backgroundColor: "white",
        }}
        title={
          <div className="flex w-full items-center justify-between">
            <div className="w-1/3">
              Огноо: {moment(ognoo?.[0]).format("YYYY-MM-DD")} -{" "}
              {moment(ognoo?.[1]).format("YYYY-MM-DD")}
            </div>
            <div className="w-1/3 text-center text-[20px] font-bold">
              Дэлгэрэнгүй
            </div>
            <div className="w-1/3"></div>
          </div>
        }
        footer={[
          <div className="flex w-full items-center justify-end gap-2">
            <Button onClick={handlePrint}>
              <PrinterOutlined />
              Хэвлэх
            </Button>
            <Button
              onClick={() => setBaraOrlogdojAvsanDelgerengui()}
              type="primary"
            >
              Хаах
            </Button>
          </div>,
        ]}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1300}
        open={!!baraOrlogdojAvsanDelgerenguiModal}
        onCancel={handleCancel}
      >
        <Table
          scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
          dataSource={
            !!baraOrlogdojAvsanDelgerenguiModal
              ? baraOrlogdojAvsanDelgerenguiModal
              : null
          }
          columns={columns}
          summary={() => (
            <AntdTable.Summary fixed>
              <UilgelAvya
                garalt={
                  baraOrlogdojAvsanDelgerenguiModal &&
                  baraOrlogdojAvsanDelgerenguiModal
                }
                columns={columns}
              />{" "}
            </AntdTable.Summary>
          )}
          //   pagination={{
          //     current: parseFloat(baraaOrlogdokhGaralt?.khuudasniiDugaar),
          //     pageSize: baraaOrlogdokhGaralt?.khuudasniiKhemjee,
          //     total: baraaOrlogdokhGaralt?.niitMur,
          //     showSizeChanger: true,
          //     onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
          //       setBaraaOrlogdokhKhuudaslalt((umnukh) => ({
          //         ...umnukh,
          //         khuudasniiDugaar,
          //         khuudasniiKhemjee,
          //       })),
          //   }}
        />
      </Modal>
      <div
        className="hidden h-full w-full flex-col items-center justify-start print:flex"
        ref={printRef}
      >
        <div className="mx-12 mt-4 flex w-full items-center justify-center font-semibold">
          Орлогын дэлгэрэнгүй баримт
        </div>
        <div className="w-full">
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="ml-4 flex gap-1">
              <strong>Нийлүүлэгч:</strong> <div>{baraaniiKhariltsagch}</div>
            </div>
            <div className="mr-4 flex gap-1">
              <strong>Огноо:</strong> <div>{moment().format("YYYY-MM-DD")}</div>
            </div>
          </div>
          <strong className="ml-4">{turulHurwuulelt(khelber)}</strong>
        </div>
        <Table
          dataSource={delgeruulsenData}
          className="!m-0"
          rowClassName="bg-transparent text-mashJijigiinDundaj"
          columns={khevlekhColumn}
          bordered
          pagination={false}
          summary={() => {
            let totalSum = 0;
            if (delgeruulsenData?.length > 0) {
              for (const obj of delgeruulsenData) {
                const product = obj?.too * obj?.urtugUne;
                totalSum += product;
              }
            }
            return (
              <AntdTable.Summary fixed>
                <AntdTable.Summary.Row>
                  {khevlekhColumn.map((mur, index) => (
                    <AntdTable.Summary.Cell
                      className={`${
                        mur.summary !== true ? "border-none " : "font-semibold "
                      }`}
                      index={index}
                      align="right"
                    >
                      {mur.summary ? (
                        mur.key === "niitUne" ? (
                          <div className="text-mashJijigiinDundaj">
                            {formatNumber(totalSum, 2) + "₮"}
                          </div>
                        ) : mur.key === "baraaniiNer" ? (
                          <div className="text-left text-mashJijigiinDundaj">
                            Нийт
                          </div>
                        ) : mur.key === "negjUrtug" ? (
                          <div className="text-mashJijigiinDundaj">
                            {formatNumber(
                              delgeruulsenData?.reduce(
                                (a, b) => a + (b[mur.dataIndex] || 0),
                                0
                              ),
                              2
                            ) + "₮"}
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center text-mashJijigiinDundaj">
                            {tooOronKhyazgaarliy(
                              delgeruulsenData?.reduce(
                                (a, b) => a + (b[mur.dataIndex] || 0),
                                0
                              ),
                              2
                            ) + "ш"}
                          </div>
                        )
                      ) : (
                        ""
                      )}
                    </AntdTable.Summary.Cell>
                  ))}
                </AntdTable.Summary.Row>
              </AntdTable.Summary>
            );
          }}
        />
        <div className="ml-[2.5rem] mt-8 flex w-1/2 justify-start">
          <div className="flex w-1/2 flex-col gap-3">
            <div className="text-right text-mashJijigiinJijig italic">
              Хүлээн авсан:
            </div>
            <div className="text-right text-mashJijigiinJijig italic">
              Хүлээлгэн өгсөн:
            </div>
          </div>
          <div className="flex w-1/2 flex-col gap-3">
            <div className="text-left text-mashJijigiinJijig italic">
              ................................/
              {ajiltan?.ovog && ajiltan?.ovog[0]}
              {ajiltan?.ovog && "."}
              {ajiltan?.ner}/
            </div>
            <div className="text-left text-mashJijigiinJijig italic">
              ................................
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BaraOrlogdojAvsanDelgerengui;
