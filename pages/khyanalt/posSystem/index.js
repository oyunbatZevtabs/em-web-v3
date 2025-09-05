import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  DollarCircleOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Drawer, Form, Image, Popover, Switch, Tooltip } from "antd";
import moment from "moment";
import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
  SwipeableList,
} from "react-swipeable-list";
import _, { forEach } from "lodash";
import { FaCartArrowDown } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { IoGiftOutline } from "react-icons/io5";
import "react-swipeable-list/dist/styles.css";
import useScanDetection from "use-scan-detection";
// import { BroadcastChannel } from "broadcast-channel";

import formatNumber from "tools/function/formatNumber";
import TulburTuluhModal from "components/modalBody/posSystem/tulburTuluhModal";
import Table from "components/ant/AntdTable";
import {
  ActionContent,
  ItemColumnCentered,
} from "components/swipeableItem/styledComponents";
import useBaraa from "hooks/useBaraa";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch, posUrl } from "services/posUilchilgee";
import useGuilgeeniiTuukh from "hooks/guilgeeniiTuukh";
import deleteMethod from "tools/function/crud/deleteMethod";
import TsuwraliinDugaarSongokh from "components/modalBody/posSystem/tsuwraliinDugaarSongokh";
import EBarimtModal from "components/modalBody/posSystem/eBarimt";
import TsahimJorModal from "components/modalBody/posSystem/tsahimJorModal";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AngilalSongokhModal from "components/modalBody/posSystem/angilalSongokhModal";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import tooOronKhyazgaarliy from "tools/function/tooOronKhyazgaarliy";
import KhemjikhNegjUurchlukh from "components/modalBody/posSystem/khemjikhNegjUurchlukh";
import TooShirkhegInput from "components/ant/AntdInput";
import UramshuulalModal from "components/modalBody/posSystem/uramshuulal";
import useDansKhuulga from "hooks/useDansKhuulga";
import useSuuliinKhaaltOgnooAvya from "hooks/useSuuliinKhaaltOgnooAvya";
import BelegSongokhModal from "components/modalBody/posSystem/belegsongokh";
import Khaalt from "components/modalBody/posSystem/khaalt";
import styles from "./styles.module.css";
import { usePosData } from "services/uilchluulegchPosData";
import Bill from "components/modalBody/posSystem/bill";
import posUseJagsaalt from "hooks/posUseJagsaalt";

const order = { createdAt: -1 };

