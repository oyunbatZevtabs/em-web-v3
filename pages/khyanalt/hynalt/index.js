import Admin from "components/Admin";
import react, { useMemo, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  List,
  Popover,
  Progress,
  Table as AntdTable,
  Select,
  Empty,
} from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import Image from "next/image";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";
import BaiguullagaBurtgelAlkham from "components/modalBody/hynalt/salbarNemekhsModal";
import { useAuth } from "services/auth";
import posUilchilgee from "services/posUilchilgee";
import useData from "hooks/useData";
import moment from "moment";
import useKhyanakhSambarUgugdul from "hooks/useKhyanakhSambarUgugdul";
import formatNumber from "tools/function/formatNumber";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Table from "components/ant/AntdTable";

function Hynalt({ children, href }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Filler,
    Title,
    Tooltip,
    Legend
  );

  const router = useRouter();

  const { token, baiguullagiinId, salbariinId } = useAuth();
  const { data: emiinSanData, mutate: emiinSanSalbarMutate } = useData(
    token,
    "/emiinSanSalbarAvya",
    undefined,
    baiguullagiinId
  );

  const [dashboardData, setDashBoardData] = useState();
  const [borluulaltTopJagsaaltAvya, setBorluulaltTopJagsaaltAvya] = useState();
  const [ashigTopJagsaaltAvya, setAshigTopJagsaaltAvya] = useState();
  const [borluulaltToimAvya, setBorluulaltToimAvya] = useState();
  const [nariivchlal, setNariivchlal] = useState();

  const { RangePicker } = DatePicker;

  const handleChange = (value) => {
    setNariivchlal(value);
  };

  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const [borluulaltiinTopJagsaaltognoo, setBorluulaltiinTopJagsaaltognoo] =
    useState([moment().startOf("month"), moment().endOf("month")]);

  const [topAshigJagsaaltOgnoo, setTopAshigJagsaaltOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const [ognooToim, setOgnooToim] = useState([
    moment().startOf("year"),
    moment().endOf("year"),
  ]);

  const borluulaltTopJagsaaltQuery = useMemo(() => {
    const query = {
      ekhlekhOgnoo:
        !!borluulaltiinTopJagsaaltognoo &&
        moment(borluulaltiinTopJagsaaltognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo:
        !!borluulaltiinTopJagsaaltognoo &&
        moment(borluulaltiinTopJagsaaltognoo[1]).format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
    };

    return query;
  }, [borluulaltiinTopJagsaaltognoo, salbariinId]);

  const ashigTopJagsaaltQuery = useMemo(() => {
    const query = {
      ekhlekhOgnoo:
        !!topAshigJagsaaltOgnoo &&
        moment(topAshigJagsaaltOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo:
        !!topAshigJagsaaltOgnoo &&
        moment(topAshigJagsaaltOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
    };

    return query;
  }, [topAshigJagsaaltOgnoo, salbariinId]);

  const dashboardMedeelelQuery = useMemo(() => {
    const query = {
      ekhlekhOgnoo: !!ognoo && moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: !!ognoo && moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
    };

    return query;
  }, [ognoo, salbariinId]);

  const toimQuery = useMemo(() => {
    const query = {
      salbariinId: salbariinId,
      nariivchlal,
      ekhlekhOgnoo:
        !!ognooToim && moment(ognooToim[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo:
        !!ognooToim && moment(ognooToim[1]).format("YYYY-MM-DD 23:59:59"),
    };

    return query;
  }, [ognooToim, salbariinId, nariivchlal]);

  const khyanakhSambarQuery = useMemo(() => {
    const query = {
      ekhlekhOgnoo: !!ognoo && moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: !!ognoo && moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      salbariinId: salbariinId,
    };

    return query;
  }, [ognoo, salbariinId]);

  const { KhyanakhSambarData, KhyanakhSambarMutate } = useKhyanakhSambarUgugdul(
    token,
    khyanakhSambarQuery
  );

  useEffect(() => {
    if (!!token) {
      posUilchilgee(token)
        .post(`/borluulaltTopJagsaaltAvya`, {
          ...borluulaltTopJagsaaltQuery,
        })
        .then(({ data }) => {
          setBorluulaltTopJagsaaltAvya(data);
        });
    }
  }, [token, borluulaltTopJagsaaltQuery]);

  useEffect(() => {
    if (!!token) {
      posUilchilgee(token)
        .post(`/ashigTopJagsaaltAvya`, {
          ...ashigTopJagsaaltQuery,
        })
        .then(({ data }) => {
          setAshigTopJagsaaltAvya(data);
        });
    }
  }, [token, ashigTopJagsaaltQuery]);

  useEffect(() => {
    if (!!token) {
      posUilchilgee(token)
        .post(`/dashboardMedeelelAvya`, {
          ...dashboardMedeelelQuery,
        })
        .then(({ data }) => {
          setDashBoardData(data);
        });
    }
  }, [token, dashboardMedeelelQuery]);

  useEffect(() => {
    if (!!token) {
      posUilchilgee(token)
        .post(`/borluulaltToimAvya`, {
          ...toimQuery,
        })
        .then(({ data }) => {
          setBorluulaltToimAvya(data);
        });
    }
  }, [token, toimQuery]);

  const columns2 = [
    {
      title: "№",
      key: "index",
      align: "center",
      summary: true,
      width: "3rem",
      className: "border-r border-gray-200",
      height: "2rem",
      render: (text, record, index) => {
        return <div className="dark:">{index + 1}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Нэр</div>,
      dataIndex: "ner",
      align: "left",
      key: "",
      className: "border-r border-gray-200",
      width: "7rem",
      render: (text, data) => {
        return (
          <div>
            {
              <Popover title={false} content={<div>{data._id.ner}</div>}>
                <div className="truncate text-left">{data._id.ner}</div>
              </Popover>
            }
          </div>
        );
      },
    },
    {
      title: <div className="text-center font-semibold">Борлуулалтын хувь</div>,
      // dataIndex: "huwi",
      align: "right",
      key: "huwi",
      className: "border-r border-gray-200",
      width: "12rem",
      render: (huwi, record) => {
        let niit = borluulaltTopJagsaaltAvya?.reduce(
          (sum, item) => sum + (+item?.niitToo || 0),
          0
        );
        let huvi = (record?.niitToo / niit) * 100;
        return (
          <div className="flex w-full ">
            <div className="w-[90%] px-2">
              <Progress percent={huvi} size="small" />
            </div>
            <div className="w-[20%] text-[#4FD1C5]">{huvi.toFixed(2)}%</div>
          </div>
        );
      },
    },
    {
      title: <div className="text-center font-semibold ">Ширхэг</div>,
      // title: (
      //   <div className="color-amber-700 text-center font-semibold">Ширхэг</div>
      // ),
      dataIndex: "niitToo",
      align: "center",
      className: "border-r border-gray-200",
      key: "niitToo",
      width: "9rem",
      summary: true,
      render: (niitToo) => {
        return <div>{formatNumber(niitToo || 0, 2)}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Орлого</div>,
      dataIndex: "zarsanNiitUne",
      align: "right",
      key: "zarsanNiitUne",
      summary: true,
      width: "9rem",
      className: "border-r border-gray-200",
      render: (text, record) => {
        return <div> {formatNumber(record.zarsanNiitUne || 0, 2)}₮</div>;
      },
    },
  ];
  const columns = [
    {
      title: "№",
      key: "index",
      // className: "text-center dark:bg-gray-900 dark:text-white",
      align: "center",
      summary: true,
      className: "border-r border-gray-200",
      width: "3rem",
      render: (text, record, index) => {
        return <div className="dark:">{index + 1}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Нэр</div>,
      dataIndex: "ner",
      align: "left",
      key: "",
      className: "border-r border-gray-200",
      width: "7rem",
      render: (text, data) => {
        return (
          <div>
            {
              <Popover title={false} content={<div>{data._id.ner}</div>}>
                <div className="truncate text-left">{data._id.ner}</div>
              </Popover>
            }
          </div>
        );
      },
    },
    {
      title: <div className="text-center font-semibold">Ашгийн хувь</div>,
      // dataIndex: "huwi",
      align: "right",
      key: "huwi",
      width: "12rem",
      className: "border-r border-gray-200",
      render: (huwi, record) => {
        let niit = ashigTopJagsaaltAvya?.reduce(
          (sum, item) => sum + (+item?.niitAshig || 0),
          0
        );

        let huvi = (record?.niitAshig / niit) * 100;
        return (
          <div className="flex w-full ">
            <div className="w-[90%] px-2">
              <Progress percent={huvi} size="small" />
            </div>
            <div className="w-[20%] text-[#4FD1C5]">{huvi.toFixed(2)}%</div>
          </div>
        );
      },
    },
    {
      title: <div className="text-center font-semibold ">Ширхэг</div>,
      // title: (
      //   <div className="color-amber-700 text-center font-semibold">Ширхэг</div>
      // ),
      dataIndex: "niitToo",
      className: "border-r border-gray-200",
      align: "center",
      key: "niitToo",
      width: "9rem",
      summary: true,
      render: (niitToo) => {
        return <div>{formatNumber(niitToo || 0, 2)}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Ашиг</div>,
      dataIndex: "zarsanNiitUne",
      align: "right",
      key: "zarsanNiitUne",
      summary: true,
      className: "border-r border-gray-200",
      width: "9rem",
      render: (text, record) => {
        return <div>{formatNumber(record.niitAshig || 0, 2)}₮</div>;
      },
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        border: { dash: [3, 3] },
        ticks: {
          color: "#CBD5E0",
        },
      },
      x: {
        ticks: {
          color: "#CBD5E0",
        },
        grid: {
          display: false,
        },
      },
      xAxes: [
        {
          gridLines: {
            display: false,
            color: "black",
          },
          scaleLabel: {
            display: true,
            labelString: "Time in Seconds",
            fontColor: "red",
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Speed in Miles per Hour",
            fontColor: "green",
          },
        },
      ],
    },
  };

  return (
    <Admin
      onSearch={""}
      khuudasniiNer={"hynalt"}
      title={"Хяналт"}
      className="pt-5"
    >
      <div className="col-span-12 mb-4 flex h-full flex-col gap-5 px-2 sm:px-4">
        <div className="flex w-full flex-col gap-2 sm:flex-row dark:border-[#4FD1C5] dark:text-gray-300">
          <div
            onClick={() => router.push("./tailan/BorluulaltTailan")}
            className="flex h-[80px] sm:h-[80px] md:h-[90px] w-full sm:w-[50%] lg:w-[25%] items-center justify-between rounded-lg border border-[#4FD1C5] bg-white p-3 sm:p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-2 hover:border-[#4FD1C5] hover:bg-white dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 cursor-pointer"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-[#A0AEC0] text-xs sm:text-sm truncate">Нийт борлуулалт</div>
              <div className="flex items-center justify-between text-black dark:text-gray-300">
                <div className="text-sm sm:text-base md:text-[18px] font-bold truncate">
                  {formatNumber(dashboardData?.borluulalt)} ₮
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
            <div className="flex h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] items-center justify-center rounded-lg bg-[#4FD1C5]">
              <div className="p-1">
                <Image 
                  src="/niitBor.png" 
                  width={500} 
                  height={500} 
                  alt="Sales icon"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          </div>
          <div
            onClick={() =>
              router.push(`/khyanalt/tailan/BorluulaltTailan?tab=ashig`)
            }
            className="flex h-[80px] sm:h-[80px] md:h-[90px] w-full sm:w-[50%] lg:w-[25%] items-center border border-[#4FD1C5] justify-between rounded-lg bg-white p-3 sm:p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-2 hover:border-[#4FD1C5] hover:bg-white dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 cursor-pointer"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-[#A0AEC0] text-xs sm:text-sm truncate">Нийт ашиг</div>
              <div className="flex items-center justify-between text-black dark:text-gray-300">
                <div className="text-sm sm:text-base md:text-[18px] font-bold truncate">
                  {formatNumber(dashboardData?.ashig)} ₮
                </div>
                {/* <div className="text-green-400 text-xs sm:text-sm">+55%</div> */}
              </div>
            </div>
            <div className="flex-shrink-0">
            <div className="flex h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] items-center justify-center rounded-lg bg-[#4FD1C5]">
              <div className="p-1">
                <Image 
                  src="/ashig.png" 
                  width={500} 
                  height={500} 
                  alt="Profit icon"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          </div>
          <div
            onClick={() => router.push("./tailan/AvlagaTailan")}
            className="flex h-[80px] w-[25%] items-center justify-between rounded-lg border border-[#4FD1C5] bg-white p-3 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-2 hover:border-[#4FD1C5] hover:bg-white dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900"
          >
            <div className="w-[30%]">
              <div className="text-[#A0AEC0]">Авлага</div>
              <div className="flex items-center justify-between text-black dark:text-gray-200">
                <div className="text-[18px] font-bold">
                  {" "}
                  {formatNumber(dashboardData?.avlaga)}
                </div>
                {/* <div className="text-green-400">+55%</div> */}
              </div>
            </div>
            <div>
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-[#4FD1C5]">
                <div className="p-1">
                  <Image
                    src="/avlaga.png"
                    width={500}
                    height={500}
                    // alt="Picture of the author"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => router.push("./tailan/UglugTailan")}
            className="flex h-[80px] w-[25%] items-center justify-between rounded-lg border border-[#4FD1C5] bg-white p-3 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-2 hover:border-[#4FD1C5] hover:bg-white dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900"
          >
            <div className="w-[30%]">
              <div className="text-[#A0AEC0]">Өглөг</div>
              <div className="flex items-center justify-between text-black dark:text-gray-300">
                <div className="text-[18px] font-bold ">
                  {" "}
                  {formatNumber(dashboardData?.uglug)}
                </div>
              </div>
            </div>
            <div>
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-[#4FD1C5]">
                <div className="p-1">
                  <Image src="/uglug.png" width={500} height={500} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-5">
          <div className=" flex h-[445px] w-[50%] flex-col  rounded-lg bg-white p-2 dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 ">
            <div className="flex justify-between pl-[3%] text-[18px] font-[600] leading-8">
              <div className="!h-[36px] !w-[40%] bg-white font-bold  dark:bg-gray-900">
                Их зарагдсан
              </div>
              <div>
                <DatePicker.RangePicker
                  className="!h-[36px] !rounded-md bg-white dark:bg-white"
                  format={"YYYY-MM-DD"}
                  allowClear
                  disabledTime
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  value={borluulaltiinTopJagsaaltognoo}
                  onChange={(v) => setBorluulaltiinTopJagsaaltognoo(v)}
                />
              </div>
            </div>

            <Table
              locale={{
                emptyText: (
                  <span>
                    <Empty description={"Хоосон байна."} />
                  </span>
                ),
              }}
              size="small"
              pagination={false}
              scroll={{ y: "calc(53vh - 10rem)" }}
              columns={columns2}
              dataSource={borluulaltTopJagsaaltAvya}
              summary={(e) => (
                <AntdTable.Summary className="border " fixed={"bottom"}>
                  <AntdTable.Summary.Cell colSpan={2}>
                    <div className="space-x-2 truncate text-base font-bold ">
                      Нийт
                    </div>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell>
                    <div className="truncate text-center font-bold ">
                      {formatNumber(
                        e?.reduce((a, b) => a + (b?.niitToo || 0), 0),
                        2
                      )}
                    </div>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell>
                    <div className="truncate text-right font-bold ">
                      {formatNumber(
                        e?.reduce((a, b) => a + (b?.zarsanNiitUne || 0), 0),
                        2
                      )}
                      ₮
                    </div>
                  </AntdTable.Summary.Cell>
                </AntdTable.Summary>
              )}
            />
          </div>
          <div className=" flex h-[445px] w-[50%] flex-col  rounded-lg bg-white p-2 dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 ">
            <div className="flex justify-between pl-[3%] text-[18px] font-[600] leading-8">
              <div className="!h-[36px] !w-[30%] bg-white font-bold dark:bg-gray-900">
                Өндөр ашигтай
              </div>
              <div>
                <DatePicker.RangePicker
                  className="!h-[36px] !rounded-md bg-white"
                  format={"YYYY-MM-DD"}
                  allowClear
                  disabledTime
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  value={topAshigJagsaaltOgnoo}
                  onChange={(v) => {
                    setTopAshigJagsaaltOgnoo(v);
                  }}
                />
              </div>
            </div>
            <Table
              locale={{
                emptyText: (
                  <span>
                    <Empty description={"Хоосон байна."} />
                  </span>
                ),
              }}
              size="small"
              pagination={false}
              scroll={{ y: "calc(53vh - 10rem)" }}
              columns={columns}
              dataSource={ashigTopJagsaaltAvya}
              summary={(e) => (
                <AntdTable.Summary className="border " fixed={"bottom"}>
                  <AntdTable.Summary.Cell colSpan={2}>
                    <div className="space-x-2 truncate text-base font-bold ">
                      Нийт
                    </div>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell>
                    <div className="truncate text-center font-bold ">
                      {formatNumber(
                        e?.reduce((a, b) => a + (b?.niitToo || 0), 0),
                        2
                      )}
                    </div>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell>
                    <div className="truncate text-right font-bold ">
                      {formatNumber(
                        e?.reduce((a, b) => a + (b?.niitAshig || 0), 0),
                        2
                      )}
                      ₮
                    </div>
                  </AntdTable.Summary.Cell>
                </AntdTable.Summary>
              )}
            />
          </div>
          {/* <div className=" flex h-[445px] w-[20%] flex-col  rounded-lg bg-white p-2 dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 ">
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-bold">Салбарын мэдээлэл</div>
              <BaiguullagaBurtgelAlkham
                salbariinId={salbariinId}
                token={token}
                mutate={emiinSanSalbarMutate}
                readonly={false}
                ugugdul={undefined}
                baiguullagiinId={baiguullagiinId}
              />
            </div>
            <Divider className="!my-2" />
            <div className="flex h-[100%] w-full flex-col items-center justify-center gap-2 overflow-y-auto ">
              {emiinSanData?.map((item, index) => (
                <div className="flex w-[90%] items-center   p-2 " key={index}>
                  <div className="flex w-[30%] text-lg font-[500]"></div>
                  <div className="flex w-full flex-col items-start justify-center gap-4">
                    <div className="font-[700] leading-4 text-[#718096]">
                      {item?.ner}
                    </div>
                    <div>
                      <div className="flex gap-1 truncate">
                        <div className="font-[400] text-[#A0AEC0]">Утас:</div>
                        <div className="font-[400] text-[#718096]">
                          {item?.utas}
                        </div>
                      </div>
                      <div className="flex gap-2 truncate">
                        <div className="font-[400] text-[#A0AEC0]">Хаяг:</div>
                        <div className="font-[400] text-[#718096]">
                          {item?.khayag}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex flex-col gap-4">
                    <BaiguullagaBurtgelAlkham
                      salbariinId={salbariinId}
                      token={token}
                      mutate={emiinSanSalbarMutate}
                      readonly={false}
                      ugugdul={item}
                      baiguullagiinId={baiguullagiinId}
                    />
                    <BaiguullagaBurtgelAlkham
                      salbariinId={salbariinId}
                      token={token}
                      mutate={emiinSanSalbarMutate}
                      readonly={true}
                      ugugdul={item}
                      baiguullagiinId={baiguullagiinId}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
        <div className=" flex h-[445px] w-full flex-col  gap-5 rounded-lg bg-white p-6 dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900">
          <div className="flex justify-between">
            <div className="ml-5 text-[18px] font-bold text-[#2D3748] dark:text-[#d1d5db]">
              Борлуулалтын тойм
            </div>
            <div className=" flex items-center">
              <div className="ml-5">
                <Select
                  defaultValue="Сар"
                  style={{
                    width: 120,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#4FD1C5",
                    marginRight: 10,
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "day",
                      label: "Өдөр",
                    },
                    {
                      value: "month",
                      label: "Сар",
                    },
                    {
                      value: "year",
                      label: "Жил",
                    },
                  ]}
                />
              </div>
              <div>
                <DatePicker.RangePicker
                  className="!h-[36px] !rounded-md bg-white"
                  format={"YYYY-MM-DD"}
                  allowClear
                  disabledTime
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  value={ognooToim}
                  onChange={(v) => {
                    setOgnooToim(v);
                  }}
                />
              </div>
            </div>
            {/* <div className="flex gap-2">
              <div className="text-green-400">(+5) more</div>
              <div className="text-[#A0AEC0]">in 2021</div>
            </div> */}
          </div>

          {/* {console.log(borluulaltToimAvya, "chartOptions")} */}
          {borluulaltToimAvya?.length < 0 ? (
            <Line
              options={chartOptions}
              data={borluulaltToimAvya}
              height={50}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Empty description={"Хоосон байна."} />
            </div>
          )}
        </div>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Hynalt;
