import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useRef, useState } from "react";
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

function EBarimtModal({
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
  setQpayModal,
  qpayModal,
  setBaiguullagaTatvar,
  baiguullagaTatvar,
  hynaltiinDugaaraarLavlagaaAvakhData,
  setHynaltiinDugaaraarLavlagaaAvakhData,
  eBarimtShine,
  shuudTulukh,
  guilgeeniiTuukhGaraltMutate,
  setShuudTulukh,
  niitDunNoat,
  dahinHewleh,
}) {
  const [eBarimtAvakhTurul, setEBarimtAvakhTurul] = useState("irgen");
  const [neelttei, setNeelttei] = useState(false);
  const [register, setRegister] = useState("");
  const [eBarimt, setEBarimt] = useState();
  const [baiguullagaEsekh, setBaiguullagaEsekh] = useState(false);
  const [belneer, setBelneer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasValidItems = turul?.some(
      (item) => item.turul !== "belen" && item.une !== ""
    );
    setBelneer(hasValidItems);
  }, [turul]);

  const eBarimtRef = useRef(null);

  function registerShalgaya(register) {
    if (isString(register)) {
      register = register?.toUpperCase();
    }
    setRegister(register);
    setBaiguullagaTatvar(null);
    if (
      (register?.toString().length === 7 && eBarimtAvakhTurul === "AAN") ||
      (register?.toString().length === 10 && eBarimtAvakhTurul === "irgen")
    ) {
      axios
        .get(`${posUrl}/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => {
          if (data?.found === true) {
            setBaiguullagaEsekh(eBarimtAvakhTurul === "AAN");
            setBaiguullagaTatvar(data);
          }
        });
    } else if (
      register?.toString().length === 0 &&
      eBarimtAvakhTurul === "irgen"
    ) {
      setBaiguullagaEsekh(false);
    }
  }
  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
    onAfterPrint: () => {
      setQpayModal(false);
      setEBarimt();
      setRegister("");
      setBaiguullagaEsekh(false);
      setEBarimtAvakhTurul("irgen");
      setShuudTulukh(false);
    },
  });

  function eBarimtAvakhTurulFunction(v) {
    setEBarimtAvakhTurul(v);
    setRegister("");
  }

  const tiim = () => {
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
    setQpayModal(false);
    setEBarimt();
    setNeelttei(false);
  };

  const ugui = () => {
    setEBarimt();
    setNeelttei(false);
  };

  const handleCancel = () => {
    setEBarimt();
    setNeelttei(true);
  };
  function onFinish() {
    setLoading(true);
    if (!!eBarimt) {
      setQpayModal(true);
    } else {
      if (
        (register?.toString().length !== 7 &&
          eBarimtAvakhTurul === "AAN" &&
          !!baiguullagaEsekh) ||
        (register?.toString().length !== 10 &&
          eBarimtAvakhTurul === "irgen" &&
          !!baiguullagaEsekh)
      ) {
        setLoading(false);
        AnkhaaruulgaAlert("Байгууллагын регистр оруулна уу");
      } else if (!baiguullagaEsekh) {
        const body = {
          guilgeeniiDugaar,
          guilgeeniiId,
          baiguullagiinId: baiguullagiinId,
          baiguullaga: baiguullaga,
          salbariinId: salbariinId,
          tsahimJor: hynaltiinDugaaraarLavlagaaAvakhData,
        };

        posUilchilgee(token)
          .post("/ebarimtShivye", body)
          .then(({ data, status }) => {
            if (data.success === true || (data.status == "SUCCESS" && 200)) {
              if (eBarimtShine) {
                setQpayModal(true);
              }
              setEBarimt(data);
              setGuilgeeniiId();
              setNeelttei(false);
              setLoading(false);
              setHynaltiinDugaaraarLavlagaaAvakhData();
              handlePrint();
              guilgeeniiTuukhGaraltMutate();
            } else {
              setLoading(false);
              AnkhaaruulgaAlert(
                data.errorCode === 210
                  ? data.message.replace("customerNo", register)
                  : data.message
              );
            }
          })
          .catch((err) => {
            if (err && Object.keys(err).length > 0) {
              aldaaBarigch(err);
            }

            setLoading(false);
          });
      } else if (
        (eBarimtAvakhTurul === "AAN" && register?.toString().length === 7) ||
        (eBarimtAvakhTurul === "irgen" && register?.toString().length === 10)
      ) {
        const body = {
          guilgeeniiId,
          guilgeeniiDugaar,
          baiguullagiinId: baiguullagiinId,
          baiguullaga: baiguullaga,
          salbariinId: salbariinId,
          turul: "3",
          register: register,
          customerTin: baiguullagaTatvar?.tin,
        };

        posUilchilgee(token)
          .post("/ebarimtShivye", body)
          .then(({ data }) => {
            if (data.success === true || (data.status == "SUCCESS" && 200)) {
              if (eBarimtShine) {
                setQpayModal(true);
              }
              setEBarimt(data);
              setNeelttei(false);
              setLoading(false);
              handlePrint();
              guilgeeniiTuukhGaraltMutate();
            } else {
              setLoading(false);
              AnkhaaruulgaAlert(
                data.errorCode === 210
                  ? data.message.replace("customerNo", register)
                  : data.message
              );
            }
          })
          .catch((err) => {
            if (err && Object.keys(err).length > 0) {
              aldaaBarigch(err);
            }
            setLoading(false);
          });
      }
    }
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
  }
  useEffect(() => {
    if (eBarimt) {
      handlePrint();
    }
  }, [eBarimt]);
  useEffect(() => {
    if (qpayModal) {
      const handleKeyPress = (event) => {
        const key = event.key;
        if (key === "F4") {
          !loading && onFinish();
        }
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [qpayModal, loading]);

  // useKeyboardTovchlol("F4", f4Darsan);

  // function f4Darsan() {
  //   if (shuudTulukh && !!salbariinId && baiguullagiinId && guilgeeniiId) {
  //     onFinish();
  //   }
  // }

  useEffect(() => {
    var tulsunDun = turul.reduce((a, b) => a + (parseFloat(b.une) || 0), 0);
    if (tulsunDun >= niitDunNoat?.niitDun) {
      if (shuudTulukh && !!salbariinId && baiguullagiinId && guilgeeniiId) {
        !loading && onFinish();
      } else if (!!eBarimt) {
        handlePrint();
        return; // Exit early to prevent alert
      }
    } else {
      setLoading(false);
    }
  }, [eBarimt, shuudTulukh, baiguullagiinId, salbariinId, guilgeeniiId]);

  return (
    <>
      <Modal
        destroyOnClose={true}
        width={"538px"}
        okText="Бүртгэх"
        footer={
          <Button onClick={() => !loading && onFinish()} type="primary">
            Хэвлэх
          </Button>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">И-Баримт</div>
        }
        open={qpayModal}
        onCancel={handleCancel}
      >
        <div className="h-[200px]">
          <Modal
            footer={false}
            onCancel={() => setNeelttei(false)}
            open={neelttei}
            className="flex min-w-[60%] items-center justify-center"
          >
            <div>
              <AsuulgaModal
                ugui={ugui}
                tiim={tiim}
                type="ankhaar"
                text={"Та хэвлэхгүй гарах уу?"}
              />
            </div>
          </Modal>
          <div className="flex flex-col items-center gap-7">
            <div className="flex h-[53px] w-[394px] items-center justify-between rounded-full bg-[#B9EDE8] p-1">
              <div
                onClick={() => eBarimtAvakhTurulFunction("irgen")}
                className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
                  eBarimtAvakhTurul === "irgen" && "bg-white"
                }`}
              >
                <div className="px-4 py-2 text-[15px] font-[700]">Иргэн</div>
              </div>
              <div
                onClick={() => eBarimtAvakhTurulFunction("AAN")}
                className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
                  eBarimtAvakhTurul === "AAN" && "bg-white"
                } `}
              >
                <div className=" px-4 py-2 text-[15px] font-[700]">ААН</div>
              </div>
            </div>
            <div className="flex w-[50%] flex-col items-center gap-2">
              <Input
                onChange={({ target }) => registerShalgaya(target.value)}
                value={register}
                autoComplete="off"
                style={{
                  height: "36px",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder={`${
                  eBarimtAvakhTurul === "irgen" ? "Иргэн" : "ААН"
                }`}
              />
              <div className="text-[15px] font-[700]">
                {baiguullagaTatvar?.name}
              </div>
            </div>
          </div>
        </div>

        {eBarimt && (
          <div className="hidden">
            <div
              className="flex w-full min-w-[58mm] flex-col font-mono text-sm font-normal text-black"
              ref={eBarimtRef}
            >
              <div className="flex justify-between">
                <div>Борлуулагч:</div>
                <div className="text-base font-bold">{baiguullaga?.ner}</div>
              </div>
              <div className="flex justify-between">
                <div>Огноо:</div>
                <div>{moment(Date.now()).format("YYYY-MM-DD, HH:mm")}</div>
              </div>
              <div className="flex justify-between">
                <div>ТТД:</div>
                <div>{eBarimt?.merchantTin}</div>
              </div>
              <div className="flex justify-between">
                <div>Касс:</div>
                <div>{eBarimt?.posNo}</div>
              </div>
              <div className="flex justify-between">
                <div>Кассчин:</div>
                <div>{ajiltan?.ner}</div>
              </div>
              <div className="flex justify-between">
                <div>Баримтын дугаар:</div>
                <div>{guilgeeniiDugaar}</div>
              </div>
              <div>
                <div>ДДТД:</div>
              </div>
              <div className="w-[80mm] text-sm">
                <div>{eBarimt?.billId ? eBarimt?.billId : eBarimt?.id}</div>
              </div>
              {baiguullagaEsekh && (
                <>
                  <div>
                    <div>Худалдан авагч</div>
                  </div>
                  <div className="flex justify-between">
                    <div>ТТД:</div>
                    <div>{register}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Нэр:</div>
                    <div>{baiguullagaTatvar?.name}</div>
                  </div>
                </>
              )}
              <div>
                <div>
                  <br />
                </div>
              </div>
              <div className="grid grid-cols-3 border-t-2 border-dashed border-gray-800">
                <div className="col-span-3">/ Бараа /</div>
                <div className="text-center">Тоо</div>
                <div>Үнэ</div>
                <div>Дүн</div>
              </div>
              {/* {eBarimt?.stocks
                ?.filter((a) => a.uramshuulaliinBaraaEsekh !== true)
                .map((mur, index) => (
                  <div
                    className={`grid grid-cols-3 items-stretch justify-between border-b-2 border-dashed border-black ${
                      index === 0 && "border-t-2"
                    }`}
                    key={`${index}-zakhialga`}>
                    <div className="col-span-3">/ {mur.name} /:</div>
                    <div className="text-center">{mur.qty}</div>{" "}
                    <div>{formatNumber(mur.unitPrice, 2)}</div>
                    <div>{formatNumber(mur.totalAmount, 2)}</div>
                  </div>
                ))}
              {eBarimt?.stocks?.filter(
                (a) => a.uramshuulaliinBaraaEsekh === true
              ).length > 0 ? (
                <div className="mt-3">
                  <div className="text-center font-semibold">
                    --Урамшуулал--
                  </div>
                  {eBarimt?.stocks
                    ?.filter((a) => a.uramshuulaliinBaraaEsekh === true)
                    .map((mur, index) => (
                      <div
                        className={`grid grid-cols-3 items-stretch justify-between border-b-2 border-dashed border-black ${
                          index === 0 && "border-t-2"
                        }`}
                        key={`${index}-zakhialga`}>
                        <div className="col-span-3">/ {mur.name} /:</div>
                        <div className="text-center">{mur.qty}</div>{" "}
                        <div>{formatNumber(mur.unitPrice, 2)}</div>
                        <div>{formatNumber(mur.totalAmount, 2)}</div>
                      </div>
                    ))}
                </div>
              ) : null} */}
              {eBarimt?.receipts?.map((e, i) => {
                return (
                  <div
                    className={`
                  border-b-2 border-dashed border-black ${
                    i === 0 && "border-t-2"
                  }`}
                  >
                    <div className="font-bold">
                      {e.taxType === "VAT_ABLE"
                        ? "НӨАТ-тэй бараа"
                        : e.taxType === "VAT_FREE" && "НӨАТ-гүй бараа"}
                    </div>
                    {e.items.map((mur, index) => (
                      <div
                        className={`grid grid-cols-3 items-stretch justify-between border-b-2 border-dashed border-black ${
                          index === e?.items?.length - 1 && "border-b-0"
                        } `}
                        key={`${index}-zakhialga`}
                      >
                        <div className="col-span-3">/ {mur.name} /:</div>
                        <div className="text-center">{mur.qty}</div>{" "}
                        <div>{formatNumber(mur.unitPrice, 2)}</div>
                        <div>{formatNumber(mur?.unitPrice * mur?.qty, 2)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
              <div>
                <div>
                  <br />
                </div>
              </div>
              {!!eBarimt?.khariltsagch?.id ? (
                <div>
                  <div>Харилцагчийн урамшуулал</div>
                  <div className="mx-2 rounded-md border border-black p-1">
                    {eBarimt?.khariltsagch?.bonus?.nemegdsen > 0 ? (
                      <div className="mt-2">
                        <div className="border-b border-dashed border-black font-semibold">
                          Бонус
                        </div>
                        <div>
                          Ашигласан:{" "}
                          {formatNumber(
                            eBarimt?.khariltsagch?.bonus?.ashiglasan || 0,
                            2
                          )}
                        </div>
                        <div>
                          Өмнөх:{" "}
                          {formatNumber(
                            eBarimt?.khariltsagch?.bonus?.umnukh || 0,
                            2
                          )}
                        </div>
                        <div>
                          Нэмэгдсэн:{" "}
                          {formatNumber(
                            eBarimt?.khariltsagch?.bonus?.nemegdsen || 0,
                            2
                          )}
                        </div>
                      </div>
                    ) : null}
                    {(eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                      "Хувь" &&
                      eBarimt?.khariltsagch?.khunglult?.khuvi > 0) ||
                    (eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul ===
                      "Мөнгөн дүн" &&
                      eBarimt?.khariltsagch?.khunglult?.dun > 0) ? (
                      <div className="mt-2">
                        <div className="border-b border-dashed border-black font-semibold">
                          Хөнгөлөлт
                        </div>
                        <div>
                          Хөнгөлөлтийн төрөл:{" "}
                          {eBarimt?.khariltsagch?.khunglult?.khunglultiinTurul}
                        </div>
                        <div>
                          {eBarimt?.khariltsagch?.khunglult
                            ?.khunglultiinTurul === "Хувь"
                            ? "Хөнгөлсөн хувь"
                            : "Хөнгөлсөн дүн"}
                          :{" "}
                          {eBarimt?.khariltsagch?.khunglult
                            ?.khunglultiinTurul === "Хувь"
                            ? `${eBarimt?.khariltsagch?.khunglult?.khuvi}%`
                            : formatNumber(
                                eBarimt?.khariltsagch?.khunglult?.dun,
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
              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">Нийт дүн:</div>
                <div className="text-right">
                  {eBarimt.type === "B2C_INVOICE" ||
                  eBarimt.type === "B2B_INVOICE"
                    ? formatNumber(
                        Number(
                          eBarimt?.amount
                            ? eBarimt?.amount
                            : eBarimt?.totalAmount || 0
                        ),
                        2
                      )
                    : formatNumber(
                        Number(
                          eBarimt?.amount
                            ? eBarimt?.amount
                            : eBarimt?.totalAmount || 0
                        ) + Number(eBarimt?.khungulukhDun || 0),
                        2
                      )}
                </div>
              </div>
              {!!eBarimt?.khungulukhDun && (
                <div className="flex justify-between text-base">
                  <div className="w-1/2 text-right font-bold">
                    Хөнгөлсөн дүн:
                  </div>
                  <div className="text-right">
                    {formatNumber(eBarimt?.khungulukhDun || 0, 2)}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">НӨАТ-гүй дүн:</div>
                <div className="text-right">
                  {formatNumber(
                    +(eBarimt?.amount
                      ? eBarimt?.amount
                      : eBarimt?.totalAmount) -
                      +(eBarimt?.vat ? eBarimt?.vat : eBarimt?.totalVAT) -
                      +(eBarimt?.cityTax
                        ? eBarimt?.cityTax
                        : eBarimt?.totalCityTax),
                    2
                  )}
                </div>
              </div>
              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">НӨАТ:</div>
                <div className="text-right">
                  {formatNumber(
                    eBarimt?.vat ? eBarimt?.vat : eBarimt?.totalVAT,
                    2
                  )}
                </div>
              </div>

              <div className="flex justify-between text-base">
                <div className="w-1/2 text-right font-bold">Төлөх дүн:</div>
                <div className="text-right">
                  {formatNumber(
                    eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount,
                    2
                  )}
                </div>
              </div>

              {/* {turul.map((item) => {
                if (item.turul === "belen") {
                  return (
                    <div
                      key={item.turul}
                      className="flex justify-between text-base"
                    >
                      <div className="w-1/2 text-right font-bold">Бэлнээр:</div>
                      <div className="text-right">{item.une}</div>
                    </div>
                  );
                }
                return null;
              })} */}
              {/* {turul.map((item) => {
                if (item.turul !== "belen") {
                  var kharuulakh = kharuulakh + item.une;
                  return (
                    <div
                      key={item.turul}
                      className='flex justify-between text-base'>
                      <div className='w-1/2 text-right font-bold'>
                        Бэлэн бусаар:
                      </div>
                      <div className='text-right'>{kharuulakh}</div>
                    </div>
                  );
                }
                return null;
              })} */}
              {belneer && (
                <div className="flex justify-between text-base">
                  <div className="w-1/2 text-right font-bold">
                    Бэлэн бусаар:
                  </div>
                  <div className="text-right">
                    {turul.reduce((acc, item) => {
                      if (item.turul !== "belen" && item.une !== "") {
                        return acc + parseInt(item.une);
                      }
                      return acc;
                    }, 0)}
                  </div>
                </div>
              )}
              {/* {tulbur?.khariult && (
                <div className='flex justify-between text-base'>
                  <div className='w-1/2 text-right font-bold'>Хариулт:</div>
                  <div className='text-right'>
                    {formatNumber(tulbur?.khariult)}
                  </div>
                </div>
              )} */}
              <div className="flex items-end justify-between">
                <div className="w-1/2 text-right font-bold">
                  {`Е-Баримт дүн`}:
                </div>
                <div className="text-end">
                  {formatNumber(
                    eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount,
                    2
                  )}
                </div>
              </div>
              {!baiguullagaEsekh && (
                <div className="flex items-end justify-between text-base">
                  <div className="w-1/2 text-right font-bold">
                    Сугалааны дугаар:
                  </div>
                  <div className="text-end text-base font-bold">
                    {eBarimt?.lottery}
                  </div>
                </div>
              )}
              <div>
                <div>
                  <div className="flex w-full justify-center p-5">
                    <div>
                      <QRCode level="L" value={eBarimt?.qrData} size={200} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
export default EBarimtModal;
