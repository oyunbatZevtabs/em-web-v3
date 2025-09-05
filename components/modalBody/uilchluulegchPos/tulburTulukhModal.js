import { Image } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BsFillCreditCardFill } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import formatNumber from "tools/function/formatNumber";
import QpayModal from "../qpay";
import AldaaAlert from "components/alert/AldaaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import uilchilgee from "services/uilchilgee";
import CartLoading from "../posSystem/cartLoading";

function TulburTuluhModal({
  umnuhGuilgeeniiDun,
  khariltsagchiinKhunglultUramshuulal,
  guilgeeniiId,
  bustaaltKhiikhId,
  setShineSongogdsomEmnuud,
  niitDunNoat,
  guilgeeniiDugaar,
  songogdsomEmnuud,
  turul,
  eBarimtAshiglakhEsekh,
  qpayModal,

  tulburTulukhModal,
  loading,
  qpayerTulukh,
  qpayModalTuluv,
  khuleegdejBuiQpay,
  setQpayerTulukh,
  setLoading,
  setKhuleegdejBuiQpay,
  setQpayModalTuluv,
  cartAmjilttai,
  setCartAmjilttai,
}) {
  const [tulburiinHelber, setTulburiinHelber] = useState("");
  const [turulruuKhiikhDun, setTurulruuKhiikhDun] = useState("0");
  // const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  // const [qpayModalTuluv, setQpayModalTuluv] = useState(false);
  // const [qpayerTulukh, setQpayerTulukh] = useState("");
  // const [loading, setLoading] = useState(false);
  const [qpayTulsun, setQpayTulsun] = useState(false);
  const { token, ajiltan, baiguullagiinId, salbariinId, baiguullaga } =
    useAuth();
  const [khariult, setKhariult] = useState();
  const [tulukhDun, setTulukhDun] = useState(0);
  const [zeelModalOpen, setZeelModalOpen] = useState(false);

  useEffect(() => {
    if (umnuhGuilgeeniiDun - niitDunNoat?.niitDun > 0) {
      setTulukhDun();
      setKhariult(umnuhGuilgeeniiDun - niitDunNoat?.niitDun);
    } else {
      setKhariult();
      setTulukhDun(Math.abs(umnuhGuilgeeniiDun - niitDunNoat?.niitDun));
    }
  }, [umnuhGuilgeeniiDun, niitDunNoat, songogdsomEmnuud]);

  function handleCancelQpay() {
    setQpayModalTuluv(false);
  }

  useEffect(() => {
    if (turul[3].une > 0) {
      setZeelModalOpen(true);
    }
  }, [turul[3].une]);

  useEffect(() => {
    if (
      turul.reduce((a, b) => {
        return a + (parseFloat(b.une) || 0);
      }, 0) < niitDunNoat?.niitDun
    ) {
      setTurulruuKhiikhDun(
        niitDunNoat?.niitDun -
          turul
            .reduce((a, b) => {
              return a + (parseFloat(b.une) || 0);
            }, 0)
            .toString()
      );
    } else if (
      niitDunNoat?.niitDun -
        turul.reduce((a, b) => {
          return a + (parseFloat(b.une) || 0);
        }, 0) <=
      0
    ) {
      setTurulruuKhiikhDun("0");
    }
  }, [turul]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (validKeys.includes(key)) {
        setTurulruuKhiikhDun(
          (turulruuKhiikhDun?.toString() || "") + key.toString()
        );
      }
      if (event.key === "Backspace") {
        setTurulruuKhiikhDun(turulruuKhiikhDun.toString().slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tulburiinHelber, turul, turulruuKhiikhDun]);

  return (
    <div>
      <Modal
        zIndex={99}
        width={"1024px"}
        style={{ top: 0 }}
        okText="Бүртгэх"
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-bold ">
            Төлбөр тооцоо
          </div>
        }
        open={tulburTulukhModal}>
        <div className="flex h-[545px] w-full flex-col  p-11 pb-0 xl:h-[750px]">
          <div className="flex h-[50%] w-full  items-center  gap-10 ">
            <div className="flex h-full w-[50%] flex-col items-center justify-center gap-5  ">
              <div className="flex gap-8">
                <div
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "belen"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}>
                  {turul[0].une > 0 && tulburiinHelber !== "belen" ? (
                    <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-[#4FD1C5] bg-white p-1">
                      <div className="font-semibold">
                        {formatNumber(turul[0].une)}₮
                      </div>
                    </div>
                  ) : null}
                  <FaMoneyBillWave className="text-[30px] text-[#4FD1C5]" />
                  <div className="text-[20px] text-lg font-bold text-[#4FD1C5]">
                    Бэлэн
                  </div>
                </div>
                <div
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "cart"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}>
                  {turul[1].une > 0 && tulburiinHelber !== "cart" ? (
                    <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-[#4FD1C5] bg-white p-1">
                      <div className="font-semibold">
                        {formatNumber(turul[1].une)}₮
                      </div>
                    </div>
                  ) : null}
                  <BsFillCreditCardFill className="text-[30px] text-[#4FD1C5]" />
                  <div className="text-lg font-bold text-[#4FD1C5]">Карт</div>
                </div>
              </div>
              <div className="flex gap-8">
                <div
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "khariltsakh"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}>
                  {turul[2].une > 0 && tulburiinHelber !== "khariltsakh" ? (
                    <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-[#4FD1C5] bg-white p-1">
                      <div className="font-semibold">
                        {formatNumber(turul[2].une)}₮
                      </div>
                    </div>
                  ) : null}
                  <FaArrowRightArrowLeft className="text-[30px] text-[#4FD1C5]" />
                  <div className=" text-lg font-bold text-[#4FD1C5]">
                    Харилцах
                  </div>
                </div>
                <div
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "zeel"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}>
                  {turul[3].une > 0 && tulburiinHelber !== "zeel" ? (
                    <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-[#4FD1C5] bg-white p-1">
                      <div className="font-semibold ">
                        {formatNumber(turul[3].une)}₮
                      </div>
                    </div>
                  ) : null}
                  <FaArrowRightArrowLeft className="text-[30px] text-[#4FD1C5]" />
                  <div className="text-lg font-bold text-[#4FD1C5]">Зээл</div>
                </div>
              </div>
            </div>

            <div className="flex h-full w-[75%] flex-col items-center justify-center gap-4  ">
              <div className="flex gap-[48px]">
                <div
                  className={`${
                    tulburiinHelber === "qpay" &&
                    "overflow-hidden rounded-3xl border-[3px] border-[#4FD1C5]"
                  } relative h-[55px] w-[60px] hover:scale-110 xl:h-[85px] xl:w-[100px] `}>
                  {turul[4].une > 0 && tulburiinHelber !== "qpay" ? (
                    <div className="absolute right-[0] top-[-15px] z-10 rounded-xl border-[1px] border-[#4FD1C5] bg-white p-1">
                      <div className="font-semibold">
                        {formatNumber(turul[4].une)}₮
                      </div>
                    </div>
                  ) : null}
                  <Image preview={false} src="/Rectangle56.png" />
                </div>
                <QpayModal
                  loading={loading}
                  qpayerTulukh={qpayerTulukh}
                  token={token}
                  setQpayerTulukh={setQpayerTulukh}
                  setQpayModalTuluv={setQpayModalTuluv}
                  handleCancelQpay={handleCancelQpay}
                  qpayModalTuluv={qpayModalTuluv}
                  turul={turul}
                  khuleegdejBuiQpay={khuleegdejBuiQpay}
                  qpayerTulukhDun={turul[4].une}
                  setQpayTulsun={setQpayTulsun}
                />
                <div
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px] xl:w-[100px]`}>
                  <Image
                    id="SocialPay"
                    preview={false}
                    src="/Rectangle60.png"
                  />
                </div>
                <div
                  className={`hover:scale-110" h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl xl:h-[90px] xl:w-[100px]`}>
                  <Image preview={false} src="/Rectangle72.png" />
                </div>
              </div>

              <div className="flex gap-[48px]">
                <div
                  className={`hover:scale-110" h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl xl:h-[90px] xl:w-[100px]`}>
                  <Image preview={false} src="/Rectangle66.png" />
                </div>
                <div
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px] xl:w-[100px]`}>
                  <Image preview={false} src="/Rectangle81.png" />
                </div>
                <div
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px]  xl:w-[100px]`}>
                  <Image preview={false} src="/Rectangle83.png" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-8 ">
            <div className="flex h-full w-[45%] flex-col items-center gap-5">
              <div className="flex h-[25px] w-[186px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5]  xl:h-[53px] xl:w-[256px]">
                <div className="truncate text-[15px] font-bold text-[#00A35E] xl:text-[32px]">
                  {formatNumber(turulruuKhiikhDun)}₮
                </div>
              </div>
            </div>
            <div className="flex h-full w-[300px] flex-col items-center gap-6">
              <div className="flex h-fit w-[100%] flex-col justify-between rounded-[25px] border-2 border-dotted border-[#4FD1C5] p-5 dark:text-gray-300 ">
                <div className="flex flex-col gap-2 text-[10px] font-semibold xl:text-[16px]">
                  <div className="flex w-full justify-between">
                    <div>ХӨНГӨЛӨЛТ:</div>
                    <div>{formatNumber(niitDunNoat?.hungulsunDun, 2)}₮</div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div>НӨАТ:</div>
                    <div>
                      {baiguullaga?.tokhirgoo?.eBarimtAshiglakhEsekh
                        ? formatNumber(niitDunNoat?.noat, 2)
                        : 0}
                      ₮
                    </div>
                  </div>
                  <div className="flex w-full justify-between font-semibold">
                    <div>Нийт дүн:</div>
                    <div>{formatNumber(niitDunNoat?.niitDun, 2)}₮</div>
                  </div>
                  {/* {!!params && (
                    <div className="flex w-full justify-between font-semibold">
                      <div>Өмнөх дүн:</div>
                      <div>{formatNumber(umnuhGuilgeeniiDun, 2)}₮</div>
                    </div>
                  )}
                  {!!params && (
                    <div className="flex w-full justify-between font-semibold">
                      <div>Төлөх дүн:</div>
                      <div>{formatNumber(tulukhDun, 2)}₮</div>
                    </div>
                  )} */}
                </div>
                <div className="flex w-full justify-between text-[10px] font-semibold text-[#00A35E] xl:text-[16px]">
                  <div>Хариулт:</div>
                  <div>
                    {/* {formatNumber(
                      !!params
                        ? khariult
                        : turul.reduce(
                            (a, b) => a + (parseFloat(b.une) || 0),
                            0
                          ) -
                            niitDunNoat?.niitDun <
                          0
                        ? 0
                        : turul.reduce(
                            (a, b) => a + (parseFloat(b.une) || 0),
                            0
                          ) - niitDunNoat?.niitDun,
                      2
                    )} */}
                    ₮
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <CartLoading
        setCartAmjilttai={setCartAmjilttai}
        cartAmjilttai={cartAmjilttai}
      />
    </div>
  );
}
export default TulburTuluhModal;