function ButeegdekhuunBurtgel({ token }) {
  const isLocalStorageAvailable = typeof localStorage !== "undefined";
  const [id, setId] = useState();
  const [songogdsomEmnuud, setSongogdsomEmnuud] = useState([]);
  const [songogdsonKhudaldaa, setSongogdsonKhudaldaa] = useState("khudaldakh");
  const [huleeldendBaigaaItem, setHuleeldendBaigaaItem] = useState();
  const [guilgeeniiDugaar, setGuilgeeniiDugaar] = useState();
  const [guilgeeniiId, setGuilgeeniiId] = useState();
  const [umnuhGuilgeeniiDun, setUmnuhGuilgeeniiDun] = useState();
  const [qpayModal, setQpayModal] = useState(false);
  const { ajiltan, baiguullaga, baiguullagiinId, salbariinId } = useAuth();
  const salbar = useMemo(
    () => baiguullaga?.salbaruud?.find((a) => a._id === salbariinId),
    [baiguullaga, salbariinId]
  );
  const [baiguullagaTatvar, setBaiguullagaTatvar] = useState();
  const [dussanBaraagKharakh, setDussanBaraagKharakh] = useState(false);
  const [idevkhteiEsekh, setidevkhteiEsekh] = useState(false);
  const [shineSongogdsomEmnuud, setShineSongogdsomEmnuud] = useState([]);
  const [bustaaltKhiikhId, setBustaaltKhiikhId] = useState();
  const [songojAvsanAngilal, setSongojAvsanAngilal] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [zadlakhToo, setZadlakhToo] = useState("0");
  const [uramshuulal, setUramshuulal] = useState([]);
  const [songokhBelegnuud, setSongokhBelegnuud] = useState([]);
  const [songogdsonBelegnuud, setSongogdsonBelegnuud] = useState([]);
  const [billModal, setBillModal] = useState(false);
  const [isModalOpenTulbur, setIsModalOpenTulbur] = useState(false);

  const [
    khariltsagchiinKhunglultUramshuulal,
    setKhariltsagchiinKhunglultUramshuulal,
  ] = useState();
  const [guilgeeDrawerOpen, setGuilgeeDrawerOpen] = useState(false);
  const [guilgeeKharakh, setGuilgeeKharakh] = useState(false);
  const [shuudTulukh, setShuudTulukh] = useState(false);
  const [baraaNUATModalOpen, setBaraaNUATModalOpen] = useState(
    salbar?.tokhirgoo?.borluulaltNUAT
  );
  const [servereesAvsanUnuuduriinTsag, setServereesAvsanUnuuduriinTsag] =
    useState();
  const [khaalModal, setKhaalModal] = useState(false);
  const { setPosData } = usePosData();
  const [shineerBarimtiinDugaarAviya, setShineerBarimtiinDugaarAviya] =
    useState(true);
  const [
    hynaltiinDugaaraarLavlagaaAvakhData,
    setHynaltiinDugaaraarLavlagaaAvakhData,
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

  const scrollRef = useRef(null);
  const divRev = useRef(null);
  const lastInputRef = useRef(null);
  const router = useRouter();
  const [form] = Form.useForm();
  const params = router.query.params;
  const [turulruuKhiikhDun, setTurulruuKhiikhDun] = useState("0");
  const tsagOchigdor = new Date();
  tsagOchigdor.setDate(tsagOchigdor.getDate() - 1);
  const niitDunNoat = useMemo(() => {
    var niitDun = 0;
    var noat = 0;
    var dun = 0;
    var hungulsunDun = 0;
    var bonusHungulult = 0;
    var nhat = 0;
    var count = 0;

    songogdsomEmnuud.map((e, i) => {
      e.zarsanNiitUne = e.shirkheg * e.niitUne - (e.hungulsunDun || 0);

      if (e.zarsanNiitUne > 0) {
        var tempKhuvi = 0;
        var huwiHungulult = 0;

        if (
          khariltsagchiinKhunglultUramshuulal?.khunglult?.khunglultiinTurul ===
            "Хувь" &&
          khariltsagchiinKhunglultUramshuulal?.khunglult?.khuvi > 0
        )
          tempKhuvi = khariltsagchiinKhunglultUramshuulal?.khunglult?.khuvi;

        if (tempKhuvi > 0) {
          huwiHungulult = (e.zarsanNiitUne / 100) * tempKhuvi;
          hungulsunDun += huwiHungulult;
          e.zarsanNiitUne -= huwiHungulult;
        }
      }
      e.noatiinDun = 0;

      if (e.noatBodohEsekh === true) {
        e.noatiinDun = e.zarsanNiitUne / 1.1 / 10;
        noat += e.noatiinDun;
      }

      niitDun += e.zarsanNiitUne;
      hungulsunDun += e.hungulsunDun || 0;
      if (khariltsagchiinKhunglultUramshuulal?.bonus?.ashiglasan > 0) {
        e.zarsanNiitUne -=
          khariltsagchiinKhunglultUramshuulal?.bonus?.ashiglasan /
          songogdsomEmnuud.length;
      }
      if (
        khariltsagchiinKhunglultUramshuulal?.khunglult?.khunglultiinTurul ===
          "Мөнгөн дүн" &&
        khariltsagchiinKhunglultUramshuulal?.khunglult?.dun > 0
      ) {
        e.zarsanNiitUne -=
          khariltsagchiinKhunglultUramshuulal?.khunglult?.dun /
          songogdsomEmnuud.length;
      }
    });

    if (
      khariltsagchiinKhunglultUramshuulal?.khunglult?.khunglultiinTurul ===
        "Мөнгөн дүн" &&
      khariltsagchiinKhunglultUramshuulal?.khunglult?.dun > 0
    ) {
      var voucherDiscount = khariltsagchiinKhunglultUramshuulal?.khunglult?.dun;
      hungulsunDun += voucherDiscount;
      niitDun -= voucherDiscount;
    }

    if (khariltsagchiinKhunglultUramshuulal?.bonus?.ashiglasan > 0) {
      hungulsunDun += khariltsagchiinKhunglultUramshuulal?.bonus?.ashiglasan;
      niitDun -= khariltsagchiinKhunglultUramshuulal?.bonus?.ashiglasan;
    }

    noat = Math.abs(niitDun / 1.1 / 10);
    dun = niitDun - noat - nhat;
    setTurulruuKhiikhDun(niitDun);
    // setSongogdsomEmnuud((prev) =>
    //   prev.map((item) =>
    //     item.id === id ? { ...item, zarsanNiitUne: niitUne } : item
    //   )
    // );
    return { niitDun, noat, dun, hungulsunDun, nhat };
  }, [
    songogdsomEmnuud,
    khariltsagchiinKhunglultUramshuulal,
    baraaNUATModalOpen,
    isModalOpenTulbur,
  ]);

  const {
    dansniiKhuulgaGaralt,
    dansniiKhuulgaMutate,
    isValidating: dansKhuleelt,
  } = useDansKhuulga(
    token,
    baiguullaga?._id,
    undefined,
    [
      moment().subtract(30, "days").format("YYYY-MM-DD 00:00:00"),
      moment().format("YYYY-MM-DD 23:59:59"),
    ],
    { createdAt: -1 },
    undefined
  );

  function barCodeAshiglanNemekh(code) {
    if (code && String(code).match(/^\d+$/)) {
      if (songogdsomEmnuud.some((e) => e.barCode === code)) {
        divRev.current.focus();
        const updatedSongogdsomEmnuud = songogdsomEmnuud.map((baraa) => {
          if (baraa.barCode === code) {
            incrementShirkhegTsuvral(baraa);
          }
          return baraa;
        });
        setSongogdsomEmnuud(updatedSongogdsomEmnuud);
      } else {
        posUilchilgee(token)
          .post("/barCodeoorBaraaAvya", {
            baiguullagiinId: baiguullagiinId,
            salbariinId: salbariinId,
            barCode: code,
          })
          .then(({ data }) => {
            const songogdson = songogdsomEmnuud.find((a) => a._id === data._id);
            if (!songogdson) {
              emSongokh(data, { focuslahgui: true });
            } else if (data.tsuvraliinDugaartaiEsekh === true) {
              incrementShirkhegTsuvral(songogdson);
            } else incrementShirkheg(songogdson._id);
          })
          .catch((err) => aldaaBarigch(err));
      }
    }
  }

  if (typeof window !== "undefined") {
    useScanDetection({
      minLength: 8,
      onComplete: (code) => {
        divRev.current.focus();
        barCodeAshiglanNemekh(code);
      },
    });
  }

  async function uramshuulalShalgakh(emnuud, shine) {
    let yavlakhData = {
      songogdsonEmnuud: emnuud,
      baiguullagiinId,
      songogdsonBelegnuud: songogdsonBelegnuud,
      salbariinId,
    };
    if (!!shine) {
      yavlakhData.songogdsonBelegnuud = shine;
    }
    await posUilchilgee(token)
      .post("/uramshuulalShalgay", yavlakhData)
      .then(({ data, status }) => {
        if (data) {
          for (const mur of data.songogdsonEmnuud) {
            if (!mur.uramshuulaliinId) {
              var too =
                data.songogdsonEmnuud.find(
                  (a) => !!a.uramshuulaliinId && a.code === mur.code
                )?.shirkheg || 0;
              var maxShirkheg = mur?.uldegdel - too;
              mur.maxShirkheg = maxShirkheg;
            }
          }
          setSongogdsomEmnuud(data.songogdsonEmnuud);
          if (data.songokhBelegnuud?.length > 0) {
            setSongokhBelegnuud(data.songokhBelegnuud);
          } else if (songokhBelegnuud.length > 0) {
            setSongokhBelegnuud([]);
          }
          if (songogdsonBelegnuud?.length > 0) {
            var shine = songogdsonBelegnuud?.filter(
              (a) =>
                !!data.songogdsonEmnuud.find(
                  (b) =>
                    b.uramshuulaliinId === a.uramshuulaliinId &&
                    b.code === a.code
                )
            );
            setSongogdsonBelegnuud([...shine]);
          }
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }
  useEffect(() => {
    if (!!params) {
      posUilchilgee(token)
        .get(`/guilgeeniiTuukh/${params}`)
        .then(({ data }) => {
          var extractedBaraaArray = [];
          for (const item of data?.baraanuud) {
            item.baraa.shirkheg = item.too;
            extractedBaraaArray.push(item.baraa);
          }
          var uramshuulal = extractedBaraaArray?.filter(
            (a) => !!a.uramshuulaliinId
          );
          setUmnuhGuilgeeniiDun(
            data.umnuhGuilgeeniiDun || data.umnukhGuilgeeniiDun
          );
          setSongogdsonBelegnuud(uramshuulal);
          setBustaaltKhiikhId(data.bustaaltKhiikhId);
          uramshuulalShalgakh(extractedBaraaArray, uramshuulal);
          setGuilgeeniiDugaar(data.guilgeeniiDugaar);
          setGuilgeeniiId({
            _id: data.bustaaltKhiikhId,
            shineGuilgeeniiId: data._id,
            shaltgaan: data.tsutslagdsanShaltgaan,
            ognoo: data.ognoo,
          });
        });
    }
  }, [params]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      if (event.key === "F8") {
        setKhaalModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    var khudaldakh =
      localStorage.getItem("dussanBaraagKharakh") === "true" ? true : false;
    setDussanBaraagKharakh(khudaldakh);
  }, []);

  useEffect(() => {
    var khudaldakh =
      localStorage.getItem("idevkhteiBaraagKharakh") === "true" ? true : false;
    setidevkhteiEsekh(khudaldakh);
  }, []);

  const queryAguulakh = useMemo(() => {
    const query = {};
    if (dussanBaraagKharakh === false) {
      query.uldegdel = { $gt: 0 };
    }
    if (idevkhteiEsekh === false) {
      query.idevkhteiEsekh = { $ne: false };
    }
    if (!!id) {
      query.angilal = id;
    }
    if (songojAvsanAngilal.length > 0) {
      query.angilal = { $in: songojAvsanAngilal };
    }
    return query;
  }, [dussanBaraagKharakh, id, songojAvsanAngilal]);

  const query = useMemo(() => {
    var qeury = {
      tuluv: 0,
    };

    return qeury;
  }, [songogdsonKhudaldaa]);

  const suuliinKhaaltOgnooQuery = useMemo(() => {
    var qeury = {
      turul: "pos",
      salbariinId: salbariinId,
      burtgesenAjiltan: ajiltan?._id,
    };

    return qeury;
  }, [salbariinId, ajiltan]);

  const { jagsaalt, next, baraaMutate, setBaraaniiKhuudaslalt, isLoading } =
    useBaraa(token, baiguullagiinId, undefined, queryAguulakh, order);

  const { guilgeeniiTuukhGaralt, guilgeeniiTuukhGaraltMutate } =
    useGuilgeeniiTuukh(token, 100, query);

  const { suuliinKhaaltOgnooData, suuliinKhaaltOgnooAvyaMutate } =
    useSuuliinKhaaltOgnooAvya(token, suuliinKhaaltOgnooQuery);

  useEffect(() => {
    posUilchilgee(token)
      .post("/servereesTsagAvyaa")
      .then(({ data }) => {
        if (!!data) {
          setServereesAvsanUnuuduriinTsag(moment(data).format("YYYY-MM-DD"));
        }
      });
  }, []);

  const huleelgey = () => {
    const data = {
      baiguullagiinId: baiguullagiinId,
      salbariinId: salbariinId,
      turul: "pos",
      noatiinDun: parseFloat(niitDunNoat.noat.toFixed(2)),
      noatguiDun: parseFloat(niitDunNoat.dun.toFixed(2)),
      niitUne: parseFloat(niitDunNoat.niitDun) || 0,
      guilgeeniiDugaar,
      baraanuud: songogdsomEmnuud.map((item) => {
        const { shirkheg, ...yavuulahItem } = item;
        return {
          tsuvral: item?.zarakhTsuvral,
          baraa: yavuulahItem,
          niitUne: item.niitUne * shirkheg,
          too: shirkheg || 0,
        };
      }),
      tulbur: [],
      ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
    };

    {
      data.baraanuud?.length !== 0
        ? posUilchilgee(token)
            .post("/guilgeeniiTuukhKhadgalya", data)
            .then(({ data }) => {
              if (data) {
                setSongogdsomEmnuud([]);
                setShineerBarimtiinDugaarAviya(true);
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            })
        : AnkhaaruulgaAlert("Бараа хоосон байна");
    }
  };

  function addInputValue(
    mur,
    value,
    functionDotorAshiglakhShirkheg,
    zadlakhTooButarhai
  ) {
    const updatedSongogdsomEmnuud = songogdsomEmnuud;
    if (mur.shirkheglekhEsekh && !!value) {
      setZadlakhToo(
        parseFloat(value) * parseFloat(mur?.negKhairtsaganDahiShirhegiinToo)
      );
    }
    var uramshuulaliinToo = 0;
    for (const el of updatedSongogdsomEmnuud) {
      if (el._id === mur._id) {
        if (el.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        mur.zarakhTsuvral = [];
        var too = 0;
        if (zadlakhTooButarhai != 0 && !!zadlakhTooButarhai) {
          too = parseFloat(zadlakhTooButarhai);
          value = parseFloat(zadlakhTooButarhai);
        }
        if (value != 0 && !!value) {
          too = value;
        }
        var filterlsen = el.tsuvral?.filter(
          (a) => parseFloat(a.uldegdel) > 0 && a.uldegdel != null
        );
        var sortolson = filterlsen.sort((a, b) =>
          moment(a?.duusakhOgnoo || a?.huleejAvsanOgnoo).isBefore(
            moment(b?.duusakhOgnoo || b?.huleejAvsanOgnoo)
          )
            ? -1
            : 1
        );

        el.zadlakhToo = mur.shirkheglekhEsekh
          ? functionDotorAshiglakhShirkheg
          : value * mur?.negKhairtsaganDahiShirhegiinToo;
        el.zadlakhTooButarhai = zadlakhTooButarhai;
        el.shirkheg =
          zadlakhTooButarhai !== 0 && !!zadlakhTooButarhai
            ? parseFloat(zadlakhTooButarhai)
            : value != 0 && !!value
            ? value
            : 0;

        el.zarsanNiitUne =
          functionDotorAshiglakhShirkheg != "0" &&
          !!functionDotorAshiglakhShirkheg
            ? el.khunglukhEsekh === true
              ? parseFloat(mur.niitUne) * parseFloat(value || 1) -
                functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : (parseFloat(mur.niitUne) /
                  parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 1)) *
                parseFloat(functionDotorAshiglakhShirkheg || 1)
            : value <= mur.uldegdel
            ? value * el.niitUne -
              value *
                (el.khunglukhEsekh === true
                  ? el.emiinShirkhegiinKhunglukhDun
                  : 0)
            : mur.uldegdel * el.niitUne -
              mur.uldegdel *
                (el.khunglukhEsekh === true
                  ? el.emiinShirkhegiinKhunglukhDun
                  : 0);

        el.hungulsunDun =
          value <= mur.uldegdel && el.khunglukhEsekh
            ? mur.shirkheglekhEsekh
              ? functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : value * el.emiinShirkhegiinKhunglukhDun
            : mur.uldegdel * el.emiinShirkhegiinKhunglukhDun;

        sortolson.forEach((element) => {
          if (too > 0) {
            const { uldegdel, ...tsuvral } = element;
            var shineTsuvral = { ...tsuvral };
            if (element.uldegdel >= too) {
              shineTsuvral.too = Number(too).toFixed(2);
              too = Number(too).toFixed(2) - Number(too).toFixed(2);
            } else {
              too =
                Number(too).toFixed(2) - Number(element.uldegdel).toFixed(2);
              shineTsuvral.too = Number(element.uldegdel).toFixed(2);
            }
            if (element.uldegdel != 0) mur.zarakhTsuvral.push(shineTsuvral);
            mur.shirkheg = value;
          }
          el.tsuvral.forEach((data) => {
            var oldson = mur.zarakhTsuvral.find((a) => a._id === data._id);
            if (!!oldson) {
              data.too = Number(oldson?.too).toFixed(2);
            }
          });
        });
        el.zarakhTsuvral = mur.zarakhTsuvral;
      }
    }
    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(updatedSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
  }

  const incrementShirkhegTsuvral = (mur) => {
    let value = mur.shirkheg + 1;
    if (value > mur.uldegdel) {
      value = mur.uldegdel;
    }
    let functionDotorAshiglakhShirkheg =
      mur.shirkheglekhEsekh &&
      parseFloat(value) * parseFloat(mur?.negKhairtsaganDahiShirhegiinToo);
    var uramshuulaliinToo = 0;
    if (mur.shirkheg < mur.uldegdel) {
      const updatedSongogdsomEmnuud = songogdsomEmnuud;
      for (const el of updatedSongogdsomEmnuud) {
        if (el._id === mur._id) {
          if (el.uramshuulal.length > 0) {
            uramshuulaliinToo = uramshuulaliinToo + 1;
          }
          mur.zarakhTsuvral = [];
          var too = 0;
          if (value != 0 && !!value) {
            too = value;
          }
          var filterlsen = el.tsuvral.filter(
            (a) => parseFloat(a.uldegdel) > 0 && a.uldegdel != null
          );
          var sortolson = filterlsen.sort((a, b) =>
            moment(a?.duusakhOgnoo || a?.huleejAvsanOgnoo).isBefore(
              moment(b?.duusakhOgnoo || b?.huleejAvsanOgnoo)
            )
              ? -1
              : 1
          );

          el.zadlakhToo = zadlakhToo;
          el.shirkheg = value != 0 && !!value ? value : 0;

          el.zarsanNiitUne =
            functionDotorAshiglakhShirkheg != "0" &&
            !!functionDotorAshiglakhShirkheg
              ? el.khunglukhEsekh === true
                ? parseFloat(mur.niitUne) * parseFloat(value || 1) -
                  functionDotorAshiglakhShirkheg *
                    el.emiinShirkhegiinKhunglukhDun
                : (parseFloat(mur.niitUne) /
                    parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 1)) *
                  parseFloat(functionDotorAshiglakhShirkheg || 1)
              : value <= mur.uldegdel
              ? value * el.niitUne -
                value *
                  (el.khunglukhEsekh === true
                    ? el.emiinShirkhegiinKhunglukhDun
                    : 0)
              : mur.uldegdel * el.niitUne -
                mur.uldegdel *
                  (el.khunglukhEsekh === true
                    ? el.emiinShirkhegiinKhunglukhDun
                    : 0);

          // el.zarsanNiitUne =
          //   zadlakhToo != "0" && !!zadlakhToo
          //     ? (parseFloat(mur.niitUne) /
          //         parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 1)) *
          //       parseFloat(zadlakhToo || 1)
          //     : value <= mur.uldegdel
          //     ? value * el.niitUne
          //     : mur.uldegdel * el.niitUne;

          el.hungulsunDun =
            value <= mur.uldegdel && el.khunglukhEsekh
              ? mur.shirkheglekhEsekh
                ? functionDotorAshiglakhShirkheg *
                  el.emiinShirkhegiinKhunglukhDun
                : value * el.emiinShirkhegiinKhunglukhDun
              : mur.uldegdel * el.emiinShirkhegiinKhunglukhDun;

          // el.hungulsunDun =
          //   value <= mur.uldegdel && el.khunglukhEsekh
          //     ? value * el.emiinShirkhegiinKhunglukhDun
          //     : mur.uldegdel * el.emiinShirkhegiinKhunglukhDun;
          sortolson.forEach((element) => {
            if (too > 0) {
              const { uldegdel, ...tsuvral } = element;
              var shineTsuvral = { ...tsuvral };
              if (element.uldegdel >= too) {
                shineTsuvral.too = Number(too).toFixed(2);
                too = Number(too).toFixed(2) - Number(too).toFixed(2);
              } else {
                too =
                  Number(too).toFixed(2) - Number(element.uldegdel).toFixed(2);
                shineTsuvral.too = Number(element.uldegdel).toFixed(2);
              }
              if (element.uldegdel != 0) mur.zarakhTsuvral.push(shineTsuvral);
              mur.shirkheg = value;
            }
            el.tsuvral.forEach((data) => {
              var oldson = mur.zarakhTsuvral.find((a) => a._id === data._id);
              if (!!oldson) {
                data.too = Number(oldson?.too).toFixed(2);
              }
            });
          });
          el.zarakhTsuvral = mur.zarakhTsuvral;
        }
      }
      if (uramshuulaliinToo > 0) {
        uramshuulalShalgakh(updatedSongogdsomEmnuud);
      } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
    } else {
      AnkhaaruulgaAlert("Үлдэгдэл хүрэлцэхгүй байна");
    }
  };

  const decrementShirkhegTsuvral = (mur) => {
    let valueNegeer;
    if (mur.shirkheg > 0) {
      valueNegeer = mur.shirkheg - 1;
    } else {
      valueNegeer = mur.shirkheg - 0;
    }
    if (mur.shirkheg - 1 < 0) {
      valueNegeer = 0;
    }

    let functionDotorAshiglakhShirkheg =
      mur.shirkheglekhEsekh &&
      parseFloat(valueNegeer) *
        parseFloat(mur?.negKhairtsaganDahiShirhegiinToo);

    var uramshuulaliinToo = 0;
    const updatedSongogdsomEmnuud = songogdsomEmnuud;
    for (const el of updatedSongogdsomEmnuud) {
      if (el._id === mur._id) {
        if (mur.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        mur.zarakhTsuvral = [];
        var too = valueNegeer;
        var filterlsen = el.tsuvral.filter((a) => a.uldegdel !== 0);

        var sortolson = filterlsen.sort((a, b) =>
          moment(b.duusakhOgnoo || b.huleejAvsanOgnoo).isBefore(
            moment(a.duusakhOgnoo || a.huleejAvsanOgnoo)
          )
            ? -1
            : 1
        );

        el.shirkheg = valueNegeer <= mur.uldegdel ? valueNegeer : mur.uldegdel;

        el.zarsanNiitUne =
          functionDotorAshiglakhShirkheg != "0" &&
          !!functionDotorAshiglakhShirkheg
            ? el.khunglukhEsekh === true
              ? parseFloat(mur.niitUne) * parseFloat(valueNegeer || 1) -
                functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : (parseFloat(mur.niitUne) /
                  parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 1)) *
                parseFloat(functionDotorAshiglakhShirkheg || 1)
            : valueNegeer <= mur.uldegdel
            ? valueNegeer * el.niitUne -
              valueNegeer *
                (el.khunglukhEsekh === true
                  ? el.emiinShirkhegiinKhunglukhDun
                  : 0)
            : mur.uldegdel * el.niitUne -
              mur.uldegdel *
                (el.khunglukhEsekh === true
                  ? el.emiinShirkhegiinKhunglukhDun
                  : 0);

        // el.zarsanNiitUne =
        //   valueNegeer <= mur.uldegdel
        //     ? valueNegeer * el.niitUne

        //     : mur.uldegdel * el.niitUne;

        el.hungulsunDun =
          valueNegeer <= mur.uldegdel && el.khunglukhEsekh
            ? mur.shirkheglekhEsekh
              ? functionDotorAshiglakhShirkheg * el.emiinShirkhegiinKhunglukhDun
              : valueNegeer * el.emiinShirkhegiinKhunglukhDun
            : mur.uldegdel * el.emiinShirkhegiinKhunglukhDun;

        sortolson.forEach((element) => {
          if (too > 0) {
            const { uldegdel, ...tsuvral } = element;
            var shineTsuvral = { ...tsuvral };
            if (element.uldegdel >= too) {
              shineTsuvral.too = too;
              too = too - too;
            } else {
              too = too - element.uldegdel;
              shineTsuvral.too = element.uldegdel;
            }
            if (element.uldegdel != 0) mur.zarakhTsuvral.push(shineTsuvral);
            mur.shirkheg = valueNegeer;
          }
          el.tsuvral.forEach((data) => {
            var oldson = mur.zarakhTsuvral.find((a) => a?._id === data?._id);
            if (!!oldson) {
              data.too = oldson?.too;
            }
          });
        });
        el.zarakhTsuvral = mur.zarakhTsuvral;
      }
    }

    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(updatedSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
  };

  const decrementShirkheg = (murId) => {
    var uramshuulaliinToo = 0;
    const updatedSongogdsomEmnuud = songogdsomEmnuud;
    for (const mur of updatedSongogdsomEmnuud) {
      if (mur._id === murId) {
        if (mur.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        mur.shirkheg = mur.shirkheg > 0 ? mur.shirkheg - 1 : 0;
        mur.hungulsunDun = mur.khunglukhEsekh
          ? Number(mur.hungulsunDunTsahimJor || 0) *
            (mur.shirkheglekhEsekh
              ? mur.shirkheg * mur.negKhairtsaganDahiShirhegiinToo
              : mur.shirkheg)
          : 0; // 1050 * 30 = 31500
        mur.zarsanNiitUne = mur.niitUne * mur.shirkheg - mur.hungulsunDun;
      }
    }

    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(updatedSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
  };

  function negHuleeltAviya(mur) {
    setHuleeldendBaigaaItem(mur);
  }

  const incrementShirkheg = (murId) => {
    var uramshuulaliinToo = 0;

    const updatedSongogdsomEmnuud = songogdsomEmnuud;
    for (const mur of updatedSongogdsomEmnuud) {
      console.log("niitUne ----" + mur.niitUne);
      console.log(
        "negKhairtsaganDahiShirhegiinToo ----" +
          mur.negKhairtsaganDahiShirhegiinToo
      );
      if (mur._id === murId) {
        if (mur.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        if (mur?.shirkheg < mur?.uldegdel) {
          mur.shirkheg =
            mur.shirkheg + 1 >= mur.uldegdel ? mur.uldegdel : mur.shirkheg + 1;
          mur.hungulsunDun = mur.khunglukhEsekh
            ? Number(mur.hungulsunDunTsahimJor || 0) *
              (mur.shirkheglekhEsekh
                ? mur.shirkheg * mur.negKhairtsaganDahiShirhegiinToo
                : mur.shirkheg)
            : 0; // 1050 * 30 = 31500
          mur.zarsanNiitUne = mur.niitUne * mur.shirkheg - mur.hungulsunDun;
        } else {
          AnkhaaruulgaAlert("Үлдэгдэл хүрэлцэхгүй байна");
        }
      }
    }
    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(updatedSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...updatedSongogdsomEmnuud]);
  };

  function uramshuulalOruulakh(data) {
    posUilchilgee(token)
      .post("/uramshuulalOruulya", {
        uramshuulaliinNukhtsul: data,
        songogdsomEmnuud: songogdsomEmnuud,
        salbariinId: salbariinId,
        baiguullagiinId: baiguullaga?._id,
      })
      .then(({ data }) => {
        if (data) {
          uramshuulalShalgakh(data);
        }
      });
  }

  function emSongokh(mur) {
    if (mur.dispensingType === "Жортой")
      AnkhaaruulgaAlert(mur.code + " " + mur.ner + " жортой эм байна");
    if (mur.tsuvraliinDugaartaiEsekh || mur.ognooniiMedeelelBurtgekhEsekh) {
      mur.tsuvral = mur.tsuvral.filter(
        (a) => a.uldegdel > 0 && a.uldegdel != null
      );

      var sortolson = mur.tsuvral.sort((a, b) =>
        moment(a?.duusakhOgnoo || a?.huleejAvsanOgnoo).isBefore(
          moment(b?.duusakhOgnoo || b?.huleejAvsanOgnoo)
        )
          ? -1
          : 1
      );

      var shineSongogdsomEmnuud = songogdsomEmnuud;
      var too = 1;
      mur.zarakhTsuvral = [];
      mur.shirkheg = 1;

      sortolson.forEach((element) => {
        if (too > 0) {
          const { uldegdel, ...tsuvral } = element;
          var shineTsuvral = { ...tsuvral };
          if (element.uldegdel >= too) {
            shineTsuvral.too = Number(too).toFixed(2);
            too = Number(too).toFixed(2) - Number(too).toFixed(2);
          } else {
            too = Number(too).toFixed(2) - Number(element.uldegdel).toFixed(2);
            shineTsuvral.too = Number(element.uldegdel).toFixed(2);
          }
          if (element.uldegdel != 0) mur.zarakhTsuvral.push(shineTsuvral);
          mur.shirkheg = 1;
        }
        mur.tsuvral.forEach((data) => {
          var oldson = mur.zarakhTsuvral.find((a) => a._id === data._id);
          if (!!oldson) {
            data.too = Number(oldson?.too).toFixed(2);
          }
        });
      });
    } else {
      mur.shirkheg = 1;
    }

    mur.shirkheg > 0
      ? (mur.zarsanNiitUne = mur.niitUne)
      : (mur.zarsanNiitUne = 0);
    var shineSongogdsomEmnuud = songogdsomEmnuud;
    const index = shineSongogdsomEmnuud.find(
      (a) => !a.uramshuulaliinId && a.niitUne > 0 && a._id === mur._id
    );
    if (!!index) {
      shineSongogdsomEmnuud = songogdsomEmnuud.filter((a) => a._id !== mur._id);
    } else {
      shineSongogdsomEmnuud = songogdsomEmnuud;
      if (mur.niitUne > 0) {
        if (
          shineSongogdsomEmnuud?.length === 0 &&
          shineerBarimtiinDugaarAviya
        ) {
          posUilchilgee(token)
            .post("/zakhialgiinDugaarAvya", {
              baiguullagiinId: baiguullagiinId,
            })
            .then(({ data }) => {
              if (data) {
                setGuilgeeniiDugaar(data);
                setShineerBarimtiinDugaarAviya(false);
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            });
        }

        const duusakhOgnoo = mur.tsuvral?.duusakhOgnoo;
        if (duusakhOgnoo) {
          for (const tsuvralItem of mur.tsuvral) {
            if (Math.abs(tsuvralItem.ognoo - duusakhOgnoo) < 1) {
              tsuvralItem.too = 1;
            }
          }
        }

        shineSongogdsomEmnuud.push(mur);
      } else {
        AnkhaaruulgaAlert("Худалдах үнэ оруулж өгнө үү");
      }
    }
    if (!!searchValue) {
      setSearchValue("");
      setBaraaniiKhuudaslalt((a) => ({
        ...a,
        search: "",
        khuudasniiDugar: 1,
        jagsaalt: [],
        a,
      }));
    }

    setSongogdsomEmnuud([...shineSongogdsomEmnuud]);
    if (mur.uramshuulal.length > 0) {
      uramshuulalShalgakh(shineSongogdsomEmnuud);
    } else setSongogdsomEmnuud([...shineSongogdsomEmnuud]);

    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }

  function tsutslakh() {
    if (!!bustaaltKhiikhId) {
    }
    setSongogdsomEmnuud([]);
    setShineSongogdsomEmnuud([]);
    setHynaltiinDugaaraarLavlagaaAvakhData();
    form.resetFields();
  }

  const handleDelete = (mur) => {
    setHynaltiinDugaaraarLavlagaaAvakhData();
    if (!!mur.uramshuulaliinId) {
      var shine = songogdsonBelegnuud.filter(
        (a) =>
          a.uramshuulaliinId !== mur.uramshuulaliinId ||
          (a.uramshuulaliinId === mur.uramshuulaliinId && mur.code !== a.code)
      );
      setSongogdsonBelegnuud([...shine]);
    }
    if (mur.uramshuulal.length > 0) {
      uramshuulalShalgakh(
        songogdsomEmnuud.filter(
          (a) => a._id + a?.uramshuulaliinId !== mur._id + mur.uramshuulaliinId
        ),
        shine
      );
    } else
      setSongogdsomEmnuud(
        songogdsomEmnuud.filter(
          (a) => a._id + a?.uramshuulaliinId !== mur._id + mur.uramshuulaliinId
        )
      );
  };

  function ustgaya(mur) {
    deleteMethod("guilgeeniiTuukh", token, mur?._id).then(
      ({ data }) =>
        data === "Amjilttai" &&
        (AmjilttaiAlert("Амжилттай устгагдлаа"), guilgeeniiTuukhGaraltMutate())
    );
  }

  function huleelgeesHudaldahruuZakhialgaKhiiy() {
    if (typeof huleeldendBaigaaItem === "undefined") {
      AldaaAlert("Захиалга сонгоогүй байна.");
    } else {
      deleteMethod("guilgeeniiTuukh", token, huleeldendBaigaaItem?._id).then(
        ({ data }) => data === "Amjilttai" && guilgeeniiTuukhGaraltMutate()
      );
      var uramshuulaliinToo = 0;
      const baraa = [];
      for (const item of huleeldendBaigaaItem?.baraanuud) {
        if (item?.baraa?.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        item.baraa.shirkheg = item.too;
        item.baraa.zarsanNiitUne = item.niitUne;
        baraa.push(item.baraa);
      }
      var uramshuulaluud = baraa?.filter((a) => !!a.uramshuulaliinId);
      setSongogdsonBelegnuud(uramshuulaluud);
      if (huleeldendBaigaaItem) setSongogdsonKhudaldaa("khudaldakh");
      setGuilgeeniiDugaar(huleeldendBaigaaItem.guilgeeniiDugaar);
      if (uramshuulaliinToo > 0) {
        uramshuulalShalgakh(baraa, uramshuulaluud);
      } else setSongogdsomEmnuud([...baraa]);
    }
  }

  function khudaldakhKharuulakhFunction() {
    setSongogdsonKhudaldaa("khudaldakh");
    setHuleeldendBaigaaItem();
  }

  const handleShirkhegChange = (id, value) => {
    var uramshuulaliinToo = 0;
    var shine = songogdsomEmnuud;
    for (const mur of shine) {
      if (mur._id === id) {
        if (mur.uramshuulal.length > 0) {
          uramshuulaliinToo = uramshuulaliinToo + 1;
        }
        mur.shirkheg = parseFloat(value || 0);
        mur.hungulsunDun = mur.khunglukhEsekh
          ? Number(mur.hungulsunDunTsahimJor || 0) *
            (!!mur.negKhairtsaganDahiShirhegiinToo
              ? mur.shirkheg * mur.negKhairtsaganDahiShirhegiinToo
              : mur.shirkheg)
          : 0; // 1050 * 30 = 31500
        mur.zarsanNiitUne = mur.niitUne * mur.shirkheg - mur.hungulsunDun;
      }
    }
    if (uramshuulaliinToo > 0) {
      uramshuulalShalgakh(shine);
    } else setSongogdsomEmnuud([...shine]);
  };

  const HuleelgeTrailingActions = (mur) => {
    return (
      <TrailingActions style={{ height: "100px" }}>
        <SwipeAction
          className={"h-[100px]"}
          destructive={false}
          onClick={() => ustgaya(mur)}
        >
          <ActionContent
            style={{
              height: "84px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 70, 70, 0.3)",
              marginLeft: "5px",
              borderRadius: "1rem",
            }}
          >
            <ItemColumnCentered>
              <span className="testicon flex items-center justify-center">
                <MdDeleteOutline
                  style={{ color: "rgba(255, 70, 70, 1)", fontSize: "25px" }}
                />
              </span>
            </ItemColumnCentered>
          </ActionContent>
        </SwipeAction>
      </TrailingActions>
    );
  };

  function khadgalakh(angilal) {
    if (songojAvsanAngilal.includes(angilal)) {
      const updatedAngilal = songojAvsanAngilal.filter(
        (item) => item !== angilal
      );
      setSongojAvsanAngilal(updatedAngilal);
    } else {
      setSongojAvsanAngilal([...songojAvsanAngilal, angilal]);
    }
  }

  useKeyboardTovchlol("Escape", escapeDarsan);
  useKeyboardTovchlol("F1", f1Darsan);

  function escapeDarsan() {
    tsutslakh();
  }
  function f1Darsan() {
    huleelgey();
  }

  const scrollToUldegdelguiItem = () => {
    const ekhniiIndex = songogdsomEmnuud.findIndex((item) => {
      return item.shirkheg > item.uldegdel;
    });
    if (ekhniiIndex !== -1 && scrollRef.current) {
      const oldooguiRef = scrollRef.current.children[0].children[ekhniiIndex];
      if (oldooguiRef) {
        oldooguiRef.scrollIntoView({ behavior: "smooth" });
        oldooguiRef.classList.add("animate-bounce");
        setTimeout(() => {
          oldooguiRef.classList.remove("animate-bounce");
        }, 1500);
      }
    }
  };

  const baganuud = [
    {
      title: "№",
      width: "2.5rem",
      align: "center",
      dataIndex: "description",
      render: (v, index, key) => key + 1,
    },
    {
      title: "Огноо",
      width: "6rem",
      align: "center",
      dataIndex: "createdAt",
      render: (data) => {
        return moment(data).format("MM/DD HH:mm");
      },
    },
    {
      title: "Утга",
      width: "10rem",
      align: "center",
      dataIndex: "description",
      render: (_v, e) => {
        return (
          <Tooltip
            placement="top"
            title={e?.description ? e?.description : e?.TxAddInf}
            mouseLeaveDelay={0}
            mouseEnterDelay={1}
          >
            <div className="truncate text-left">
              {e?.description ? e?.description : e?.TxAddInf}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Дүн",
      width: "4rem",
      dataIndex: "amount",
      align: "center",
      render(_v, e) {
        return (
          (e?.amount || e?.Amt) && (
            <div className="text-right">
              {formatNumber(e?.amount ? e?.amount : e?.Amt, 0)} ₮
            </div>
          )
        );
      },
    },
  ];

  function guilgeeDrawerOngoilgokh() {
    setGuilgeeDrawerOpen(true);
  }
  function guilgeeDrawerKhaakh() {
    setGuilgeeDrawerOpen(false);
  }

  return (
    <Admin
      title="ПОС"
      loading={isLoading}
      khuudasniiNer="posSystem"
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      className="grid grid-cols-12 !gap-0 !p-0 md:px-4 md:pt-4"
      onSearch={(search) =>
        setBaraaniiKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
          jagsaalt: [],
        }))
      }
    >
      <div
        ref={divRev}
        className="col-span-6 flex h-full flex-col overflow-y-hidden dark:bg-gray-900 xl:col-span-7"
      >
        <div className="flex h-[75px] w-[100%] items-center justify-between gap-2 space-x-3  bg-white pr-3 text-sm font-bold dark:bg-gray-900 ">
          <div className="flex h-[400px] flex-col items-center justify-center">
            <div
              className=" h-12 w-12 cursor-pointer rounded-full border-y border-r bg-[#4FD1C5] text-xl text-white shadow-lg"
              onClick={guilgeeDrawerOngoilgokh}
            >
              <DollarCircleOutlined />
            </div>
            <Drawer
              title={"Сүүлийн гүйлгээ"}
              placement="left"
              size="large"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onClose={guilgeeDrawerKhaakh}
              open={guilgeeDrawerOpen}
              getContainer={false}
              bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="absolute right-4 top-3">
                  <Button
                    className={`${guilgeeKharakh === false ? "mr-0" : "mr-8"}`}
                    type="tertiary"
                    onClick={(e) => {
                      e.stopPropagation();
                      dansniiKhuulgaMutate();
                    }}
                  >
                    Шалгах
                  </Button>
                </div>
                <Table
                  pagination={false}
                  tableLayout="fixed"
                  className="mt-3"
                  scroll={{ y: "calc(100vh / 4.5)" }}
                  size="small"
                  unshijBaina={dansKhuleelt}
                  dataSource={dansniiKhuulgaGaralt?.jagsaalt}
                  columns={baganuud}
                />
              </div>
            </Drawer>
          </div>
          <div className="flex w-[50%] justify-end gap-2">
            <AngilalSongokhModal
              baiguullagiinId={baiguullagiinId}
              setSongojAvsanAngilal={setSongojAvsanAngilal}
              songojAvsanAngilal={songojAvsanAngilal}
            />
            {baiguullaga?.tokhirgoo?.khaaltAshiglakhEsekh ? (
              <Khaalt
                isModalOpen={khaalModal}
                setIsModalOpen={setKhaalModal}
                servereesAvsanUnuuduriinTsag={servereesAvsanUnuuduriinTsag}
                suuliinKhaaltOgnooAvyaMutate={suuliinKhaaltOgnooAvyaMutate}
                suuliinKhaaltOgnooData={suuliinKhaaltOgnooData}
                baiguullagiinId={baiguullagiinId}
                salbariinId={salbariinId}
                ajiltan={ajiltan}
                token={token}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mt-2 flex w-full justify-end gap-2 pr-2 dark:bg-gray-900">
          <div>Дуусан барааг харах</div>
          <Switch
            checked={dussanBaraagKharakh}
            onChange={(v) => {
              if (isLocalStorageAvailable) {
                localStorage.setItem("dussanBaraagKharakh", v.toString());
              }
              setDussanBaraagKharakh(v);
            }}
          />
        </div>
        <div className="flex h-full flex-col dark:bg-gray-900">
          <div className="mt-2 h-full">
            {jagsaalt?.length !== 0 ? (
              <div
                className="flex max-h-[70vh] flex-wrap justify-center gap-3 overflow-scroll p-2 xl:max-h-[80vh]"
                onScroll={(e) => {
                  if (
                    e.target.scrollHeight - e.target.scrollTop - 2 <=
                    e.target.clientHeight
                  ) {
                    next();
                  }
                }}
              >
                {jagsaalt.map((mur, index) => {
                  return (
                    <Popover
                      key={index}
                      content={
                        <div className="flex flex-col dark:text-gray-200">
                          {mur.code && (
                            <div className="flex gap-[5px] font-semibold">
                              <div>Барааны нэр:</div>
                              <div>{mur.ner}</div>
                            </div>
                          )}
                          {mur.code && (
                            <div className="flex gap-[5px] font-semibold">
                              <div>Дотоод код:</div>
                              <div>{mur.code}</div>
                            </div>
                          )}
                          {mur.barCode && (
                            <div className="flex gap-[5px] font-semibold">
                              <div>Бар код:</div>
                              <div>{mur.barCode}</div>
                            </div>
                          )}
                          <div className="flex gap-[5px] font-semibold">
                            <div>Үлдэгдэл:</div>
                            <div>
                              {mur.uldegdel}{" "}
                              {mur.shirkheglekhEsekh ? "хайрцаг" : "ш"}
                            </div>
                          </div>
                          {mur.shirkheglekhEsekh && (
                            <div className="flex gap-[5px] font-semibold">
                              <div>Нэг хайрцаг дахь ширхэг:</div>
                              <div>{mur.negKhairtsaganDahiShirhegiinToo}ш</div>
                            </div>
                          )}
                          {mur.uramshuulal?.length > 0 && (
                            <div>
                              <div className="text-center font-semibold">
                                Урамшуулал{" "}
                              </div>
                            </div>
                          )}
                        </div>
                      }
                      title={false}
                    >
                      <>
                        <div
                          className={`${
                            mur.uldegdel === undefined ||
                            mur.uldegdel === 0 ||
                            songogdsomEmnuud?.some(
                              (item) => item?.khunglukhEsekh === true
                            )
                              ? "cursor-not-allowed border-red-600 opacity-50"
                              : "cursor-pointer"
                          }
                      ${
                        songogdsomEmnuud?.find(
                          (item) =>
                            !item.uramshuulaliinId && item._id === mur._id
                        ) && "border-4 border-blue-500"
                      } relative flex h-[105px] w-[120px] flex-col rounded-2xl border border-[#4FD1C5] shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 dark:border-[#4FD1C5] dark:bg-gray-800 xl:h-[145px] xl:w-[160px] `}
                          onClick={() => {
                            const suuliinKhaaltOgnooMoment =
                              suuliinKhaaltOgnooData &&
                              moment(suuliinKhaaltOgnooData?.ognoo).startOf(
                                "day"
                              );
                            const servereesAvsanUnuuduriinTsagMoment = moment(
                              servereesAvsanUnuuduriinTsag
                            ).startOf("day");

                            if (
                              baiguullaga?.tokhirgoo?.khaaltAshiglakhEsekh ===
                              true
                            ) {
                              if (
                                servereesAvsanUnuuduriinTsagMoment.isSameOrBefore(
                                  suuliinKhaaltOgnooMoment
                                ) &&
                                ajiltan?._id ===
                                  suuliinKhaaltOgnooData?.burtgesenAjiltan
                              ) {
                                return AnkhaaruulgaAlert(
                                  "Өнөөдөр хаалт хийсэн байна."
                                );
                              } else if (
                                mur.uldegdel === undefined ||
                                mur.uldegdel === 0 ||
                                songogdsomEmnuud?.some(
                                  (item) => item?.khunglukhEsekh === true
                                )
                              ) {
                              } else if (
                                baiguullaga?.tokhirgoo?.khaaltAshiglakhEsekh ===
                                true
                              ) {
                                return emSongokh(mur);
                              }
                            } else {
                              return emSongokh(mur);
                            }
                          }}
                        >
                          <div className="relative flex h-[90%] w-full items-center justify-center overflow-hidden pb-[14px] pt-5">
                            <Image
                              layout="responsive"
                              objectfit=""
                              preview={false}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              src={
                                !!mur.zurgiinId
                                  ? `${posUrl}/file?path=baraa/${mur.zurgiinId}`
                                  : "/drugs.svg"
                              }
                              width={"85%"}
                              height={"85%"}
                            />
                            {mur.uramshuulal?.length > 0 &&
                              mur.uramshuulal.filter(
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
                              ).length > 0 && (
                                <IoGiftOutline
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    mur.uldegdel !== undefined &&
                                      mur.uldegdel !== 0 &&
                                      setUramshuulal(
                                        mur.uramshuulal.filter(
                                          (a) =>
                                            Number(
                                              moment(a.duusakhOgnoo).format(
                                                "YYYYMMDDHHmm"
                                              )
                                            ) >
                                              Number(
                                                moment(new Date()).format(
                                                  "YYYYMMDDHHmm"
                                                )
                                              ) &&
                                            Number(
                                              moment(a.ekhlekhOgnoo).format(
                                                "YYYYMMDDHHmm"
                                              )
                                            ) <
                                              Number(
                                                moment(new Date()).format(
                                                  "YYYYMMDDHHmm"
                                                )
                                              )
                                        )
                                      );
                                  }}
                                  className={`absolute left-[2px] top-7 text-2xl ${
                                    mur.uramshuulal.filter(
                                      (a) =>
                                        !a.duusakhTsag ||
                                        (Number(
                                          moment(a.duusakhTsag).format("HHmm")
                                        ) >
                                          Number(
                                            moment(new Date()).format("HHmm")
                                          ) &&
                                          Number(
                                            moment(a.ekhlekhTsag).format("HHmm")
                                          ) <
                                            Number(
                                              moment(new Date()).format("HHmm")
                                            ))
                                    ).length > 0
                                      ? "text-[#4FD1C5]"
                                      : "text-gray-400"
                                  }  transition-all hover:text-3xl`}
                                />
                              )}
                            <div className="absolute top-0 flex w-full justify-between px-[3px]">
                              <Popover
                                content={
                                  <div className="flex flex-col gap-2">
                                    <div className="text-[16px] text-black">
                                      {tooOronKhyazgaarliy(
                                        mur.uldegdel || 0,
                                        2
                                      )}{" "}
                                      ш
                                    </div>
                                  </div>
                                }
                              >
                                <div className="ml-[10px] flex h-[20px] w-[66px] max-w-[4rem] items-center justify-center gap-[4px] truncate rounded-b-[10px] bg-white text-[8px] font-bold text-[#293050] dark:bg-gray-800 dark:text-gray-300 xl:text-[12px]">
                                  <BsBoxSeam className="text-[#4FD1C5]" />{" "}
                                  <div>
                                    {tooOronKhyazgaarliy(mur.uldegdel || 0, 2)}{" "}
                                    ш
                                  </div>
                                </div>
                              </Popover>
                              <Popover
                                content={
                                  <div>
                                    {formatNumber(mur.niitUne || 0, 2)}₮
                                  </div>
                                }
                              >
                                <div className="mr-[10px] flex h-[20px] w-[66px] max-w-[4rem] items-center justify-center truncate rounded-b-[10px] bg-[#4FD1C5] p-2 text-center text-[8px] font-bold dark:bg-gray-900 xl:text-[12px]">
                                  {formatNumber(mur.niitUne || 0, 2)}
                                  {"₮"}
                                </div>
                              </Popover>
                            </div>
                            <Popover
                              content={<div>{mur.barCode || mur.code}</div>}
                            >
                              <div className="absolute bottom-0 h-[14px] w-[118px] truncate rounded-t-[15px] border-[1px] border-[#4FD1C5] bg-white px-2 text-center text-[10px] dark:bg-gray-900 ">
                                {mur.barCode || mur.code}
                              </div>
                            </Popover>
                          </div>
                          <div className="flex h-[fit] flex-col truncate border-t-[1px] border-[#4FD1C5] px-2 ">
                            <div className=" flex h-full items-center justify-start truncate break-all text-left text-[10px] font-[600] leading-4 xl:text-[16px]">
                              {mur?.boginoNer ? mur?.boginoNer : mur?.ner}
                            </div>
                          </div>
                        </div>
                      </>
                    </Popover>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center dark:bg-gray-700">
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
                  Бараа байхгүй байна
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="box col-span-6 flex h-full select-none flex-col justify-start gap-3 px-4 py-4 dark:bg-gray-900 xl:col-span-5">
        <div className="flex w-full items-center justify-between rounded-full bg-[#B9EDE8] p-1 dark:bg-[#4FD1C5]">
          <div
            onClick={khudaldakhKharuulakhFunction}
            className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
              songogdsonKhudaldaa === "khudaldakh" &&
              "bg-white dark:bg-gray-900"
            }`}
          >
            <div className="px-4 py-2 text-[15px] font-[700]">Худалдах</div>
          </div>
          <div
            onClick={() => setSongogdsonKhudaldaa("khuleelge")}
            className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
              songogdsonKhudaldaa === "khuleelge" && "bg-white dark:bg-gray-900"
            } `}
          >
            <div className=" px-4 py-2 text-[15px] font-[700]">Хүлээлгэ</div>
          </div>
        </div>
        {songogdsonKhudaldaa === "khudaldakh" &&
          (songogdsomEmnuud?.length !== 0 ? (
            <div
              ref={scrollRef}
              className="z-20 flex max-h-[300px] flex-col gap-2 !overflow-y-auto xl:max-h-[calc(85vh-17rem)]"
            >
              <SwipeableList
                className="flex flex-col gap-2 pb-2"
                fullSwipe={false}
                threshold={0.5}
                type={ListType.IOS}
              >
                {songogdsomEmnuud?.map((mur, index) => {
                  return (
                    <div className="flex p-1 xl:p-0" key={index}>
                      <div
                        style={{
                          backgroundColor: !mur.uramshuulaliinId
                            ? "rgba(79, 209, 197, 0.4)"
                            : "rgba(200, 250, 250, 0.2)",
                        }}
                        className={`flex w-[90%] flex-col items-center justify-between gap-x-1 rounded-[15px] px-2 py-1 md:w-[90%] md:flex-row ${
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
                              <div className="w-[120px] truncate text-left text-[15px] font-[500]">
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
                                Number(
                                  moment(new Date()).format("YYYYMMDDHHmm")
                                )
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
                                        moment(new Date()).format(
                                          "YYYYMMDDHHmm"
                                        )
                                      ) &&
                                    Number(
                                      moment(a.ekhlekhOgnoo).format(
                                        "YYYYMMDDHHmm"
                                      )
                                    ) <
                                      Number(
                                        moment(new Date()).format(
                                          "YYYYMMDDHHmm"
                                        )
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
                        <div className="flex w-fit items-center justify-center gap-3 xl:w-full">
                          {!mur.uramshuulaliinId && mur.shirkheglekhEsekh ? (
                            <KhemjikhNegjUurchlukh
                              songogdsomEmnuud={songogdsomEmnuud}
                              setSongogdsomEmnuud={setSongogdsomEmnuud}
                              uramshuulalShalgakh={uramshuulalShalgakh}
                              zadlakhToo={zadlakhToo}
                              setZadlakhToo={setZadlakhToo}
                              data={mur}
                            />
                          ) : (
                            <div className="flex h-10 w-10 xl:hidden"></div>
                          )}
                          <div className=" flex h-full flex-col justify-between">
                            {mur?.tsuvraliinDugaartaiEsekh ||
                            mur?.ognooniiMedeelelBurtgekhEsekh ? (
                              <div className="flex h-full flex-col items-center font-[500] leading-[34px]">
                                <div className="text-[15px]">Тоо ширхэг</div>
                                <div className="flex w-[150px] gap-2 xl:w-full">
                                  {!mur.uramshuulaliinId && (
                                    <div className="cursor-not-allowed text-xl text-white xl:text-4xl">
                                      <MinusCircleFilled
                                        onClick={() =>
                                          decrementShirkhegTsuvral(mur)
                                        }
                                      />
                                    </div>
                                  )}
                                  <div className="flex w-full items-center justify-center text-[20px] font-[600]">
                                    {!mur.uramshuulaliinId ? (
                                      <TooShirkhegInput
                                        size="large"
                                        // ref={lastInputRef}
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
                                          borderColor:
                                            "rgba(79, 209, 197, 0.4)",
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
                                  {!mur.uramshuulaliinId && (
                                    <div className="cursor-not-allowed text-xl text-white xl:text-4xl">
                                      <PlusCircleFilled
                                        onClick={() =>
                                          incrementShirkhegTsuvral(mur)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex h-full  flex-col items-center font-[500] leading-[34px]">
                                <div className="text-[15px]">Тоо ширхэг</div>
                                <div className="flex w-[150px] gap-2 xl:w-full">
                                  {!mur.uramshuulaliinId && (
                                    <div className="cursor-not-allowed text-xl text-white xl:text-4xl">
                                      <MinusCircleFilled
                                        onClick={() =>
                                          decrementShirkheg(mur?._id)
                                        }
                                      />
                                    </div>
                                  )}
                                  <div className="flex w-full items-center justify-center text-[20px] font-[600]">
                                    {!mur.uramshuulaliinId ? (
                                      <TooShirkhegInput
                                        size="large"
                                        // ref={lastInputRef}
                                        autoFocus
                                        min={0}
                                        max={
                                          mur?.maxShirkheg
                                            ? mur.maxShirkheg
                                            : mur.uldegdel
                                        }
                                        className="posInput !h-[14px] !w-full xl:!h-[36px] "
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderColor:
                                            "rgba(79, 209, 197, 0.4)",
                                          borderRadius: "25px",
                                          backgroundColor:
                                            "rgba(79, 209, 197, 0.4)",
                                        }}
                                        // value={mur?.shirkheg}
                                        value={
                                          mur?.shirkheg > 0
                                            ? mur?.shirkheg.toFixed(2)
                                            : mur?.shirkheg
                                        }
                                        onChange={(e) =>
                                          handleShirkhegChange(mur?._id, e)
                                        }
                                      />
                                    ) : (
                                      <div className=" -mt-3 text-green-500">
                                        {mur?.shirkheg}
                                      </div>
                                    )}
                                  </div>
                                  {!mur.uramshuulaliinId && (
                                    <div className="cursor-not-allowed text-xl text-white xl:text-4xl">
                                      <PlusCircleFilled
                                        onClick={() =>
                                          incrementShirkheg(mur._id)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          {(mur?.tsuvraliinDugaartaiEsekh === true ||
                            mur?.ognooniiMedeelelBurtgekhEsekh === true) &&
                          !mur.uramshuulaliinId ? (
                            <div>
                              <TsuwraliinDugaarSongokh
                                data={mur}
                                songogdsomEmnuud={songogdsomEmnuud}
                                setSongogdsomEmnuud={uramshuulalShalgakh}
                              />
                            </div>
                          ) : (
                            <div
                              className={
                                mur.uramshuulaliinId ? "w-[5px]" : "w-[35px]"
                              }
                            ></div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-[10%] gap-2 xl:w-[8%]">
                        <div
                          className="w-full cursor-pointer"
                          destructive={false}
                          onClick={() => handleDelete(mur)}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              displayflex: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 70, 70, 0.3)",
                              marginLeft: "5px",
                              borderRadius: "1rem",
                            }}
                          >
                            <span className="flex h-full items-center justify-center">
                              <MdDeleteOutline
                                style={{
                                  color: "rgba(255, 70, 70, 1)",
                                  fontSize: "25px",
                                }}
                              />
                            </span>
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
          ))}

        {songogdsonKhudaldaa === "khuleelge" &&
          (guilgeeniiTuukhGaralt?.jagsaalt?.length > 0 ? (
            <SwipeableList
              className="z-20 flex max-h-[calc(75vh)] flex-col gap-2 !overflow-y-auto dark:text-gray-300 "
              fullSwipe={false}
              threshold={0.5}
              type={ListType.IOS}
            >
              {guilgeeniiTuukhGaralt?.jagsaalt
                .filter((mur) => {
                  return (
                    mur?.createdAt && new Date(mur.createdAt) > tsagOchigdor
                  );
                })
                .map((mur, i) => {
                  return (
                    <SwipeableListItem
                      className={`min-h-[100px] cursor-pointer `}
                      key={mur._id || i}
                      trailingActions={HuleelgeTrailingActions(mur)}
                    >
                      <div
                        onClick={() => {
                          negHuleeltAviya(mur);
                        }}
                        style={{
                          backgroundColor: "rgba(79, 209, 197, 0.4)",
                          boxShadow:
                            huleeldendBaigaaItem?._id === mur._id
                              ? "0px 4px 4px 0px  rgba(0, 0, 0, 0.25)"
                              : null,
                          border:
                            huleeldendBaigaaItem?._id === mur._id
                              ? "1px solid black"
                              : "1px solid transparent",
                        }}
                        className={`flex h-[84px] w-full flex-col items-center justify-between gap-x-1 rounded-[15px] px-5 py-3`}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <div className="text-[14px] font-medium text-[#293050] dark:text-gray-300">
                              З/Дугаар:
                            </div>
                            <div className="text-[14px] font-light text-[#293050] dark:text-gray-300">
                              {mur.guilgeeniiDugaar}
                            </div>
                          </div>
                          <div className="flex ">
                            {moment(mur?.createdAt).format("YYYY/MM/DD HH:mm")}
                          </div>
                        </div>
                        <div className="flex w-full items-center justify-between gap-2 ">
                          <div className="flex gap-2">
                            <div className="text-[14px] font-medium text-[#293050] dark:text-gray-300">
                              Хэрэглэгч:
                            </div>
                            <div className="text-[14px] font-light text-[#293050] dark:text-gray-300">
                              {ajiltan.ner}
                            </div>
                          </div>
                          <div className="flex text-[20px] font-semibold">
                            {formatNumber(mur.niitUne, 2)} ₮
                          </div>
                        </div>
                      </div>
                    </SwipeableListItem>
                  );
                })}
            </SwipeableList>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center dark:text-gray-300">
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
                Хүлээлгэсэн бараа байхгүй байна
              </div>
            </div>
          ))}

        {songogdsonKhudaldaa !== "khuleelge" && (
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
                    {formatNumber(niitDunNoat.hungulsunDun, 2)} ₮
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="text-[10px] xl:text-[16px]">ДҮН :</div>
                  <div className="text-[10px] font-semibold xl:text-[16px]">
                    {baiguullaga?.tokhirgoo?.eBarimtShine
                      ? formatNumber(niitDunNoat.niitDun - niitDunNoat.noat, 2)
                      : 0}{" "}
                    ₮
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="text-[10px] xl:text-[16px]">НӨАТ :</div>
                  <div className="text-[10px] font-semibold xl:text-[16px]">
                    {baiguullaga?.tokhirgoo?.eBarimtShine
                      ? formatNumber(niitDunNoat.noat, 2)
                      : 0}{" "}
                    ₮
                  </div>
                </div>
              </div>
              <div className={`col-span-1 flex items-center justify-between`}>
                <div className="text-[10px] xl:text-[16px]">НИЙТ ДҮН :</div>
                <div className="text-[10px] font-bold text-[#4FD1C5] xl:text-[16px]">
                  {formatNumber(niitDunNoat.niitDun, 2)} ₮
                </div>
              </div>
            </div>
            <div className="col-span-12 flex h-full w-full flex-col justify-end gap-2 place-self-end">
              <div className="flex h-12 w-full justify-between gap-1 xl:gap-6">
                <button
                  style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                  type="primary"
                  className="flex h-12 w-full items-center justify-center rounded-2xl border-[1px] border-[#FF4646] bg-red-400 text-xl font-[600] text-white  shadow-md"
                  onClick={() => tsutslakh()}
                >
                  <div className="truncate p-2 text-[15px] text-[#FF4646]">
                    Цуцлах [ESC]
                  </div>
                </button>
                <TsahimJorModal
                  setShineSongogdsomEmnuud={setShineSongogdsomEmnuud}
                  shineSongogdsomEmnuud={shineSongogdsomEmnuud}
                  setGuilgeeniiDugaar={setGuilgeeniiDugaar}
                  setShineerBarimtiinDugaarAviya={
                    setShineerBarimtiinDugaarAviya
                  }
                  shineerBarimtiinDugaarAviya={shineerBarimtiinDugaarAviya}
                  form={form}
                  setHynaltiinDugaaraarLavlagaaAvakhData={
                    setHynaltiinDugaaraarLavlagaaAvakhData
                  }
                  hynaltiinDugaaraarLavlagaaAvakhData={
                    hynaltiinDugaaraarLavlagaaAvakhData
                  }
                  setSongogdsomEmnuud={setSongogdsomEmnuud}
                  songogdsomEmnuud={songogdsomEmnuud}
                />
                <button
                  type="primary"
                  className="shad flex h-12 w-full items-center justify-center rounded-2xl border border-[#4FD1C5] text-xl font-[600] shadow-md"
                  onClick={() => huleelgey()}
                >
                  <div className="truncate p-2 text-[15px]">Хүлээлгэ [F1]</div>
                </button>
              </div>
              <TulburTuluhModal
                tulburTulkhudAldaaGarsanBaraanuud={
                  tulburTulkhudAldaaGarsanBaraanuud
                }
                setTulburTulkhudAldaaGarsanBaraanuud={
                  setTulburTulkhudAldaaGarsanBaraanuud
                }
                params={params}
                baiguullaga={baiguullaga}
                umnuhGuilgeeniiDun={umnuhGuilgeeniiDun}
                setUmnuhGuilgeeniiDun={setUmnuhGuilgeeniiDun}
                guilgeeniiId={guilgeeniiId}
                setGuilgeeniiId={setGuilgeeniiId}
                bustaaltKhiikhId={bustaaltKhiikhId}
                setBustaaltKhiikhId={setBustaaltKhiikhId}
                setKhariltsagchiinKhunglultUramshuulal={
                  setKhariltsagchiinKhunglultUramshuulal
                }
                khariltsagchiinKhunglultUramshuulal={
                  khariltsagchiinKhunglultUramshuulal
                }
                setShineSongogdsomEmnuud={setShineSongogdsomEmnuud}
                form={form}
                baiguullagaTatvar={baiguullagaTatvar}
                setTurul={setTurul}
                turul={turul}
                setShineerBarimtiinDugaarAviya={setShineerBarimtiinDugaarAviya}
                setGuilgeeniiDugaar={setGuilgeeniiDugaar}
                baraaMutate={baraaMutate}
                niitDunNoat={niitDunNoat}
                guilgeeniiDugaar={guilgeeniiDugaar}
                songogdsomEmnuud={songogdsomEmnuud}
                setSongogdsomEmnuud={setSongogdsomEmnuud}
                setQpayModal={setQpayModal}
                setHynaltiinDugaaraarLavlagaaAvakhData={
                  setHynaltiinDugaaraarLavlagaaAvakhData
                }
                hynaltiinDugaaraarLavlagaaAvakhData={
                  hynaltiinDugaaraarLavlagaaAvakhData
                }
                baraaNUATModalOpen={baraaNUATModalOpen}
                setBaraaNUATModalOpen={setBaraaNUATModalOpen}
                scrollToUldegdelguiItem={scrollToUldegdelguiItem}
                eBarimtShine={baiguullaga?.tokhirgoo?.eBarimtShine}
                shuudTulukh={shuudTulukh}
                setShuudTulukh={setShuudTulukh}
                qpayModal={qpayModal}
                billModal={billModal}
                setBillModal={setBillModal}
                isModalOpen={isModalOpenTulbur}
                setIsModalOpen={setIsModalOpenTulbur}
              />
            </div>
          </div>
        )}

        {songogdsonKhudaldaa === "khuleelge" && (
          <div className="mt-auto flex w-full items-center justify-center place-self-end ">
            <Button
              onClick={() => {
                const suuliinKhaaltOgnooMoment =
                  suuliinKhaaltOgnooData &&
                  moment(suuliinKhaaltOgnooData?.ognoo).startOf("day");
                const servereesAvsanUnuuduriinTsagMoment = moment(
                  servereesAvsanUnuuduriinTsag
                ).startOf("day");

                if (
                  servereesAvsanUnuuduriinTsagMoment.isSameOrBefore(
                    suuliinKhaaltOgnooMoment
                  ) &&
                  ajiltan?._id === suuliinKhaaltOgnooData?.burtgesenAjiltan
                ) {
                  return AnkhaaruulgaAlert("Өнөөдөр хаалт хийсэн байна.");
                } else {
                  return huleelgeesHudaldahruuZakhialgaKhiiy();
                }
              }}
              type="primary"
              style={{ height: "57px" }}
              className="w-[288px]"
            >
              Идэвхжүүлэх [ENTER]
            </Button>
          </div>
        )}
        <UramshuulalModal
          uramshuulal={uramshuulal}
          setUramshuulal={setUramshuulal}
          posEsekh={true}
          uramshuulalOruulakh={uramshuulalOruulakh}
        />
        <BelegSongokhModal
          uramshuulalShalgakh={uramshuulalShalgakh}
          songogdsomEmnuud={songogdsomEmnuud}
          setSongokhBelegnuud={setSongokhBelegnuud}
          songogdsonBelegnuud={songogdsonBelegnuud}
          setSongogdsonBelegnuud={setSongogdsonBelegnuud}
          songokhBelegnuud={songokhBelegnuud}
        />
        <EBarimtModal
          setGuilgeeniiId={setGuilgeeniiId}
          guilgeeniiId={guilgeeniiId}
          setBaiguullagaTatvar={setBaiguullagaTatvar}
          baiguullagaTatvar={baiguullagaTatvar}
          baiguullaga={baiguullaga}
          salbariinId={salbariinId}
          token={token}
          guilgeeniiDugaar={guilgeeniiDugaar}
          ajiltan={ajiltan}
          baiguullagiinId={baiguullagiinId}
          turul={turul}
          setTurul={setTurul}
          setQpayModal={setQpayModal}
          qpayModal={qpayModal}
          hynaltiinDugaaraarLavlagaaAvakhData={
            hynaltiinDugaaraarLavlagaaAvakhData
          }
          setHynaltiinDugaaraarLavlagaaAvakhData={
            setHynaltiinDugaaraarLavlagaaAvakhData
          }
          eBarimtShine={baiguullaga?.tokhirgoo?.eBarimtShine}
          shuudTulukh={shuudTulukh}
          setShuudTulukh={setShuudTulukh}
          niitDunNoat={niitDunNoat}
        />

        <Bill
          billModal={billModal}
          setBillModal={setBillModal}
          setGuilgeeniiId={setGuilgeeniiId}
          guilgeeniiId={guilgeeniiId}
          baiguullaga={baiguullaga}
          salbariinId={salbariinId}
          token={token}
          guilgeeniiDugaar={guilgeeniiDugaar}
          ajiltan={ajiltan}
          baiguullagiinId={baiguullagiinId}
          turul={turul}
          setTurul={setTurul}
          shuudTulukh={shuudTulukh}
          setShuudTulukh={setShuudTulukh}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ButeegdekhuunBurtgel;
