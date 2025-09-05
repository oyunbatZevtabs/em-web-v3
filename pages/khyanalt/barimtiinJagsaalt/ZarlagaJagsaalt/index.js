import { EyeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { DatePicker, Select, Table as AntdTable, Button } from "antd";
import Table from "components/ant/AntdTable";
import locale from "antd/lib/date-picker/locale/mn_MN";
import ZarlagaKhiikhModal from "components/modalBody/zarlaga/ZarlagaKhiikhModal";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
import DelgerenguiKharakh from "components/modalBody/zarlaga/DelgerenguiKharakh";
import { modal } from "components/ant/Modal";

const searchKeys = ["ner", "register"];

const tableSearchKeys = [
  "khariltsagchiinNer",
  "baraanuud.ner",
  "baraanuud.code",
  "baraanuud.barCode",
];

const ZarlagaJagsaalt = ({
  data,
  khariltsagchData,
  setOgnoo,
  ognoo,
  khariltsagchOnSearch,
  onChangeTable,
  token,
  khariltsagchiinId,
  setKhariltsagchiinId,
  setShuult,
  shuult,
}) => {
  const delgerenguiRef = useRef(null);

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        key: "index",
        className: "text-center",
        align: "center",
        width: "1rem",
        fixed: "left",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className="w-full text-center font-semibold">Огноо</div>,
        dataIndex: "ognoo",
        showSorterTooltip: false,
        align: "center",
        key: "ognoo",
        width: "80px",
        sorter: (a, b) => 0,
        render: (e) => {
          return moment(e).format("YYYY-MM-DD, HH:mm");
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Ажилтан</div>,
        dataIndex: "ajiltan",
        align: "left",
        key: "ajiltan",
        width: "100px",
        render(mur) {
          return (
            <div className="flex flex-row space-x-2">
              <div>{mur?.ner}</div>
            </div>
          );
        },
      },
      {
        title: <div className="text-center font-semibold">Харилцагч</div>,
        dataIndex: "khariltsagchiinNer",
        align: "left",
        key: "khariltsagchiinNer",
        width: "100px",
        render(text) {
          return <div>{text}</div>;
        },
      },
      {
        title: <div className="text-center font-semibold">Тоо хэмжээ</div>,
        dataIndex: "ajiltan",
        align: "left",
        key: "too",
        width: "80px",
        showSorterTooltip: false,
        sorter: () => 0,
        render(mur, data) {
          return (
            <div className="text-center">
              {formatNumber(
                data.baraanuud.reduce((a, b) => a + (b?.too || 0), 0),
                2
              )}
            </div>
          );
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Нийт дүн</div>,
        align: "right",
        dataIndex: "niitUne",
        key: "niitDun",
        width: "80px",
        showSorterTooltip: false,
        sorter: () => 0,
        render(mur, data) {
          return formatNumber(
            data.baraanuud.reduce((a, b) => a + (b?.niitUne || 0), 0),
            2
          );
        },
        summary: true,
      },
      {
        title: <div className="text-center font-semibold">Төрөл</div>,
        dataIndex: "turul",
        align: "center",
        key: "khariltsagchiinNer",
        width: "4rem",
        render(text) {
          var turul = "";
          switch (text) {
            case "act":
              turul = "Акт";
              break;
            case "busadZarlaga":
              turul = "Бусад";
              break;
            default:
              break;
          }
          return (
            <div className="flex w-full justify-center font-medium">
              {text === "orlogo" ? (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-green-600 p-1 px-2 text-white">
                  <BiDownArrowAlt />
                  {turul}
                </div>
              ) : (
                <div className="flex w-32 items-center justify-center gap-1 rounded-lg bg-red-600 p-1 px-2 text-white">
                  <BiUpArrowAlt />
                  {turul}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: () => (
          <div className="flex justify-center text-center font-semibold">
            <SettingOutlined />
          </div>
        ),
        width: "80px",
        key: "action",
        align: "center",
        render: (_text, record) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <div className="flex justify-center">
                <a
                  onClick={() => delgerenguiKharya(record)}
                  className="ant-dropdown-link flex w-full justify-between gap-2 rounded-lg p-2 hover:bg-green-100"
                >
                  <EyeOutlined style={{ fontSize: "18px", color: "#4fc1d5" }} />
                </a>
              </div>
            </div>
          );
        },
      },
    ];
  }, [shuult]);

  function delgerenguiKharya(data) {
    const footer = [
      <Button onClick={() => delgerenguiRef.current.khaaya()}>{"Хаах"}</Button>,
    ];
    modal({
      title: "Дэлгэрэнгүй",
      icon: <PlusOutlined />,
      width: 1000,
      content: (
        <DelgerenguiKharakh ref={delgerenguiRef} data={data} token={token} />
      ),
      footer,
    });
  }

  function UilgelAvya({ garalt, columns, shuult }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, columns]);
    let totalSum = 0;
    let totalShirkeh = 0;
    if (garalt?.length > 0) {
      for (const array of garalt) {
        for (const obj of array.baraanuud) {
          const product = (obj.too || 1) * (obj.urtugUne || 1);
          totalShirkeh += obj.too || 0;
          totalSum += product;
        }
      }
    }
    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => (
          <AntdTable.Summary.Cell
            key={index}
            className={`${
              mur.summary !== true ? "border-none " : "font-bold "
            }`}
            index={index}
            align="right"
          >
            {mur.summary ? (
              mur.key === "niitDun" ? (
                formatNumber(totalSum, 2) + " ₮"
              ) : mur.key === "ognoo" ? (
                <div className="flex items-center justify-start">Нийт</div>
              ) : (
                <div className="text-left">
                  {tooOronKhyazgaarliy(totalShirkeh, 2) + "ш"}
                </div>
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
      <div className="flex w-full flex-col justify-start gap-4 md:flex-row">
        <Select
          className="w-full rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200 md:w-36"
          placeholder="Төрөл"
          allowClear
          onChange={(v) => setShuult(v)}
        >
          <Select.Option value={"act"}>Акт</Select.Option>
          <Select.Option value={"busadZarlaga"}>Бусад зарлага</Select.Option>
        </Select>
        <Select
          bordered={false}
          value={khariltsagchiinId}
          onChange={(v) => {
            setKhariltsagchiinId(v);
          }}
          placeholder="Харилцагч сонгох"
          className="!min-h-[34px] w-full rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200 md:!w-48"
          showSearch
          filterOption={(o) => o}
          allowClear={true}
          onSearch={khariltsagchOnSearch}
        >
          {khariltsagchData?.jagsaalt?.map((mur) => {
            return (
              <Select.Option key={mur?._id}>
                <div className={`flex justify-start `}>
                  <div className="font-bold">{mur?.ner}</div>
                  {"---"}
                  {mur?.register}
                </div>
              </Select.Option>
            );
          })}
        </Select>
        <DatePicker.RangePicker
          className="!h-[36px] w-full !rounded-md bg-white md:w-64"
          format={"YYYY-MM-DD"}
          placeholder={["Эхлэх огноо", "Дуусах огноо"]}
          disabledTime
          value={ognoo}
          onChange={(v) => setOgnoo(v)}
          locale={locale}
        />
      </div>
      <div className="mt-4 flex w-full flex-col">
        <Table
          scroll={{ y: "calc(100vh - 20rem)", x: "calc(20vw - 25rem)" }}
          dataSource={data?.jagsaalt}
          columns={columns}
          onChange={onChangeTable}
          // pagination={{
          //   current: parseFloat(data?.khuudasniiDugaar),
          //   pageSize: data?.khuudasniiKhemjee,
          //   total: data?.niitMur,
          //   showSizeChanger: true,
          //   onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
          //     setBaraaOrlogdokhKhuudaslalt((umnukh) => ({
          //       ...umnukh,
          //       khuudasniiDugaar,
          //       khuudasniiKhemjee,
          //     })),
          // }}
          summary={() => (
            <AntdTable.Summary fixed>
              <UilgelAvya
                garalt={data?.jagsaalt && data?.jagsaalt}
                columns={columns}
                shuult={shuult}
              />{" "}
            </AntdTable.Summary>
          )}
        />
      </div>
    </div>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default ZarlagaJagsaalt;
