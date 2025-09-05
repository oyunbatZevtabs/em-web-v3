import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Switch, Table as AntdTable } from "antd";
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
import posUilchilgee from "services/posUilchilgee";
import useTailan from "hooks/tailan/useTailan";
import usebaraagaarAvsanTailan from "hooks/usebaraagaarAvsanTailan";

function OrlogoZarlagaDelegrengui({
  buttonData,
  butenData,
  salbariinNer,
  salbariinId,
  token,
  ognoo,
}) {
  const [openModal, setOpenModal] = useState(false);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const printRef = useRef(null);

  function handleOpen() {
    setOpenModal(true);
  }
  function handleCancel() {
    setOpenModal(false);
  }
  const {
    baraagaarAvsanTailan,
    setBaraagaarAvsanTailanKhuudaslalt,
    khuudaslalt,
  } = usebaraagaarAvsanTailan(
    openModal && token,
    ognoo,
    salbariinId,
    butenData?._id?.code,
    order
  );
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        width: "2.5rem",
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (baraagaarAvsanTailan?.khuudasniiDugaar || 0) *
            (baraagaarAvsanTailan?.khuudasniiKhemjee || 0) -
          (baraagaarAvsanTailan?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Огноо",
        dataIndex: "createdAt",
        align: "center",
        width: "8rem",
        sortDirections: ["descend", "ascend", "descend"],
        sorter: (a, b) => moment(a.createdAt).subtract(moment(b.createdAt)),
        showSorterTooltip: false,
        render: (b) => moment(b).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "Төрөл",
        dataIndex: "turul",
        align: "center",
        key: "turul",
        width: "6rem",
        sortDirections: ["descend", "ascend", "descend"],
        sorter: (a, b) => a - b,
        showSorterTooltip: false,
        render: (a, data) => {
          return a === "ekhniiUldegdel"
            ? "Эхний үлдэгдэл"
            : a === "khudulguun"
            ? "Хөдөлгөөн"
            : a === "khuselt"
            ? "Хүсэлт"
            : a === "khurvuulelt"
            ? "Хөрвүүлэлт"
            : a === "orlogo"
            ? "Орлого"
            : a === "zakhialga"
            ? "Захиалга"
            : a === "act"
            ? "Акт"
            : a === "busadZarlaga"
            ? "Бусад зарлага"
            : a;
        },
      },
      {
        title: "Орлого",
        align: "center",
        key: "orlogo",
        children: [
          {
            title: "Тоо",
            dataIndex: "baraanuud",
            align: "center",
            key: "orlogoToo",
            width: "4rem",
            sortDirections: ["descend", "ascend", "descend"],
            showSorterTooltip: false,
            sorter: (a, b) => a.baraanuud.too - b.baraanuud.too,
            render: (b, a) => {
              var orlogo =
                a.ursgaliinTurul === "orlogo" || a?.turul?.includes("Orlogo")
                  ? b.too
                  : 0;
              return orlogo ? formatNumber(orlogo, 2) : "";
            },
            ellipsis: true,
          },
          {
            title: "Үнэ",
            dataIndex: "baraanuud",
            align: "center",
            width: "6rem",
            key: "niitUne",
            sortDirections: ["descend", "ascend", "descend"],
            showSorterTooltip: false,
            sorter: (a, b) => a.baraanuud.niitUne - b.baraanuud.niitUne,
            render: (b, data) => (
              <div className="text-right">
                {data?.ursgaliinTurul === "orlogo" ||
                data?.turul?.includes("Orlogo")
                  ? formatNumber(b.urtugUne, 0)
                  : null}
              </div>
            ),
            ellipsis: true,
          },
        ],
      },
      {
        title: "Зарлага",
        align: "center",
        key: "zarlaga",
        children: [
          {
            title: "Тоо",
            dataIndex: "baraanuud",
            align: "center",
            key: "zarlagaToo",
            width: "4rem",
            sortDirections: ["descend", "ascend", "descend"],
            showSorterTooltip: false,
            sorter: (a, b) => a.baraanuud.too - b.baraanuud.too,
            render: (b, a) => {
              var zarlaga =
                a.ursgaliinTurul === "zarlaga" || a?.turul?.includes("Zarlaga")
                  ? b.too
                  : null;
              return zarlaga ? formatNumber(zarlaga, 2) : "";
            },
            ellipsis: true,
          },
          {
            title: "Үнэ",
            dataIndex: "baraanuud",
            align: "center",
            key: "turulZarlaga",
            width: "6rem",
            sortDirections: ["descend", "ascend", "descend"],
            showSorterTooltip: false,
            sorter: (a, b) => a.baraanuud.niitUne - b.baraanuud.niitUne,
            render: (b, a) =>
              b?.niitUne && (
                <div className="text-right">
                  {a.ursgaliinTurul === "zarlaga" ||
                  a?.turul?.includes("Zarlaga")
                    ? formatNumber(
                        b?.negjUne ? b.negjUne : b.niitUne / b.too,
                        0
                      )
                    : null}
                </div>
              ),
            ellipsis: true,
          },
        ],
      },
      {
        title: "Нийт үнэ",
        dataIndex: "baraanuud",
        align: "center",
        key: "turulZarlaga",
        width: "6rem",
        sortDirections: ["descend", "ascend", "descend"],
        showSorterTooltip: false,
        sorter: (a, b) => a.baraanuud.niitUne - b.baraanuud.niitUne,
        render: (b, a) =>
          b?.niitUne && (
            <div className="text-right">
              {formatNumber(
                a.ursgaliinTurul === "zarlaga" || a?.turul?.includes("Zarlaga")
                  ? b?.niitUne
                  : b.urtugUne * b.too,
                2
              )}
            </div>
          ),
        ellipsis: true,
      },
      {
        title: "Ажилтан",
        dataIndex: "ajiltan",
        key: "ajiltan",
        align: "center",
        width: "6rem",
        sorter: (a, b) => a?.ner?.localeCompare(b?.ajiltan.ner),
        render: (a) => a?.ner,
        showSorterTooltip: false,
      },
    ];
  }, []);

  const khevlekhColumns = useMemo(() => {
    return [
      {
        title: <div className="text-mashJijigiinJijig">№</div>,
        width: "2.5rem",
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (khuudaslalt?.khuudasniiDugaar || 0) *
            (khuudaslalt?.khuudasniiKhemjee || 0) -
          (khuudaslalt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className="text-mashJijigiinJijig">Огноо</div>,
        dataIndex: "createdAt",
        align: "center",
        width: "8rem",
        render: (b) => moment(b).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: <div className="text-mashJijigiinJijig">Төрөл</div>,
        dataIndex: "turul",
        align: "center",
        key: "turul",
        width: "6rem",
        render: (a, data) => {
          return a === "ekhniiUldegdel" ? (
            "Эхний үлдэгдэл"
          ) : a === "khudulguun" ? (
            <Link
              href={`/khyanalt/aguulakhiinKhyanalt/${data?._id}?turul=Khudulguun&drilldsen=true`}
            >
              <a target="_blank" rel="noopener noreferrer">
                Хөдөлгөөн
              </a>
            </Link>
          ) : a === "khuselt" ? (
            "Хүсэлт"
          ) : a === "khurvuulelt" ? (
            "Хөрвүүлэлт"
          ) : a === "orlogo" ? (
            <Link
              href={`/khyanalt/aguulakhiinKhyanalt/${data?._id}?turul=Orlogo&drilldsen=true`}
            >
              <a target="_blank" rel="noopener noreferrer">
                Орлого
              </a>
            </Link>
          ) : a === "zakhialga" ? (
            "Захиалга"
          ) : a === "act" ? (
            "Акт"
          ) : (
            a
          );
        },
      },
      {
        title: <div className="text-mashJijigiinJijig">Орлого</div>,
        align: "center",
        key: "orlogo",
        children: [
          {
            title: <div className="text-mashJijigiinJijig">Тоо</div>,
            dataIndex: "baraanuud",
            align: "center",
            key: "orlogoToo",
            width: "4rem",
            render: (b) => formatNumber(b?.orlogo, 2) || "",
            ellipsis: true,
          },
          {
            title: <div className="text-mashJijigiinJijig">Үнэ</div>,
            dataIndex: "baraanuud",
            align: "center",
            key: "turulOrlogo",
            width: "6rem",
            render: (b) =>
              b?.orlogo && (
                <div className="text-right">{formatNumber(b?.negjUne)}</div>
              ),
            ellipsis: true,
          },
        ],
      },
      {
        title: <div className="text-mashJijigiinJijig"> Зарлага</div>,
        align: "center",
        key: "zarlaga",
        children: [
          {
            title: <div className="text-mashJijigiinJijig">Тоо</div>,
            dataIndex: "baraanuud",
            align: "center",
            key: "zarlagaToo",
            width: "4rem",
            render: (b) => formatNumber(b?.zarlaga, 2) || "",
            ellipsis: true,
          },
          {
            title: <div className="text-mashJijigiinJijig">Үнэ</div>,
            dataIndex: "baraanuud",
            align: "center",
            key: "turulZarlaga",
            width: "6rem",
            render: (b) =>
              b?.zarlaga && (
                <div className="text-right">{formatNumber(b?.negjUne)}</div>
              ),
            ellipsis: true,
          },
        ],
      },
      {
        title: <div className="text-mashJijigiinJijig">Нийт үнэ</div>,
        dataIndex: "baraanuud",
        align: "center",
        width: "6rem",
        key: "niitUne",
        render: (b, data) => (
          <div className="text-right">
            {data?.turul !== "orlogo"
              ? formatNumber(b?.niitUne)
              : formatNumber((b?.negjUne || 0) * (b?.orlogo || 0))}
            ₮
          </div>
        ),
        ellipsis: true,
      },
      {
        title: <div className="text-mashJijigiinJijig">Ажилтан</div>,
        dataIndex: "burtgesenAjiltaniiNer",
        key: "burtgesenAjiltaniiNer",
        align: "center",
        width: "6rem",
      },
    ];
  }, []);

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
      const product = obj.too * obj.niitUne;
      totalSum += product;
    }
    for (const obj of garalt) {
      totalNiitUne += obj.baraa.niitUne;
    }
    for (const obj of garalt) {
      const noat = obj.baraa.noatiinDun * obj.too;
      totalNiitNoat += noat;
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
            {mur.summary
              ? mur.key === "baraa.niitUne"
                ? formatNumber(totalNiitUne, 2) + " ₮"
                : mur.key === "baraa.noat"
                ? formatNumber(totalNiitNoat, 2) + " ₮"
                : garalt?.reduce((a, b) => a + (b[mur.dataIndex] || 0), 0) + "ш"
              : ""}
          </AntdTable.Summary.Cell>
        ))}
      </AntdTable.Summary.Row>
    );
  }

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
            Орлого зарлагын дэлгэрэнгүй
          </div>
        }
        footer={[
          <Button onClick={() => handleCancel()} type="primary">
            Хаах
          </Button>,
        ]}
        cancelButtonProps={{ style: { display: "none" } }}
        width={1300}
        open={openModal}
        onCancel={handleCancel}
      >
        <div className="p-4 pt-0">
          <div className="font-semibold dark:text-gray-200">Салбар: {salbariinNer}</div>
          <div className="font-semibold dark:text-gray-200">
            Барааны нэр: {butenData?._id?.ner}
          </div>{" "}
          <div className="font-semibold dark:text-gray-200">
            Баркод: {butenData?._id?.barCode || butenData?._id?.code}
          </div>
          <Table
            scroll={{ y: "calc( 90vh - 35rem)" }}
            size="small"
            dataSource={
              baraagaarAvsanTailan?.length > 0 &&
              baraagaarAvsanTailan[0]?.jagsaalt
            }
            onChange={onChangeTable}
            columns={columns}
            pagination={{
              current: khuudaslalt.khuudasniiDugaar,
              pageSize: khuudaslalt.khuudasniiKhemjee,
              total:
                baraagaarAvsanTailan?.length > 0 &&
                baraagaarAvsanTailan[0]?.niitMur[0]?.too,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setBaraagaarAvsanTailanKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell colSpan={1}>
                  <div className="space-x-2 truncate text-base font-semibold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) =>
                          a +
                          (b.ursgaliinTurul === "orlogo" ||
                          b?.turul?.includes("Orlogo")
                            ? b.baraanuud.too
                            : 0),
                        0
                      ),
                      2
                    )}
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-right font-semibold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) =>
                          a +
                          (b?.ursgaliinTurul === "orlogo" ||
                          b?.turul?.includes("Orlogo")
                            ? b?.baraanuud?.urtugUne || 0
                            : 0),
                        0
                      )
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-center font-semibold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) =>
                          a +
                          (b.ursgaliinTurul === "zarlaga" ||
                          b?.turul?.includes("Zarlaga")
                            ? b.baraanuud.too
                            : 0),
                        0
                      ),
                      2
                    )}
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-right font-semibold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) =>
                          a +
                          ((b?.baraanuud?.niitUne &&
                            b.ursgaliinTurul === "zarlaga") ||
                          b?.turul?.includes("Zarlaga")
                            ? b?.baraanuud?.negjUne
                              ? b.baraanuud?.negjUne
                              : b.baraanuud?.niitUne / b.baraanuud?.too
                            : 0),
                        0
                      )
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell>
                  <div className="truncate text-right font-semibold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) =>
                          a +
                          (b.ursgaliinTurul === "zarlaga" ||
                          b?.turul?.includes("Zarlaga")
                            ? b?.baraanuud?.niitUne || 0
                            : (b?.baraanuud?.urtugUne || 0) *
                              (b?.baraanuud?.too || 0)),
                        0
                      )
                    )}
                    ₮
                  </div>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary>
            )}
          />
          <div ref={printRef} className="hidden p-4 pt-0 print:block">
            <div className="text-mashJijig flex w-full items-center justify-center font-semibold">
              Орлого зарлагын дэлгэрэнгүй
            </div>
            <div className="text-mashJijig">
              Салбар: <strong></strong>
            </div>
            <div className="text-mashJijig">
              Барааны нэр: <strong></strong>
            </div>
            <div className="text-mashJijig flex w-full items-center justify-between">
              <div className="text-mashJijig">
                Баркод: <strong></strong>
              </div>
              <div className="text-mashJijig">
                Огноо: <strong></strong>
              </div>
            </div>
            <Table
              className="text-mashJijigiinJijig"
              size="small"
              tableLayout="auto"
              rowClassName="text-mashJijigiinJijig"
              // dataSource={
              //   baraagaarAvsanTailan?.length > 0 &&
              //   baraagaarAvsanTailan[0]?.jagsaalt
              // }
              bordered
              onChange={onChangeTable}
              columns={khevlekhColumns}
              // pagination={{
              //   style: { display: "none" },
              //   current: khuudaslalt.khuudasniiDugaar,
              //   pageSize: khuudaslalt.khuudasniiKhemjee,
              //   total:
              //     baraagaarAvsanTailan?.length > 0 &&
              //     baraagaarAvsanTailan[0]?.niitMur[0]?.too,
              // }}
            />
            <div className="flex w-full items-center border ">
              <div className="w-[2.5rem]"></div>
              <div className="w-[8rem]">
                <div className="space-x-2 text-mashJijigiinJijig font-semibold ">
                  Нийт
                </div>
              </div>
              <div className="w-[6rem]"></div>
              <div className="w-[4rem]">
                <div className="truncate text-center text-mashJijigiinJijig font-semibold ">
                  {/* {formatNumber(
                    baraagaarAvsanTailan?.[0]?.jagsaalt?.reduce(
                      (a, b) => a + (b?.baraanuud?.orlogo || 0),
                      0
                    ),
                    2
                  )} */}
                </div>
              </div>
              <div className="w-[6rem]">
                <div className="truncate text-right text-mashJijigiinJijig font-semibold ">
                  {/* {formatNumber(
                    baraagaarAvsanTailan?.[0]?.jagsaalt?.reduce(
                      (a, b) =>
                        a +
                        (b?.baraanuud?.orlogo ? b?.baraanuud?.negjUne || 0 : 0),
                      0
                    )
                  )} */}
                  ₮
                </div>
              </div>
              <div className="w-[4rem]">
                <div className="truncate text-center text-mashJijigiinJijig font-semibold ">
                  {/* {formatNumber(
                    baraagaarAvsanTailan?.[0]?.jagsaalt?.reduce(
                      (a, b) => a + (b?.baraanuud?.zarlaga || 0),
                      0
                    ),
                    2
                  )} */}
                </div>
              </div>
              <div className="w-[6rem]">
                <div className="truncate text-right text-mashJijigiinJijig font-semibold ">
                  {/* {formatNumber(
                    baraagaarAvsanTailan?.[0]?.jagsaalt?.reduce(
                      (a, b) =>
                        a +
                        (b?.baraanuud?.zarlaga
                          ? b?.baraanuud?.negjUne || 0
                          : 0),
                      0
                    )
                  )} */}
                  ₮
                </div>
              </div>
              <div className="w-[6rem]">
                <div className="truncate text-right text-mashJijigiinJijig font-semibold ">
                  {/* {formatNumber(
                    baraagaarAvsanTailan?.[0]?.jagsaalt?.reduce(
                      (a, b) =>
                        a +
                        (b?.turul !== "orlogo"
                          ? b?.baraanuud?.niitUne || 0
                          : b?.baraanuud?.negjUne * b?.baraanuud?.orlogo || 0),
                      0
                    )
                  )} */}
                  ₮
                </div>
              </div>
              <div className="w-[6rem]"></div>
            </div>
            <div className="ml-[2.5rem] mt-8 flex w-1/2 justify-start">
              <div className="w-1/2">
                <div className="text-mashJijig text-right italic">
                  Тайлан гаргасан:
                </div>
                <div className="text-mashJijig text-right italic">
                  Хянасан нягтлан бодогч:
                </div>
              </div>
              <div className="w-1/2">
                <div className="text-mashJijig text-left italic">
                  ................................/
                  {/* {ajiltan?.ovog && ajiltan?.ovog[0]}
                  {ajiltan?.ovog && "."}
                  {ajiltan?.ner}/ */}
                </div>
                <div className="text-mashJijig text-left italic">
                  ................................
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default OrlogoZarlagaDelegrengui;
