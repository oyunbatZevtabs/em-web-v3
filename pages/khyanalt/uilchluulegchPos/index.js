import React, { useEffect, useMemo, useState, useRef } from "react";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Drawer, Form, Image, Popover, Switch, Tooltip } from "antd";
import moment from "moment";
import { Type as ListType, SwipeableList } from "react-swipeable-list";
import _ from "lodash";
import { FaCartArrowDown } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";
import "react-swipeable-list/dist/styles.css";
// import { BroadcastChannel } from "broadcast-channel";

import formatNumber from "tools/function/formatNumber";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import { posUrl } from "services/posUilchilgee";
import TsuwraliinDugaarSongokh from "components/modalBody/posSystem/tsuwraliinDugaarSongokh";
import KhemjikhNegjUurchlukh from "components/modalBody/posSystem/khemjikhNegjUurchlukh";
import TooShirkhegInput from "components/ant/AntdInput";
import PosUilchluulegchTulburTuluhModal from "components/modalBody/uilchluulegchPos/tulburTulukhModal";

function UilchluulegchPos({ token }) {
  const [songogdsomEmnuud, setSongogdsomEmnuud] = useState([]);
  const [guilgeeniiDugaar, setGuilgeeniiDugaar] = useState();
  const [guilgeeniiId, setGuilgeeniiId] = useState();
  const [umnuhGuilgeeniiDun, setUmnuhGuilgeeniiDun] = useState();
  const [qpayModal, setQpayModal] = useState(false);
  const { ajiltan, baiguullaga, baiguullagiinId, salbariinId } = useAuth();
  const [baiguullagaTatvar, setBaiguullagaTatvar] = useState();
  const [bustaaltKhiikhId, setBustaaltKhiikhId] = useState();
  const [uramshuulal, setUramshuulal] = useState([]);
  const [niitDunNoat, setNiitDunNoat] = useState();
  const [tulburTulukhModal, setTulburTulukhModal] = useState(false);
  const [cartAmjilttai, setCartAmjilttai] = useState(false);

  const [qpayModalTuluv, setQpayModalTuluv] = useState(false);
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [qpayerTulukh, setQpayerTulukh] = useState("");
  const [loading, setLoading] = useState(false);

  const [
    khariltsagchiinKhunglultUramshuulal,
    setKhariltsagchiinKhunglultUramshuulal,
  ] = useState();

  const [turul, setTurul] = useState([
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
  const [
    tulburTulkhudAldaaGarsanBaraanuud,
    setTulburTulkhudAldaaGarsanBaraanuud,
  ] = useState([]);
  const [
    hynaltiinDugaaraarLavlagaaAvakhData,
    setHynaltiinDugaaraarLavlagaaAvakhData,
  ] = useState();

  // const setupBroadcastChannel = (channelName, setter) => {
  //   const channel = new BroadcastChannel(channelName);
  //   channel.onmessage = (msg) => setter(msg);
  // };

  // useEffect(() => {
  //   setupBroadcastChannel("songogdsomEmnuud", setSongogdsomEmnuud);
  //   setupBroadcastChannel("guilgeeniiDugaar", setGuilgeeniiDugaar);
  //   setupBroadcastChannel(
  //     "tulburTulkhudAldaaGarsanBaraanuud",
  //     setTulburTulkhudAldaaGarsanBaraanuud
  //   );
  //   setupBroadcastChannel("guilgeeniiId", setGuilgeeniiId);
  //   setupBroadcastChannel("bustaaltKhiikhId", setBustaaltKhiikhId);
  //   setupBroadcastChannel(
  //     "khariltsagchiinKhunglultUramshuulal",
  //     setKhariltsagchiinKhunglultUramshuulal
  //   );
  //   setupBroadcastChannel("baiguullagaTatvar", setBaiguullagaTatvar);
  //   setupBroadcastChannel("turul", setTurul);
  //   setupBroadcastChannel(
  //     "hynaltiinDugaaraarLavlagaaAvakhData",
  //     setHynaltiinDugaaraarLavlagaaAvakhData
  //   );
  //   setupBroadcastChannel("qpayModal", setQpayModal);
  //   setupBroadcastChannel("niitDunNoat", setNiitDunNoat);
  //   setupBroadcastChannel("tulburTulukhModal", setTulburTulukhModal);

  //   setupBroadcastChannel("qpayModalTuluv", setQpayModalTuluv);
  //   setupBroadcastChannel("qpayerTulukh", setQpayerTulukh);
  //   setupBroadcastChannel("loading", setLoading);
  //   setupBroadcastChannel("khuleegdejBuiQpay", setKhuleegdejBuiQpay);
  //   setupBroadcastChannel("cartAmjilttai", setCartAmjilttai);
  // }, []);

  return (
    <>
      <div className="box col-span-6 flex h-screen select-none flex-col justify-start gap-3 px-4 py-4 dark:bg-gray-900 xl:col-span-5">
        {songogdsomEmnuud?.length !== 0 ? (
          <div className="z-20 flex max-h-[300px] flex-col gap-2 !overflow-y-auto xl:max-h-[calc(100vh-136px)]">
            <SwipeableList
              className="flex flex-col gap-2 pb-2"
              fullSwipe={false}
              threshold={0.5}
            >
              {songogdsomEmnuud?.map((mur, index) => {
                return (
                  <div className="flex " key={index}>
                    <div
                      style={{
                        backgroundColor: !mur.uramshuulaliinId
                          ? "rgba(79, 209, 197, 0.4)"
                          : "rgba(200, 250, 250, 0.2)",
                      }}
                      className={`flex w-[100%] flex-col items-center justify-between gap-x-1 rounded-[15px] px-2 py-1 md:w-[100%] md:flex-row ${
                        mur.uramshuulaliinId && "border-2 border-[#4FD1C5]"
                      }`}
                    >
                      <div className="flex w-full gap-2 xl:w-fit">
                        <div className="hidden h-[50px] w-[50px] items-center justify-center rounded-[7px] xl:flex">
                          <Image
                            height={50}
                            preview={false}
                            src={
                              !!mur.zurgiinId
                                ? `${posUrl}/file?path=baraa/${mur.zurgiinId}`
                                : "/drugs.svg"
                            }
                            width={50}
                          />
                        </div>
                        <div className="flex w-full flex-col items-start justify-between truncate">
                          <Popover
                            content={
                              <div>
                                {mur?.boginoNer ? mur?.boginoNer : mur?.ner}
                              </div>
                            }
                            title={false}
                          >
                            <div className="w-fit truncate text-left text-[15px] font-[500]">
                              {mur?.boginoNer ? mur?.boginoNer : mur?.ner}
                            </div>
                          </Popover>
                          {/* <div className="w-[110px]"></div> */}
                          <div className="flex w-full items-center gap-2 text-left !text-[10px] font-[600] xl:!text-[20px]">
                            {formatNumber(mur?.zarsanNiitUne, 2)}
                            {" ₮"}
                            <div className="text-[10px] text-gray-400 xl:text-sm">
                              ({" "}
                              {formatNumber(
                                !!mur?.uramshuulaliinId
                                  ? mur?.undsenZarakhUne
                                  : mur?.niitUne,
                                2
                              )}
                              {" ₮"} )
                            </div>
                          </div>
                        </div>
                      </div>
                      {mur.uramshuulaliinId &&
                        mur.uramshuulal?.length > 0 &&
                        mur.uramshuulal.filter(
                          (a) =>
                            Number(
                              moment(a.duusakhOgnoo).format("YYYYMMDDHHmm")
                            ) >
                              Number(
                                moment(new Date()).format("YYYYMMDDHHmm")
                              ) &&
                            Number(
                              moment(a.ekhlekhOgnoo).format("YYYYMMDDHHmm")
                            ) <
                              Number(moment(new Date()).format("YYYYMMDDHHmm"))
                        ).length > 0 && (
                          <IoGiftOutline
                            onClick={() => {
                              var data = mur.uramshuulal.filter(
                                (a) =>
                                  Number(
                                    moment(a.duusakhOgnoo).format(
                                      "YYYYMMDDHHmm"
                                    )
                                  ) >
                                    Number(
                                      moment(new Date()).format("YYYYMMDDHHmm")
                                    ) &&
                                  Number(
                                    moment(a.ekhlekhOgnoo).format(
                                      "YYYYMMDDHHmm"
                                    )
                                  ) <
                                    Number(
                                      moment(new Date()).format("YYYYMMDDHHmm")
                                    )
                              );
                              data.push({ zuvhunKharakh: true });
                              setUramshuulal(data);
                            }}
                            className={`cursor-pointer text-5xl text-[#4FD1C5] transition-colors ${
                              mur.uramshuulaliinId
                                ? "hover:text-green-500"
                                : "hover:text-white"
                            }`}
                          />
                        )}
                      <div className="flex w-fit items-center justify-center gap-3 ">
                        <div className=" flex h-full flex-col justify-between">
                          <div className="flex h-full flex-col items-center font-[500] leading-[34px]">
                            <div className="text-[15px]">Тоо ширхэг</div>
                            <div className="flex w-[150px] gap-2 xl:w-full">
                              <div className="flex w-full items-center justify-center text-[20px] font-[600]">
                                {!mur.uramshuulaliinId ? (
                                  <TooShirkhegInput
                                    size="large"
                                    autoFocus
                                    min={0}
                                    className="posInput !h-[14px]  !w-full xl:!h-[36px] "
                                    max={
                                      mur?.maxShirkheg
                                        ? mur.maxShirkheg
                                        : mur.uldegdel
                                    }
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderColor: "rgba(79, 209, 197, 0.4)",
                                      borderRadius: "25px",
                                      backgroundColor:
                                        "rgba(79, 209, 197, 0.4)",
                                    }}
                                    value={mur?.shirkheg.toFixed(2)}
                                    onChange={(v) =>
                                      addInputValue(
                                        mur,
                                        v,
                                        mur.shirkheglekhEsekh &&
                                          parseFloat(v) *
                                            parseFloat(
                                              mur?.negKhairtsaganDahiShirhegiinToo
                                            )
                                      )
                                    }
                                  />
                                ) : (
                                  <div className="-mt-3 text-green-500">
                                    {mur?.shirkheg}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </SwipeableList>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div>
              <FaCartArrowDown
                style={{ color: "rgba(41, 48, 80, 0.3)" }}
                className="text-[90px]"
              />
            </div>
            <div
              className="font-normal"
              style={{ color: "rgba(41, 48, 80, 0.5)" }}
            >
              Захиалга хоосон байна
            </div>
          </div>
        )}
        <div
          onMouseEnter={() =>
            document.getElementById("tulburTulukhTovch")?.focus()
          }
          className="mt-auto grid h-fit w-full grid-cols-12 place-self-end rounded-[14px] border border-dashed border-[#A9A9A9] p-2 xl:px-4 xl:py-2"
        >
          <div className="col-span-12 text-lg">
            <div className="col-span-1 flex h-[10px] items-center justify-between xl:h-[30px]">
              <div className="text-[10px] xl:text-[16px]">
                Баримтын дугаар :
              </div>
              <div className="text-[10px] font-semibold xl:text-[16px]">
                {songogdsomEmnuud?.length > 0 ? guilgeeniiDugaar : ""}
              </div>
            </div>
            <div className="flex flex-col leading-5">
              <div className="flex w-full items-center justify-between">
                <div className="text-[10px] xl:text-[16px]">ХӨНГӨЛӨЛТ :</div>
                <div className="text-[10px] font-semibold xl:text-[16px]">
                  {formatNumber(
                    songogdsomEmnuud?.reduce(
                      (a, b) =>
                        a +
                        (b?.khunglukhEsekh === false
                          ? b?.emiinShirkhegiinKhunglukhDun || 0
                          : b?.hungulsunDun || 0),
                      0
                    ),
                    2
                  )}{" "}
                  ₮
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="text-[10px] xl:text-[16px]">ДҮН :</div>
                <div className="text-[10px] font-semibold xl:text-[16px]">
                  {baiguullaga?.tokhirgoo?.eBarimtAshiglakhEsekh
                    ? formatNumber(
                        (niitDunNoat?.niitDun || 0) - (niitDunNoat?.noat || 0),
                        2
                      )
                    : 0}{" "}
                  ₮
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="text-[10px] xl:text-[16px]">НӨАТ :</div>
                <div className="text-[10px] font-semibold xl:text-[16px]">
                  {baiguullaga?.tokhirgoo?.eBarimtAshiglakhEsekh
                    ? formatNumber(niitDunNoat?.noat, 2)
                    : 0}{" "}
                  ₮
                </div>
              </div>
            </div>
            <div className={`col-span-1 flex items-center justify-between`}>
              <div className="text-[10px] xl:text-[16px]">НИЙТ ДҮН :</div>
              <div className="text-[10px] font-bold text-[#4FD1C5] xl:text-[16px]">
                {formatNumber(niitDunNoat?.niitDun, 2)} ₮
              </div>
            </div>
          </div>
          <div className="col-span-12 flex h-full w-full flex-col justify-end gap-2 place-self-end">
            <PosUilchluulegchTulburTuluhModal
              tulburTulukhModal={tulburTulukhModal}
              tulburTulkhudAldaaGarsanBaraanuud={
                tulburTulkhudAldaaGarsanBaraanuud
              }
              umnuhGuilgeeniiDun={umnuhGuilgeeniiDun}
              guilgeeniiId={guilgeeniiId}
              bustaaltKhiikhId={bustaaltKhiikhId}
              khariltsagchiinKhunglultUramshuulal={
                khariltsagchiinKhunglultUramshuulal
              }
              baiguullagaTatvar={baiguullagaTatvar}
              turul={turul}
              niitDunNoat={niitDunNoat}
              guilgeeniiDugaar={guilgeeniiDugaar}
              songogdsomEmnuud={songogdsomEmnuud}
              hynaltiinDugaaraarLavlagaaAvakhData={
                hynaltiinDugaaraarLavlagaaAvakhData
              }
              eBarimtAshiglakhEsekh={
                baiguullaga?.tokhirgoo?.eBarimtAshiglakhEsekh
              }
              qpayModal={qpayModal}
              khuleegdejBuiQpay={khuleegdejBuiQpay}
              setKhuleegdejBuiQpay={setKhuleegdejBuiQpay}
              qpayModalTuluv={qpayModalTuluv}
              setQpayModalTuluv={setQpayModalTuluv}
              qpayerTulukh={qpayerTulukh}
              setQpayerTulukh={setQpayerTulukh}
              setLoading={setLoading}
              loading={loading}
              cartAmjilttai={cartAmjilttai}
              setCartAmjilttai={setCartAmjilttai}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default UilchluulegchPos;
