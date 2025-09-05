import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Switch, Table as AntdTable } from "antd";
import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import { tsonkhnuud } from "tools/logic/khereglegchiinErkhiinTokhirgoo";

function JagsaaltDelgerenguiTuukh({
  setGuilgeeniiTuukhDelgerengui,
  guilgeeniiTuukhDelgerengui,
}) {
  function handleCancel() {
    setGuilgeeniiTuukhDelgerengui();
  }

  const columns = [
    {
      title: "№",
      key: "index",
      className: "text-center",
      align: "center",
      summary: true,
      width: "3rem",
      fixed: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: <div className="text-center font-semibold">Барааны нэр</div>,
      dataIndex: "baraa",
      align: "left",
      key: "baraa",
      width: "7rem",
      render: (text, record, index) => {
        return <div>{text?.ner}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Худалдах үнэ</div>,
      dataIndex: "baraa",
      align: "right",
      key: "baraa",
      width: "9rem",
      render: (text, record, index) => {
        return <div>{formatNumber(text?.niitUne, 2)}₮</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Тоо хэмжээ</div>,
      dataIndex: "too",
      align: "center",
      key: "too",
      width: "9rem",
      summary: true,
      render: (too) => {
        return <div>{formatNumber(too || 0, 2)}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Нийт үнэ</div>,
      dataIndex: "baraa",
      align: "right",
      key: "baraa.niitUne",
      summary: true,
      width: "9rem",
      render: (text, record, index) => {
        return <div>{formatNumber(text?.zarsanNiitUne, 2)}₮</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Нөат</div>,
      dataIndex: "baraa",
      align: "right",
      key: "baraa.noat",
      summary: true,
      width: "9rem",
      render: (text, record, index) => {
        return (
          <div>
            {formatNumber((text?.noatiinDun || 0) * (record.too || 0), 2)}₮
          </div>
        );
      },
    },
    {
      title: <div className="text-center font-semibold">Дотоод код</div>,
      dataIndex: "baraa",
      align: "center",
      key: "baraa",
      width: "9rem",
      render: (text, record, index) => {
        return <div>{text?.code}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Бар код</div>,
      dataIndex: "baraa",
      align: "center",
      key: "baraa",
      width: "9rem",
      render: (text, record, index) => {
        return <div>{text?.barCode}</div>;
      },
    },
    // {
    //   title: <div className='text-left font-semibold'>Цуврал</div>,
    //   dataIndex: "code",
    //   align: "right",
    //   key: "code",
    //   width: "9rem",
    // },
  ];

  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);

    let totalSum = 0;
    let totalNiitUne = 0;
    let totalNiitNoat = 0;

    for (const obj of garalt) {
      const product = obj?.too || 1 * obj?.niitUne || 1;
      totalSum += product;
    }
    for (const obj of garalt) {
      totalNiitUne += obj?.niitUne || 0;
    }
    for (const obj of garalt) {
      const noat = (obj?.baraa?.noatiinDun || 1) * (obj?.too || 1);
      totalNiitNoat += noat || 0;
    }

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="center"
          >
            {mur.summary
              ? mur.key === "baraa.niitUne"
                ? formatNumber(totalNiitUne, 2) + " ₮"
                : mur.key === "baraa.noat"
                ? formatNumber(totalNiitNoat, 2) + " ₮"
                : mur.title === "№"
                ? "Нийт"
                : formatNumber(
                    garalt?.reduce((a, b) => a + (b[mur?.dataIndex] || 0), 0),
                    2
                  )
              : ""}
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
          <div className="text-center text-[20px] font-bold">
            Баримтын дэлгэрэнгүй
          </div>
        }
        footer={[
          <Button
            onClick={() => setGuilgeeniiTuukhDelgerengui()}
            type="primary"
          >
            Хаах
          </Button>,
        ]}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1300}
        open={!!guilgeeniiTuukhDelgerengui}
        onCancel={handleCancel}
      >
        <Table
          scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
          dataSource={
            !!guilgeeniiTuukhDelgerengui?.baraa
              ? guilgeeniiTuukhDelgerengui?.baraa
              : null
          }
          columns={columns}
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
          summary={() => (
            <AntdTable.Summary fixed>
              <UilgelAvya
                garalt={
                  !!guilgeeniiTuukhDelgerengui?.baraa
                    ? guilgeeniiTuukhDelgerengui.baraa
                    : null
                }
                columns={columns}
              />{" "}
            </AntdTable.Summary>
          )}
        />
        {!!guilgeeniiTuukhDelgerengui?.khariltsagch ? (
          <div className="-mt-10 w-1/2 dark:text-gray-200">
            <div className="flex gap-2 font-normal">
              <div className="font-semibold ">Харилцагчийн урамшуулал:</div>
              {String(
                guilgeeniiTuukhDelgerengui?.khariltsagch.ner
              )?.toUpperCase()}
            </div>
            <div className="mx-2 grid grid-cols-2 gap-5 rounded-md border border-[#4FD1C5] p-1 px-3">
              {guilgeeniiTuukhDelgerengui?.khariltsagch?.bonus?.nemegdsen >
              0 ? (
                <div className="mt-1">
                  <div className="border-b border-dashed border-black font-semibold">
                    Бонус
                  </div>
                  <div className="flex gap-2 dark:text-gray-200">
                    Ашигласан:{" "}
                    <div className="text-green-500">
                      {formatNumber(
                        guilgeeniiTuukhDelgerengui?.khariltsagch?.bonus
                          ?.ashiglasan || 0,
                        2
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 dark:text-gray-200">
                    Өмнөх:{" "}
                    <div className="text-green-500">
                      {formatNumber(
                        guilgeeniiTuukhDelgerengui?.khariltsagch?.bonus
                          ?.umnukh || 0,
                        2
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    Нэмэгдсэн:{" "}
                    <div className="text-green-500">
                      {formatNumber(
                        guilgeeniiTuukhDelgerengui?.khariltsagch?.bonus
                          ?.nemegdsen || 0,
                        2
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              {(guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                ?.khunglultiinTurul === "Хувь" &&
                guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult?.khuvi >
                  0) ||
              (guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                ?.khunglultiinTurul === "Мөнгөн дүн" &&
                guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult?.dun >
                  0) ? (
                <div className="mt-1">
                  <div className="border-b border-dashed border-black font-semibold">
                    Хөнгөлөлт
                  </div>
                  <div className="flex gap-2">
                    Хөнгөлөлтийн төрөл:{" "}
                    <div className="text-green-500">
                      {
                        guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                          ?.khunglultiinTurul
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                      ?.khunglultiinTurul === "Хувь"
                      ? "Хөнгөлсөн хувь"
                      : "Хөнгөлсөн дүн"}
                    :{" "}
                    <div className="text-green-500">
                      {guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                        ?.khunglultiinTurul === "Хувь"
                        ? `${guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult?.khuvi}%`
                        : formatNumber(
                            guilgeeniiTuukhDelgerengui?.khariltsagch?.khunglult
                              ?.dun,
                            0
                          )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
export default JagsaaltDelgerenguiTuukh;
