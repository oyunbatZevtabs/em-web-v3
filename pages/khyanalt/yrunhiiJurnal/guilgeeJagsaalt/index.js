import React, { useMemo, useState } from "react";
import { DatePicker, Select } from "antd";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Table from "components/ant/AntdTable";
import GuilgeeBurtgekh from "components/modalBody/guilgeeJagsaalt/guilgeeBurtgekh";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/posUseJagsaalt";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import BaganiinSongolt from "components/baganaNemekh";
import { Popover } from "components/ant/AntdPopover";
import { Table as AntdTable } from "antd";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import useOrder from "tools/function/useOrder";

const searchKeys = ["code", "ner"];
const searchKeysJurnal = ["zadargaa.dansniiNer"];
var timeout = null;

const GuilgeeniiJagsaalt = () => {
  const [shineBagana, setShineBagana] = useState([]);
  const [dans, setDans] = useState([]);
  const [selectedHaritssanDans, setSelectedHaritssanDans] = useState([]);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const { RangePicker } = DatePicker;
  const { salbariinId, baiguullagiinId } = useAuth();

  const query = useMemo(() => {
    var result = {
      baiguullagiinId: baiguullagiinId,
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
    };

    if (dans.length > 0) {
      result.dansniiDugaar = dans;
    }
    if (selectedHaritssanDans.length > 0) {
      result.kharitssanDans = selectedHaritssanDans;
    }

    return result;
  }, [baiguullagiinId, ognoo, dans, selectedHaritssanDans]);

  const queryJurnal = useMemo(() => {
    return {
      baiguullagiinId: baiguullagiinId,
    };
  }, [baiguullagiinId]);

  const { data: jurnalDansData, setKhuudaslalt: setJurnalDansKhuudaslalt } =
    posUseJagsaalt(
      "/jurnalDans",
      queryJurnal,
      undefined,
      undefined,
      searchKeys
    );

  const { data: kharitsasanDans, setKhuudaslalt: setKharitsasanDans } =
    posUseJagsaalt(
      "/jurnalDans",
      queryJurnal,
      undefined,
      undefined,
      searchKeys
    );

  const { data, jagsaalt, setKhuudaslalt, refresh, isValidating } = useJagsaalt(
    "/jurnalGuilgeeniiJagsaaltAvya",
    query,
    order
  );

  const columns = useMemo(
    () => [
      {
        title: <div className="">№</div>,
        dataIndex: "desDugaar",
        key: "desDugaar",
        width: "40px",
        align: "center",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: <div className="">Журналын дугаар</div>,
        key: "barimtiinDugaar",
        dataIndex: "barimtiinDugaar",
        width: "160px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: <div className="">Огноо</div>,
        key: "ognoo",
        dataIndex: "ognoo",
        width: "160px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (ognoo) => {
          return (
            <div className="jjjjjjjj">{moment(ognoo).format("YYYY-MM-DD")}</div>
          );
        },
      },
      {
        title: <div className="">Багц</div>,
        key: "bagts",
        dataIndex: "bagts",
        align: "center",
        width: "80px",
        render: (bagts, data) => {
          return <div className="">{data?.zadargaa?.bagts}</div>;
        },
      },
      {
        title: <div className="">Дансны код</div>,
        key: "dansniiDugaar",
        dataIndex: "dansniiDugaar",
        align: "center",
        width: "120px",
        render: (dansniiDugaar, data) => {
          return <div className="">{data?.zadargaa?.dansniiDugaar}</div>;
        },
      },
      {
        title: <div className="">Дансны нэр</div>,
        key: "dansniiNer",
        dataIndex: "dansniiNer",
        align: "center",
        width: "140px",
        render: (dansniiNer, data) => {
          return (
            <Popover
              content={<div className="">{data?.zadargaa?.dansniiNer}</div>}>
              <div className="truncate text-left">
                {data?.zadargaa?.dansniiNer}
              </div>
            </Popover>
          );
        },
      },
      {
        title: <div className="">Ханш</div>,
        key: "khansh",
        dataIndex: "khansh",
        width: "100px",
        align: "center",
        render: (khansh, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.khansh, 2)}
            </div>
          );
        },
      },
      {
        title: <div className="">Дебет /Валют/</div>,
        key: "debitValyut",
        dataIndex: "debitValyut",
        width: "150px",
        align: "center",
        render: (debitValyut, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.debitDun, 2)}
            </div>
          );
        },
      },
      {
        title: <div className="">Дебет</div>,
        key: "debitDun",
        dataIndex: "zadargaa.debitDun",
        width: "100px",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        summary: true,
        render: (debitDun, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.debitDun, 2)}
            </div>
          );
        },
      },
      {
        title: <div className="">Кредит /Валют/</div>,
        key: "kreditValyut",
        dataIndex: "kreditValyut",
        width: "150px",
        align: "center",
        render: (kreditValyut, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.kreditDun, 2)}
            </div>
          );
        },
      },
      {
        title: <div className="">Кредит</div>,
        key: "kreditDun",
        dataIndex: "zadargaa.kreditDun",
        width: "100px",
        align: "center",
        summary: true,
        showSorterTooltip: false,
        sorter: () => 0,
        render: (kreditDun, data) => {
          return (
            <div className="text-right">
              {formatNumber(data?.zadargaa?.kreditDun, 2)}
            </div>
          );
        },
      },
      ...shineBagana,
    ],
    [shineBagana]
  );

  function UilgelAvya({ garalt, columns }) {
    return (
      <AntdTable.Summary.Row>
        {columns.map((mur, index) => {
          return (
            <AntdTable.Summary.Cell
              className={`${
                mur.summary !== true ? "border-none " : "font-bold "
              }`}
              index={index}
              align="right">
              {mur.summary
                ? mur?.dataIndex === "debitDun"
                  ? formatNumber(
                      garalt?.reduce(
                        (a, b) => a + (b?.zadargaa?.debitDun || 0),
                        0
                      ),
                      2
                    ) + "₮"
                  : mur?.dataIndex === "kreditDun"
                  ? formatNumber(
                      garalt?.reduce(
                        (a, b) => a + (b?.zadargaa?.kreditDun || 0),
                        0
                      ),
                      2
                    ) + "₮"
                  : ""
                : ""}
            </AntdTable.Summary.Cell>
          );
        })}
      </AntdTable.Summary.Row>
    );
  }

  return (
    <Admin
      khuudasniiNer={"guilgeeJagsaalt"}
      className={"p-4"}
      title={"Гүйлгээний жагсаалт"}>
      <div className="col-span-full flex w-full flex-col">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <div className="flex w-full gap-2">
              <RangePicker
                size="large"
                suffixIcon=""
                allowClear={false}
                className="!h-[36px] w-64 !rounded-md bg-white"
                placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                value={ognoo}
                onChange={(v) => setOgnoo(v)}
              />
              <Select
                bordered={false}
                onChange={(v) => setDans(v)}
                placeholder="Данс сонгох"
                className="w-64 overflow-hidden rounded-md border-[1px] border-[#4FD1C5] bg-white"
                showSearch
                mode="multiple"
                filterOption={(o) => o}
                allowClear={true}
                onClear={() => {
                  setJurnalDansKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: "",
                  }));
                }}
                onSearch={(v) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setJurnalDansKhuudaslalt((e) => ({
                      ...e,
                      khuudasniiDugaar: 1,
                      search: v,
                    }));
                  }, 500);
                }}>
                {jurnalDansData?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur?.code}>
                      <div className={`flex justify-start`}>
                        {mur.code} - {mur.ner}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
              <Select
                // disabled={true}
                disabled={!dans.length > 0}
                bordered={false}
                onChange={(v) => setSelectedHaritssanDans(v)}
                placeholder="Харьцсан данс"
                className="w-64 overflow-hidden rounded-md border-[1px] border-[#4FD1C5] bg-white"
                showSearch
                mode="multiple"
                filterOption={(o) => o}
                allowClear={true}
                onClear={() => {
                  setKharitsasanDans((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: "",
                  }));
                }}
                onSearch={(v) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setKharitsasanDans((e) => ({
                      ...e,
                      khuudasniiDugaar: 1,
                      search: v,
                    }));
                  }, 500);
                }}>
                {kharitsasanDans?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur?.code}>
                      <div className={`flex justify-start`}>
                        {mur.code} - {mur.ner}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
              <Select
                bordered={false}
                placeholder="Харилцагч"
                className="w-[100px] overflow-hidden rounded-md border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"></Select>
              <Select
                bordered={false}
                placeholder="Дугаар"
                className="w-[100px] overflow-hidden rounded-md border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"></Select>
            </div>
            <div className="flex gap-2">
              <GuilgeeBurtgekh
                guigleeJagsaaltMutate={refresh}
                salbariinId={salbariinId}
                baiguullagiinId={baiguullagiinId}
              />
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: <div className="">Гүйлгээний утга</div>,
                    key: "tailbar",
                    dataIndex: "tailbar",
                    width: "150px",
                    align: "center",
                    render: (tailbar, data) => {
                      return (
                        <div className="text-left">
                          {data?.zadargaa?.tailbar}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="">Харилцагч</div>,
                    key: "khariltsagchiinNer",
                    dataIndex: "khariltsagchiinNer",
                    align: "center",
                    width: "140px",
                    render: (khariltsagchiinNer, data) => {
                      return <div className="">{khariltsagchiinNer}</div>;
                    },
                  },
                  {
                    title: <div className="">Гүйлгээний төрөл</div>,
                    key: "guilgeeniiTurul",
                    dataIndex: "guilgeeniiTurul",
                    width: "150px",
                    align: "center",
                    // render: (guilgeeniiTurul) => {
                    //   return <div className="">{guilgeeniiTurul}</div>;
                    // },
                  },
                ]}
              />
            </div>
          </div>
          <Table
            size="small"
            onChange={onChangeTable}
            unshijBaina={isValidating}
            bordered={true}
            dataSource={data?.jagsaalt}
            scroll={{ y: "calc(100vh - 15rem)", x: "calc(100vw - 30rem)" }}
            rowClassName="hover:bg-blue-100"
            columns={columns}
            summary={() => (
              <AntdTable.Summary fixed>
                <UilgelAvya garalt={data?.jagsaalt} columns={columns} />{" "}
              </AntdTable.Summary>
            )}
            pagination={{
              current: data?.khuudasniiDugaar,
              pageSize: data?.khuudasniiKhemjee,
              total: data?.niitMur,

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
      </div>
    </Admin>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default GuilgeeniiJagsaalt;
