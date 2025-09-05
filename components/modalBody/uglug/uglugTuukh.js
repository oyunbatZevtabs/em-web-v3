import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import _ from "lodash";
import { useMemo } from "react";
import moment from "moment";
import { EyeOutlined, HomeOutlined } from "@ant-design/icons";
import { Button } from "components/ant/AntdButton";
import { Modal } from "components/ant/AntdModal";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import Table from "components/ant/AntdTable";
import formatNumber from "tools/function/formatNumber";
import { Popover } from "components/ant/AntdPopover";
import useUglug from "hooks/useUglug";
import { Table as AntdTable } from "antd";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import { PiListBulletsBold } from "react-icons/pi";
import useOrder from "tools/function/useOrder";

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

const UglugTuukh = ({
  hariltsagchAjiltanMedeelel,
  token,
  activeKey,
  etssiinDun,
}) => {
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const [openModal, setOpenModal] = useState(false);
  const [kharuulakhTuukh, setKharuulakhTuukh] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function UilgelAvya({ columns }) {
    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right">
            {mur.summary
              ? mur.dataIndex === "orlogo"
                ? "Эцсийн үлдэгдэл"
                : formatNumber(etssiinDun, 2) + "₮"
              : ""}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

  function handleCancel() {
    setOpenModal(false);
  }

  const query = useMemo(() => {
    if (openModal === true) {
      if (activeKey === "2") {
        return { ajiltniiId: hariltsagchAjiltanMedeelel._id };
      } else {
        return { khariltsagchiinId: hariltsagchAjiltanMedeelel._id };
      }
    }
    return {};
  }, [activeKey, openModal, hariltsagchAjiltanMedeelel]);

  const { uglugGaralt, uglugMutate, setKhuudaslalt } = useUglug(
    openModal && token,
    100,
    query,
    order
  );

  // function tuukh(id) {
  //   const uglugQuery =
  //     activeKey === "2"
  //       ? { ajiltniiId: id._id }
  //       : { khariltsagchiinId: id._id };

  //   posUilchilgee(token)
  //     .get("/uglug", { params: { query: uglugQuery } })
  //     .then(({ data }) => {
  //       setKharuulakhTuukh(data), setOpenModal(true);
  //     })
  //     .catch(aldaaBarigch);
  // }
  const columns = useMemo(() => {
    return [
      {
        showSorterTooltip: false,
        sorter: () => 0,
        title: "Огноо",
        dataIndex: "createdAt",
        ellipsis: true,
        width: "125px",
        align: "center",
        render: (ner) => {
          return <div>{moment(ner).format("YYYY-MM-DD HH:mm")}</div>;
        },
      },
      {
        title: "Тайлбар",
        dataIndex: "tailbar",
        ellipsis: true,
        width: "125px",
        align: "center",
        render: (ner) => {
          return (
            <Popover content={<div>{ner}</div>}>
              <div className="flex max-w-[120px] justify-start truncate">
                {ner}
              </div>
            </Popover>
          );
        },
      },
      {
        showSorterTooltip: false,
        sorter: () => 0,
        title: "Кредит",
        summary: true,
        dataIndex: "orlogo",
        ellipsis: true,
        width: "125px",
        align: "center",
        render: (ner) => {
          return (
            <div className="flex justify-end">{formatNumber(ner, 2)}₮</div>
          );
        },
      },
      {
        showSorterTooltip: false,
        sorter: () => 0,
        title: "Дебет",
        dataIndex: "zarlaga",
        ellipsis: true,
        summary: true,
        width: "125px",
        align: "center",
        render: (ner) => {
          return <div className="text-right">{formatNumber(ner, 2)}₮</div>;
        },
      },
    ];
  }, []);

  return (
    <div>
      <div className="flex w-full justify-center">
        {/* <PiListBulletsBold
          className="cursor-pointer text-[20px]"
          onClick={() => setOpenModal(true)}
        /> */}

        <a
          onClick={() => setOpenModal(true)}
          className="ant-dropdown-link flex gap-2 rounded-lg p-[2px] hover:bg-green-100">
          <EyeOutlined style={{ fontSize: "18px", color: "#4fc1d5" }} />
        </a>
      </div>

      <Modal
        bodyStyle={{ paddingBottom: "0" }}
        footer={[
          <div className="flex w-full items-start justify-end">
            <Button onClick={handlePrint}>
              <PrinterOutlined />
              Хэвлэх
            </Button>
            <Button size={"small"} type="primary" onClick={handleCancel}>
              Хаах
            </Button>
          </div>,
        ]}
        width={"735px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className=" text-center text-[20px] ">Өглөг түүх</div>}
        open={openModal}
        onCancel={() => setOpenModal(false)}>
        <div>
          <div className="flex gap-2 dark:text-gray-200">
            <div>Нэр:</div>
            <div className="font-semibold dark:text-gray-200">
              {hariltsagchAjiltanMedeelel?.ner}
            </div>
          </div>
          <Table
            onChange={onChangeTable}
            scroll={{ y: "calc(100vh - 45rem)", x: "50vh" }}
            size="small"
            pagination={{
              pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
              current: uglugGaralt?.khuudasniiDugaar,
              pageSize: uglugGaralt?.khuudasniiKhemjee,
              total: uglugGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            dataSource={uglugGaralt?.jagsaalt}
            columns={columns}
            summary={() => (
              <AntdTable.Summary fixed>
                <UilgelAvya columns={columns} />{" "}
              </AntdTable.Summary>
            )}
          />
        </div>
        <div className="hidden">
          <div ref={printRef}>
            <div className="flex w-full  items-center justify-between text-sm">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex w-full justify-between">
                  <div className="flex gap-2">
                    <div>Нэр:</div>
                    <div className="font-semibold">
                      {hariltsagchAjiltanMedeelel?.ner}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border bg-gray-300 text-black">
                  <td className="border text-center text-mashJijigiinJijig">
                    Огноо
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Тайлбар
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Кредит
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Дебет
                  </td>
                </tr>
              </thead>
              <tbody>
                {uglugGaralt?.jagsaalt?.map((mur, index) => {
                  return (
                    <React.Fragment>
                      <tr>
                        <td className="border text-center text-mashJijigiinJijig">
                          {moment(mur?.createdAt).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td className="border text-mashJijigiinJijig">
                          {mur?.tailbar}
                        </td>
                        <td className="border text-end text-mashJijigiinJijig">
                          {formatNumber(mur?.orlogo, 2)}₮
                        </td>
                        <td className="border text-right text-mashJijigiinJijig">
                          {formatNumber(mur?.zarlaga, 2)}₮
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
    </div>
  );
};

export default UglugTuukh;
