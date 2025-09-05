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
import { Popover } from "components/ant/AntdPopover";
import { useRouter } from "next/router";

function HudulguunJagsaalt({
  hudulguunData,
  setHudulguunKhuudaslalt,
  ognoo,
  setOgnoo,
  token,
  onChangeTable,
  baiguullaga,
}) {
  const router = useRouter();

  const columnsTuukh = [
    {
      title: "№",
      key: "",
      align: "center",
      summary: true,
      width: "60px",
      render: (text, record, index) =>
        (hudulguunData?.khuudasniiDugaar || 0) *
          (hudulguunData?.khuudasniiKhemjee || 0) -
        (hudulguunData?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Огноо",
      key: "",
      dataIndex: "createdAt",
      align: "center",
      summary: true,
      width: "200px",
      render: (createdAt) => {
        return <div>{moment(createdAt).format("YYYY-MM-DD HH:mm")}</div>;
      },
    },
    {
      title: "Баримтын дугаар",
      key: "",
      dataIndex: "barimtiinDugaar",
      align: "center",
      width: "150px",
      summary: true,
      render: (barimtiinDugaar) => {
        return <div>{barimtiinDugaar}</div>;
      },
    },
    {
      title: "Илгээсэн салбар",
      key: "",
      dataIndex: "zarlagdsanSalbariinId",
      width: "150px",
      align: "center",
      render: (zarlagdsanSalbariinId) => {
        return (
          <div>
            {
              baiguullaga.salbaruud.find((a) => a._id === zarlagdsanSalbariinId)
                .ner
            }
          </div>
        );
      },
    },
    {
      title: "Хүсэлт авсан",
      key: "",
      dataIndex: "orlogdsonSalbariinId",
      width: "150px",
      align: "center",
      render: (orlogdsonSalbariinId) => {
        return (
          <div>
            {
              baiguullaga.salbaruud.find((a) => a._id === orlogdsonSalbariinId)
                .ner
            }
          </div>
        );
      },
    },
    {
      title: "Тоо хэмжээ",
      key: "",
      dataIndex: "baraanuud",
      width: "150px",
      align: "center",
      render: (baraanuud, data) => {
        return (
          <div>
            {
              <Popover
                content={data.baraanuud.map((e) => {
                  return (
                    <div className="flex gap-2">
                      <div>{e.ner}:</div>
                      <div>{formatNumber(e.too, 2)}ш</div>
                    </div>
                  );
                })}
                title={false}
              >
                {formatNumber(
                  data.baraanuud.reduce((a, b) => a + b.too || 0, 0),
                  2
                )}
              </Popover>
            }
          </div>
        );
      },
    },
    {
      title: "Нийт",
      key: "",
      dataIndex: "niitDun",
      width: "150px",
      align: "center",
      render: (niitDun) => {
        return <div>{formatNumber(niitDun, 2)}₮</div>;
      },
    },
    {
      title: "",
      key: "",
      dataIndex: "turul",
      width: "150px",
      align: "center",
      render: (turul, data) => {
        return (
          <div>
            <Button
              onClick={() =>
                router.push(
                  `/khyanalt/hudulguun?params=${data._id}&turul=delgerengui`
                )
              }
            >
              Дэлгэрэнгүй
            </Button>
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
              dataSource={hudulguunData?.jagsaalt}
              columns={columnsTuukh}
              onChange={onChangeTable}
              pagination={{
                current: hudulguunData?.khuudasniiDugaar,
                pageSize: hudulguunData?.khuudasniiKhemjee,
                total: hudulguunData?.niitMur,
                pageSizeOptions: ["10", "50", "100", "250", "500"],
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setHudulguunKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
              scroll={{ y: "calc(100vh - 20rem)" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default HudulguunJagsaalt;
