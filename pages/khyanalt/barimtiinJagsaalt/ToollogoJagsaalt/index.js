import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { Button, DatePicker, Select, Checkbox, Table as AntdTable } from "antd";
import moment from "moment";
import { isArray } from "lodash";
import TuukhDelgerenguiKharakhModal from "components/modalBody/toollogo/tuukhDelgernguiKharakhModal";
import local from "antd/lib/date-picker/locale/mn_MN";

import Table from "components/ant/AntdTable";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import useToollogiinJagsaaltAvya from "hooks/useToollogiinJagsaaltAvya";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";

function ToollogoJagsaalt({
  toollogiinJagsaalt,
  toololtKhuudaslalt,
  ognoo,
  setOgnoo,
  token,
  onChangeTable,
}) {
  // const [ognoo, setOgnoo] = useState([
  //   moment().startOf("day"),
  //   moment().endOf("day"),
  // ]);

  // const toollogiinJagsaaltQuery = useMemo(() => {
  //   return {
  //     createdAt: isArray(ognoo)
  //       ? {
  //           $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
  //           $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
  //         }
  //       : undefined,
  //     id: salbariinId,
  //   };
  // }, [salbariinId, ognoo]);

  // const {
  //   toollogiinJagsaalt,
  //   toollogiinJagsaaltMutate,
  //   setKhuudaslalt: toololtKhuudaslalt,
  // } = useToollogiinJagsaaltAvya(
  //   token,
  //   undefined,
  //   toollogiinJagsaaltQuery,
  //   order
  // );

  function ToollogoTuukh({ garalt, columns }) {
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
                        (mur.title === "Илүү" || mur.title === "Зөрүү"
                          ? !!obj.niitZoruu
                            ? obj?.niitZoruu[`${data?.key}`]
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
                              ? !!obj.niitZoruu
                                ? obj?.niitZoruu[`${data1?.key}`]
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
                      data?.summary !== true ? "border-none " : "font-bold "
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
                colSpan={mur?.key === "Барааны мэдээлэл" ? 4 : 1}
                className={"border-none font-bold"}
                index={index}
                align="center"
              >
                {mur?.key === "Барааны мэдээлэл" ? "Нийт дүн" : ""}
              </AntdTable.Summary.Cell>
            );
          }
        })}
      </AntdTable.Summary.Row>
    );
  }

  const columnsTuukh = [
    {
      title: "№",
      key: "",
      align: "center",
      summary: true,
      width: "60px",
      render: (text, record, index) =>
        (toollogiinJagsaalt?.khuudasniiDugaar || 0) *
          (toollogiinJagsaalt?.khuudasniiKhemjee || 0) -
        (toollogiinJagsaalt?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Нэр",
      key: "",
      dataIndex: "ner",
      align: "center",
      summary: true,
      width: "200px",
      render: (ner) => {
        return <div>{ner}</div>;
      },
    },
    {
      title: "Эхэлсэн огноо",
      key: "",
      dataIndex: "ekhelsenOgnoo",
      align: "center",
      width: "150px",
      summary: true,
      render: (ekhelsenOgnoo) => {
        return <div>{moment(ekhelsenOgnoo).format("YYYY-MM-DD hh:mm:ss")}</div>;
      },
    },
    {
      title: "Дууссан огноо",
      key: "",
      dataIndex: "duussanOgnoo",
      width: "150px",
      align: "center",
      render: (duussanOgnoo) => {
        return <div>{moment(duussanOgnoo).format("YYYY-MM-DD hh:mm:ss")}</div>;
      },
    },
    {
      title: "Илүү",
      children: [
        {
          title: "Тоо",
          align: "center",
          width: "150px",
          key: "niitIluuToo",
          dataIndex: "niitZoruu",
          summary: true,
          render: (niitZoruu) => {
            return <div>{formatNumber(niitZoruu?.niitIluuToo, 2)}</div>;
          },
        },
        {
          title: "Үнэ",
          align: "center",
          width: "150px",
          summary: true,
          key: "niitIluuDun",
          dataIndex: "niitZoruu",
          render: (niitZoruu) => {
            return (
              <div className="text-right">
                {formatNumber(niitZoruu?.niitIluuDun, 2)}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "Зөрүү",
      children: [
        {
          title: "Тоо",
          align: "center",
          width: "150px",
          key: "niitDutuuToo",
          summary: true,
          dataIndex: "niitZoruu",
          render: (niitZoruu) => {
            return <div>{formatNumber(niitZoruu?.niitDutuuToo, 2)}</div>;
          },
        },
        {
          title: <div className="text-center">Үнэ</div>,
          align: "right",
          width: "150px",
          summary: true,
          key: "niitDutuuDun",
          dataIndex: "niitZoruu",
          render: (niitZoruu) => {
            return <div>{formatNumber(niitZoruu?.niitDutuuDun, 2)}</div>;
          },
        },
      ],
    },
    {
      title: "",
      align: "center",
      width: "150px",
      render: (v, data) => {
        return (
          <div>
            <TuukhDelgerenguiKharakhModal data={data} token={token} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="col-span-12 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between gap-2">
            <div className="flex w-full items-baseline gap-2">
              <DatePicker.RangePicker
                locale={local}
                value={ognoo}
                onChange={setOgnoo}
                className="!h-[36px] w-64 !rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <Table
              bordered={true}
              dataSource={toollogiinJagsaalt?.jagsaalt}
              columns={columnsTuukh}
              onChange={onChangeTable}
              pagination={{
                current: toollogiinJagsaalt?.khuudasniiDugaar,
                pageSize: toollogiinJagsaalt?.khuudasniiKhemjee,
                total: toollogiinJagsaalt?.niitMur,
                pageSizeOptions: ["10", "50", "100", "250", "500"],
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  toololtKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
              scroll={{ y: "calc(100vh - 20rem)" }}
              summary={() => (
                <AntdTable.Summary fixed>
                  <ToollogoTuukh
                    garalt={toollogiinJagsaalt?.jagsaalt}
                    columns={columnsTuukh}
                  />
                </AntdTable.Summary>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default ToollogoJagsaalt;
