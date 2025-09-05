import { Button, Input, Select } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { InputNumber } from "../antdInput";
import moment from "moment";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import uilchilgee from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import KhariltsagchNemekhModal from "../khariltsagch/khariltsagchNemekhModal";
const order = { ognoo: -1, createdAt: -1 };
const searchKeys = ["ner", "utas", "mail", "register"];
function PosKhariltsagchModal({
  khariltsagchModal,
  setKhariltsagchModal,
  setKhariltsagchiinKhunglultUramshuulal,
  khariltsagchiinKhunglultUramshuulal,
  baiguullagiinId,
  baiguullaga,
  bonusAshiglakhEsekh,
  token,
}) {
  const [khariltsagch, setKhariltsagch] = useState();
  const [ashiglakhOnoo, setAshiglakhOnoo] = useState();

  const KhariltsagchQuery = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  const {
    data: KhariltsagchData,
    setKhuudaslalt,
    onSearch,
    mutate,
  } = posUseJagsaalt(
    "/khariltsagch",
    KhariltsagchQuery,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  useEffect(() => {
    if (!khariltsagchiinKhunglultUramshuulal) {
      setKhariltsagch();
      mutate();
      setAshiglakhOnoo();
    }
  }, [khariltsagchiinKhunglultUramshuulal]);

  function khariltsagchOruulya() {
    if (!!khariltsagch?._id) {
      var uramshuulalKhungulult = {
        ner: khariltsagch?.ner,
        id: khariltsagch?._id,
        bonus: {
          ashiglasan: Number(ashiglakhOnoo || 0),
          umnukh: Number(khariltsagch?.onoo || 0),
          nemegdsen: 0,
        },
        khunglult: {
          khunglultiinTurul: khariltsagch?.khunglukhTurul,
          dun: khariltsagch?.khunglukhDun,
          khuvi: khariltsagch?.khunglukhKhuvi,
        },
      };
      setKhariltsagchiinKhunglultUramshuulal(uramshuulalKhungulult);
    } else {
      setKhariltsagchiinKhunglultUramshuulal();
      setAshiglakhOnoo();
    }
  }

  return (
    <>
      <Modal
        width={"538px"}
        okText={false}
        footer={
          <div className="flex w-full justify-between">
            <Button
              onClick={() => setKhariltsagchModal(false)}
              style={{ width: "120px", height: "36px" }}
              type="default">
              Хаах
            </Button>
            {khariltsagch?.khunglukhEsekh === true ||
            baiguullaga?.tokhirgoo?.loyalty?.ashiglakhEsekh === true ? (
              <Button
                onClick={() => {
                  khariltsagchOruulya();
                  setKhariltsagchModal(false);
                }}
                style={{ width: "120px", height: "36px" }}
                type="primary">
                Хадгалах
              </Button>
            ) : null}
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[16px] font-medium ">
            Харилцагчийн урамшуулал
          </div>
        }
        open={khariltsagchModal}
        onCancel={() => setKhariltsagchModal(false)}>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-2 dark:text-gray-400">
            <div>Харилцагч сонгох:</div>
            <Select
              bordered={false}
              value={khariltsagch?._id}
              onChange={(v) => {
                setKhariltsagch(
                  KhariltsagchData?.jagsaalt?.find((a) => a._id === v)
                );
                if (!v) {
                  setKhariltsagchiinKhunglultUramshuulal();
                  setAshiglakhOnoo();
                }
              }}
              placeholder="Харилцагч хайх..."
              className="w-[200px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onSearch={(v) =>
                setKhuudaslalt((e) => ({
                  ...e,
                  khuudasniiDugaar: 1,
                  search: v,
                }))
              }
              popupClassName="z-[10000] bg-white dark:bg-gray-800 dark:text-gray-500">
              {KhariltsagchData?.jagsaalt?.map((mur) => (
                <Select.Option key={mur._id} value={mur._id} className="dark:bg-gray-800 dark:text-gray-300 hover:dark:bg-gray-900">
                  <div className="flex justify-start">
                    <div className="font-bold dark:text-teal-500">{mur.ner}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>

            <KhariltsagchNemekhModal
              mutate={mutate}
              ashiglajBaigaGazar={"khunglultModal"}
            />
          </div>

          <div className="relative mt-3 w-full rounded-xl border border-dashed border-[#4FD1C5] p-3">
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-gray-400 transition-all ${
                !khariltsagch
                  ? "opacity-100"
                  : "scale-125 opacity-0 delay-100 duration-1000"
              }`}>
              Харилцагч сонгоно уу...
            </div>
            <div
              className={`transition-all ${
                !khariltsagch
                  ? "invisible scale-125 opacity-0"
                  : " scale-100 opacity-100 delay-100 duration-500"
              }`}>
              <div className="flex gap-2 px-3 dark:text-gray-400">
                Харилцагчийн нэр:{" "}
                <div className="text-green-500">{khariltsagch?.ner}</div>
              </div>
              <div className="flex gap-2 px-3 dark:text-gray-400">
                Харилцагчийн утас:{" "}
                <div className="text-green-500">{khariltsagch?.utas}</div>
              </div>
              <div
                className={`dark:text-gray-400 relative mt-3 flex gap-2 border-t border-dashed border-[#4FD1C5] px-3 pt-3`}>
                <div className="dark:text-black absolute right-0 top-0 -translate-y-1/2 select-none rounded-md border border-dashed border-[#4FD1C5] bg-white px-2">
                  Хөнгөлөлт
                </div>
                Хөнгөлөлттэй эсэх:{" "}
                <div
                  className={`${
                    khariltsagch?.khunglukhEsekh === true
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                  {khariltsagch?.khunglukhEsekh === true ? "Тийм" : "Үгүй"}
                </div>
              </div>
              {khariltsagch?.khunglukhTurul === "Хувь" ? (
                <div className="flex gap-2 px-3">
                  Хөнгөлөх хувь:{" "}
                  <div
                    className={`${
                      khariltsagch?.khunglukhEsekh === true
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}>
                    {khariltsagch?.khunglukhEsekh === true
                      ? khariltsagch?.khunglukhKhuvi
                      : 0}
                    %
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 px-3 dark:text-gray-400">
                  Хөнгөлөх дүн:{" "}
                  <div
                    className={`${
                      khariltsagch?.khunglukhEsekh === true
                        ? "text-green-500"
                        : "text-gray-400"
                        
                    }`}>
                    {khariltsagch?.khunglukhEsekh === true
                      ? khariltsagch?.khunglukhDun
                      : 0}
                  </div>
                </div>
              )}

              {bonusAshiglakhEsekh?.ashiglakh === true ? (
                <div className="relative mt-3 border-t border-dashed border-[#4FD1C5] px-3 pt-3">
                  <div className="absolute right-0 top-0 -translate-y-1/2 select-none rounded-md border border-dashed border-[#4FD1C5] bg-white px-2">
                    Бонус
                  </div>
                  <div className="flex gap-2 dark:text-gray-400">
                    Цуглуулсан урамшуулалын оноо:{" "}
                    <div
                      className={
                        khariltsagch?.onoo > 0
                          ? "text-green-500"
                          : "text-gray-400"
                      }>
                      {formatNumber(khariltsagch?.onoo || 0, 2)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1 dark:text-gray-400">
                      Ашиглах урамшуулалын оноо{" "}
                      <div className="text-gray-400">/заавал биш/</div>:{" "}
                    </div>
                    <div className="flex w-full justify-center">
                      <InputNumber
                        value={ashiglakhOnoo}
                        disabled={
                          khariltsagch?.onoo === 0 || !khariltsagch?.onoo
                        }
                        onChange={(v) => setAshiglakhOnoo(v)}
                        max={khariltsagch?.onoo || 0}
                        style={{
                          width: "220px",
                          borderColor: "#4FD1C5",
                          borderRadius: "25px",
                          borderWidth: 1,
                        }}
                        placeholder="Ашиглах урамшуулалын оноо"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default PosKhariltsagchModal;
