import React, { useEffect, useMemo, useState } from "react";
import { Button, Select } from "antd";
import _ from "lodash";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";

import formatNumber from "tools/function/formatNumber";
import { InputNumber } from "components/ant/AntdInput";
import { Modal } from "components/ant/AntdModal";
import Table from "components/ant/AntdTable";
import { DatePicker } from "components/ant/AntdDatePicker";
import { Input } from "../antdInput";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { Popover } from "components/ant/AntdPopover";

const searchKeys = ["buleg", "code", "ner"];
const searchKeysKhariltsagch = ["ner", "utas", "mail", "register"];

function GuilgeeBurtgekh({
  salbariinId,
  baiguullagiinId,
  guigleeJagsaaltMutate,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [burtgesenGuilgee, setBurtgesenGuilgee] = useState([
    { bagts: "1" },
    { bagts: "1" },
  ]);
  const [khariltsagchId, setKhariltsagchId] = useState();
  const [loading, setLoading] = useState(false);

  const [ognoo, setOgnoo] = useState(moment());
  const [suuldUussenBagtsiinDugaar, setSuuldUussenBagtsiinDugaar] = useState(1);
  const [niitDebet, setNiitDebet] = useState(0);
  const [niitKredit, setNiitKredit] = useState(0);

  const { ajiltan, token } = useAuth();

  function handleCancel() {
    setIsModalOpen(false);
    setBurtgesenGuilgee([{}, {}]);
    setOgnoo(moment());
  }

  function onFinish() {
    setLoading(true);
    const davhardaaguiBagtsiinDugaar = new Set();
    let tailbarHoosonBaina = false;

    burtgesenGuilgee.forEach((item) => {
      if (item.bagts !== undefined) {
        davhardaaguiBagtsiinDugaar.add(item.bagts);
      }

      if (item.tailbar === undefined) {
        tailbarHoosonBaina = true;
      }
    });

    const davhardaaguiBagtsiinDugaarToo = davhardaaguiBagtsiinDugaar.size;

    if (tailbarHoosonBaina) {
      AnkhaaruulgaAlert("Тайлбар хоосон байна.");
    } else {
      if (burtgesenGuilgee.length > 0) {
        var yavuulakhData = {
          baiguullagiinId,
          salbariinId,
          ognoo: moment(ognoo).format("YYYY-MM-DD"),
          bagts: davhardaaguiBagtsiinDugaarToo,
          dun: burtgesenGuilgee.reduce((a, b) => a + (+b.debitDun || 0), 0),
          dunTugrug: burtgesenGuilgee.reduce(
            (a, b) => a + (+b.debitDun || 0),
            0
          ),
          khariltsagchiinId: khariltsagchId,
          khariltsagchiinNer: khariltsagchData?.jagsaalt.find(
            (e) => e._id === khariltsagchId
          )?.ner,
          zadargaa: burtgesenGuilgee,
          burtgesenAjiltan: ajiltan._id,
          burtgesenAjiltaniiNer: ajiltan.ner,
        };

        posUilchilgee(token)
          .post("/jurnaliinGuilgeeKhadgalya", yavuulakhData)
          .then((khariu) => {
            if (khariu.data === "Amjilttai") {
              guigleeJagsaaltMutate();
              handleCancel();
              AmjilttaiAlert("Амжилттай");
              setLoading(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setLoading(false);
          });
      } else {
        setLoading(false);
        AnkhaaruulgaAlert("Данс хоосон байна.");
      }
    }
  }

  function columnUstgakh(index) {
    setBurtgesenGuilgee((prevData) => prevData.filter((_, i) => i !== index));
    bagtsTsegtslekh();
  }

  function functionColumnNemekh() {
    setBurtgesenGuilgee((prev) => {
      return [
        ...prev,
        { bagts: suuldUussenBagtsiinDugaar.toString() },
        { bagts: suuldUussenBagtsiinDugaar.toString() },
      ];
    });
  }

  const KhariltsagchQuery = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId, isModalOpen]
  );

  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullagiinId,
    };
  }, [salbariinId, baiguullagiinId, isModalOpen]);

  const {
    data: jurnalDansData,
    refresh,
    setKhuudaslalt,
  } = posUseJagsaalt(
    isModalOpen && "/jurnalDans",
    query,
    undefined,
    undefined,
    searchKeys
  );

  function bagtsTsegtslekh() {
    setBurtgesenGuilgee((prev) => {
      let result = [...prev].sort((a, b) => {
        const bagtsA = parseInt(a.bagts);
        const bagtsB = parseInt(b.bagts);

        if (bagtsA < bagtsB) {
          return -1;
        }
        if (bagtsA > bagtsB) {
          return 1;
        }
        return 0;
      });

      // let undsen = 1;
      // for (let i = 0; i < result.length; i++) {
      //   if (result[i].bagts !== undefined) {
      //     result[i].bagts = undsen.toString();
      //     if (result[i + 1] && result[i].bagts !== result[i + 1].bagts) {
      //       undsen++;
      //     }
      //   }
      // }

      return result;
    });
  }

  function hadgalakhDataruuTalbarNemii(v, talbar, index) {
    if (talbar === "dansniiDugaar") {
      setBurtgesenGuilgee((prev) => {
        const updatedData = prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              valyut: jurnalDansData?.jagsaalt.find((e) => e.code === v)
                ?.valyut,
              dansniiNer: jurnalDansData?.jagsaalt.find((e) => e.code === v)
                ?.ner,
              uldegdel:
                jurnalDansData?.jagsaalt.find((e) => e.code === v)?.uldegdel ||
                0,
              khansh: 1,
              dansniiShinj: jurnalDansData?.jagsaalt.find((e) => e.code === v)
                ?.shinjChanar,
              [talbar]: v,
            };
          }
          return item;
        });
        return updatedData;
      });
    } else if (talbar === "debitDun") {
      setBurtgesenGuilgee((prev) => {
        const updatedData = prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              debitDunTugrug: +v,
              [talbar]: +v,
            };
          }
          return item;
        });
        return updatedData;
      });
    } else if (talbar === "kreditDun") {
      setBurtgesenGuilgee((prev) => {
        const updatedData = prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              kreditDunTugrug: +v,
              [talbar]: +v,
            };
          }
          return item;
        });
        return updatedData;
      });
    } else if (talbar === "bagts") {
      // if (suuldUussenBagtsiinDugaar < +v) {
      //   // setSuuldUussenBagtsiinDugaar((prev) => prev + 1);
      // }
      setSuuldUussenBagtsiinDugaar(
        Math.max(...burtgesenGuilgee.map((obj) => (+obj.bagts || 0) + 1))
      );
      setBurtgesenGuilgee((prev) => {
        const updatedData = prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [talbar]: v,
            };
          }
          return item;
        });
        return updatedData;
      });
      bagtsTsegtslekh();
    } else {
      setBurtgesenGuilgee((prev) => {
        const updatedData = prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [talbar]: v,
            };
          }
          return item;
        });
        return updatedData;
      });
    }
  }

  const {
    data: khariltsagchData,
    setKhuudaslalt: setKhariltsagchKhuudaslalt,
    onSearch: khariltsagchOnSearch,
    mutate,
  } = posUseJagsaalt(
    "/khariltsagch",
    KhariltsagchQuery,
    undefined,
    undefined,
    searchKeysKhariltsagch,
    undefined,
    undefined
  );

  useEffect(() => {
    if (!!burtgesenGuilgee.length > 0) {
      document.querySelector(`#bagts-${+burtgesenGuilgee.length - 1}`)?.focus();
    }
  }, [burtgesenGuilgee.length]);

  useEffect(() => {
    setNiitDebet(() => {
      return burtgesenGuilgee.reduce((a, b) => a + (b?.debitDun || 0), 0);
    });
    setNiitKredit(() => {
      return burtgesenGuilgee.reduce((a, b) => a + (b?.kreditDun || 0), 0);
    });
  }, [burtgesenGuilgee]);

  const handleKeyPress = (odooBaigaInput, e, index) => {
    if (e.key === "Enter") {
      switch (odooBaigaInput) {
        case "bagts":
          document.querySelector(`#dansniiDugaar-${index}`).focus();
          break;
        case "dansniiDugaar":
          document.querySelector(`#debitDun-${index}`).focus();
          break;
        case "debitDun":
          document.querySelector(`#kreditDun-${index}`).focus();
          break;
        case "kreditDun":
          document.querySelector(`#tailbar-${index}`).focus();
          break;
        case "tailbar":
          functionColumnNemekh();
          break;
        default:
          break;
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        title: <div className="">№</div>,
        dataIndex: "desDugaar",
        key: "desDugaar",
        width: "40px",
        align: "center",
        render: (v, a, index) => {
          return <div className="">{index + 1}</div>;
        },
      },
      {
        title: <div className="">Багц</div>,
        key: "bagts",
        dataIndex: "bagts",
        width: "80px",
        align: "center",
        render: (bagts, e, i) => {
          return (
            <div className="dark:text-gray-200 dark:bg-gray-800">
              <Select
                onSearch={(v) =>
                  setKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: v,
                  }))
                }
                showSearch
                value={bagts}
                placeholder="Багц"
                onChange={(v) => hadgalakhDataruuTalbarNemii(v, "bagts", i)}
                onKeyDown={(e) => handleKeyPress("bagts", e, i)}
                id={`bagts-${i}`}
                bordered={false}
                className="w-full overflow-hidden !bg-[rgba(79,209,197)/2]">
                {Array.from({ length: suuldUussenBagtsiinDugaar + 1 }).map(
                  (_, index) => (
                    <Select.Option key={index + 1}>
                      <div className={`flex justify-start dark:text-gray-300`}>
                        <div className="font-bold dark:text-gray-300">
                          {index + 1}
                        </div>
                      </div>
                    </Select.Option>
                  )
                )}
              </Select>
            </div>
          );
        },
      },
      {
        title: <div className="">Данс</div>,
        key: "dansniiDugaar",
        dataIndex: "dansniiDugaar",
        width: "160px",
        align: "center",
        render: (dansniiDugaar, d, i) => {
          return (
            <div className="">
              <Select
                showSearch
                value={dansniiDugaar}
                onSearch={(v) =>
                  setKhuudaslalt((e) => ({
                    ...e,
                    khuudasniiDugaar: 1,
                    search: v,
                  }))
                }
                placeholder="Данс"
                filterOption={false}
                onChange={(v) =>
                  hadgalakhDataruuTalbarNemii(v, "dansniiDugaar", i)
                }
                onKeyDown={(e) => handleKeyPress("dansniiDugaar", e, i)}
                id={`dansniiDugaar-${i}`}
                bordered={false}
                optionFilterProp="children"
                optionLabelProp="label"
                className="w-full overflow-hidden !bg-[rgba(79,209,197)/2]">
                {jurnalDansData?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur?.code} value={mur?.code}>
                      <div className={`flex justify-center dark:text-gray-300`}>
                        <div className="font-bold dark:text-gray-300 dark:bg-gray-800">
                          {mur?.code} - {mur?.ner}
                        </div>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          );
        },
      },
      {
        title: <div className="">Дансны нэр</div>,
        key: "dansniiNer",
        dataIndex: "dansniiNer",
        width: "160px",
        align: "center",
        render: (dansniiNer, d, i) => {
          return <div>{dansniiNer}</div>;
        },
      },
      {
        title: <div className="">Үлдэгдэл</div>,
        key: "uldegdel",
        dataIndex: "uldegdel",
        width: "100px",
        align: "center",
        render: (uldegdel, v, i) => {
          return <div className="">{formatNumber(uldegdel, 2)}₮</div>;
        },
      },
      {
        title: <div className="">Валют</div>,
        key: "valyut",
        dataIndex: "valyut",
        width: "100px",
        align: "center",
        render: (valyut, v, i) => {
          return <div className="">{valyut}</div>;
        },
      },
      {
        title: <div className="">Дебет</div>,
        key: "debitDun",
        dataIndex: "debitDun",
        width: "150px",
        align: "center",
        render: (debitDun, v, i) => {
          return (
            <div className="">
              {
                <InputNumber
                  disabled={!!v.kreditDun}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  value={debitDun}
                  placeholder="Дебет"
                  id={`debitDun-${i}`}
                  onKeyDown={(e) => handleKeyPress("debitDun", e, i)}
                  style={{ background: "rgba(79,209,197,0.01)" }}
                  onChange={(v) =>
                    hadgalakhDataruuTalbarNemii(v, "debitDun", i)
                  }
                  className={"!rounded-none !border-[0px]"}
                />
              }
            </div>
          );
        },
      },
      {
        title: <div className="">Кредит</div>,
        key: "kreditDun",
        dataIndex: "kreditDun",
        align: "center",
        width: "150px",
        render: (kreditDun, v, i) => {
          return (
            <div className="">
              {
                <InputNumber
                  disabled={!!v.debitDun}
                  value={kreditDun}
                  placeholder="Кредит"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onKeyDown={(e) => handleKeyPress("kreditDun", e, i)}
                  style={{ background: "rgba(79,209,197,0.01)" }}
                  onChange={(v) =>
                    hadgalakhDataruuTalbarNemii(v, "kreditDun", i)
                  }
                  className={"!rounded-none !border-[0px]"}
                  id={`kreditDun-${i}`}
                />
              }
            </div>
          );
        },
      },
      {
        title: <div className="">Ханш</div>,
        key: "khansh",
        dataIndex: "khansh",
        align: "center",
        width: "150px",
        render: (khansh, v, i) => {
          return <div className="">{formatNumber(khansh, 2)}₮</div>;
        },
      },
      {
        title: <div className="">Тайлбар</div>,
        key: "tailbar",
        dataIndex: "tailbar",
        width: "180px",
        align: "center",
        render: (tailbar, v, i) => {
          return (
            <div className="">
              {
                <Input
                  value={tailbar}
                  placeholder="Тайлбар"
                  onKeyDown={(e) => handleKeyPress("tailbar", e, i)}
                  style={{ background: "rgba(79,209,197,0.01)" }}
                  onChange={(v) =>
                    hadgalakhDataruuTalbarNemii(v.target.value, "tailbar", i)
                  }
                  className={"!rounded-none !border-[0px] "}
                  id={`tailbar-${i}`}
                />
              }
            </div>
          );
        },
      },
      {
        title: "",
        key: "extra",
        dataIndex: "extra",
        width: "30px",
        align: "center",
        render: (extra, v, i) => {
          return (
            <div className="">
              <a onClick={() => columnUstgakh(i)}>
                <DeleteOutlined
                  style={{ fontSize: "18px", cursor: "pointer", color: "red" }}
                />
              </a>
            </div>
          );
        },
      },
    ],
    [jurnalDansData, isModalOpen, burtgesenGuilgee, khariltsagchData]
  );

  return (
    <>
      <Button
        type={"primary"}
        className={"!text-[12px]"}
        onClick={() => setIsModalOpen(true)}>
        Нэмэх
      </Button>
      <Modal
        destroyOnClose={true}
        width={"1738px"}
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={() => !loading && onFinish()}
              style={{ width: "186px", height: "36px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Гүйлгээ бүртгэл
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        {" "}
        <div className="flex h-[600px] flex-col gap-2">
          <div className="flex items-center gap-2">
            <DatePicker
              value={ognoo}
              onChange={(e) => setOgnoo(e)}
              placeholder={"Огноо"}
            />
            <Select
              value={khariltsagchId}
              bordered={false}
              placeholder="Харилцагч"
              onChange={(e) => setKhariltsagchId(e)}
              showSearch
              filterOption={(o) => o}
              onSearch={khariltsagchOnSearch}
              className="w-[100px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white xl:w-[220px]">
              {khariltsagchData?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?._id}>
                    <div className={`flex justify-start dark:text-gray-200 dark:bg-gray-800`}>
                      <div className="font-bold">{mur?.ner}</div>
                      {"---"}
                      {mur?.register}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
          <Table
            size="small"
            unshijBaina={false}
            bordered={true}
            dataSource={burtgesenGuilgee}
            pagination={false}
            scroll={{ y: "calc(49vh)" }}
            rowClassName="hover:bg-blue-100"
            columns={columns}
          />
          <div className="flex w-full justify-end gap-5 dark:text-gray-200">
            <div>Нийт дебет: {formatNumber(niitDebet, 2)}₮ </div>
            <div>Нийт кредит: {formatNumber(niitKredit, 2)}₮ </div>
          </div>

          <div
            onClick={functionColumnNemekh}
            className="flex w-full cursor-pointer items-center justify-center border-2 border-dotted transition duration-150 ease-in-out dark:text-gray-200 hover:border-[rgb(79,209,197)]">
            Нэмэх
          </div>
        </div>
      </Modal>
    </>
  );
}
export default GuilgeeBurtgekh;
