import { EyeOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Tabs, Popover, DatePicker } from "antd";
import Admin from "components/Admin";
import React, { useMemo, useRef, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import moment from "moment";
import useOrder from "tools/function/useOrder";
import AvlagaUusgekhModal from "components/modalBody/avlaga/avlagaUusgekh";
import AvlagaKhaakhModal from "components/modalBody/avlaga/avlagaKhaakh";
import dummyData from "./dummyData";
import useKhariltsagch from "hooks/useKhariltsagch";
import AvlagaTuukh from "components/modalBody/avlaga/avlagaTuukh";
import Table from "components/ant/AntdTable";
import formatNumber from "tools/function/formatNumber";

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

const Avlaga = ({ token }) => {
  const { salbariinId, baiguullaga } = useAuth();
  const [activeKey, setActiveKey] = useState("1");
  const [ognoo, setOgnoo] = useState(null);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const khariltsagchQuery = useMemo(
    () => ({
      avlagaUldegdel: { $exists: true, $ne: null },
    }),
    []
  );

  const { khariltsagchiinGaralt, setKhuudaslalt, khariltsagchMutate } =
    useKhariltsagch(
      activeKey === "1" && token,
      100,
      khariltsagchQuery,
      order,
      searchKeys
    );
  const ajiltanTulsen =
    khariltsagchiinGaralt?.jagsaalt
      ?.filter((item) => !item.register || item.register === undefined)
      ?.reduce((sum, item) => sum + (item.uglugUldegdel || 0), 0) || 0;

  const ajiltanAvlaga =
    khariltsagchiinGaralt?.jagsaalt
      ?.filter((item) => !item.register || item.register === undefined)
      ?.reduce((sum, item) => sum + (item.avlagaUldegdel || 0), 0) || 0;

  const khariltsagchTulsen =
    khariltsagchiinGaralt?.jagsaalt
      ?.filter((item) => item.register)
      ?.reduce((sum, item) => sum + (item.uglugUldegdel || 0), 0) || 0;

  const khariltsagchAvlaga =
    khariltsagchiinGaralt?.jagsaalt
      ?.filter((item) => item.register)
      ?.reduce((sum, item) => sum + (item.avlagaUldegdel || 0), 0) || 0;
      
  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "1rem",
        className: "border-r border-gray-300",
        align: "center",
        render: (text, record, index) =>
          (khariltsagchiinGaralt?.khuudasniiDugaar || 0) *
            (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) -
          (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Нэр",
        dataIndex: "ner",
        width: "2rem",
        align: "center",
        className: "border-r border-gray-300",
        key: "ner",
        showSorterTooltip: false,
        render: (text) => <div className=" text-left">{text}</div>,
        ellipsis: true,
      },
      {
        title: "И-Мэйл",
        ellipsis: true,
        align: "center",
        className: "border-r border-gray-300",
        width: "3rem",
        render: (a, mur) => {
          return (
            <Popover
              content={
                !!mur.mail &&
                mur.utas !== mur.mail && (
                  <div className={`text-left `}> {mur.mail}</div>
                )
              }
            >
              <div className={` flex items-center justify-center`}>
                {mur.mail}
              </div>
            </Popover>
          );
        },
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        className: "border-r border-gray-300",
        ellipsis: true,
        align: "center",
        width: "2rem",
        render: (text, data) => <div>{data.utas[0]}</div>,
      },
      {
        title: "Үлдэгдэл",
        dataIndex: "avlagaUldegdel",
        width: "1rem",
        align: "right",
        className: "border-r border-gray-300",
        key: "ner",
        sorter: () => 0,
        showSorterTooltip: false,
        render: (text) => (
          <div className=" text-right">{formatNumber(text, 2) || 0}</div>
        ),
        ellipsis: true,
      },
      {
        title: "Түүх",
        width: "1rem",
        align: "center",
        key: "ner",
        showSorterTooltip: false,
        render: (text, data) => (
          <AvlagaTuukh
            token={token}
            id={text}
            activeKey={activeKey}
            hariltsagchAjiltanMedeelel={text}
            etssiinDun={data?.avlagaUldegdel}
          />
        ),
        ellipsis: true,
      },
    ];
    return jagsaalt;
  }, [baiguullaga, activeKey, khariltsagchiinGaralt]);

  const items = [
    {
      key: "1",
      label: "Харилцагч",
      children: (
        <Table
          size="small"
          scroll={{ y: "calc(100vh - 29rem)" }}
          rowClassName="hover:bg-blue-100"
          rowKey={(row) => row._id}
          columns={columns}
          onChange={onChangeTable}
          dataSource={khariltsagchiinGaralt?.jagsaalt}
          pagination={{
            current: khariltsagchiinGaralt?.khuudasniiDugaar,
            pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
            total: khariltsagchiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      ),
    },
    // {
    //   key: "2",
    //   label: "Ажилтан",
    //   children: (
    //     <Table
    //       size="small"
    //       onChange={onChangeTable}
    //       scroll={{ y: "calc(100vh - 25rem)" }}
    //       rowClassName="hover:bg-blue-100"
    //       rowKey={(row) => row._id}
    //       columns={[
    //         {
    //           title: "№",
    //           width: "3rem",
    //           key: "index",
    //           className: "text-center",
    //           align: "center",
    //           render: (text, record, index) =>
    //             (khariltsagchiinGaralt?.khuudasniiDugaar || 0) *
    //               (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) -
    //             (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) +
    //             index +
    //             1,
    //         },
    //         {
    //           title: "Нэр",
    //           dataIndex: "ner",
    //           ellipsis: true,
    //           width: "8rem",
    //           align: "center",
    //           render: (ner) => {
    //             return <div className="flex justify-start">{ner}</div>;
    //           },
    //         },
    //         {
    //           title: "Регистр",
    //           dataIndex: "register",
    //           ellipsis: true,
    //           width: "5rem",
    //           align: "center",
    //         },

    //         {
    //           title: "Утас",
    //           dataIndex: "utas",
    //           ellipsis: true,
    //           align: "center",
    //           width: "7rem",
    //         },
    //         {
    //           title: "Ажилд орсон огноо",
    //           dataIndex: "ajildOrsonOgnoo",
    //           width: "10rem",
    //           ellipsis: true,
    //           align: "center",
    //           render: (data) => (
    //             <span>
    //               {data !== null ? moment(data).format("YYYY-MM-DD HH:mm") : ""}
    //             </span>
    //           ),
    //         },
    //         {
    //           title: "Албан тушаал",
    //           dataIndex: "albanTushaal",
    //           width: "5rem",
    //           ellipsis: true,
    //           align: "center",
    //           render: (albanTushaal) => {
    //             return <div className="flex justify-start">{albanTushaal}</div>;
    //           },
    //         },
    //         {
    //           title: "Хаяг",
    //           width: "4rem",
    //           align: "center",
    //           dataIndex: "khayag",
    //           ellipsis: true,
    //           render: (khayag) => {
    //             return (
    //               <Popover content={<div>{khayag}</div>}>
    //                 <div className=" flex justify-center">
    //                   <HomeOutlined className="text-xl" />
    //                 </div>
    //               </Popover>
    //             );
    //           },
    //         },
    //         {
    //           title: "Үлдэгдэл",
    //           dataIndex: "avlagaUldegdel",
    //           width: "7rem",
    //           align: "center",
    //           key: "ner",
    //           sorter: () => 0,
    //           showSorterTooltip: false,
    //           render: (text) => (
    //             <div className=" text-right font-medium">{text || 0}</div>
    //           ),
    //           ellipsis: true,
    //         },
    //         {
    //           title: "Түүх",
    //           width: "3rem",
    //           align: "center",
    //           key: "ner",
    //           showSorterTooltip: false,
    //           render: (text) => (
    //             <div className="flex w-full justify-center">
    //               <Button onClick={() => tuukh(text._id)} type="primary">
    //                 <EyeOutlined />
    //               </Button>
    //             </div>
    //           ),
    //           ellipsis: true,
    //         },
    //       ]}
    //       pagination={{
    //         current: khariltsagchiinGaralt?.khuudasniiDugaar,
    //         pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
    //         total: khariltsagchiinGaralt?.niitMur,
    //         showSizeChanger: true,
    //         onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
    //           setAjiltniiKhuudaslalt((kh) => ({
    //             ...kh,
    //             khuudasniiDugaar,
    //             khuudasniiKhemjee,
    //           })),
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <Admin
      khuudasniiNer="avlaga"
      title="Авлага"
      tsonkhniiId={"6447286d28c37d7cdda115ac"}
      onSearch={(search) =>
        setKhuudaslalt((kh) => ({ ...kh, khuudasniiDugaar: 1, search }))
      }
      className="px-4"
    >
      <div className="col-span-12">
        <div className="mt-0 grid grid-cols-12 gap-2 md:mt-5">
          <div className="col-span-12 block grid-cols-4 gap-5 overflow-hidden  overflow-x-auto py-2 sm:flex lg:grid">
            {[
              {
                ner: "Ажилтан төлсөн",
                shuult: undefined,
                too: ajiltanTulsen,
              },
              {
                ner: "Ажилтан дүн",
                shuult: { register: { $exists: false } },
                too: ajiltanAvlaga,
              },
              {
                ner: "Харилцагч төлсөн",
                shuult: { register: { $exists: true } },
                too: khariltsagchTulsen,
              },
              {
                ner: "Харилцагч дүн",
                shuult: undefined,
                too: khariltsagchAvlaga,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`col-span-1 flex w-full flex-col items-start justify-center rounded-lg border border-[#4FD1C5] p-4 shadow-lg`}
              >
                <div className="font-[500] text-gray-400">{item.ner}</div>
                <div className="flex w-full justify-end gap-[4px]">
                  <div className="font-[700]">{formatNumber(item.too, 2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="md col-span-12  flex flex-col items-center justify-between gap-2 sm:flex-row ">
            <DatePicker.RangePicker
              className="!h-[36px] !rounded-md bg-white"
              format={"YYYY-MM-DD"}
              allowClear
              disabledTime
              placeholder={["Эхлэх огноо", "Дуусах огноо"]}
              value={ognoo}
              onChange={(v) => setOgnoo(v)}
            />
            <div className="flex items-center justify-center gap-3">
              <AvlagaUusgekhModal
                mutate={khariltsagchMutate}
                baiguullagiinId={baiguullaga?._id}
                token={token}
              />
              <AvlagaKhaakhModal
                mutate={khariltsagchMutate}
                baiguullagiinId={baiguullaga?._id}
                token={token}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-5 overflow-auto rounded-md border bg-white px-5 dark:bg-gray-900 lg:overflow-visible">
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={(v) => setActiveKey(v)}
          />
        </div>
      </div>
    </Admin>
  );
};

export const getServerSideProps = shalgaltKhiikh;

export default Avlaga;
