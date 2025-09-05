import {
  DeleteOutlined,
  MoreOutlined,
  SendOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Form, Popconfirm, Popover } from "antd";
import Admin from "components/Admin";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import Table from "components/ant/AntdTable";
import { modal } from "components/ant/Modal";
import BonusDelegrengui from "components/modalBody/khariltsagch/bonusDelegrengui";
import KhariltsagchExcel from "components/modalBody/khariltsagch/khariltsagchExcel";
import KhariltsagchNemekhModal from "components/modalBody/khariltsagch/khariltsagchNemekhModal";
import MedegdelIlgeegch from "components/modalBody/khariltsagch/medegdelIlgeegch";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import useToololt from "hooks/useToololt";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee from "services/uilchilgee";
import deleteMethod from "tools/function/crud/deleteMethod";
import formatNumber from "tools/function/formatNumber";

const order = { createdAt: -1 };
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

function Khariltsagch() {
  const [open, setOpen] = useState(false);
  const medegdelRef = useRef(null);
  const { token, baiguullagiinId, baiguullaga, salbariinId } = useAuth();
  const [bonusAshiglakhEsekh, setBonusAshiglakhEsekh] = useState(false);
  const [bonus, setBonus] = useState();

  useEffect(() => {
    if (!!token) {
      uilchilgee(token)
        .post("/loyaltyErkhAvya", { baiguullagiinId: baiguullagiinId })
        .then(({ data }) => {
          setBonusAshiglakhEsekh({
            ashiglakh: data?.tokhirgoo?.loyalty?.ashiglakhEsekh,
            khuvi: data?.tokhirgoo?.loyalty?.khunglukhKhuvi,
          });
        })
        .catch((e) => console.log(e));
    }
  }, [token]);

  const [turul, setTurul] = useState("Нийт");
  const toololtQuery = useMemo(() => {
    return { baiguullagiinId: baiguullagiinId };
  }, [baiguullagiinId]);
  const { toololtGaralt, toololtMutate } = useToololt(
    token,
    "/khariltsagchToololtAvya",
    toololtQuery
  );

  const query = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    if (turul !== "Нийт") {
      query.turul = turul;
    }
    return query;
  }, [baiguullagiinId, turul]);

  const { data, jagsaalt, setKhuudaslalt, mutate, onSearch } = posUseJagsaalt(
    "/khariltsagch",
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
        width: "3rem",
        className: "border-r border-gray-200",
        render: (text, record, index) =>
          (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
          (data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      // {
      //   title: "№",
      //   key: "index",
      //   className: "text-center",
      //   align: "center",
      //   width: "3rem",
      //   fixed: "left",
      //   render: (text, record, index) => index + 1,
      // },
      {
        title: <div className="text-center font-semibold">Нэр</div>,
        dataIndex: "ner",
        align: "left",
        className: "border-r border-gray-200",
        width: "8rem",
        ellipsis: true,
      },
      {
        title: <div className="text-center font-semibold">Регистр</div>,
        dataIndex: "register",
        align: "center",
        className: "border-r border-gray-200",
        width: "8rem",
      },
      {
        title: <div className="text-center font-semibold">Утас</div>,
        dataIndex: "utas",
        width: "8rem",
        className: "border-r border-gray-200",
        align: "center",
      },
      {
        title: <div className="text-center font-semibold">Мэйл</div>,
        dataIndex: "mail",
        align: "left",
        width: "8rem",
        className: "border-r border-gray-200",
        ellipsis: true,
      },

      {
        title: <div className="text-center font-semibold">Хаяг</div>,
        dataIndex: "khayag",
        align: "left",
        className: "border-r border-gray-200",
        width: "8rem",
        ellisis: true,
      },
    ];
    if (bonusAshiglakhEsekh?.ashiglakh === true) {
      jagsaalt.push({
        title: <div className="text-center font-semibold">Бонус</div>,
        dataIndex: "onoo",
        align: "center",
        className: "border-r border-gray-200",
        width: "8rem",
        ellipsis: true,
        render: (a, mur) => (
          <div
            onClick={() => a > 0 && setBonus(mur)}
            className={
              a > 0
                ? "cursor-pointer font-medium text-green-500 underline"
                : "text-gray-400"
            }
          >
            {formatNumber(a, 2)}
          </div>
        ),
      });
    }
    var jagsaalt2 = [
      {
        title: <div className="text-center font-semibold">Хөнгөлөлт</div>,
        dataIndex: "khunglukhEsekh",
        align: "center",
        width: "8rem",
        className: "border-r border-gray-200",
        ellipsis: true,
        render: (a, b) =>
          a ? (
            <div className="font-medium text-green-500">
              {b.khunglukhTurul === "Мөнгөн дүн"
                ? `${formatNumber(b.khunglukhDun)}₮`
                : `${b.khunglukhKhuvi}%`}
            </div>
          ) : (
            <div className="text-gray-500">Хөнгөлөлтгүй</div>
          ),
      },
      {
        title: (
          <div className="text-center font-semibold">Харилцагчийн төрөл</div>
        ),
        dataIndex: "khariltsagchiinTurul",
        align: "center",
        className: "border-r border-gray-200",
        width: "8rem",
        ellipsis: true,
      },
      {
        title: <div className="text-center font-semibold">Төрөл</div>,
        dataIndex: "turul",
        align: "center",
        width: "8rem",
        className: "border-r border-gray-200",
        ellipsis: true,
      },
      {
        title: () => (
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
        render: (_e, ugugdul) => {
          return (
            <Popover
              trigger={"hover"}
              placement="bottom"
              content={
                <div className="flex w-20 flex-col gap-2 space-y-2">
                  {!ugugdul?.uglugUldegdel &&
                    !ugugdul?.avlagaUldegdel &&
                    !ugugdul.khunglukhEsekh && (
                      <Popconfirm
                        title={<div>Нийлүүлэгч устгах уу?</div>}
                        okText={
                          <div
                            onClick={() =>
                              deleteMethod(
                                "khariltsagch",
                                token,
                                ugugdul._id
                              ).then(({ data }) => {
                                if (data === "Amjilttai") {
                                  AmjilttaiAlert("Амжилттай устгалаа");
                                  mutate();
                                  toololtMutate();
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
                    )}
                  <KhariltsagchNemekhModal
                    data={_.cloneDeep(ugugdul)}
                    mutate={mutate}
                    toololtMutate={toololtMutate}
                  />
                </div>
              }
            >
              <MoreOutlined className="cursor-pointer" />
            </Popover>
          );
        },
      },
    ];
    return [...jagsaalt, ...jagsaalt2];
  }, [bonusAshiglakhEsekh, data]);

  const shuultuud = useMemo(
    () => [
      {
        key: "1",
        garchig: "Нийт",
        too: toololtGaralt?.niit,
        shuult: "Нийт",
      },
      {
        key: "2",
        garchig: "Нийлүүлэгч",
        too: toololtGaralt?.niiluulegch,
        shuult: "Нийлүүлэгч",
      },
      {
        key: "3",
        garchig: "Худалдан авагч",
        too: toololtGaralt?.hudaldanAvagch,
        shuult: "Худалдан авагч",
      },
    ],
    [toololtGaralt]
  );

  function mutateFunction() {
    toololtMutate();
    mutate();
  }

  const medegdelIlgeekh = () => {
    const footer = [
      <Button onClick={() => medegdelRef.current.khaaya()}>{"Хаах"}</Button>,
      (baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhKey ||
        baiguullaga?.tokhirgoo?.email?.mailNevtrekhNer) && (
        <Button type="primary" onClick={() => medegdelRef.current.khadgalya()}>
          {"Илгээх"}
        </Button>
      ),
    ];
    modal({
      title: <div className="dark:text-gray-300">Мэдэгдэл илгээх</div>,
      icon: <SendOutlined />,
      content: (
        <MedegdelIlgeegch
          ref={medegdelRef}
          data={jagsaalt}
          token={token}
          salbariinId={salbariinId}
          baiguullagiinId={baiguullaga?._id}
          baiguullaga={baiguullaga}
        />
      ),
      footer,
    });
  };

  return (
    <Admin
      title="Харилцагч"
      onSearch={onSearch}
      khuudasniiNer="khariltsagch"
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
        <div className="mb-5 grid h-fit w-full grid-cols-3 place-items-center gap-6">
          {shuultuud.map((item) => {
            return (
              <div
                onClick={() => setTurul(item.shuult)}
                key={item.key}
                className={`${
                  turul === item.shuult && "bg-green-500 bg-opacity-5 "
                } col-span-1 flex w-full cursor-pointer flex-col items-start justify-center rounded-lg border border-[#4FD1C5] p-4 px-6 shadow-lg`}
              >
                <div
                  className={`${
                    turul === item.shuult ? "font-[500]" : "font-[300]"
                  }`}
                >
                  {item.garchig}
                </div>
                <div
                  className={`flex w-full items-center justify-end gap-2  ${
                    turul === item.shuult ? "font-[700]" : "font-[400]"
                  }`}
                >
                  <div className="font-thin text-gray-400">Тоо:</div>
                  {item.too}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex w-full justify-end gap-3 p-2 pt-0">
          <Button onClick={medegdelIlgeekh} type="primary">
            <SendOutlined /> Мэдэгдэл илгээх{" "}
          </Button>
          <KhariltsagchExcel
            mutate={mutateFunction}
            toololtMutate={toololtMutate}
          />
          <KhariltsagchNemekhModal
            mutate={mutate}
            toololtMutate={toololtMutate}
          />
          <BonusDelegrengui
            baiguullagiinId={baiguullagiinId}
            salbariinId={salbariinId}
            token={token}
            bonus={bonus}
            setBonus={setBonus}
          />
        </div>

        <div className="box col-span-12 p-5 px-8 pt-3 ">
          <Table
            scroll={{ y: "calc(100vh - 25rem)", x: "100vh" }}
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
            columns={columns}
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

export default Khariltsagch;
