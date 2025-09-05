import {
  EditOutlined,
  FileExcelOutlined,
  SettingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Popover, Table as AntdTable } from "antd";
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
import { orderBy } from "lodash";
import useData from "hooks/useData";
import { Pagination } from "antd";
import { useAuth } from "services/auth";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import { FaTruckMedical } from "react-icons/fa6";
import useBorluulaltTailanDelegrengui from "hooks/tailan/useBorluulaltDelgerengui";
import { Excel } from "antd-table-saveas-excel";
import useBaraa from "hooks/useBaraa";
import posUilchilgee from "services/posUilchilgee";
import useGuilgee from "hooks/useGuilgee";
function BorluulaltTailanDelegrengui({
  buttonData,
  butenData,
  token,
  ognoo,
  salbariinId,
  baiguullagiinId,
  songosonSalbar,
}) {
  const [khuudaslalt, setKhuudaslalt] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [songosonBaraa, setSongosonBaraa] = useState();
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState();
  const searchKeys = ["_id.ner, _id.code"];

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: songosonSalbar?.length > 0 ? songosonSalbar : undefined,
      baiguullagiinId: baiguullagiinId,
      angilal: butenData?._id,
      baraanuud: songosonBaraa ? songosonBaraa : undefined,
    };
    return query;
  }, [butenData, baiguullagiinId, songosonBaraa, salbariinId, songosonSalbar]);

  const { borluulaltData, unshijBaina, setTailanKhuudaslalt } =
    useBorluulaltTailanDelegrengui(
      openModal && token,
      shuult,
      undefined,
      khuudaslalt,
      order
    );

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    if (!!salbariinId) {
      query.salbariinId = salbariinId;
    } else query.salbariinId = "shuuhgui";
    return query;
  }, [baiguullagiinId, salbariinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const printRef = useRef(null);

  function handleOpen() {
    setOpenModal(true);
  }
  function handleCancel() {
    setOpenModal(false);
  }

  const { data: salbaruud } = uilchilgee(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  async function exceleerTatya() {
    const excel = new Excel();

    setLoading(true);
    await posUilchilgee(token)
      .post("/borluulaltiinTailanDelgerenguiAvya", {
        ...shuult,
      })
      .then(({ data }) => {
        excel
          .addSheet("Борлуулалт тайлан")

          .setTHeadStyle({
            background: "ffccf8f8",
            borderColor: "ff73e6e7",
          })
          .setTBodyStyle({
            background: "FFFFFFFF",
            border: 0,
          })
          .addColumns([
            {
              title: "Огноо",
              dataIndex: ["_id", "ognoo"],
              render: (_id, data) => {
                return (
                  <div>{moment(data?._id?.ognoo).format("YYYY-MM-DD")}</div>
                );
              },
            },
            {
              title: "Барааны нэр",
              dataIndex: ["_id", "ner"],
              render: (b) => {
                return (
                  <div className="flex justify-start overflow-hidden">{b}</div>
                );
              },
            },
            {
              title: "Дотоод код",
              dataIndex: ["_id", "code"],
              width: "3rem",
              render: (b) => {
                return (
                  <div className="flex justify-center overflow-hidden">{b}</div>
                );
              },
            },
            {
              title: "Борлуулалт",
              align: "center",
              children: [
                {
                  title: "Тоо хэмжээ",
                  dataIndex: "tooKhemjee",

                  render: (e) => {
                    return (
                      <div className="flex justify-center">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "Үнэ",
                  dataIndex: "borluulaltUne",
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "НӨАТ",
                  dataIndex: "borluulaltiinNoat",
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "Нийт дүн",
                  dataIndex: "niitBorluulalt",
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
              ],
            },
            {
              title: "Буцаалт",
              align: "center",
              children: [
                {
                  title: "Тоо хэмжээ",
                  dataIndex: "butsaaltiinTooKhemjee",
                  render: (e) => {
                    return (
                      <div className="flex justify-center">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "Үнэ",
                  dataIndex: ["_id", "borluulaltUne"],
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "НӨАТ",
                  dataIndex: "butsaaltiinNoat",
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
                {
                  title: "Нийт үнэ",
                  dataIndex: "butsaaltiinDun",
                  render: (e) => {
                    return (
                      <div className="flex justify-end">
                        {formatNumber(e, 2)}
                      </div>
                    );
                  },
                },
              ],
            },
          ])
          .addDataSource(data?.jagsaalt || data)
          .saveAs("БорлуулалтТайлан.xlsx");
        setLoading(false);
      })
      .catch((err) => {
        aldaaBarigch(err);
        setLoading(false);
      });
  }

  const columns = useMemo(() => {
    return [
      {
        title: "Огноо",
        dataIndex: ["_id", "ognoo"],
        ellipsis: true,
        width: "3rem",
        align: "center",
        showSorterTooltip: false,
        render: (ognoo) => {
          return (
            <div className="flex justify-start">
              {moment(ognoo).format("YYYY-MM-DD HH:mm")}
            </div>
          );
        },
      },
      {
        title: "Барааны нэр",
        dataIndex: ["_id", "ner"],
        align: "center",
        key: "baraaniiNer",
        width: "4rem",
        summary: true,
        render: (b) => {
          return <div className="flex justify-start overflow-hidden">{b}</div>;
        },
      },
      {
        title: "Дотоод код",
        dataIndex: ["_id", "code"],
        align: "center",
        key: "dotoodCode",
        width: "2rem",
        render: (b) => {
          return <div className="flex justify-center overflow-hidden">{b}</div>;
        },
      },

      {
        title: "Борлуулалт",
        align: "center",
        children: [
          {
            title: "Тоо хэмжээ",
            dataIndex: "tooKhemjee",
            align: "center",
            key: "tooKhemjee",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-center">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "Үнэ",
            dataIndex: "borluulaltUne",
            align: "center",
            key: "une",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "НӨАТ",
            dataIndex: "borluulaltiinNoat",
            align: "center",
            key: "noat",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "Нийт дүн",
            dataIndex: "niitBorluulalt",
            align: "center",
            key: "niitDun",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
        ],
      },
      {
        title: "Буцаалт",
        align: "center",
        children: [
          {
            title: "Тоо хэмжээ",
            dataIndex: "butsaaltiinTooKhemjee",
            align: "center",
            key: "tooKhemjee",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-center">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "Үнэ",
            dataIndex: "butsaagdsanBaraaUne",
            align: "center",
            key: "une",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,

            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "НӨАТ",
            dataIndex: "butsaaltiinNoat",
            align: "center",
            key: "noat",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,
            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
          {
            title: "Нийт үнэ",
            dataIndex: "butsaaltiinDun",
            align: "center",
            key: "niitUne",
            width: "2rem",
            showSorterTooltip: false,
            ellipsis: true,
            summray: true,

            render: (e) => {
              return (
                <div className="flex justify-end">{formatNumber(e, 2)}</div>
              );
            },
          },
        ],
      },
    ];
  }, [borluulaltData, ognoo]);

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
            Борлуулалтын дэлгэрэнгүй
          </div>
        }
        footer={[
          <div key="pagination" className="mb-3 flex w-full justify-end">
            <Pagination
              current={
                borluulaltData?.khuudasniiDugaar
                  ? borluulaltData.khuudasniiDugaar
                  : 1
              }
              pageSize={borluulaltData?.khuudasniiKhemjee || 20}
              total={borluulaltData?.tooKhemjee || 0}
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
            <div className="dropdown h-8 w-1/2 sm:w-auto">
              <Popover
                placement="bottom"
                content={
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => exceleerTatya()} type="gol">
                      <DownloadOutlined className="pr-3 text-lg" />
                      <div className="pr-3">Татах</div>
                    </Button>
                  </div>
                }
                title={false}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <Button className="w-28" type="gol">
                  <FileExcelOutlined className="text-sm" />
                  Excel
                </Button>
              </Popover>
            </div>
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
          <div className="flex flex-row justify-between">
            <div className="mb-4 grid grid-cols-12 font-semibold dark:text-white">
              <div className="col-span-4 font-semibold">
                Ангиллын нэр: {butenData?._id}
              </div>
            </div>
            <div className="mb-3">
              <Select
                showSearch
                placeholder="Бараа сонгох"
                allowClear
                mode="multiple"
                className="!h-[36px] w-[25%] rounded-md  border-[1px] border-[#4fd1c5] bg-white md:w-40"
                filterOption={(a) => a}
                onChange={(v) => {
                  setSongosonBaraa(v);
                  v === undefined &&
                    setBaraaniiKhuudaslalt((a) => ({ ...a, search: "" }));
                }}
                value={songosonBaraa}
                onClear={() => {
                  setBaraaniiKhuudaslalt({
                    khuudasniiDugaar: 1,
                    khuudasniiKhemjee: 100,
                    search: "",
                    jagsaalt: [],
                  });
                  baraaMutate();
                  setSongosonBaraa(undefined);
                }}
                onSearch={(search) => {
                  setBaraaniiKhuudaslalt((a) => ({ ...a, search }));
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
                          {mur?.ner}- {mur?.code}
                        </div>
                        <div className="flex  justify-end truncate font-semibold">
                          {mur?.id}
                        </div>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <Table
            scroll={{ y: "calc(65vh - 17rem)" }}
            tableLayout="fixed"
            style={{
              height: "50vh",
              overflow: "hidden",
            }}
            unshijBaina={unshijBaina}
            size="small"
            pagination={false}
            dataSource={borluulaltData}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell colSpan={1}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-right font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.niitBorluulalt || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-right font-semibold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.butsaaltiinDun || 0), 0),
                      2
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
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
                      <div>Ангиллын нэр:</div>
                      <div className="font-semibold">{butenData?._id}</div>
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
                      Дотоод код
                    </th>
                    <th
                      className="border text-center text-mashJijigiinJijig"
                      colSpan={3}
                    >
                      Борлуулалт
                    </th>
                    <th
                      className="border text-center text-mashJijigiinJijig"
                      colSpan={4}
                    >
                      Буцаалт
                    </th>
                  </tr>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">
                      Тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">Үнэ</th>
                    <th className="border text-mashJijigiinJijig">НӨАТ</th>
                    <th className="border text-mashJijigiinJijig">Нийт дүн</th>
                    <th className="border text-mashJijigiinJijig">
                      Тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">Үнэ</th>
                    <th className="border text-mashJijigiinJijig">Нийт дүн</th>
                  </tr>
                </thead>
                <tbody>
                  {borluulaltData?.map((mur, index) => (
                    <tr key={index}>
                      <td className="border text-center text-mashJijigiinJijig">
                        {moment(mur?.ognoo).format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="border text-center text-mashJijigiinJijig">
                        {mur?._id?.code}
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.tooKhemjee, 2)}
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.borluulaltUne, 2)}
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.borluulaltiinNoat, 2)}
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.niitBorluulalt, 2)}
                      </td>
                      <td className="border text-center text-mashJijigiinJijig">
                        {mur?.butsaaltiinTooKhemjee}
                      </td>
                      <td className="border text-end text-mashJijigiinJijig">
                        {formatNumber(mur?.borluulaltUne, 2)}
                      </td>
                      <td className="border text-right text-mashJijigiinJijig">
                        {formatNumber(mur?.butsaaltiinDun, 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"></td>
                    <td colSpan="4" className="text-right italic">
                      Тайлан гаргасан:
                    </td>
                    <td>................................/</td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td colSpan="4" className="text-right italic">
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
export default BorluulaltTailanDelegrengui;
