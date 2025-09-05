import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useState } from "react";
import { Button } from "antd";
import Table from "components/ant/AntdTable";
import UramshuulalBurtgel from "components/modalBody/uramshuulal/UramshuulalBurtgel";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import { Popover } from "components/ant/AntdPopover";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UstgahdaaItgelteibainaModal from "components/modalBody/ustgahdaaItgelteibainaModal";
import useOrder from "tools/function/useOrder";
import UramshuulalModal from "components/modalBody/posSystem/uramshuulal";
import Khymdral from "components/modalBody/uramshuulal/Khymdral";

const searchKeys = [
  "ner",
  "uramshuulaliinBeleg.barCode",
  "uramshuulaliinBeleg.baraaniiDotoodCode",
  "uramshuulaliinBeleg.baraaniiNer",
  "uramshuulaliinNukhtsul.barCode",
  "uramshuulaliinNukhtsul.baraaniiDotoodCode",
  "uramshuulaliinNukhtsul.baraaniiNer",
];

function Uramshuulal() {
  const [loading, setLoading] = useState(false);
  const { token, baiguullagiinId, salbariinId } = useAuth();
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [ustgahUramshuulaliinId, setUstgahUramshuulaliinId] = useState();
  const [uramshuulal, setUramshuulal] = useState([]);
  const [sungakhUramshuulal, setSungakhUramshuulal] = useState();

  const query = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    return query;
  }, [baiguullagiinId, salbariinId]);

  const { data, setKhuudaslalt, mutate, onSearch } = posUseJagsaalt(
    "/uramshuulal",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined,
    true
  );
  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: <div className="flex items-center justify-center">№</div>,
        key: "index",
        align: "center",
        className: "border-r border-gray-200",
        width: "3rem",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Нэршил",
        key: "",
        dataIndex: "ner",
        width: "10rem",
        maxWidth: "350px",
        className: "border-r border-gray-200",
        ellipsis: true,
        align: "center",
        render(v, data) {
          return <div className="truncate text-center">{v}</div>;
        },
      },

      {
        title: "Нөхцөлт бараа",
        key: "",
        width: "300px",
        className:"border-r border-gray",
        dataIndex: "uramshuulaliinNukhtsul",
        align: "center",
        render(v, data) {
          return (
            <div>
              {data.uramshuulaliinNukhtsul.map((e) => {
                return (
                  <Popover
                    content={
                      <div className="text-left dark:text-white">
                        <div>{e.baraaniiNer}</div>
                      </div>
                    }
                  >
                    <div>
                      <div className="truncate  text-left">{e.baraaniiNer}</div>
                    </div>
                  </Popover>
                );
              })}
            </div>
          );
        },
      },
      {
        title: "Урамшуулалт бараа",
        key: "",
        className: "border-r border-gray-200",
        maxWidth: "350px",
        ellipsis: true,
        width: "300px",
        dataIndex: "uramshuulaliinBeleg",
        align: "center",
        render(v, data) {
          return (
            <div>
              {data.uramshuulaliinBeleg.map((e) => {
                return (
                  <Popover
                    content={
                      <div className="text-left dark:text-white">
                        <div>{e.baraaniiNer}</div>
                      </div>
                    }
                  >
                    <div>
                      <div className="truncate  text-left">{e.baraaniiNer}</div>
                    </div>
                  </Popover>
                );
              })}
            </div>
          );
        },
      },
      {
        title: "Төрөл",
        key: "",
        dataIndex: "turul",
        width: "250px",
        align: "center",
        className: "border-r border-gray-200",
        render(v, data) {
          const duusakhOgnoo = moment(data.duusakhOgnoo);
          const isPast = duusakhOgnoo.isBefore(moment(), "minutes");
          const ekhlekhOgnoo = moment(data.ekhlekhOgnoo);
          const isFuture = ekhlekhOgnoo.isAfter(moment(), "minutes");

          return (
            <div className="flex w-full justify-center">
              <div
                className={`w-[100px] rounded-full font-semibold ${
                  isFuture
                    ? "bg-blue-500"
                    : isPast
                    ? "bg-yellow-500"
                    : " bg-green-500"
                }`}
              >
                {isFuture
                  ? "Эхлээгүй"
                  : isPast
                  ? "Дууссан"
                  : data?.sungasanAjiltan
                  ? "Сунгагдсан"
                  : "Идэвхтэй"}
              </div>
            </div>
          );
        },
      },
      {
        title: "Идэвхтэй хугацаа",
        showSorterTooltip: false,
        dataIndex: "duusakhOgnoo",
        className: "border-r border-gray-200",
        width: "150px",
        align: "center",
        sorter: (a, b) => 0,
        render(v, data) {
          return (
            <div className="text-xs font-medium">
              <div className="text-green-500">
                {moment(data.ekhlekhOgnoo).format("YYYY-MM-DD")} --{" "}
                {moment(data.duusakhOgnoo).format("YYYY-MM-DD")} {"  "}
              </div>
              <div className="text-blue-500">
                {moment(
                  data.ekhlekhTsag ? data.ekhlekhTsag : data.ekhlekhOgnoo
                ).format("HH:mm")}{" "}
                --{" "}
                {moment(
                  data.duusakhTsag ? data.duusakhTsag : data.duusakhOgnoo
                ).format("HH:mm")}
              </div>
            </div>
          );
        },
      },
      {
        title: "Бүртгэсэн ажилтан",
        key: "",
        dataIndex: "burtegsenAjiltan",
        width: "8rem",
        align: "center",
        render(v, data) {
          return <div className="pl-3 text-left">{v?.ner}</div>;
        },
      },
      {
        title: "",
        align: "center",
        width: "80px",
        render: (_text, record) => {
          const duusakhOgnoo = moment(record.duusakhOgnoo);
          const isPast = duusakhOgnoo.isBefore(moment(), "minutes");
          return (
            <div className="flex items-center justify-center gap-2">
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex w-24 flex-col space-y-2">
                    <a
                      onClick={() => {
                        setUstgahUramshuulaliinId(record?._id);
                      }}
                      className="ant-dropdown-link flex w-full items-center justify-between  rounded-lg p-2 hover:bg-green-100 dark:rounded-lg "
                    >
                      <DeleteOutlined
                        style={{ fontSize: "18px", color: "red" }}
                      />
                      <label className="text-[#ff0000]">Устгах</label>
                    </a>
                    <a
                      onClick={() => {
                        setUramshuulal([record]);
                      }}
                      className="ant-dropdown-link flex w-full items-center justify-between  rounded-lg p-2 hover:bg-green-100 "
                    >
                      <EyeOutlined
                        style={{ fontSize: "18px", color: "#008cff" }}
                      />
                      <label className="text-[#008cff]">Харах</label>
                    </a>
                    {isPast ? (
                      <a
                        onClick={() => {
                          setSungakhUramshuulal(record);
                        }}
                        className="ant-dropdown-link flex w-full items-center justify-between  rounded-lg p-2 hover:bg-green-100 "
                      >
                        <EditOutlined
                          style={{ fontSize: "18px", color: "#3ce452" }}
                        />
                        <label className="text-[#3ce452]">Сунгах</label>
                      </a>
                    ) : null}
                  </div>
                )}
              >
                <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            </div>
          );
        },
      },
    ];
    return jagsaalt;
  }, [data]);
  return (
    <Admin
      onSearch={(search) => onSearch(search)}
      loading={loading}
      title="Урамшуулал"
      khuudasniiNer="uramshuulal"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 flex flex-col gap-4">
        <div className="flex w-full justify-end gap-2">
          {/* <Button type="gol">Хөнгөлөлт нэмэх</Button> */}
          {/* <Button type="gol">Ваучер нэмэх</Button> */}
          {/* <Khymdral
            mutate={mutate}
            setSungakhUramshuulal={setSungakhUramshuulal}
            sungakhUramshuulal={sungakhUramshuulal}
          /> */}
          <UramshuulalBurtgel
            mutate={mutate}
            setSungakhUramshuulal={setSungakhUramshuulal}
            sungakhUramshuulal={sungakhUramshuulal}
          />
        </div>

        <Table
          scroll={{ y: "calc(100vh - 20rem)", x: "50vw" }}
          dataSource={data?.jagsaalt}
          onChange={onChangeTable}
          columns={columns}
          pagination={{
            current: data?.khuudasniiDugaar,
            pageSize: data?.khuudasniiKhemjee,
            total: data?.niitMur,
            pageSizeOptions: ["10", "50", "100", "250", "500"],
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
      <UramshuulalModal
        uramshuulal={uramshuulal}
        setUramshuulal={setUramshuulal}
      />
      <UstgahdaaItgelteibainaModal
        url={"uramshuulalUstgaya"}
        ustgahBaraaniiId={ustgahUramshuulaliinId}
        setUstgahBaraaniiId={setUstgahUramshuulaliinId}
        baraaMutate={mutate}
      />
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default Uramshuulal;
