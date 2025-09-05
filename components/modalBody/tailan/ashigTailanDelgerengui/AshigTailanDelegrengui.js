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
import useAshigTailanDelegrengui from "hooks/tailan/useAshigTailanDelegrengui";
import { orderBy } from "lodash";
import useData from "hooks/useData";
import { Pagination } from "antd";
import { useAuth } from "services/auth";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import useGuilgee from "hooks/useGuilgee";
import posUilchilgee from "services/posUilchilgee";
function AshigTailanDelegrengui({
  buttonData,
  butenData,
  token,
  ognoo,
  salbariinId,
  baiguullagiinId,
  baiguullaga,
  ajiltan,
  khariltsagchNer,
}) {
  const [khuudaslalt, setKhuudaslalt] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const zarlagaSearchKeys = ["baraanuud.code"];

  const [songosonSalbar, setSongosonSalbar] = useState([]);
  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
      baraaniiCode: butenData._id?.code,
    };
    return query;
  }, [butenData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function HulDun({ garalt, columns }) {
    const getValue = (obj, dataIndex) => {
      if (Array.isArray(dataIndex)) {
        return dataIndex.reduce((acc, key) => acc?.[key], obj);
      }
      return obj?.[dataIndex];
    };

    const flattenColumns = (cols) => {
      return cols.reduce((acc, col) => {
        if (col.children) {
          acc.push(...flattenColumns(col.children));
        } else {
          acc.push(col);
        }
        return acc;
      }, []);
    };

    const flatColumns = flattenColumns(columns);

    return (
      <AntdTable.Summary.Row>
        {flatColumns.map((mur, index) => {
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
                  <div className="text-center">Нийт</div>
                ) : mur.title === "Ашиг" ? (
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
  const { ashigData, unshijBaina, setTailanKhuudaslalt } =
    useAshigTailanDelegrengui(openModal && token, shuult);

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
        width: "1rem",
        key: "index",
        summary: true,
        className: "text-center",
        render: (text, record, index) =>
          (ashigData?.khuudasniiDugaar || 0) *
            (ashigData?.khuudasniiKhemjee || 0) -
          (ashigData?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Огноо",
        dataIndex: "ognoo",
        ellipsis: true,
        width: "3rem",
        align: "center",
        showSorterTooltip: false,
        render: (ner) => {
          return <div>{moment(ner).format("YYYY-MM-DD HH:mm")}</div>;
        },
      },
      {
        title: "Гүйлгээний дугаар",
        dataIndex: "guilgeeniiDugaar",
        align: "center",
        key: "guilgeeniiDugaar",
        width: "2rem",
        render: (b) => {
          return <div className="flex justify-center overflow-hidden">{b}</div>;
        },
      },
      {
        title: "Тоо хэмжээ",
        dataIndex: "too",
        align: "center",
        key: "guilgeeniiDugaar",
        width: "1rem",
        render: (b) => {
          return (
            <div className="flex justify-center overflow-hidden">
              {formatNumber(b, 2)}
            </div>
          );
        },
      },
      {
        title: "Нэгж өртөг",
        align: "center",
        children: [
          {
            title: "Өртөг",
            dataIndex: "urtugUne",
            align: "center",
            key: "urtugUne",
            width: "3rem",
            showSorterTooltip: false,
            ellipsis: true,
            summary: false,
            sorter: () => 0,
            render: (e) => {
              return <div className="text-right">{formatNumber(e, 2)}</div>;
            },
          },
          {
            title: "Нийт",
            dataIndex: "niitUrtug",
            key: "niitUrtug",
            align: "center",
            width: "3rem",
            showSorterTooltip: false,
            ellipsis: true,
            showSorterTooltip: false,
            sorter: () => 0,
            render: (b) => {
              return (
                <div className="flex justify-end">{formatNumber(b, 2)}</div>
              );
            },
          },
        ],
      },

      {
        title: "Худалдах үнэ",
        align: "center",
        summary: false,
        children: [
          {
            title: "Худалдах үнэ",
            dataIndex: "zarakhUne",
            key: "negjUrtug",
            align: "center",
            width: "3rem",
            summary: false,
            render: (a) => {
              const formatted = new Intl.NumberFormat("en-US").format(a);
              return <div className="flex justify-end">{formatted}</div>;
            },
          },
          {
            title: "Нийт",
            dataIndex: "zarsanNiitUne",
            key: "negjUrtug",
            align: "center",
            width: "3rem",
            summary: false,
            render: (a) => {
              const formatted = new Intl.NumberFormat("en-US").format(a);
              return <div className="flex justify-end">{formatted}</div>;
            },
          },
        ],
      },
      {
        title: "Ашиг",
        dataIndex: "ashig",
        align: "center",
        key: "niitUne",
        width: "2rem",
        summary: true,
        render: (a) => {
          const formatted = new Intl.NumberFormat("en-US").format(a);
          return <div className="flex justify-end">{formatted}</div>;
        },
      },
    ];
  }, [ashigData, ognoo]);

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
            Ашгийн дэлгэрэнгүй
          </div>
        }
        footer={[
          <div key="pagination" className="mb-3 flex w-full justify-end">
            <Pagination
              current={
                ashigData?.khuudasniiDugaar ? ashigData.khuudasniiDugaar : 1
              }
              pageSize={ashigData?.khuudasniiKhemjee || 20}
              total={ashigData?.tooKhemjee || 0}
              onChange={(khuudasniiDugaar, khuudasniiKhemjee) => {
                setTailanKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }));
              }}
            />
          </div>,

          <div className="flex w-full items-start justify-end gap-3">
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
        width={1621}
        open={openModal}
        onCancel={handleCancel}
      >
        <div className="p-4 pt-0">
          <div className="mb-4 grid grid-cols-12 font-semibold dark:text-white">
            <div className="col-span-4 font-semibold">
              Барааны нэр: {butenData?._id?.ner}
            </div>{" "}
            <div className="col-span-4 font-semibold">
              Код: {butenData?._id?.code}
            </div>
          </div>
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
            dataSource={ashigData}
            summary={() => (
              <AntdTable.Summary fixed>
                <HulDun garalt={ashigData || []} columns={columns} />
              </AntdTable.Summary>
            )}
            columns={columns}
          />
          <div className="hidden">
            <div ref={printRef}>
              <div className="flex w-full items-center justify-between  text-sm">
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="flex w-full justify-between">
                    <div className="flex gap-2">
                      <div>Барааны нэр:</div>
                      <div className="font-semibold">
                        {khariltsagchNer?.ner}
                      </div>
                      <div>Барааны код:</div>
                      <div className="font-semibold">
                        {khariltsagchNer?.code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig" rowSpan={2}>
                      Огноо
                    </th>
                    <th className="border text-mashJijigiinJijig" rowSpan={2}>
                      Баримтын дугаар
                    </th>
                    <th className="border text-mashJijigiinJijig" rowSpan={2}>
                      Тоо хэмжээ
                    </th>
                    <th
                      className="border text-center text-mashJijigiinJijig"
                      colSpan={2}
                    >
                      Нэгж өртөг
                    </th>

                    <th
                      className="border text-center text-mashJijigiinJijig"
                      colSpan={2}
                    >
                      Худалдах үнэ
                    </th>
                    <th
                      className="border text-center text-mashJijigiinJijig"
                      rowSpan={2}
                    >
                      Ашиг
                    </th>
                  </tr>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">Өртөг</th>
                    <th className="border text-mashJijigiinJijig">Нийт</th>
                    <th className="border text-mashJijigiinJijig">
                      Худалдах үнэ
                    </th>
                    <th className="border text-mashJijigiinJijig">Нийт</th>
                  </tr>
                </thead>
                <tbody>
                  {ashigData?.map((mur, index) => (
                    <tr key={index}>
                      <td className="border text-center text-mashJijigiinJijig">
                        {moment(mur?.ognoo).format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="border text-mashJijigiinJijig">
                        {mur?.guilgeeniiDugaar}
                      </td>
                      <td className="border text-mashJijigiinJijig">
                        {mur?.too}
                      </td>
                      <td className="border text-end text-mashJijigiinJijig">
                        {formatNumber(mur?.urtugUne, 2)}₮
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.niitUrtug, 2)}₮
                      </td>

                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.zarakhUne, 2)}₮
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.zarsanNiitUne, 2)}₮
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.ashig, 2)}₮
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="mt-4">
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Тайлан гаргасан:
                    </td>
                    <td>................................/</td>
                  </tr>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Хянасан нягтлан бодогч:
                    </td>
                    <td> ................................/</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default AshigTailanDelegrengui;
