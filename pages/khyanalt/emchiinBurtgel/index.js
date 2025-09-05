import { MoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Popover, Select } from "antd";
import Admin from "components/Admin";
import Table from "components/ant/AntdTable";
import EmchBurtgehZasahModal from "components/modalBody/emchiinBurtgel/emchBurtgehZasahModal";
import ErkhiinTokhirgooModal from "components/modalBody/emchiinBurtgel/erkhiinTokhirgooModal";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";

const order = { createdAt: -1 };

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

function EmchiinBurtgel() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [form] = Form.useForm();
  const { token, baiguullagiinId, salbariinId, ajiltan } = useAuth();

  const query = useMemo(
    () => ({
      emiinSanId: baiguullagiinId,
      salbaruud: { $in: salbariinId },
    }),
    [baiguullagiinId, salbariinId]
  );

  const { data, setKhuudaslalt, mutate, onSearch } = useJagsaalt(
    baiguullagiinId && "/emZuich",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  return (
    <Admin
      title="Эмчийн Бүртгэл"
      onSearch={onSearch}
      khuudasniiNer="emchiinBurtgel"
      className="grid grid-cols-12 p-0 md:p-4"
      // onSearch={(search) =>
      //   emchiinMedeelel?.data?.setKhuudaslalt((a) => ({
      //     ...a,
      //     search,
      //     khuudasniiDugaar: 1,
      //   }))
      // }
    >
      <div
        className="col-span-12 gap-2"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <div className="flex w-full justify-end p-2 pt-0">
          <EmchBurtgehZasahModal mutate={mutate} />
        </div>
        <div className="box col-span-12 p-5 px-8 pt-5 ">
          <Table
            scroll={{ y: "calc(100vh - 20rem)", x: "100vh" }}
            bordered={false}
            dataSource={data?.jagsaalt}
            pagination={{
              current: parseFloat(data?.khuudasniiDugaar),
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
            columns={[
              {
                title: (
                  <div className="flex items-center justify-center">№</div>
                ),
                key: "index",
                className: "border-r border-gray-200",
                align: "center",
                width: "3rem",
                render: (text, record, index) =>
                  (data?.khuudasniiDugaar || 0) *
                    (data?.khuudasniiKhemjee || 0) -
                  (data?.khuudasniiKhemjee || 0) +
                  index +
                  1,
              },
              {
                title: <div className="text-left font-semibold">Нэр</div>,
                dataIndex: "ner",
                align: "left",
                width: "8rem",
                ellipsis: true,
                className: "border-r border-gray-200",
              },
              {
                title: <div className="text-left font-semibold">Овог</div>,
                dataIndex: "ovog",
                width: "8rem",
                className: "border-r border-gray-200",
                align: "left",
                ellipsis: true,
              },
              {
                title: <div className="text-left font-semibold">Утас</div>,
                dataIndex: "utas",
                className: "border-r border-gray-200",
                width: "8rem",
                align: "left",
              },
              {
                title: <div className="text-left font-semibold">Мэйл</div>,
                dataIndex: "mail",
                align: "left",
                className: "border-r border-gray-200",
                width: "8rem",
                ellipsis: true,
              },
              {
                title: <div className="text-left font-semibold">Регистр</div>,
                dataIndex: "register",
                align: "left",
                className: "border-r border-gray-200",
                width: "8rem",
              },
              {
                title: <div className="text-left font-semibold">Хаяг</div>,
                dataIndex: "khayag",
                align: "left",
                className: "border-r border-gray-200",
                width: "8rem",
                ellisis: true,
              },
              {
                title: (
                  <div className="text-left font-semibold">Албан тушаал</div>
                ),
                dataIndex: "albanTushaal",
                align: "left",
                width: "8rem",
                className: "border-r border-gray-200",
                ellipsis: true,
              },
              {
                title: () =>
                  ajiltan?.AdminEsekh && (
                    <div className="text-center font-semibold">
                      <SettingOutlined />
                    </div>
                  ),
                key: "_id",
                dataIndex: "extra",
                width: "4rem",
                // render(v) {
                //   return (
                //     <Popover
                //       content={<ErkhiinTokhirgooModal />}
                //       title=''
                //       trigger='click'
                //       open={open}
                //       onOpenChange={handleOpenChange}>
                //       <MoreOutlined />
                //     </Popover>
                //   );
                // },
                render: (_e, data) =>
                  ajiltan?.AdminEsekh && (
                    <Popover
                      trigger={"hover"}
                      placement="bottom"
                      content={
                        <div className="flex w-20 flex-col gap-2 space-y-2">
                          <ErkhiinTokhirgooModal
                            mutate={mutate}
                            data={_.cloneDeep(data)}
                            token={token}
                          />
                          <EmchBurtgehZasahModal
                            data={_.cloneDeep(data)}
                            mutate={mutate}
                          />
                        </div>
                      }
                    >
                      <MoreOutlined className="cursor-pointer" />
                    </Popover>
                  ),
              },
            ]}
            // pagination={{
            //   current: data?.data?.khuudasniiDugaar,
            //   pageSize: data?.data?.khuudasniiKhemjee,
            //   total: data?.data?.niitMur,
            //   showSizeChanger: true,
            //   onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
            //     data.setKhuudaslalt((kh) => ({
            //       ...kh,
            //       khuudasniiDugaar,
            //       khuudasniiKhemjee,
            //     })),
            // }} />
          />
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default EmchiinBurtgel;
