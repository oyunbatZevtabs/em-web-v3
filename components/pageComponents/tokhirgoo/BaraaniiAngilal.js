import React, { useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Popover,
  message,
  notification,
} from "antd";
import { aldaaBarigch } from "services/uilchilgee";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import posUilchilgee from "services/posUilchilgee";
import { useAuth } from "services/auth";
import deleteMethod from "tools/function/crud/deleteMethod";
import BaraaniiAngilalExcel from "./BaraaniiAngilalExcel";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";

const order = { createdAt: -1 };

function BaraaniiAngilal({
  tokhirgooModalKhaayaa,
  setTokhirgooModal,
  setTsonkh,
  setAsuukhEsekh,
}) {
  const [angilalInputValue, setAngilalInputValue] = useState("");
  const [angilalOruulakh, setAngilalOruulakh] = useState(false);
  const { token, baiguullagiinId } = useAuth();

  const query = useMemo(() => {
    var qeury = {
      baiguullagiinId: baiguullagiinId,
    };
    return qeury;
  }, [baiguullagiinId]);

  const { jagsaalt, mutate, data, setKhuudaslalt } = posUseJagsaalt(
    "BaraaniiAngilal",
    query,
    order,
    undefined,
    undefined,
    undefined,
    undefined,
    true
  );

  const shiljikhKhuudas = useMemo(() => {
    return [
      {
        tsonkh: (
          <BaraaniiAngilalExcel
            setAsuukhEsekh={setAsuukhEsekh}
            setTsonkh={setTsonkh}
          />
        ),
      },
    ];
  }, []);

  function angilalNemehFunction() {
    const yavuulahData = {
      angilal: angilalInputValue,
      baiguullagiinId: baiguullagiinId,
    };
    if (angilalInputValue.length > 0) {
      posUilchilgee(token)
        .post("/angilalNemii", yavuulahData)
        .then(({ data, status }) => {
          if (status === 200 && data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгаллаа");
            setAngilalInputValue("");
            // setAngilalAsuukh(false)
            mutate();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else {
      AldaaAlert("Ангилал хоосон байна !");
    }
  }

  return (
    <div className="relative h-[100%]">
      <div className="box  lg:mt-5">
        <div className=" flex items-center ">
          <div
            className={`flex w-full items-center justify-between border-b border-gray-200 p-4`}
          >
            <div>
              {angilalOruulakh ? (
                <Input
                  value={angilalInputValue}
                  onChange={(e) => setAngilalInputValue(e.target.value)}
                  placeholder="Ангилал"
                  style={{
                    width: "100%",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                />
              ) : null}
            </div>
            <Dropdown
              overlay={
                <Menu className="p-2">
                  <Menu.Item
                    key="Ангилал бүртгэх"
                    className="flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200"
                    onClick={() => setAngilalOruulakh(true)}
                  >
                    <span>Ангилал бүртгэх</span>
                  </Menu.Item>
                  <Menu.Item
                    key="Ангилал excel-ээс оруулах"
                    className="flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200"
                    onClick={() => setTsonkh(shiljikhKhuudas[0])}
                  >
                    <span>Ангилал excel-ээс оруулах</span>
                  </Menu.Item>
                </Menu>
              }
              trigger="click"
              className="cursor-pointer"
            >
              <Button type="primary">Ангилал бүртгэх</Button>
            </Dropdown>
          </div>
        </div>
        <div
          style={{ maxHeight: "calc( 80vh - 20rem )" }}
          className=" overflow-auto"
        >
          {jagsaalt?.map((a) => {
            return (
              <div className="space-y-4 overflow-y-auto">
                <div className="rounded-md border bg-white shadow-md dark:border-[#4FD1C5] dark:bg-gray-800">
                  <div className=" flex items-center px-5 py-3">
                    <div className="overflow-auto border-l-2 border-[#4FD1C5] pl-4">
                      <div className="">
                        <div className="w-96 truncate">{a.angilal}</div>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Popover
                        placement="bottom"
                        trigger="hover"
                        content={() => (
                          <div className="flex w-24 flex-col space-y-2">
                            <Popconfirm
                              title={<div>Ангилал устгах уу?</div>}
                              okText={
                                <div
                                  onClick={() =>
                                    deleteMethod(
                                      "BaraaniiAngilal",
                                      token,
                                      a._id
                                    ).then(({ data }) => {
                                      if (data === "Amjilttai") {
                                        AmjilttaiAlert("Амжилттай устгалаа");
                                        mutate();
                                      }
                                    })
                                  }
                                >
                                  Тийм
                                </div>
                              }
                              cancelText="Үгүй"
                            >
                              <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                                <DeleteOutlined
                                  style={{ fontSize: "18px", color: "red" }}
                                />
                                <label>Устгах</label>
                              </a>
                            </Popconfirm>
                          </div>
                        )}
                      >
                        <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
                          <MoreOutlined style={{ fontSize: "18px" }} />
                        </a>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {data?.jagsaalt?.length > 0 && (
          <div className="mt-3 flex w-full justify-end border-t-2 py-3">
            <Pagination
              locale={{ items_per_page: "/ Хуудас" }}
              current={data?.khuudasniiDugaar}
              pageSize={data?.khuudasniiKhemjee || 0}
              total={data?.niitMur}
              showSizeChanger={true}
              onChange={(khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }))
              }
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-5 right-0">
        <Button onClick={angilalNemehFunction} type="primary">
          Хадгалах
        </Button>
      </div>
    </div>
  );
}

export default BaraaniiAngilal;
