import React, { useMemo, useState } from "react";
import { DatePicker, Select } from "antd";
import Admin from "components/Admin";
import Table from "components/ant/AntdTable";
import GuilgeeBurtgekh from "components/modalBody/guilgeeJagsaalt/guilgeeBurtgekh";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/posUseJagsaalt";
import moment from "moment";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import BaganiinSongolt from "components/baganaNemekh";

const searchKeys = ["buleg", "code", "ner"];
const order = { createdAt: -1 };

const GuilgeeniiJagsaalt = () => {
  const [shineBagana, setShineBagana] = useState([]);
  const [dans, setDans] = useState();
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const { RangePicker } = DatePicker;
  const { salbariinId, baiguullagiinId } = useAuth();

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      dansniiDugaar: dans,
    }),
    [baiguullagiinId, ognoo, dans]
  );

  const queryJurnal = useMemo(() => {
    return {
      baiguullagiinId: baiguullagiinId,
    };
  }, [baiguullagiinId]);

  const { data: jurnalDansData, setKhuudaslalt: jurnalSetKhuudaslalt } =
    posUseJagsaalt(
      "/jurnalDans",
      queryJurnal,
      undefined,
      undefined,
      searchKeys
    );

  const { data, jagsaalt, setKhuudaslalt, refresh } = useJagsaalt(
    "/jurnalGuilgeeniiJagsaaltAvya",
    query
  );

  return (
    <Admin
      khuudasniiNer={"guilgeeJagsaalt"}
      className={"p-4"}
      title={"Гүйлгээний жагсаалт"}
    >
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
                onSearch={(v) =>
                  jurnalSetKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: v,
                  }))
                }
                showSearch
                placeholder="Данс"
                onChange={(v) => setDans(v)}
                className="w-[100px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"
              >
                {jurnalDansData?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur?.code}>
                      <div className={`flex justify-start dark:text-gray-300 `}>
                        <div className="font-bold dark:text-gray-300">
                          {mur?.code}
                        </div>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
              <Select
                bordered={false}
                placeholder="Данс (Агуулаагүй)"
                className="w-[100px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"
              ></Select>
              <Select
                bordered={false}
                placeholder="Харилцагч"
                className="w-[100px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"
              ></Select>
              <Select
                bordered={false}
                placeholder="Дугаар"
                className="w-[100px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]"
              ></Select>
            </div>
            <div className="flex gap-2">
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: <div className="">Гүйлгээний утга</div>,
                    key: "guilgeeniiUtga",
                    dataIndex: "guilgeeniiUtga",
                    width: "150px",
                    align: "center",
                    // render: (guilgeeniiUtga) => {
                    //   return <div className="">{guilgeeniiUtga}</div>;
                    // },
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
              <GuilgeeBurtgekh
                guigleeJagsaaltMutate={refresh}
                salbariinId={salbariinId}
                baiguullagiinId={baiguullagiinId}
              />
            </div>
          </div>
          <Table
            size="small"
            unshijBaina={false}
            bordered={true}
            dataSource={data?.jagsaalt}
            scroll={{ y: "calc(100vh - 15rem)", x: "calc(100vw - 30rem)" }}
            rowClassName="hover:bg-blue-100"
            columns={columns}
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
export default GuilgeeBurtgekh;
