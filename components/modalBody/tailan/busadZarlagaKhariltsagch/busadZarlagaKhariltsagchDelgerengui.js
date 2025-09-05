import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Table as AntdTable } from "antd";
import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";
import { tsonkhnuud } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import moment from "moment";
import Link from "next/link";
import useBusadZarlagaDelgerengui from "hooks/tailan/useBusadZarlagaDelgerengui";
import { orderBy } from "lodash";
import useData from "hooks/useData";
import { Pagination } from "antd";
import useBusadZarlagaKhariltsagchDelgerengui from "hooks/tailan/useBusadZarlagaKhariltsagch";
import posUilchilgee from "services/posUilchilgee";
function BusadZarlagaKhariltsagchDelgerengui({
  buttonData,
  khariltsagchData,
  token,
  ognoo,
  baiguullagiinId,
}) {
  const [khuudaslalt, setKhuudaslalt] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const zarlagaSearchKeys = ["baraanuud.code"];

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: khariltsagchData._id?.salbariinId,
      baiguullagiinId: baiguullagiinId,
      khariltsagchiinId: khariltsagchData._id?.khariltsagchiinId,
      turul: khariltsagchData._id?.turul,
    };
    return query;
  }, [khariltsagchData, ognoo, baiguullagiinId]);

  const { delgerenguiData, unshijBaina, setTailanKhuudaslalt } =
    useBusadZarlagaKhariltsagchDelgerengui(openModal && token, shuult);

  function HulDun({ garalt, columns }) {
    const getValue = (obj, dataIndex) => {
      if (Array.isArray(dataIndex)) {
        return dataIndex.reduce((acc, key) => acc?.[key], obj);
      }
      return obj?.[dataIndex];
    };

    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => {
          let sumValue = null;

          if (mur.summary) {
            sumValue = garalt?.reduce((sum, item) => {
              const value = getValue(item, mur.dataIndex);
              return sum + (typeof value === "number" ? value : 0);
            }, 0);
          }

          return (
            <AntdTable.Summary.Cell
              key={index}
              index={index}
              align="center"
              className={`${mur.summary ? "font-bold" : "border-none"}`}
            >
              {mur.summary ? (
                mur.title === "№" ? (
                  <div className="text-left">Нийт</div>
                ) : mur.title === "Тоо хэмжээ" ? (
                  sumValue
                ) : mur.title === "Нийт өртөг" || mur.title === "Нийт" ? (
                  <div className="flex justify-end">
                    {new Intl.NumberFormat("en-US").format(sumValue || 0)}₮
                  </div>
                ) : null
              ) : null}
            </AntdTable.Summary.Cell>
          );
        })}
      </AntdTable.Summary.Row>
    );
  }

  const printRef = useRef(null);

  function handleOpen() {
    setOpenModal(true);
  }
  function handleCancel() {
    setOpenModal(false);
  }

  const { data: salbaruud } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        align: "center",
        width: "2.5rem",
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (delgerenguiData?.khuudasniiDugaar || 0) *
            (delgerenguiData?.khuudasniiKhemjee || 0) -
          (delgerenguiData?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Огноо",
        dataIndex: "createdAt",
        align: "center",
        width: "4rem",
        sortDirections: ["descend", "ascend", "descend"],

        showSorterTooltip: false,
        render: (b) => moment(b).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "Барааны нэр",
        dataIndex: ["baraanuud", "ner"],
        align: "center",
        width: "5rem",
        showSorterTooltip: false,
        render: (b) => {
          return (
            <div className="flex justify-start overflow-hidden">
              {salbaruud?.find((a) => b?.salbariinId === a.baraanuud)?.ner}
            </div>
          );
        },
      },
      {
        title: "Дотоод код",
        dataIndex: ["baraanuud", "code"],
        align: "center",
        key: "tooKhemjee",
        width: "5rem",
        sortDirections: ["descend", "ascend", "descend"],
        showSorterTooltip: false,
        render: (a) => {
          return <div className="overflow-hidden text-center">{a}</div>;
        },
      },

      {
        title: "Тоо хэмжээ",
        dataIndex: ["baraanuud", "too"],
        key: "ajiltan",
        align: "center",
        width: "2rem",
        summary: true,
        render: (a) => {
          return <div className="overflow-hidden text-center">{a}</div>;
        },
      },

      {
        title: "Нийт өртөг",
        dataIndex: ["baraanuud", "niitUne"],
        align: "center",
        key: "niitUne",
        width: "2rem",
        summary: true,
        render: (a) => {
          return <div className="flex justify-end">{formatNumber(a, 2)}₮</div>;
        },
      },
      {
        title: "Ажилтан",
        dataIndex: ["ajiltan", "ner"],
        align: "center",
        width: "3rem",
        render: (a) => {
          return <div className="flex justify-center truncate">{a}</div>;
        },
      },
    ];
  }, [delgerenguiData, ognoo]);

  return (
    <div>
      <a onClick={handleOpen} className="flex items-center justify-center">
        <div className="underline">{formatNumber(buttonData, 2)}</div>
      </a>
      <Modal
        bodyStyle={{
          backgroundColor: "white",
        }}
        title={
          <div className="text-center text-[20px] font-bold">
            Харилцагч дэлгэрэнгүй
          </div>
        }
        footer={[
          <div key="pagination" className="mb-3 flex w-full justify-end">
            <Pagination
              current={
                delgerenguiData?.khuudasniiDugaar
                  ? delgerenguiData?.khuudasniiDugaar.khuudasniiDugaar
                  : 1
              }
              pageSize={
                delgerenguiData?.khuudasniiDugaar?.khuudasniiKhemjee || 20
              }
              total={delgerenguiData?.khuudasniiDugaar?.tooKhemjee || 0}
              onChange={(khuudasniiDugaar, khuudasniiKhemjee) => {
                setTailanKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }));
              }}
            />
          </div>,
          <Button key="close" onClick={handleCancel} type="primary">
            Хаах
          </Button>,
        ]}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1621}
        open={openModal}
        onCancel={handleCancel}
      >
        <Table
          scroll={{ y: "calc(100vh - 17rem)" }}
          tableLayout="fixed"
          style={{
            height: "auto",
            overflow: "auto",
          }}
          unshijBaina={unshijBaina}
          size="small"
          pagination={false}
          dataSource={delgerenguiData}
          summary={() => (
            <AntdTable.Summary fixed>
              <HulDun garalt={delgerenguiData} columns={columns} />
            </AntdTable.Summary>
          )}
          columns={columns}
        />
      </Modal>
    </div>
  );
}
export default BusadZarlagaKhariltsagchDelgerengui;
