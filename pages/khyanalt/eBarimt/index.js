import { Button, DatePicker, Popover, Tabs, Tooltip } from "antd";

import shalgaltKhiikh from "services/shalgaltKhiikh";

import Admin from "components/Admin";
import React, { useMemo, useRef, useState } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import formatNumber from "tools/function/formatNumber";
import Table from "components/ant/AntdTable";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import {
  FormOutlined,
  DeleteOutlined,
  SettingOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import useEBarimt from "hooks/useEBarimt";
import { useAuth } from "services/auth";
import moment from "moment";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import UstgahdaaItgelteibainaModal from "components/modalBody/ustgahdaaItgelteibainaModal";
import { Modal } from "components/ant/AntdModal";
import useBarimtToollolt from "hooks/useEBarimtToololtAviya";
import useEBarimtMedeelel from "hooks/useEBarimtMedeelel";

function tuluw(a) {
  if (a === "Delivered") {
    return (
      <div className="rounded-full bg-[#EBF9F1] p-2  text-[#1F9254]">
        Delivered
      </div>
    );
  } else if (a === "Process")
    return (
      <div className="rounded-full bg-[#FEF2E5] p-2 text-[#CD6200]">
        Process
      </div>
    );
  else if (a === "Canceled")
    return (
      <div className="rounded-full bg-[#FBE7E8] p-2 text-[#A30D11]">
        Canceled
      </div>
    );
  else return a;
}

const order = { createdAt: -1 };

function EBarimt() {
  const { token, baiguullagiinId, salbariinId, baiguullaga } = useAuth();
  const [ustgahBarimt, setUstgahBarimt] = useState();
  const [turul, setTurul] = useState("Нийт");
  const [ebarimtOgnoo, setEbarimtOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  // Add state for digital prescription date range
  const [tsahimJorOgnoo, setTsahimJorOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  const ebarimtQuery = useMemo(() => {
    var query;
    if (turul === "Буцаалт хийгдсэн") {
      query = {
        ustgasanOgnoo: { $exists: true },
      };
    } else {
      query = {
        ustgasanOgnoo: { $exists: false },
      };
    }
    if (!!ebarimtOgnoo && !!ebarimtOgnoo[0] && !!ebarimtOgnoo[1]) {
      query = {
        ...query,
        createdAt: {
          $gte: moment(ebarimtOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ebarimtOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
      };
    }
    return query;
  }, [salbariinId, turul, ebarimtOgnoo]);

  const { eBarimtGaralt, eBarimtMutate, setEBarimtKhuudaslalt } = useEBarimt(
    token,
    baiguullagiinId,
    undefined,
    ebarimtQuery,
    order
  );

  const { eBarimtMedeelel, eBarimtMedeelelMutate } = useEBarimtMedeelel(token);

  const ToololtQuery = useMemo(() => {
    return {
      ekhlekhOgnoo: ebarimtOgnoo?.length > 0 ? ebarimtOgnoo[0] : undefined,
      duusakhOgnoo: ebarimtOgnoo?.length > 0 ? ebarimtOgnoo[1] : undefined,
      salbariinId: salbariinId,
    };
  }, [salbariinId, ebarimtOgnoo]);

  const { ebarimtiinToololt, ebarimtiinToololtMutate } = useBarimtToollolt(
    token,
    ToololtQuery
  );

  // Add query for digital prescription with date filter
  const tsahimJorQuery = useMemo(() => {
    let query = { baiguullagiinId: baiguullagiinId };

    if (!!tsahimJorOgnoo && !!tsahimJorOgnoo[0] && !!tsahimJorOgnoo[1]) {
      query = {
        ...query,
        createdAt: {
          $gte: moment(tsahimJorOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(tsahimJorOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
      };
    }
    return query;
  }, [baiguullagiinId, tsahimJorOgnoo]);

  const { data, setKhuudaslalt, mutate, isValidating } = posUseJagsaalt(
    "tsahimJor",
    tsahimJorQuery,
    order
  );

  const columns = [
    {
      title: "№",
      key: "index",
      align: "center",
      width: "1rem",
      fixed: "left",
      className: "border-r border-gray-300",
      render: (text, record, index) => {
        const dugaar =
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1;

        return <div className="text-center">{dugaar}</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Огноо</div>,
      dataIndex: "createdAt",
      className: "border-r border-gray-300",
      align: "center",
      showSorterTooltip: false,
      key: "createdAt",
      width: "3rem",
      sorter: (a, b) => 0,
      render: (e) => {
        return moment(e).format("YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: <div className="text-center font-semibold">Баримтын дугаар</div>,
      dataIndex: "guilgeeniiDugaar",
      align: "center",
      key: "zahialga",
      width: "3rem",
      className: "border-r border-gray-300",
    },
    {
      title: <div className="text-center font-semibold">Төрөл</div>,
      align: "center",
      width: "3rem",
      className: "border-r border-gray-300",
      // sorter: (a, b) => 0,
      render(mur) {
        if (mur.type === "B2B_RECEIPT")
          return (
            <div>
              <div className="text-center">Байгууллага</div>
              <div>{mur.customerNo}</div>
            </div>
          );
        return <div>Иргэн</div>;
      },
    },
    {
      title: <div className="text-center font-semibold">Дүн</div>,
      dataIndex: "amount",
      align: "right",
      className: "border-r border-gray-300",
      key: "amount",
      width: "2rem",
      render(text, object) {
        if (!!object.cashAmount)
          return <div>{formatNumber(Number(text), 2)}₮</div>;
        else return <div>{formatNumber(Number(object.totalAmount), 2)}₮</div>;
      },
    },
    {
      title: <div className="font-semibold">Төлөв</div>,
      dataIndex: "tuluw",
      align: "left",
      className: "border-r border-gray-300",
      key: "tuluw",
      showSorterTooltip: false,
      width: "3rem",
      sorter: (a, b) => 0,
      render: (data) => {
        return (
          <div className="flex w-full items-center justify-start">
            {tuluw(data)}
          </div>
        );
      },
    },
    {
      title: <div className=" font-semibold">ДДТД</div>,
      dataIndex: "billId",
      align: "left",
      className: "border-r border-gray-300",
      key: "billId",
      render: (data, object) => {
        if (!!object.billId) return object.billId;
        else return object.id;
      },
      showSorterTooltip: false,
      ellipsis: true,
      width: "4rem",
      sorter: (a, b) => 0,
    },
    {
      title: () => (
        <div className="flex justify-center text-center font-semibold">
          <SettingOutlined />
        </div>
      ),
      key: "action",
      align: "center",
      width: "1rem",
      render: (_text, record) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {record?.zarlagdsanEsekh !== true && (
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex w-24 flex-col space-y-2">
                    <a
                      onClick={() => setUstgahBarimt(record)}
                      className="ant-dropdown-link flex w-full items-center  justify-between  rounded-lg p-2 hover:bg-green-100 "
                    >
                      <DeleteOutlined
                        style={{ fontSize: "18px", color: "red" }}
                      />
                      <label className="text-[#ff0000]">Устгах</label>
                    </a>
                  </div>
                )}
              >
                <a className="flex items-center justify-start rounded-full hover:bg-gray-200">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            )}
          </div>
        );
      },
    },
  ];
  const columns2 = [
    {
      title: "№",
      key: "index",
      align: "center",
      width: "1rem",
      fixed: "left",
      className: "border-r border-gray-200",
      render: (text, record, index) => {
        const dugaar =
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1;

        return <div className="text-center">{dugaar}</div>;
      },
    },

    {
      title: <div className="text-left font-semibold">Огноо</div>,
      dataIndex: "createdAt",
      align: "left",
      showSorterTooltip: false,
      className: "border-r border-gray-200",
      key: "date",
      width: "3rem",
      sorter: (a, b) => 0,
      render: (e) => {
        return moment(e).format("YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: <div className="text-left font-semibold">Баримтын дугаар</div>,
      dataIndex: "receiptNumber",
      align: "left",
      className: "border-r border-gray-200",
      key: "zahialga",
      width: "2rem",
      render(a, b) {
        return b.guilgeeniiDugaar || a;
      },
    },
    {
      title: <div className="text-left font-semibold">Хөнгөлсөн дүн</div>,
      dataIndex: "insAmt",
      align: "right",
      width: "3rem",
      className: "border-r border-gray-200",
      render(text) {
        return formatNumber(text, 2);
      },
      // sorter: (a, b) => 0,
    },
    {
      title: <div className="text-left font-semibold">Дүн</div>,
      dataIndex: "netAmt",
      align: "right",
      key: "netAmt",
      className: "border-r border-gray-200",
      width: "3rem",
      render(text) {
        return formatNumber(text, 2);
      },
    },
    {
      title: <div className="text-left font-semibold">Төлөв</div>,
      dataIndex: "EMYruuIlgeesenEsekh",
      align: "center",
      key: "tuluw",
      className: "border-r border-gray-200",
      showSorterTooltip: false,
      width: "3rem",
      sorter: (a, b) => 0,
      render: (data) => {
        return (
          <div
            className={`flex items-center justify-center rounded-lg text-center font-medium text-white ring-2 ring-white ${
              data === true ? "bg-green-600" : "bg-yellow-600"
            }`}
          >
            {data === true ? "Илгээсэн" : "Илгээгдээгүй"}
          </div>
        );
      },
    },
    {
      title: <div className="text-left font-semibold">ДДТД</div>,
      dataIndex: "posRno",
      align: "left",
      className: "border-r border-gray-200",
      key: "posRno",
      showSorterTooltip: false,
      ellipsis: true,
      width: "4rem",
      sorter: (a, b) => 0,
    },
    {
      title: () => (
        <div className="flex justify-center text-center font-semibold">
          <SettingOutlined />
        </div>
      ),
      key: "action",
      align: "center",
      width: "1rem",
      render: (_text, record) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {record?.zarlagdsanEsekh !== true && (
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex w-24 flex-col space-y-2">
                    <a className="ant-dropdown-link flex w-full items-center  justify-between  rounded-lg p-2 hover:bg-green-100">
                      <FormOutlined
                        style={{ fontSize: "18px", color: "  #4fc1d5" }}
                      />
                      <label className="text-[#4fc1d5]">Засах</label>
                    </a>
                    <a className="ant-dropdown-link flex w-full items-center  justify-between  rounded-lg p-2 hover:bg-green-100 ">
                      <DeleteOutlined
                        style={{ fontSize: "18px", color: "red" }}
                      />
                      <label className="text-[#ff0000]">Устгах</label>
                    </a>
                  </div>
                )}
              >
                <a className="flex items-center justify-start rounded-full hover:bg-gray-200">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            )}
          </div>
        );
      },
    },
  ];

  const shuultuud = [
    {
      key: 1,
      garchig: "Баримт авах",
      too: ebarimtiinToololt?.avakhToo,
      shuult: "Баримт авах",
      jijigUg: "Тоо",
    },
    {
      key: 2,
      garchig: "Баримтын дүн",
      too: ebarimtiinToololt?.avakhDun,
      shuult: "Баримтын дүн",
      jijigUg: "Дүн",
    },
    {
      key: 3,
      garchig: "Баримт авсан",
      too: ebarimtiinToololt?.ilgeesenToo,
      shuult: "Баримт авсан",
      jijigUg: "Тоо",
    },
    {
      key: 4,
      garchig: "Баримт авсан дүн",
      too: ebarimtiinToololt?.ilgeesenDun,
      shuult: "Баримт авсан дүн",
      jijigUg: "Дүн",
    },
    {
      key: 5,
      garchig: "Буцаалт хийгдсэн",
      too: ebarimtiinToololt?.butsaasanToo,
      shuult: "Буцаалт хийгдсэн",
      jijigUg: "Тоо",
    },
    {
      key: 6,
      garchig: "Буцаалт хийгдсэн дүн",
      too: ebarimtiinToololt?.butsaasanDun,
      shuult: "Буцаалт хийгдсэн дүн",
      jijigUg: "Дүн",
    },
  ];
  const shuultuud2 = [
    {
      key: 1,
      garchig: "Жор авах",
      too: 0,
      shuult: "Жор авах",
      jijigUg: "Тоо",
    },
    {
      key: 2,
      garchig: "Жорын дүн",
      too: 0,
      shuult: "Жорын дүн",
      jijigUg: "Дүн",
    },
    {
      key: 3,
      garchig: "Жор авсан",
      too: 0,
      shuult: "Жор авсан",
      jijigUg: "Тоо",
    },
    {
      key: 4,
      garchig: "Жор авсан дүн",
      too: 0,
      shuult: "Жор авсан дүн",
      jijigUg: "Дүн",
    },
    {
      key: 5,
      garchig: "Буцаалт хийгдсэн",
      too: 0,
      shuult: "Буцаалт хийгдсэн",
      jijigUg: "Тоо",
    },
    {
      key: 6,
      garchig: "Буцаалт хийгдсэн дүн",
      too: 0,
      shuult: "Буцаалт хийгдсэн дүн",
      jijigUg: "Дүн",
    },
  ];

  function tsahimJorIlgeeye() {
    posUilchilgee(token)
      .post("/tsahimJorIlgeeye", { baiguullagiinId: baiguullagiinId })
      .then(({ status }) => {
        status === 200 && AmjilttaiAlert("Цахим жор амжилттай илгээлээ");
        mutate();
        eBarimtMedeelelMutate();
      })
      .catch(aldaaBarigch);
  }

  const items = [
    {
      key: "1",
      label: <div className="">И-Баримт</div>,
      children: (
        <>
          <div
            className="col-span-12 flex flex-col gap-2 rounded-lg "
            style={{ height: "calc( 100vh - 16rem )" }}
          >
            <div className="grid h-fit w-full grid-cols-6 place-items-center gap-6 xl:grid-cols-12">
              {shuultuud.map((item) => {
                return (
                  <div
                    onClick={() =>
                      setTurul(turul === item.shuult ? "Нийт" : item.shuult)
                    }
                    className={`${
                      turul === item.shuult && "bg-green-500 bg-opacity-5 "
                    } col-span-2 flex w-full cursor-pointer flex-col items-start justify-center overflow-hidden rounded-lg border border-[#4FD1C5] p-4 shadow-lg`}
                  >
                    <div className="truncate font-[500] text-gray-400">
                      {item.garchig}
                    </div>
                    <div className="flex w-full justify-end gap-2">
                      <div className="font-thin text-gray-400">
                        {item.jijigUg}:
                      </div>
                      <div className="truncate font-[700] dark:text-gray-300">
                        {formatNumber(item.too, 2)}
                      </div>
                    </div>
                    {/* <div>{item.shuult}</div> */}
                  </div>
                );
              })}
            </div>
            <div className="my-2 flex w-full items-center justify-between">
              <div className="flex w-full items-center justify-start gap-4">
                <DatePicker.RangePicker
                  className="!h-[36px] w-64 !rounded-md bg-white"
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  defaultValue={[
                    moment(new Date(), "YYYY-MM-DD"),
                    moment(new Date(), "YYYY-MM-DD"),
                  ]}
                  onChange={setEbarimtOgnoo}
                />
              </div>
              <div className="flex w-full items-center justify-end gap-4">
                <div className="ml-auto text-center text-[11px] font-[600] dark:text-gray-300 xl:text-[16px]">
                  Сүүлд татварт илгээсэн огноо:
                </div>
                <DatePicker
                  className="!h-[36px] w-48 !rounded-md bg-white"
                  placeholder={"Сүүлд илгээсэн огноо"}
                  value={
                    !!eBarimtMedeelel?.extraInfo?.tsahimJorLastSentDate &&
                    moment(eBarimtMedeelel?.extraInfo?.tsahimJorLastSentDate)
                  }
                  disabled
                />
                <Button onClick={ebarimtIlgeeye} type="primary">
                  Татварт илгээх
                </Button>
              </div>
            </div>
            <div>
              <Table
                scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
                // dataSource={dataSource}
                dataSource={eBarimtGaralt?.jagsaalt}
                columns={columns}
                pagination={{
                  current: parseFloat(eBarimtGaralt?.khuudasniiDugaar),
                  pageSize: eBarimtGaralt?.khuudasniiKhemjee,
                  total: eBarimtGaralt?.niitMur,
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setEBarimtKhuudaslalt((umnukh) => ({
                      ...umnukh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee,
                    })),
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: <div className="">Цахим жор</div>,
      children: (
        <>
          <div
            className="col-span-12 flex flex-col gap-2 rounded-lg "
            style={{ height: "calc( 100vh - 16rem )" }}
          >
            <div className="grid h-fit w-full grid-cols-6 place-items-center gap-6 xl:grid-cols-12">
              {shuultuud2.map((item) => {
                return (
                  <div className="col-span-2 flex w-full flex-col items-start justify-center overflow-hidden rounded-lg border border-[#4FD1C5] p-4 shadow-lg">
                    <div className="truncate font-[500] text-gray-400">
                      {item.garchig}
                    </div>
                    <div className="flex w-full justify-end truncate font-[700] dark:text-gray-300">
                      {item.too}
                    </div>
                    {/* <div>{item.shuult}</div> */}
                  </div>
                );
              })}
            </div>
            <div className="my-2 flex w-full items-center justify-between">
              <div className="flex w-full items-center justify-start gap-4">
                <DatePicker.RangePicker
                  className="!h-[36px] w-64 !rounded-md bg-white"
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  defaultValue={[
                    moment(new Date(), "YYYY-MM-DD"),
                    moment(new Date(), "YYYY-MM-DD"),
                  ]}
                  onChange={setTsahimJorOgnoo}
                />
              </div>
              <div className="my-2 flex w-full items-center justify-end gap-4">
                <div className="ml-auto text-center text-[11px] font-[600] dark:text-gray-300 xl:text-[16px]">
                  Сүүлд илгээсэн огноо:
                </div>
                <DatePicker
                  className="!h-[36px] w-48 !rounded-md bg-white"
                  placeholder={"Сүүлд илгээсэн огноо"}
                  value={
                    !!eBarimtMedeelel?.extraInfo?.tsahimJorLastSentDate &&
                    moment(eBarimtMedeelel?.extraInfo?.tsahimJorLastSentDate)
                  }
                  disabled
                />
                <Button onClick={tsahimJorIlgeeye} type="primary">
                  Цахим жор илгээх
                </Button>
              </div>
            </div>
            <div>
              <Table
                scroll={{ y: "calc(100vh - 25rem)", x: "calc(20vw - 25rem)" }}
                // dataSource={dataSource}
                dataSource={data?.jagsaalt}
                columns={columns2}
                pagination={{
                  current: parseFloat(data?.khuudasniiDugaar),
                  pageSize: data?.khuudasniiKhemjee,
                  total: data?.niitMur,
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setKhuudaslalt((umnukh) => ({
                      ...umnukh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee,
                    })),
                }}
              />
            </div>
          </div>
        </>
      ),
    },
  ];

  function ebarimtIlgeeye() {
    posUilchilgee(token)
      .post("/ebarimtIlgeeye", { baiguullagiinId: baiguullagiinId })
      .then(({ status }) => {
        status === 200 && AmjilttaiAlert("Баримт амжилттай илгээлээ");
        eBarimtMutate();
      })
      .catch(aldaaBarigch);
  }

  return (
    <Admin
      size="large"
      loading={isValidating}
      title="ИБаримт"
      khuudasniiNer="eBarimt"
      className=" grid grid-cols-12 p-0 md:p-4 "
      onSearch={(search) =>
        setEBarimtKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <Tabs
        tabPosition="bottom"
        size="large"
        animated
        className="col-span-12"
        defaultActiveKey="1"
        items={items}
      />

      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="text-center">Устгахдаа итгэлтэй байна уу?</div>}
        open={!!ustgahBarimt}
        onCancel={() => setUstgahBarimt()}
      >
        <div className="flex w-full justify-end gap-3">
          <Button type="default" onClick={() => setUstgahBarimt()}>
            Үгүй
          </Button>
          <Button
            onClick={() =>
              posUilchilgee(token)
                .post("/ebarimtButsaaya", ustgahBarimt)
                .then(({ data }) => {
                  AmjilttaiAlert("Амжилттай устгагдлаа");
                  setUstgahBarimt();
                  eBarimtMutate();
                })
            }
            type="primary"
          >
            Тийм
          </Button>
        </div>
      </Modal>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default EBarimt;
