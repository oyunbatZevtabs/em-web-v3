import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AsuulgaModal from "../asuulgaModal";
import axios from "axios";
import { isString } from "lodash";
import posUilchilgee, { aldaaBarigch, posUrl } from "services/posUilchilgee";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import { useAuth } from "services/auth";
import useGuilgeeniiTuukh from "hooks/guilgeeniiTuukh";
import EBarimt from "pages/khyanalt/eBarimt";

function Bill({
  setBillModal,
  billModal,
  shuudTulukh,
  setShuudTulukh,
  setGuilgeeniiId,
  guilgeeniiId,
  baiguullaga,
  token,
  guilgeeniiDugaar,
  ajiltan,
  baiguullagiinId,
  salbariinId,
  turul,
  setTurul,
}) {
  function handleCancel() {
    setBarimt();
    setBillModal(false);
  }

  //   const { baiguullaga, ajiltan } = useAuth();
  const [barimt, setBarimt] = useState();
  const [belneer, setBelneer] = useState(false);
  const [loading, setLoading] = useState(false);

  const barimtRef = useRef(null);
  const billRef = useRef(null);

  const query = useMemo(() => {
    let result;
    if (!!guilgeeniiId && billModal) {
      result = { _id: { $in: guilgeeniiId } };
    }

    return result;
  }, [guilgeeniiId]);

  const { guilgeeniiTuukhGaralt } = useGuilgeeniiTuukh(token, undefined, query);

  useEffect(() => {
    const hasValidItems = turul.some(
      (item) => item.turul !== "belen" && item.une !== ""
    );

    setBelneer(hasValidItems);
  }, [turul]);

  // const billRefHandlePrint = useReactToPrint({
  //   content: () => billRef.current,
  //   onAfterPrint: () => {
  //     setBillModal(false);
  //     setShuudTulukh(false);
  //   },
  // });

  const barimtRefHandlePrint = useReactToPrint({
    content: () => barimtRef.current,
    onAfterPrint: () => {
      // eco tsainii gazar id
      // baiguullaga?._id === "65fce34b68de8ed1f063a6cc"
      //   ? billRefHandlePrint()
      //   : setBillModal(false);
      setBillModal(false);
      setShuudTulukh(false);
    },
  });

  function onFinish() {
    setLoading(true);
    barimtRefHandlePrint();
    setTurul([
      { turul: "belen", une: "" },
      { turul: "cart", une: "" },
      {
        turul: "khariltsakh",
        une: "",
      },
      {
        turul: "zeel",
        une: "",
      },
      {
        turul: "qpay",
        une: "",
      },
    ]);
    setLoading(false);
  }

  useEffect(() => {
    if (
      !!billModal &&
      !!barimtRef.current &&
      !!billRef.current &&
      !!guilgeeniiTuukhGaralt?.jagsaalt
    ) {
      if (shuudTulukh) {
        if (loading === false) {
          onFinish();
        }
      }
    }
  }, [
    billModal,
    shuudTulukh,
    barimtRef.current,
    billRef.current,
    guilgeeniiTuukhGaralt,
  ]);

  return (
    <>
      <Modal
        destroyOnClose={true}
        width={"538px"}
        okText="Бүртгэх"
        footer={
          <Button onClick={() => onFinish()} type="primary">
            Хэвлэх
          </Button>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Баримт</div>
        }
        open={billModal}
        onCancel={handleCancel}
      >
        <div className=" text-xl font-semibold">Баримт хэвлэнэ үү!</div>
        <div className="hidden">
          <div
            className="flex w-full min-w-[58mm] flex-col font-mono  text-[12px] text-black"
            ref={barimtRef}
          >
            <div className="flex justify-between">
              <div>Бaйгууллагын нэр:</div>
              <div className="text-base font-bold">{baiguullaga?.ner}</div>
            </div>
            <div className="flex justify-between">
              <div>Огноо:</div>
              <div>{moment(Date.now()).format("YYYY-MM-DD, HH:mm")}</div>
            </div>
            <div className=" flex justify-between">
              <div>Касс:</div>
              <div className="">{ajiltan?.ner}</div>
            </div>
            <div className=" flex justify-between">
              <div>Баримтын дугаар:</div>
              <div className="">{guilgeeniiDugaar}</div>
            </div>

            <div className="grid grid-cols-3 border-t-[1px] border-dashed border-gray-800">
              <div className="col-span-3">/ Бараа /</div>
              <div className="text-center">Тоо</div>
              <div>Үнэ</div>
              <div>Нийт дүн</div>
            </div>
            {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.baraanuud?.map(
              (mur, index) => (
                <div
                  className={`grid grid-cols-3 items-stretch justify-between border-b-[1px] border-dashed border-black ${
                    index === 0 && "border-t-[1px]"
                  }`}
                  key={`${index}-zakhialga`}
                >
                  <div className="col-span-3">/ {mur?.baraa?.ner} /:</div>
                  <div className="text-center">
                    {formatNumber(mur?.too, 2)}
                  </div>{" "}
                  <div>
                    {formatNumber(
                      mur?.baraa.zarakhUne
                        ? mur?.baraa.zarakhUne
                        : mur?.baraa?.niitUne,
                      2
                    )}
                  </div>
                  <div>{formatNumber(mur?.baraa.zarsanNiitUne, 2)}</div>
                </div>
              )
            )}
            <div className="flex justify-between text-[12px]">
              <div className="w-1/2 text-right font-semibold">Нийт дүн:</div>
              <div className="text-right">
                {formatNumber(
                  guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.tulsunDun,
                  2
                )}
              </div>
            </div>
            <div className="flex justify-between text-[12px]">
              <div className="w-1/2 text-right font-semibold">Төлөх дүн:</div>
              <div className="text-right">
                {formatNumber(guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.niitUne, 2)}
              </div>
            </div>
            <div>
              <div>
                <br />
              </div>
            </div>
            {!!guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch ? (
              <div>
                <div>Харилцагчийн урамшуулал</div>
                <div className="mx-2 rounded-md border border-black p-1">
                  {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch?.bonus
                    ?.nemegdsen > 0 ? (
                    <div className="mt-2">
                      <div className="border-b border-dashed border-black font-semibold">
                        Бонус
                      </div>
                      <div>
                        Ашигласан:{" "}
                        {formatNumber(
                          guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                            ?.bonus?.ashiglasan || 0,
                          2
                        )}
                      </div>
                      <div>
                        Өмнөх:{" "}
                        {formatNumber(
                          guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                            ?.bonus?.umnukh || 0,
                          2
                        )}
                      </div>
                      <div>
                        Нэмэгдсэн:{" "}
                        {formatNumber(
                          guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                            ?.bonus?.nemegdsen || 0,
                          2
                        )}
                      </div>
                    </div>
                  ) : null}
                  {(guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                    ?.khunglult?.khunglultiinTurul === "Хувь" &&
                    guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                      ?.khunglult?.khuvi > 0) ||
                  (guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch?.khunglult
                    ?.khunglultiinTurul === "Мөнгөн дүн" &&
                    guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                      ?.khunglult?.dun > 0) ? (
                    <div className="mt-2">
                      <div className="border-b border-dashed border-black font-semibold">
                        Хөнгөлөлт
                      </div>
                      <div>
                        Хөнгөлөлтийн төрөл:{" "}
                        {
                          guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                            ?.khunglult?.khunglultiinTurul
                        }
                      </div>
                      <div>
                        {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                          ?.khunglult?.khunglultiinTurul === "Хувь"
                          ? "Хөнгөлсөн хувь"
                          : "Хөнгөлсөн дүн"}
                        :{" "}
                        {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                          ?.khunglult?.khunglultiinTurul === "Хувь"
                          ? `${guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch?.khunglult?.khuvi}%`
                          : formatNumber(
                              guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.khariltsagch
                                ?.khunglult?.dun,
                              0
                            )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div>
                  <div>
                    <br />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* <div className="hidden">
          <div
            className="flex w-full min-w-[58mm] flex-col font-mono  text-[12px] text-black"
            ref={billRef}
          >
            {console.log(baiguullaga?._id, "test hiij baina")}
            {baiguullaga?._id === "65fce34b68de8ed1f063a6cc" && (
              <div className="flex justify-center font-bold">
                <div> Тогоочийн баримт</div>
                <div></div>
              </div>
            )}
            <div className="flex justify-between">
              <div>Огноо:</div>
              <div>{moment(Date.now()).format("YYYY-MM-DD, HH:mm")}</div>
            </div>
            <div className="flex justify-between">
              <div>Касс:</div>
              <div className="text-center">{ajiltan?.ner}</div>
            </div>
            <div className="pb-2 font-bold  ">
              Захиалгын дугаар:{" "}
              {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.guilgeeniiDugaar}
            </div>
            <div className="grid grid-cols-3 border-t-[1px] border-dashed border-gray-800">
              <div className="col-span-3">
                / Бүтээгдэхүүн /{" "}
                <div className="col-span-3 pr-[20%] text-right">Тоо</div>
              </div>
            </div>
            {guilgeeniiTuukhGaralt?.jagsaalt?.[0]?.baraanuud?.map(
              (mur, index) => (
                <div
                  className={`grid grid-cols-3 items-stretch justify-between border-b-[1px] border-dashed border-black ${
                    index === 0 && "border-t-[1px]"
                  }`}
                  key={`${index}-zakhialga`}
                >
                  <div className="col-span-3">
                    / {mur?.baraa?.ner} /:{" "}
                    <div className="col-span-3 pr-[20%] text-right">
                      {mur?.too}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div> */}
      </Modal>
    </>
  );
}
export default Bill;
