import React from "react";
import Admin from "components/Admin";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  Dropdown,
  Popover,
  Button,
  Table as AntdTable,
} from "antd";
import local from "antd/lib/date-picker/locale/mn_MN";
import moment from "moment";
import { useAuth } from "services/auth";
import { useReactToPrint } from "react-to-print";
import formatNumber from "tools/function/formatNumber";
import { Excel } from "antd-table-saveas-excel";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import {
  DownCircleFilled,
  FileExcelOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Table from "components/ant/AntdTable";
import useData from "hooks/useData";
import useBaraa from "hooks/useBaraa";
import useBorluulaltNegtgel from "hooks/useBorluulaltNegtgel";

const searchKeys = ["baraanuud.baraa.angilal", "baraanuud.baraa.code"];

const order = { createdAt: -1 };

// function HulDun({ garalt, columns }) {
//   const [uldegdel, setUldegdel] = useState(0);
//   useEffect(() => {
//     setTimeout(() => {
//       setUldegdel(uldegdel + 1);
//     }, 500);
//   }, [garalt, columns]);

//   return (
//     <AntdTable.Summary.Row>
//       {columns.map((mur, index) => {
//         const niitButsaaltiinTooKhemjee =
//           mur.summary &&
//           garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
//         const niitButsaaltiinDun =
//           mur.summary &&
//           garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
//         const niitBorluulaltiinNOAT =
//           mur.summary &&
//           garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
//         const niitBorluulalt =
//           mur.summary &&
//           garalt?.reduce((sum, obj) => sum + obj[`${mur.dataIndex}`], 0);
//         return (
//           <AntdTable.Summary.Cell
//             className={`${
//               mur.summary !== true ? "border-none " : "font-bold "
//             }`}
//             index={index}
//             align="center"
//           >
//             {mur.summary ? (
//               mur.title === "№" ? (
//                 <div className="text-left">Нийт</div>
//               ) : mur.title === "Буцаалтын тоо хэмжээ" ? (
//                 formatNumber(niitButsaaltiinTooKhemjee || 0, 2) + "ш"
//               ) : mur.title === "Буцаалтын дүн" ? (
//                 formatNumber(niitButsaaltiinDun || 0, 2) + "₮"
//               ) : mur.title === "Борлуулалтын НӨАТ" ? (
//                 formatNumber(niitBorluulaltiinNOAT || 0, 2) + "₮"
//               ) : mur.title === "Нийт борлуулалт" ? (
//                 formatNumber(niitBorluulalt || 0, 2) + "₮"
//               ) : (
//                 ""
//               )
//             ) : (
//               ""
//             )}
//           </AntdTable.Summary.Cell>
//         );
//       })}
//     </AntdTable.Summary.Row>
//   );
// }

const BorluulaltNegtgelTailan = (token) => {
  const [loading, setLoading] = useState(false);
  const { baiguullaga, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const [shineBagana, setShineBagana] = useState([]);

  const [open, setOpen] = useState(false);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const { data: salbaruud } = useData(
    token,
    baiguullagiinId && "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    if (!!salbariinId) {
      query.salbariinId = salbariinId;
    } else query.salbariinId = "shuuhgui";
    return query;
  }, [salbariinId, baiguullagiinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );

  const shuult = useMemo(() => {
    const query = {
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId ? salbariinId : undefined,
      baiguullagiinId: baiguullagiinId,
      code: songosonBaraa?.length > 0 ? songosonBaraa : undefined,
    };
    return query;
  }, [ognoo, salbariinId, songosonBaraa, salbariinId]);

  const { borluulaltData, unshijBaina, setBorluulaltKhuudaslalt } =
    useBorluulaltNegtgel(token, shuult, undefined, searchKeys, order);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "Борлуулалтын өдрийн тайлан",
        children: [
          {
            title: "№",
            key: "index",
            className: "text-center",
            align: "center",
            width: "3rem",
            summary: true,
            fixed: "left",
            render: (text, record, index) =>
              (borluulaltData?.khuudasniiDugaar || 0) *
                (borluulaltData?.khuudasniiKhemjee || 0) -
              (borluulaltData?.khuudasniiKhemjee || 0) +
              index +
              1,
          },
          {
            title: "огноо",
          },
          {
            title: "Борлуулалт",
            children: [
              {
                title: "Барааны нэр төрөл",
              },
              {
                title: "Нийт үнэ",
              },
            ],
          },
          {
            title: "Буцаалт",
            children: [
              {
                title: "Барааны нэр төрөл",
              },
              {
                title: "Нийт үнэ",
              },
            ],
          },
          { title: "Хөнгөлөлт" },
          { title: "Урамшуулал" },
          {
            title: "Цэвэр дүн",
            children: [
              {
                title: "Барааны нэр төрөл",
              },
              {
                title: "Баримтийн тоо",
              },
              {
                title: "Нийт үнэ",
              },
              {
                title: "НӨАТтэй",
              },
              {
                title: "НӨАТгүй",
              },
            ],
          },
        ],
      },
    ];
  });

  return (
    <Admin
      loading={loading}
      onSearch={(search) =>
        setBorluulaltKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      title="Борлуулалт өдрийн тайлан"
      khuudasniiNer="BorluulaltNegtgel"
      className="p-0 md:p-4"
      tsonkhniiId={""}
    >
      <div className="col-span-12 flex flex-col gap-6 px-5 md:px-3">
        <div className="flex">
          <div className="flex w-full gap-2">
            <DatePicker.RangePicker
              locale={local}
              value={ognoo}
              onChange={setOgnoo}
              className="!h-[36px] w-64 !rounded-md bg-white"
            />
          </div>
          <div className="ml-auto flex gap-2">
            <div className="flex h-8 gap-2">
              <Button onClick={handlePrint} className="w-28" type="gol">
                <PrinterOutlined />
                Хэвлэх
              </Button>
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
            </div>
          </div>
        </div>

        <div className="text-mashJijig col-span-12 mt-12 flex flex-col items-center justify-center 2xl:mt-0">
          <Table
            scroll={{ y: "calc(100vh - 17rem)" }}
            tableLayout="fixed"
            style={{
              height: "75vh",
            }}
            unshijBaina={unshijBaina}
            size="small"
            pagination={{
              current:
                borluulaltData?.jagsaalt?.length > 0 &&
                borluulaltData?.khuudasniiDugaar
                  ? borluulaltData?.khuudasniiDugaar
                  : 1,
              pageSize: borluulaltData?.khuudasniiKhemjee,

              total:
                borluulaltData?.jagsaalt?.length > 0 &&
                borluulaltData?.niitMur?.tooKhemjee,
              defaultPageSize: 20,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
                setTailanKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }));
              },
            }}
            dataSource={borluulaltData?.jagsaalt || []}
            // summary={() => (
            //   <AntdTable.Summary fixed>
            //     <HulDun
            //       garalt={borluulaltData?.jagsaalt || []}
            //       columns={columns}
            //     />
            //   </AntdTable.Summary>
            // )}
            columns={columns}
          />
          <div className="hidden">
            <div ref={printRef}>
              <div className="flex w-full items-center justify-between text-sm">
                <div className="w-1/3 text-left text-sm">
                  {ognoo ? (
                    <div>
                      Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")}-{" "}
                      {moment(ognoo[1]).format("YYYY-MM-DD")}
                    </div>
                  ) : (
                    <div>{""}</div>
                  )}
                </div>
                <div className="w-1/3 text-center text-sm font-bold">
                  Борлуулалт тайлан
                </div>
                <div className="w-1/3 text-right text-sm">
                  {salbariinId ? (
                    <div>
                      Салбар:{" "}
                      {
                        baiguullaga?.salbaruud?.find(
                          (a) => a?._id === salbariinId
                        )?.ner
                      }
                    </div>
                  ) : (
                    <div>{""}</div>
                  )}
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border bg-gray-400 text-white">
                    <th className="border text-mashJijigiinJijig">№</th>
                    <th className="border text-mashJijigiinJijig">
                      Барааны ангилал
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Борлуулалтын дүн
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын тоо хэмжээ
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын дүн
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Буцаалтын НӨАТ
                    </th>
                    <th className="border text-mashJijigiinJijig">
                      Нийт борлуулалт
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {borluulaltData?.jagsaalt?.map((mur, index) => {
                    return (
                      <React.Fragment>
                        <tr>
                          <td
                            className="border text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border pl-4 text-mashJijigiinJijig">
                            {mur?._id}
                          </td>
                          <td className="border text-mashJijigiinJijig">
                            {formatNumber(mur?.tooKhemjee || 0, 2)}
                          </td>
                          <td className="border text-right text-mashJijigiinJijig">
                            {formatNumber(mur?.borluulaltiinDun || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.butsaaltiinTooKhemjee || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.butsaaltiinDun || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.borluulaltiinNoat || 0, 2)}
                          </td>
                          <td className="border text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.niitBorluulalt, 2)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              <table className="ml-4 mt-4">
                <tfoot>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Тайлан гаргасан:
                    </td>
                    <td>
                      ................................/
                      {ajiltan?.ovog && ajiltan?.ovog[0]}
                      {ajiltan?.ovog && "."}
                      {ajiltan?.ner}/
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3" className="text-right italic">
                      Хянасан нягтлан бодогч:
                    </td>
                    <td> ................................</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default BorluulaltNegtgelTailan;
