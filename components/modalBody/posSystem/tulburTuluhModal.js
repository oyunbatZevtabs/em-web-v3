import { Image } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { BsFillCreditCardFill } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
// import { BroadcastChannel } from "broadcast-channel";

import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import formatNumber from "tools/function/formatNumber";
import QpayModal from "../qpay";
import { Modal } from "components/ant/AntdModal";
import AldaaAlert from "components/alert/AldaaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import CartLoading from "./cartLoading";
import PosKhariltsagchModal from "./posKhariltsagchModal";
import uilchilgee from "services/uilchilgee";
import ZeelModal from "./zeelModal";
function TulburTuluhModal({
  hynaltiinDugaaraarLavlagaaAvakhData,
  setHynaltiinDugaaraarLavlagaaAvakhData,
  tulburTulkhudAldaaGarsanBaraanuud,
  setTulburTulkhudAldaaGarsanBaraanuud,
  params,
  umnuhGuilgeeniiDun,
  setUmnuhGuilgeeniiDun,
  khariltsagchiinKhunglultUramshuulal,
  setKhariltsagchiinKhunglultUramshuulal,
  guilgeeniiId,
  setGuilgeeniiId,
  bustaaltKhiikhId,
  setBustaaltKhiikhId,
  setShineSongogdsomEmnuud,
  baraaMutate,
  niitDunNoat,
  guilgeeniiDugaar,
  songogdsomEmnuud,
  setSongogdsomEmnuud,
  setShineerBarimtiinDugaarAviya,
  setQpayModal,
  setTurul,
  turul,
  form,
  scrollToUldegdelguiItem,
  eBarimtShine,
  setShuudTulukh,
  shuudTulukh,
  qpayModal,
  billModal,
  setBillModal,
  isModalOpen,
  setIsModalOpen,
}) {
  const [tulburiinHelber, setTulburiinHelber] = useState("");
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [turulruuKhiikhDun, setTurulruuKhiikhDun] = useState("0");
  const [qpayModalTuluv, setQpayModalTuluv] = useState(false);
  const [qpayerTulukh, setQpayerTulukh] = useState("");
  const [loading, setLoading] = useState(false);
  const [qpayTulsun, setQpayTulsun] = useState(false);
  const [cartaarTulsun, setCartaarTulsun] = useState(false);
  const { token, ajiltan, baiguullagiinId, salbariinId, baiguullaga } =
    useAuth();
  const [cartAmjilttai, setCartAmjilttai] = useState(false);
  const [khariult, setKhariult] = useState();
  const [tulukhDun, setTulukhDun] = useState(0);
  const [butsaaltKhiisenEsekh, setButsaaltKhiisenEsekh] = useState(false);
  const [khariltsagchModal, setKhariltsagchModal] = useState(false);
  const [bonusAshiglakhEsekh, setBonusAshiglakhEsekh] = useState(false);
  const [zeelModalOpen, setZeelModalOpen] = useState(false);

  // useMemo(() => {
  //   const channels = {
  //     tulburTulukhModal: isModalOpen,
  //     khuleegdejBuiQpay: khuleegdejBuiQpay,
  //     loading: loading,
  //     qpayerTulukh: qpayerTulukh,
  //     qpayModalTuluv: qpayModalTuluv,
  //     cartAmjilttai: cartAmjilttai,
  //   };

  //   for (const [channelName, data] of Object.entries(channels)) {
  //     const channel = new BroadcastChannel(channelName);
  //     channel.postMessage(data);
  //   }
  // }, [
  //   isModalOpen,
  //   khuleegdejBuiQpay,
  //   loading,
  //   qpayerTulukh,
  //   qpayModalTuluv,
  //   cartAmjilttai,
  // ]);

  const router = useRouter();
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

  useEffect(() => {
    setTurulruuKhiikhDun(niitDunNoat.niitDun);
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
  }, [khariltsagchModal]);
  useEffect(() => {
    if (umnuhGuilgeeniiDun - niitDunNoat.niitDun > 0) {
      setTulukhDun();
      setKhariult(umnuhGuilgeeniiDun - niitDunNoat.niitDun);
    } else {
      setKhariult();
      setTulukhDun(Math.abs(umnuhGuilgeeniiDun - niitDunNoat.niitDun));
    }
  }, [umnuhGuilgeeniiDun, niitDunNoat, songogdsomEmnuud]);

  useKeyboardTovchlol("F4", f4Darsan);

  function f4Darsan() {
    if (!qpayModal) {
      if (!isModalOpen) {
        if (songogdsomEmnuud?.length === 0) {
          AldaaAlert("Бараа сонгоно уу!");
        } else if (songogdsomEmnuud?.some((item) => item.shirkheg === 0)) {
          AldaaAlert("Тоо ширхэг оруулаагүй байна.");
        } else if (
          songogdsomEmnuud?.some((item) => item.shirkheg > item.uldegdel)
        ) {
          AldaaAlert(
            `${
              songogdsomEmnuud.find((item) => item.shirkheg > item.uldegdel).ner
            } барааны үлдэгдэл хүрэлцэхгүй байна.`
          );
        } else {
          setIsModalOpen(true);
          setTurulruuKhiikhDun(niitDunNoat.niitDun);
        }
      } else {
        !loading;
        setShuudTulukh(true);
        onFinish();
      }
    }
  }

  function handleCancel() {
    setIsModalOpen(false);
    setKhariltsagchiinKhunglultUramshuulal();
    setQpayTulsun(false);
    setCartaarTulsun(false);
    setTulburiinHelber("");
    setSongogdsomEmnuud(songogdsomEmnuud);
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

  function handleCancelQpay() {
    setQpayModalTuluv(false);
  }

  const mungunDunNemekh = (newUneValue) => {
    setTurulruuKhiikhDun(turulruuKhiikhDun + newUneValue);
  };

  const hylbarNemekh = (newUneValue) => {
    setTurulruuKhiikhDun(
      parseInt(turulruuKhiikhDun || 0) + parseInt(newUneValue)
    );
  };

  const onFinish = () => {
    const novartic = songogdsomEmnuud.filter(
      (a) => !!a.emiinTurulManufacture && a.emiinTurulManufacture === "НОВАРТИС"
    );
    var hariult =
      turul.reduce((a, b) => a + (parseFloat(b.une) || 0), 0) -
      niitDunNoat.niitDun;
    // setLoading(true);
    var tulsunDun = turul.reduce((a, b) => a + (parseFloat(b.une) || 0), 0);
    if (tulsunDun >= niitDunNoat.niitDun) {
      var khariltsagch = khariltsagchiinKhunglultUramshuulal;
      if (
        !!khariltsagch?.bonus &&
        bonusAshiglakhEsekh?.ashiglakh === true &&
        bonusAshiglakhEsekh?.khuvi > 0
      ) {
        khariltsagch.bonus.nemegdsen =
          (Number(niitDunNoat.niitDun) / 100) *
          Number(bonusAshiglakhEsekh?.khuvi || 0);
        khariltsagch.bonus.nemegdsen = Number(
          khariltsagch.bonus.nemegdsen || 0
        );
        khariltsagch.bonus.nemegdsen =
          Math.round(
            (Number(khariltsagch.bonus.nemegdsen) + Number.EPSILON) * 100
          ) / 100;
      }

      const dataJor = !!hynaltiinDugaaraarLavlagaaAvakhData
        ? {
            receiptId: hynaltiinDugaaraarLavlagaaAvakhData.id, // getPrescription result id
            receiptNumber: hynaltiinDugaaraarLavlagaaAvakhData.receiptNumber, // Жорын дугаар
            insAmount: parseFloat(niitDunNoat.hungulsunDun.toFixed(2)), // Хөнгөлөлт
            paidAmount: tulsunDun,
            buyType: 1,
            reason: "",
            buyerId: hynaltiinDugaaraarLavlagaaAvakhData.patientRegNo, // Регистерийн дугаар
            issuerId: hynaltiinDugaaraarLavlagaaAvakhData.patientRegNo, // Регистерийн дугаар
          }
        : {};

      const data = {
        baiguullagiinId: baiguullagiinId,
        salbariinId: salbariinId,
        turul: "pos",
        tulsunDun: tulsunDun,
        hungulsunDun: parseFloat(niitDunNoat.hungulsunDun.toFixed(2)),
        noatiinDun: parseFloat(niitDunNoat.noat.toFixed(2)),
        noatguiDun: parseFloat(niitDunNoat.dun.toFixed(2)),
        hariult: tulsunDun - niitDunNoat.niitDun,
        niitUne: parseFloat(niitDunNoat.niitDun.toFixed(2)) || 0,
        khariltsagch: khariltsagch,
        guilgeeniiDugaar,
        emiinTurul: !!novartic && novartic.length > 0 ? "НОВАРТИС" : undefined,
        data: dataJor,
        baraanuud: songogdsomEmnuud.map((item) => {
          const { shirkheg, ...yavuulahItem } = item;
          return {
            baraa: yavuulahItem,
            tsuvral: item.zarakhTsuvral?.filter(
              (mur) => mur.too && mur.too != 0
            ),
            niitUne: (parseFloat(item.niitUne) * shirkheg || 0).toFixed(2),
            too: shirkheg,
            data:
              !!hynaltiinDugaaraarLavlagaaAvakhData && !!item.hungulsunDun
                ? {
                    insAmount: item.hungulsunDun,
                    detailId: item.detailId,
                    tbltId: item.tbltId,
                  }
                : {},
          };
        }),
        tulbur: turul
          .filter((item) => item.une !== "")
          .map((item) => ({
            turul: item.turul,
            ...(item.khariltsagchiinId
              ? { khariltsagchiinId: item?.khariltsagchiinId }
              : {}),
            une:
              item.turul === "belen"
                ? parseFloat(item.une || 0) - hariult
                : parseFloat(item.une || 0),
          })),
        ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
      };
      if (!!guilgeeniiId?.ognoo) {
        data.ognoo = guilgeeniiId.ognoo;
      }
      if (guilgeeniiId?._id && guilgeeniiId?.shineGuilgeeniiId) {
        data._id = guilgeeniiId?.shineGuilgeeniiId;
        data.bustaaltKhiikhId = guilgeeniiId?._id;
      }

      if (
        data.baraanuud &&
        Array.isArray(data.baraanuud) &&
        data.baraanuud?.length > 0
      ) {
        if (
          (data.baraanuud[0].baraa &&
            data.baraanuud[0].baraa.tsuvraliinDugaartaiEsekh !== undefined) ||
          data.baraanuud[0].baraa.ognooniiMedeelelBurtgekhEsekh !== undefined
        ) {
          if (!!bustaaltKhiikhId && !butsaaltKhiisenEsekh) {
            posUilchilgee(token)
              .post("/guilgeeButsaaltKhiiya", guilgeeniiId)
              .then((respone) => {
                if (respone.data === "Amjilttai") {
                  setButsaaltKhiisenEsekh(true);
                  posUilchilgee(token)
                    .post("/guilgeeniiTuukhKhadgalya", data)
                    .then(({ data, status }) => {
                      if (status === 200) {
                        setGuilgeeniiId(data);
                        setBustaaltKhiikhId();
                        setKhuleegdejBuiQpay();
                        setQpayerTulukh();
                        form.resetFields();
                        setShineSongogdsomEmnuud([]);
                        baraaMutate();
                        setSongogdsomEmnuud([]);
                        // setHynaltiinDugaaraarLavlagaaAvakhData();
                        setShineerBarimtiinDugaarAviya(true);
                        setQpayModalTuluv(false);
                        setLoading(false);
                        if (eBarimtShine) {
                          setQpayModal(true);
                        } else setBillModal(true);
                        AmjilttaiAlert("Амжилттай гүйлгээ хийгдлээ.");
                        setIsModalOpen(false);
                        setQpayTulsun(false);
                        setCartaarTulsun(false);
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
                        setButsaaltKhiisenEsekh(false);
                        router.replace({
                          pathname: router.pathname,
                        });
                      }
                    })
                    .catch((e) => {
                      aldaaBarigch(e);
                      setLoading(false);
                    });
                }
              })
              .catch((e) => {
                aldaaBarigch(e);
                setLoading(false);
              });
          } else {
            setLoading(true);
            posUilchilgee(token)
              .post("/guilgeeniiTuukhKhadgalya", data)
              .then(({ data, status }) => {
                if (status === 200) {
                  setGuilgeeniiId(data);
                  form.resetFields();
                  setShineSongogdsomEmnuud([]);
                  baraaMutate();
                  setKhuleegdejBuiQpay();
                  setQpayerTulukh();
                  setSongogdsomEmnuud([]);
                  setShineerBarimtiinDugaarAviya(true);
                  // setHynaltiinDugaaraarLavlagaaAvakhData();
                  setQpayModalTuluv(false);
                  setLoading(false);
                  if (eBarimtShine) {
                    setQpayModal(true);
                  } else setBillModal(true);
                  AmjilttaiAlert("Амжилттай гүйлгээ хийгдлээ.");
                  setIsModalOpen(false);
                  setKhariltsagchiinKhunglultUramshuulal();
                  setButsaaltKhiisenEsekh(false);
                  setQpayTulsun(false);
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
                  router.replace({
                    pathname: router.pathname,
                  });
                  setBustaaltKhiikhId();

                  setCartaarTulsun(false);
                }
              })
              .catch((e) => {
                aldaaBarigch(e);
                setLoading(false);
              });
          }
        } else {
          AldaaAlert("Алдаа");
          setLoading(false);
        }
      } else {
        AldaaAlert("Бараа сонгоогүй байна");
        setLoading(false);
      }
    } else {
      AnkhaaruulgaAlert("Төлбөрийн хэлбэр сонгоно уу");
      setLoading(false);
    }
  };

  const turulruuTooKhiikhFunction = async (v) => {
    var orjIrsenTurliinUne = 0;
    var odoogiinTurliinUne = await turul.reduce((a, b) => {
      return a + (parseFloat(b.une) || 0);
    }, 0);

    for (let i = 0; i < turul.length; i++) {
      if (turul[i].turul === v) {
        orjIrsenTurliinUne = turul[i].une;
      }
    }
    if (orjIrsenTurliinUne > niitDunNoat.niitDun && v !== "belen") {
      return AnkhaaruulgaAlert("Нийт төлөх дүнгээс их байж болохгүй");
    }
    if (odoogiinTurliinUne + turulruuKhiikhDun > niitDunNoat.niitDun) {
      if (turul.find((a) => a.turul === v).une.length === 0) {
        if (v !== "belen") {
          setTurulruuKhiikhDun(niitDunNoat.niitDun - odoogiinTurliinUne);
          return AnkhaaruulgaAlert("Нийт төлөх дүнгээс их байж болохгүй");
        }
      }
    }
    setTurul((prevTurul) =>
      prevTurul
        .map((item) => {
          return item.turul === v
            ? item.une > 0
              ? {
                  ...item,
                  une: "",
                }
              : {
                  ...item,
                  une:
                    turulruuKhiikhDun > 0 ? turulruuKhiikhDun.toString() : "",
                }
            : item;
        })
        .map(({ khariltsagchiinId, ...rest }) => rest)
    );
  };

  useEffect(() => {
    if (turul[4].une > 0) {
      setLoading(true);
      posUilchilgee(token)
        .post("/qpayGargaya", {
          dun: turulruuKhiikhDun,
          baiguullagiinId: baiguullagiinId,
          zakhialgiinDugaar: guilgeeniiDugaar + turulruuKhiikhDun,
        })
        .then(({ data }) => {
          setQpayModalTuluv(true);
          setQpayerTulukh(data.khariu);
          setLoading(false);
          setKhuleegdejBuiQpay(guilgeeniiDugaar + turulruuKhiikhDun);
        })
        .catch((e) => {
          aldaaBarigch(e);
          setLoading(false);
        });
    }
  }, [turul[4].une]);

  useEffect(() => {
    if (turul[1].une > 0 && cartAmjilttai === false) {
      setCartAmjilttai(true);

      axios
        .post(
          "http://127.0.0.1:27028",
          {
            service_name: "doSaleTransaction",
            service_params: {
              db_ref_no: moment().format("YYYYMMDDhhmmss00"),
              amount: String(turul[1].une),
              vaatps_bill_type: "1",
            },
          },
          {
            timeout: 60 * 10 * 1000,
          }
        )
        .then(({ data }) => {
          if (data.status === true) {
            AnkhaaruulgaAlert(data?.response?.response_msg);
            setTulbur(tulbur);
            // setCartAmjilttai(false);
          } else if (
            data.status === false &&
            data.response.Exception.ErrorCode === "003"
          ) {
            AnkhaaruulgaAlert("Нэг удаагийн гүйлгээний дүн хүрэхгүй");
          } else if (
            data.status === false &&
            data.response.Exception.ErrorCode === "003"
          ) {
            AnkhaaruulgaAlert("Нэг удаагийн гүйлгээний дүн хүрэхгүй");
          }
        })
        .catch((e) => {
          setTimeout(() => {
            setCartAmjilttai(false);
          }, 500);
        })
        .finally(() => {
          setTimeout(() => {
            setCartAmjilttai(false);
          }, 500);
        });
    }
  }, [turul[1].une]);

  useEffect(() => {
    if (turul[3].une > 0) {
      setZeelModalOpen(true);
    }
  }, [turul[3].une]);

  useEffect(() => {
    if (
      turul.reduce((a, b) => {
        return a + (parseFloat(b.une) || 0);
      }, 0) < niitDunNoat.niitDun
    ) {
      setTurulruuKhiikhDun(
        niitDunNoat.niitDun -
          turul
            .reduce((a, b) => {
              return a + (parseFloat(b.une) || 0);
            }, 0)
            .toString()
      );
    } else if (
      niitDunNoat.niitDun -
        turul.reduce((a, b) => {
          return a + (parseFloat(b.une) || 0);
        }, 0) <=
      0
    ) {
      setTurulruuKhiikhDun("0");
    }
  }, [turul]);

  useEffect(() => {
    if (
      qpayModalTuluv === false &&
      qpayerTulukh === "Tulugdsun" &&
      turul[4].une == niitDunNoat.niitDun &&
      turul[0].une === "" &&
      turul[1].une === "" &&
      turul[2].une === "" &&
      turul[3].une === ""
    ) {
      onFinish();
    }
  }, [qpayerTulukh, turul, qpayModalTuluv]);
  useKeyboardTovchlol("F9", onFinish);
  useKeyboardTovchlol("F10", () => setKhariltsagchModal(true));
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
      <button
        onClick={() => {
          if (songogdsomEmnuud?.length === 0) {
            AldaaAlert("Бараа сонгоно уу!");
          } else if (songogdsomEmnuud?.some((item) => item.shirkheg === 0)) {
            AldaaAlert("Тоо ширхэг оруулаагүй байна.");
          } else if (
            songogdsomEmnuud?.some((item) => item.shirkheg > item.uldegdel)
          ) {
            AldaaAlert(
              `${
                songogdsomEmnuud.find((item) => item.shirkheg > item.uldegdel)
                  .ner
              } барааны үлдэгдэл хүрэлцэхгүй байна.`
            );
            scrollToUldegdelguiItem();
          } else {
            setIsModalOpen(true);
            setTurulruuKhiikhDun(niitDunNoat.niitDun);
            setSongogdsomEmnuud(songogdsomEmnuud);
          }
        }}
        type="primary"
        id="tulburTulukhTovch"
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#4FD1C5] text-[15px] font-[600] text-white  shadow-xl xl:h-12 xl:!text-[15px]"
      >
        Төлбөр төлөх [F4]
      </button>
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
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div className="flex h-[full] w-full flex-col gap-[60px] p-11 pb-0 xl:h-[750px]">
          <div className="flex h-[full] w-full items-center justify-center gap-10 ">
            <div className="flex h-full w-[50%] flex-col items-center justify-center gap-5  ">
              <div className="flex gap-8">
                <div
                  onClick={() => turulruuTooKhiikhFunction("belen")}
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "belen"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}
                >
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
                  onClick={() => turulruuTooKhiikhFunction("cart")}
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "cart"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}
                >
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
                  onClick={() => turulruuTooKhiikhFunction("khariltsakh")}
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "khariltsakh"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}
                >
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
                  onClick={() => turulruuTooKhiikhFunction("zeel")}
                  style={{ backgroundColor: "rgba(00, 000, 000, 0.0)" }}
                  className={`relative flex h-[50px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl xl:h-[85px] ${
                    tulburiinHelber === "zeel"
                      ? "border-[3px] border-[#4FD1C5]"
                      : null
                  } `}
                >
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

            <div className="flex h-full w-[75%] flex-col justify-center gap-4  ">
              <div className="flex gap-[48px]">
                <div
                  className={`${
                    tulburiinHelber === "qpay" &&
                    "overflow-hidden rounded-3xl border-[3px] border-[#4FD1C5]"
                  } relative h-[55px] w-[60px] hover:scale-110 xl:h-[85px] xl:w-[100px] `}
                  onClick={() => {
                    turulruuTooKhiikhFunction("qpay");
                  }}
                >
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
                  baiguullagiinId={baiguullagiinId}
                  salbariinId={salbariinId}
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
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px] xl:w-[100px]`}
                >
                  <Image
                    id="SocialPay"
                    preview={false}
                    src="/Rectangle60.png"
                  />
                </div>
                <div
                  className={`hover:scale-110" h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl xl:h-[90px] xl:w-[100px]`}
                >
                  <Image preview={false} src="/Toki1.png" />
                </div>
              </div>

              <div className="flex gap-[48px]">
                <div
                  className={`hover:scale-110" h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl xl:h-[90px] xl:w-[100px]`}
                >
                  <Image preview={false} src="/Rectangle66.png" />
                </div>
                <div
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px] xl:w-[100px]`}
                >
                  <Image preview={false} src="/Rectangle81.png" />
                </div>
                {/* <div
                  className={`h-[55px] w-[60px] cursor-not-allowed overflow-hidden rounded-3xl hover:scale-110 xl:h-[90px]  xl:w-[100px]`}>
                  <Image preview={false} src="/Rectangle83.png" />
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex h-[320px] justify-between gap-4 xl:h-[400px] ">
            <div className="flex h-full w-[186px] flex-col gap-2 dark:text-gray-300">
              <div className="flex h-full w-[186px] flex-col gap-4">
                <div
                  onClick={() => hylbarNemekh("20000")}
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white xl:h-[53px]"
                >
                  <div className="font-bold">{formatNumber(20000)}</div>
                </div>
                <div
                  onClick={() => hylbarNemekh("10000")}
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white xl:h-[53px]"
                >
                  <div className="font-bold">{formatNumber(10000)}</div>
                </div>
                <div
                  onClick={() => hylbarNemekh("5000")}
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white xl:h-[53px]"
                >
                  <div className="font-bold">{formatNumber(5000)}</div>
                </div>
                <div
                  onClick={() => hylbarNemekh("1000")}
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white xl:h-[53px]"
                >
                  <div className="font-bold">{formatNumber(1000)}</div>
                </div>
                <div
                  onClick={() => hylbarNemekh("500")}
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white xl:h-[53px]"
                >
                  <div className="font-bold">{formatNumber(500)}</div>
                </div>
              </div>
              <div
                onClick={() => {
                  setIsModalOpen(false);
                  setKhariltsagchiinKhunglultUramshuulal();
                }}
                style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                className="flex h-[40px] cursor-pointer items-center justify-center rounded-xl border-[1px] border-[#FF4646] shadow-xl hover:bg-[#FF4646] hover:text-white xl:h-[57px]"
              >
                <div className="font-bold text-[#FF4646]">Цуцлах [ESC]</div>
              </div>
            </div>

            <div className="flex h-full w-[45%] flex-col items-center gap-5">
              <div className="flex h-[25px] w-[186px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#4FD1C5]  xl:h-[53px] xl:w-[256px]">
                <div className="truncate text-[15px] font-bold text-[#00A35E] xl:text-[32px]">
                  {formatNumber(turulruuKhiikhDun)}₮
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 dark:text-gray-300">
                <div
                  onClick={() => mungunDunNemekh("1")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  1
                </div>
                <div
                  onClick={() => mungunDunNemekh("2")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  2
                </div>
                <div
                  onClick={() => mungunDunNemekh("3")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  3
                </div>
                <div
                  onClick={() => mungunDunNemekh("4")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  4
                </div>
                <div
                  onClick={() => mungunDunNemekh("5")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  5
                </div>
                <div
                  onClick={() => mungunDunNemekh("6")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  6
                </div>
                <div
                  onClick={() => mungunDunNemekh("7")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  7
                </div>
                <div
                  onClick={() => mungunDunNemekh("8")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  8
                </div>
                <div
                  onClick={() => mungunDunNemekh("9")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  9
                </div>
                <div
                  onClick={() => setTurulruuKhiikhDun("")}
                  style={{ backgroundColor: "rgba(255, 92, 0, 0.1)" }}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#FF5C00] text-[32px] font-bold text-[#FF5C00] xl:h-[70px] xl:w-[30%]"
                >
                  <svg
                    width="19"
                    height="24"
                    viewBox="0 0 19 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.08 1.688C17.6347 1.96533 17.9547 2.40267 18.04 3C18.1467 3.59733 17.9973 4.14133 17.592 4.632C17.3147 5.016 16.952 5.22933 16.504 5.272C16.0773 5.31467 15.64 5.22933 15.192 5.016C14.68 4.78133 14.136 4.6 13.56 4.472C13.0053 4.344 12.4187 4.28 11.8 4.28C10.648 4.28 9.61333 4.46133 8.696 4.824C7.8 5.18667 7.032 5.70933 6.392 6.392C5.752 7.05333 5.26133 7.84267 4.92 8.76C4.6 9.67733 4.44 10.6907 4.44 11.8C4.44 13.1013 4.62133 14.232 4.984 15.192C5.368 16.152 5.89067 16.952 6.552 17.592C7.21333 18.232 7.992 18.712 8.888 19.032C9.784 19.3307 10.7547 19.48 11.8 19.48C12.376 19.48 12.952 19.4267 13.528 19.32C14.104 19.2133 14.6587 19.0213 15.192 18.744C15.64 18.5307 16.0773 18.456 16.504 18.52C16.952 18.584 17.3253 18.808 17.624 19.192C18.0507 19.7253 18.2 20.28 18.072 20.856C17.9653 21.4107 17.6453 21.816 17.112 22.072C16.5573 22.3493 15.9813 22.584 15.384 22.776C14.808 22.9467 14.2213 23.0747 13.624 23.16C13.0267 23.2667 12.4187 23.32 11.8 23.32C10.264 23.32 8.80267 23.0747 7.416 22.584C6.05067 22.0933 4.824 21.368 3.736 20.408C2.66933 19.448 1.82667 18.2533 1.208 16.824C0.589333 15.3733 0.28 13.6987 0.28 11.8C0.28 10.1573 0.557333 8.64267 1.112 7.256C1.688 5.86933 2.488 4.67467 3.512 3.672C4.55733 2.648 5.784 1.85867 7.192 1.304C8.6 0.727999 10.136 0.439999 11.8 0.439999C12.7387 0.439999 13.656 0.546665 14.552 0.759998C15.448 0.973331 16.2907 1.28267 17.08 1.688Z"
                      fill="#FF5C00"
                    />
                  </svg>
                </div>
                <div
                  onClick={() => mungunDunNemekh("0")}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#4FD1C5] text-[32px] font-bold hover:bg-[#4FD1C5] hover:text-white xl:h-[70px] xl:w-[30%]"
                >
                  0
                </div>
                <div
                  onClick={() =>
                    setTurulruuKhiikhDun(
                      turulruuKhiikhDun.toString().slice(0, -1)
                    )
                  }
                  style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                  className="flex h-[57px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#FF4646] xl:h-[70px] xl:w-[30%]"
                >
                  <svg
                    width="37"
                    height="23"
                    viewBox="0 0 37 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32.6873 7.31748e-08H11.6484C11.1714 -9.63208e-05 10.699 0.0950439 10.2583 0.279982C9.81763 0.46492 9.41722 0.73603 9.08002 1.07781L0.532016 9.73594C-0.177339 10.4545 -0.177339 11.6191 0.532016 12.3371L9.08002 20.9958C9.761 21.6856 10.6849 22.0736 11.6479 22.0736H32.6873C34.6934 22.0736 36.3192 20.4267 36.3192 18.3946V3.67893C36.3192 1.6469 34.6934 7.31748e-08 32.6873 7.31748e-08ZM27.8813 14.6042C28.236 14.9635 28.236 15.5458 27.8813 15.905L26.5977 17.2053C26.243 17.5646 25.6681 17.5646 25.3134 17.2053L21.7916 13.6379L18.2698 17.2053C17.9152 17.5646 17.3403 17.5646 16.9856 17.2053L15.702 15.905C15.3473 15.5458 15.3473 14.9635 15.702 14.6042L19.2238 11.0368L15.702 7.46938C15.3473 7.11011 15.3473 6.5278 15.702 6.16853L16.9856 4.86826C17.3403 4.50899 17.9152 4.50899 18.2698 4.86826L21.7916 8.43567L25.3134 4.86826C25.6681 4.50899 26.243 4.50899 26.5977 4.86826L27.8813 6.16853C28.236 6.5278 28.236 7.11011 27.8813 7.46938L24.3595 11.0368L27.8813 14.6042Z"
                      fill="#FF4646"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex h-full w-[246px] flex-col items-center gap-3">
              <div className="flex h-fit w-[100%] flex-col justify-between rounded-[25px] border-2 border-dotted border-[#4FD1C5] p-5 pt-2 dark:text-gray-300 xl:h-[500px]">
                <div className="flex w-full justify-between text-[10px] font-semibold xl:text-[16px]">
                  <div>Захиалгын :</div>
                  <div>{guilgeeniiDugaar}</div>
                </div>
                <div className="flex flex-col gap-2 text-[10px] font-semibold xl:text-[16px]">
                  <div className="flex w-full justify-between">
                    <div>ХӨНГӨЛӨЛТ:</div>
                    <div>{formatNumber(niitDunNoat.hungulsunDun, 2)}₮</div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div>НӨАТ:</div>
                    <div>
                      {baiguullaga?.tokhirgoo?.eBarimtShine
                        ? formatNumber(niitDunNoat.noat, 2)
                        : 0}
                      ₮
                    </div>
                  </div>
                  <div className="flex w-full justify-between font-semibold">
                    <div>Нийт дүн:</div>
                    <div>{formatNumber(niitDunNoat.niitDun, 2)}₮</div>
                  </div>
                  {!!params && (
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
                  )}
                </div>
                <div className="flex w-full justify-between text-[10px] font-semibold text-[#00A35E] xl:text-[16px]">
                  <div>Хариулт:</div>
                  <div>
                    {formatNumber(
                      !!params
                        ? khariult
                        : turul.reduce(
                            (a, b) => a + (parseFloat(b.une) || 0),
                            0
                          ) -
                            niitDunNoat.niitDun <
                          0
                        ? 0
                        : turul.reduce(
                            (a, b) => a + (parseFloat(b.une) || 0),
                            0
                          ) - niitDunNoat.niitDun,
                      2
                    )}
                    ₮
                  </div>
                </div>
              </div>
              <div className="flex h-full w-full flex-col items-center justify-end gap-4">
                <button
                  onClick={() => setKhariltsagchModal(true)}
                  type="primary"
                  className="h-[37px] w-[186px] rounded-[15px] border border-[#4FD1C5] text-[#4FD1C5] shadow-xl xl:h-[57px]"
                >
                  {khariltsagchiinKhunglultUramshuulal?.ner
                    ? khariltsagchiinKhunglultUramshuulal?.ner
                    : "Хөнгөлөлт [F10]"}
                </button>
                <button
                  onClick={loading ? null : onFinish}
                  type="primary"
                  className="h-[37px] w-[186px] rounded-[15px] border border-[#4FD1C5] text-[#4FD1C5] shadow-xl xl:h-[57px]"
                >
                  Хадгалах [F9]
                </button>
                <button
                  onClick={() => {
                    if (!loading) {
                      setShuudTulukh(true);
                      onFinish();
                    }
                  }}
                  type="primary"
                  className="h-[37px] w-[186px] rounded-[15px] bg-[#4FD1C5] text-white shadow-xl xl:h-[57px]"
                >
                  Шууд хадгалах [F4]
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <CartLoading
        setCartAmjilttai={setCartAmjilttai}
        cartAmjilttai={cartAmjilttai}
      />
      <ZeelModal
        setTurulruuKhiikhDun={setTurulruuKhiikhDun}
        turulruuKhiikhDun={turulruuKhiikhDun}
        turul={turul}
        setTurul={setTurul}
        baiguullagiinId={baiguullagiinId}
        setZeelModalOpen={setZeelModalOpen}
        zeelModalOpen={zeelModalOpen}
        token={token}
      />
      <PosKhariltsagchModal
        bonusAshiglakhEsekh={bonusAshiglakhEsekh}
        token={token}
        khariltsagchModal={khariltsagchModal}
        setKhariltsagchiinKhunglultUramshuulal={
          setKhariltsagchiinKhunglultUramshuulal
        }
        khariltsagchiinKhunglultUramshuulal={
          khariltsagchiinKhunglultUramshuulal
        }
        setKhariltsagchModal={setKhariltsagchModal}
        baiguullagiinId={baiguullagiinId}
        baiguullaga={baiguullaga}
      />
    </div>
  );
}
export default TulburTuluhModal;
