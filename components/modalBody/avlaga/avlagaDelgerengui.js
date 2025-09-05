import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Switch, Table as AntdTable } from "antd";
import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import { Popover } from "components/ant/AntdPopover";
import useData from "hooks/useData";
import useAvlaga from "hooks/useAvlaga";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";

function AvlagaDelgerengui({
  hariltsagchAjiltanMedeelel,
  turul,
  token,
  buttonData,
  ognoo,
}) {
  const [openModal, setOpenModal] = useState(false);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  // console.log(ognoo, "///////////////////////");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function handleOpen() {
    setOpenModal(true);
  }
  function handleCancel() {
    setOpenModal(false);
  }

  const printRef = useRef(null);

  // const shuult = useMemo(() => {
  //   const query = {
  //     ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
  //     duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
  //     salbariinId: !!songosonSalbar ? songosonSalbar : undefined,
  //     khariltsagchiinId: songogdsonNer.length > 0 ? songogdsonNer : undefined,
  //     baiguullagiinId: baiguullagiinId,
  //   };
  //   return query;
  // }, [ognoo, salbariinId, khariltsagchiinId, songogdsonNer, songosonSalbar]);

  const query = useMemo(() => {
    if (openModal === true) {
      return {
        khariltsagchiinId: hariltsagchAjiltanMedeelel.khariltsagchiinId,
        createdAt: {
          $gte: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
          $lt: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
        },
      };
    }
    return {};
  }, [openModal, hariltsagchAjiltanMedeelel, ognoo]);
  
  const { avlagaGaralt, avlagaMutate, setKhuudaslalt, avlagaUnshijBaina } =
    useAvlaga(openModal && token, 100, query, order);

  const columns = useMemo(() => {
    return [
      {
        title: "Огноо",
        dataIndex: "createdAt",
        ellipsis: true,
        width: "125px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
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
        title: "Дебет",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "orlogo",
        ellipsis: true,
        summary: true,
        width: "125px",
        align: "center",
        render: (a) => {
          return a ? (
            <div className="flex justify-end">{formatNumber(a, 2)}₮</div>
          ) : (
            <div className="text-right"> 0₮</div>
          );
        },
      },
      {
        title: "Кредит",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "zarlaga",
        ellipsis: true,
        summary: true,
        width: "125px",
        align: "center",
        render: (b) => {
          return b ? (
            <div className="text-right">{formatNumber(b, 2)}₮</div>
          ) : (
            <div className="text-right"> 0₮</div>
          );
        },
      },
    ];
  }, []);

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
            Авлага тайлан дэлгэрэнгүй
          </div>
        }
        footer={[
          <div className="flex w-full items-start justify-end">
            <Button onClick={handlePrint}>
              <PrinterOutlined />
              Хэвлэх
            </Button>
            <Button type="primary" onClick={handleCancel}>
              Хаах
            </Button>
          </div>,
        ]}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1300}
        open={openModal}
        onCancel={handleCancel}
      >
        <div className="p-4 pt-0">
          <div className="flex gap-2">
            <div>Нэр:</div>
            <div className="font-semibold">
              {" "}
              {hariltsagchAjiltanMedeelel?.khariltsagchiinNer}
            </div>
          </div>
          <Table
            scroll={{ y: "calc( 90vh - 35rem)" }}
            size="small"
            unshijBaina={avlagaUnshijBaina}
            dataSource={avlagaGaralt?.jagsaalt}
            onChange={onChangeTable}
            columns={columns}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell colSpan={1}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>

                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.orlogo || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.zarlaga || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary>
            )}
            pagination={{
              pageSizeOptions: ["10", "20", "50", "100"],
              current: avlagaGaralt?.khuudasniiDugaar,
              pageSize: avlagaGaralt?.khuudasniiKhemjee,
              total: avlagaGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
        <div className="hidden">
          <div ref={printRef}>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex w-full justify-between">
                  <div className="flex gap-2">
                    <div>Нэр:</div>
                    <div className="font-semibold">
                      {hariltsagchAjiltanMedeelel?.khariltsagchiinNer}
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
                    Дебет
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Кредит
                  </td>
                </tr>
              </thead>
              <tbody>
                {avlagaGaralt?.jagsaalt?.map((mur, index) => {
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
}
export default AvlagaDelgerengui;
