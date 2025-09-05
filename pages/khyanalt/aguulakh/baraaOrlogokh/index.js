import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Popover,
  Select,
  AutoComplete,
  Form,
  Input as AntdInput,
} from "antd";
import {
  CloseCircleTwoTone,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import { MdOutlineArrowBack } from "react-icons/md";
import moment from "moment";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import { Input, InputNumber } from "components/ant/AntdInput";
import useBaraa from "hooks/useBaraa";
import { DatePicker } from "components/ant/AntdDatePicker";
import formatNumber from "tools/function/formatNumber";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import BaraaBurtgekh from "components/modalBody/aguulakh/baraaBurtgekh";
import KhariltsagchNemekhModal from "components/modalBody/khariltsagch/khariltsagchNemekhModal";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import useScanDetection from "tools/logic/useScanDetection";
import { FiPlus } from "react-icons/fi";

const order = { createdAt: -1 };
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

const index = () => {
  const { token, ajiltan, baiguullagiinId, salbariinId } = useAuth();

  const [songogdsonBaraanuud, setSongogdsonBaraanuud] = useState([]);
  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [khariltsagchiinNer, setKhariltsagchNer] = useState();
  const [formDotrokhData, setFormDotrokhData] = useState([]);
  const [initialValues, setInitialValues] = useState([]);
  const [scanneraarHaisanBarCode, setSanneraarHaisanBarCode] = useState();
  const [loading, setLoading] = useState(false);
  const [khelber, setKhelber] = useState();
  const [form] = Form.useForm();
  const router = useRouter();

  const { params } = router.query;

  function barCodeAshiglanNemekh(code) {
    if (code && String(code).match(/^\d+$/)) {
      posUilchilgee(token)
        .post("/barCodeoorBaraaAvya", {
          baiguullagiinId: baiguullagiinId,
          salbariinId: salbariinId,
          barCode: code,
        })
        .then(({ data }) => {
          var songogdsonBaraanuudDorotBaraaBaigaaEsekh =
            songogdsonBaraanuud.some((e) => e?.barCode === data?.barCode);

          if (songogdsonBaraanuudDorotBaraaBaigaaEsekh) {
            AnkhaaruulgaAlert(`${code} бар кодтой бараа сонгогдсон байна.`);
            setSanneraarHaisanBarCode();
          } else {
            var songogdson = data;

            songogdson.tooShirkheg = !!songogdson?.tooShirkheg
              ? songogdson?.tooShirkheg
              : 1;

            songogdson.une = !!songogdson.turSanakhUne
              ? songogdson.turSanakhUne
              : 0;

            songogdson.zadgaiUldegdelBodsonToo = !!songogdson.shirkheglekhEsekh
              ? 0
              : undefined;

            songogdson.shirkheglekhEsekh =
              songogdson.shirkheglekhEsekh || false;

            songogdson.baraaOrlogodohUrtugUne = songogdson.urtugUne;
            songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;

            songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;
            songogdson.ashiglakhUmnukhTsuvral = songogdson.umnukhTsuvraluud.map(
              (e) => ({
                value: e.ner,
              })
            );

            if (
              songogdson.tsuvraliinDugaartaiEsekh ||
              songogdson.ognooniiMedeelelBurtgekhEsekh
            ) {
              songogdson.baraaOrlogdokhTsuvral = [{}];
            }

            form.setFieldValue(
              ["baraanuud", songogdsonBaraanuud.length, "baraa"],
              songogdson._id
            );

            form.setFieldValue(
              ["baraanuud", songogdsonBaraanuud.length, "tsuvral"],
              [{}]
            );
            form.setFieldValue(
              [
                "baraanuud",
                songogdsonBaraanuud.length,
                "baraaOrlogodohZarakhUne",
              ],
              songogdson.niitUne
            );
            form.setFieldValue(
              [
                "baraanuud",
                songogdsonBaraanuud.length,
                "baraaOrlogodohUrtugUne",
              ],
              songogdson.urtugUne
            );

            setSanneraarHaisanBarCode();
            setSongogdsonBaraanuud((prev) => [...prev, songogdson]);
          }
        })
        .catch((err) => aldaaBarigch(err));
    }
  }

  const queryAguulakh = useMemo(() => {
    const qeury = {
      baiguullagiinId: baiguullagiinId,
      khariltsagchiinId: { $exists: true },
      salbariinId: salbariinId,
      zassanEsekh: { $ne: true },
    };

    return qeury;
  }, [baiguullagiinId, salbariinId]);

  if (typeof window !== "undefined") {
    useScanDetection({
      minLength: 8,
      onComplete: (code) => {
        barCodeAshiglanNemekh(code);
      },
    });
  }

  const {
    data: tuukh,
    setKhuudaslalt: setBaraaOrlogdokhKhuudaslalt,
    mutate,
    isValidating,
  } = posUseJagsaalt(
    !!params && `/orlogoZarlagiinTuukh/${params}`,
    queryAguulakh,
    order,
    undefined,
    searchKeys
  );

  const queryBaraa = useMemo(() => {
    if (!!tuukh) {
      return {
        code: { $in: tuukh?.baraanuud?.map((a) => a.code) },
      };
    }
  }, [tuukh]);

  const { baraaGaralt: zasakhBaraaGaralt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    queryBaraa
  );

  const queryScannerBaraa = useMemo(() => {
    if (!!scanneraarHaisanBarCode) {
      return {
        barCode: { $in: scanneraarHaisanBarCode },
      };
    }
  }, [scanneraarHaisanBarCode]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    queryScannerBaraa
  );

  // useEffect(() => {
  //   if (!!scanneraarHaisanBarCode && !!baraaGaralt?.jagsaalt?.[0]) {
  //     var songogdsonBaraanuudDorotBaraaBaigaaEsekh = songogdsonBaraanuud.some(
  //       (e) => e?.barCode === baraaGaralt?.jagsaalt?.[0].barCode
  //     );

  //     if (songogdsonBaraanuudDorotBaraaBaigaaEsekh) {
  //       AnkhaaruulgaAlert(
  //         `${scanneraarHaisanBarCode} бар кодтой бараа сонгогдсон байна.`
  //       );
  //       setSanneraarHaisanBarCode();
  //     } else {
  //       var songogdson = baraaGaralt?.jagsaalt?.[0];

  //       songogdson.tooShirkheg = !!songogdson?.tooShirkheg
  //         ? songogdson?.tooShirkheg
  //         : 1;

  //       songogdson.une = !!songogdson.turSanakhUne
  //         ? songogdson.turSanakhUne
  //         : 0;

  //       songogdson.zadgaiUldegdelBodsonToo = !!songogdson.shirkheglekhEsekh
  //         ? 0
  //         : undefined;

  //       songogdson.shirkheglekhEsekh = songogdson.shirkheglekhEsekh || false;

  //       songogdson.baraaOrlogodohUrtugUne = songogdson.urtugUne;
  //       songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;

  //       songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;
  //       songogdson.ashiglakhUmnukhTsuvral = songogdson.umnukhTsuvraluud.map(
  //         (e) => ({
  //           value: e,
  //         })
  //       );

  //       if (
  //         songogdson.tsuvraliinDugaartaiEsekh ||
  //         songogdson.ognooniiMedeelelBurtgekhEsekh
  //       ) {
  //         songogdson.baraaOrlogdokhTsuvral = [{}];
  //       }

  //       form.setFieldValue(
  //         ["baraanuud", songogdsonBaraanuud.length, "baraa"],
  //         songogdson._id
  //       );

  //       form.setFieldValue(
  //         ["baraanuud", songogdsonBaraanuud.length, "tsuvral"],
  //         [{}]
  //       );
  //       form.setFieldValue(
  //         ["baraanuud", songogdsonBaraanuud.length, "baraaOrlogodohZarakhUne"],
  //         songogdson.niitUne
  //       );
  //       form.setFieldValue(
  //         ["baraanuud", songogdsonBaraanuud.length, "baraaOrlogodohUrtugUne"],
  //         songogdson.urtugUne
  //       );

  //       setSanneraarHaisanBarCode();
  //       setSongogdsonBaraanuud((prev) => [...prev, songogdson]);
  //     }
  //   }
  // }, [scanneraarHaisanBarCode, baraaGaralt]);

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      turul: "Нийлүүлэгч",
    }),
    [baiguullagiinId]
  );

  const {
    data,
    setKhuudaslalt,
    onSearch,
    mutate: khariltsagchMutate,
  } = posUseJagsaalt(
    "/khariltsagch",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  function formdUtgaSetley(object, index, tsuvral) {
    form.setFieldValue(["baraanuud", index, "baraa"], object._id);

    form.setFieldValue(
      ["baraanuud", index, "baraaOrlogodohZarakhUne"],
      object.zarakhUne
    );

    form.setFieldValue(
      ["baraanuud", index, "baraaOrlogodohUrtugUne"],
      object.urtugUne
    );

    form.setFieldValue(["baraanuud", index, "tsuvral"], tsuvral);
    if (
      !object.ognooniiMedeelelBurtgekhEsekh ||
      !object.tsuvraliinDugaartaiEsekh
    ) {
      form.setFieldValue(
        ["baraanuud", index, "baraaOrlogdohTooHemjee"],
        object?.too
      );

      form.setFieldValue(
        ["baraanuud", index, "baraaOrlogdohTooHemjeeZadgai"],
        object?.hairtsagToo
      );
    }
  }

  // function baraaShalgajSetley(tukhainBaraa) {
  //   console.log(tukhainBaraa, "tukhainBaraa");
  //   tukhainBaraa.tooShirkheg = !!tukhainBaraa.tooShirkheg
  //     ? tukhainBaraa.tooShirkheg
  //     : 1;

  //   tukhainBaraa.une = !!tukhainBaraa.turSanakhUne
  //     ? tukhainBaraa.turSanakhUne
  //     : 0;

  //   tukhainBaraa.zadgaiUldegdelBodsonToo = !!tukhainBaraa.shirkheglekhEsekh
  //     ? 0
  //     : undefined;

  //   tukhainBaraa.shirkheglekhEsekh = tukhainBaraa.shirkheglekhEsekh || false;

  //   tukhainBaraa.baraaOrlogodohUrtugUne = tukhainBaraa.urtugUne;
  //   tukhainBaraa.baraaOrlogodohZarakhUne = tukhainBaraa.niitUne;

  //   if (
  //     tukhainBaraa.tsuvraliinDugaartaiEsekh ||
  //     tukhainBaraa.ognooniiMedeelelBurtgekhEsekh
  //   ) {
  //     tukhainBaraa.baraaOrlogdokhTsuvral = [{}];
  //   }
  // }

  useEffect(() => {
    if (!!zasakhBaraaGaralt && !!tuukh) {
      setKhariltsagchiinId(tuukh.khariltsagchiinId);
      setKhariltsagchNer(tuukh.khariltsagchiinNer);
      setKhelber(!!tuukh.khelber && tuukh.khelber);
      setSongogdsonBaraanuud(() => {
        const hadgalah = tuukh?.baraanuud.map((e, i) => {
          var oldsonData = zasakhBaraaGaralt?.jagsaalt.find(
            (el) => el.code === e.code
          );
          var haruulakhTsuvralData = e?.tsuvral?.map((tsu, ind) => {
            const tsuvralData = {};

            if (e?.shirkheglekhEsekh && !!e?.negKhairtsaganDahiShirhegiinToo) {
              tsuvralData.butarhaiBolgosonZadgai =
                +tsu?.zadgaiUldegdel / +e.negKhairtsaganDahiShirhegiinToo;

              tsuvralData.khairtsagBodooguiToo =
                tsu?.too -
                formatNumber(
                  +tsu?.zadgaiUldegdel / +e.negKhairtsaganDahiShirhegiinToo,
                  2
                );
            }

            if (tsu?.duusakhOgnoo) {
              tsuvralData.duusakhOgnoo = moment(tsu.duusakhOgnoo);
            }

            if (tsu?.too !== undefined) {
              tsuvralData.too = tsu.too;
              tsuvralData.baraaOrlogdohTooHemjee = tsu.too;
            }

            if (tsu?.dugaar !== undefined) {
              tsuvralData.dugaar = tsu.dugaar;
              tsuvralData.tsuvraliinDugaar = tsu.dugaar;
            }

            if (tsu?.zadgaiUldegdel !== undefined) {
              tsuvralData.zadgaiUldegdel = tsu.zadgaiUldegdel;
            }

            return tsuvralData;
          });

          var ashiglakhUmnukhTsuvral = oldsonData.umnukhTsuvraluud?.map(
            (tsu, ind) => {
              const tsuvralData = {};

              tsuvralData.value = tsu.ner;

              return tsuvralData;
            }
          );
          formdUtgaSetley(e, i, haruulakhTsuvralData);

          return {
            ...e,
            negKhairtsaganDahiShirhegiinToo: oldsonData?.shirkheglekhEsekh
              ? oldsonData?.negKhairtsaganDahiShirhegiinToo
              : undefined,
            uldegdel: oldsonData?.uldegdel,
            butarhaiBodooguiToo: e.hairtsagToo,
            khairtsagBodooguiToo: e.zadgaiUldegdel,
            baraaOrlogohNiitToo: e.too,
            baraaOrlogodohZarakhUne: e.zarakhUne,
            baraaOrlogodohUrtugUne: e.urtugUne,
            baraaOrlogdokhTsuvral: haruulakhTsuvralData,
            ashiglakhUmnukhTsuvral,
          };
        });
        return hadgalah;
      });
    }
  }, [tuukh, zasakhBaraaGaralt]);

  function baraaSongokh(v, index, turul) {
    if (v === undefined) {
      if (index >= 0 && index < songogdsonBaraanuud?.length) {
        setSongogdsonBaraanuud((prev) => {
          songogdsonBaraanuud[index] = {};

          return songogdsonBaraanuud;
        });

        form.setFieldValue(["baraanuud", index, "tsuvral"], []);
      }
    } else {
      const niitBut = [
        ...songogdsonBaraanuud,
        ..._.cloneDeep(
          baraaGaralt?.jagsaalt.filter(
            (z) => !songogdsonBaraanuud.find((k) => k?._id === z?._id)
          )
        ),
      ];
      var songogdson = niitBut.find((x) => x?._id === v);

      songogdson.tooShirkheg = !!songogdson.tooShirkheg
        ? songogdson.tooShirkheg
        : 1;

      songogdson.une = !!songogdson.turSanakhUne ? songogdson.turSanakhUne : 0;

      songogdson.zadgaiUldegdelBodsonToo = !!songogdson.shirkheglekhEsekh
        ? 0
        : undefined;

      songogdson.shirkheglekhEsekh = songogdson.shirkheglekhEsekh || false;

      songogdson.baraaOrlogodohUrtugUne = songogdson.urtugUne;
      songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;

      songogdson.baraaOrlogodohZarakhUne = songogdson.niitUne;
      songogdson.ashiglakhUmnukhTsuvral = songogdson.umnukhTsuvral.map((e) => ({
        value: e.ner,
      }));

      if (
        songogdson.tsuvraliinDugaartaiEsekh ||
        songogdson.ognooniiMedeelelBurtgekhEsekh
      ) {
        songogdson.baraaOrlogdokhTsuvral = [{}];
      }
      form.setFieldValue(["baraanuud", index, "tsuvral"], [{}]);

      form.setFieldValue(
        ["baraanuud", index, "baraaOrlogodohZarakhUne"],
        songogdson.niitUne
      );
      form.setFieldValue(
        ["baraanuud", index, "baraaOrlogodohUrtugUne"],
        songogdson.urtugUne
      );

      setSongogdsonBaraanuud((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = songogdson;
        return updatedArray;
      });
    }
  }

  function baraaNemekh() {
    setSongogdsonBaraanuud((prevState) => [...prevState, {}]);
  }

  function tsuvraliinGadnaUildelKhiiy(value, talbar, id, index) {
    if (talbar === "baraaOrlogdohTooHemjeeZadgai") {
      setSongogdsonBaraanuud((prev) => {
        const updatedArray = prev.map((item) => {
          if (item._id === id) {
            var butarhaiBolgosonZadgai =
              parseFloat(value || 0) /
              parseFloat(item.negKhairtsaganDahiShirhegiinToo || 1);

            form.setFieldValue(
              ["baraanuud", index, "niitUrtug"],
              (item.khairtsagBodooguiToo + (butarhaiBolgosonZadgai || 0)) *
                item.baraaOrlogodohUrtugUne
            );

            return {
              ...item,
              [talbar]: value,
              butarhaiBolgosonZadgai: butarhaiBolgosonZadgai,
              baraaOrlogdohTooHemjee:
                item.baraaOrlogdohTooHemjee + butarhaiBolgosonZadgai,

              baraaOrlogohNiitToo:
                (item.khairtsagBodooguiToo || 0) +
                (butarhaiBolgosonZadgai || 0),

              butarhaiBodooguiToo: parseFloat(value || 0),
            };
          }
          return item;
        });

        return updatedArray;
      });
    } else if (talbar === "baraaOrlogdohTooHemjee") {
      setSongogdsonBaraanuud((prev) => {
        const updatedArray = prev.map((item) => {
          if (item._id === id) {
            var butarhaiBolgosonZadgai =
              parseFloat(item.butarhaiBodooguiToo) /
              parseFloat(item.negKhairtsaganDahiShirhegiinToo);

            form.setFieldValue(
              ["baraanuud", index, "niitUrtug"],
              (value + (butarhaiBolgosonZadgai || 0)) *
                songogdsonBaraanuud[index].baraaOrlogodohUrtugUne
            );

            return {
              ...item,
              [talbar]: value + butarhaiBolgosonZadgai || 0,

              baraaOrlogohNiitToo: item.shirkheglekhEsekh
                ? value + (item.butarhaiBolgosonZadgai || 0)
                : value,

              khairtsagBodooguiToo: value,
            };
          }
          return item;
        });

        return updatedArray;
      });
    } else {
      setSongogdsonBaraanuud((prev) => {
        const updatedArray = prev.map((item) => {
          if (item._id === id) {
            return { ...item, [talbar]: value };
          }
          return item;
        });

        return updatedArray;
      });
    }
  }

  function tsuvralDotorUildelKhiiy(value, talbar, baraaniiId, tsuvraliinIndex) {
    setSongogdsonBaraanuud((prevSongogdsonBaraanuud) => {
      var updatedSongogdsonBaraanuud = [...prevSongogdsonBaraanuud];

      var foundBaraa = updatedSongogdsonBaraanuud.find(
        (baraa) => baraa._id === baraaniiId
      );

      if (foundBaraa && foundBaraa.baraaOrlogdokhTsuvral) {
        if (
          tsuvraliinIndex >= 0 &&
          tsuvraliinIndex < foundBaraa.baraaOrlogdokhTsuvral.length
        ) {
          if (talbar === "duusakhOgnoo") {
            const dateObject = new Date(value);
            const formattedDate = dateObject.toISOString();
            foundBaraa.baraaOrlogdokhTsuvral[tsuvraliinIndex][talbar] =
              formattedDate;
          } else if (talbar === "baraaOrlogdohTooHemjee") {
            var butarhaiBolgosonZadgai =
              parseFloat(foundBaraa.zadgaiUldegdel || 0) /
              parseFloat(foundBaraa.negKhairtsaganDahiShirhegiinToo);

            foundBaraa.baraaOrlogdokhTsuvral[tsuvraliinIndex][talbar] =
              foundBaraa.shirkheglekhEsekh
                ? value + (butarhaiBolgosonZadgai || 0)
                : value;

            foundBaraa.baraaOrlogdokhTsuvral[
              tsuvraliinIndex
            ].khairtsagBodooguiToo = value;
          } else if (talbar === "zadgaiUldegdel") {
            var butarhaiBolgosonZadgai =
              parseFloat(value || 0) /
              parseFloat(foundBaraa.negKhairtsaganDahiShirhegiinToo || 0);

            foundBaraa.baraaOrlogdokhTsuvral[tsuvraliinIndex][talbar] = value;

            foundBaraa.baraaOrlogdokhTsuvral[
              tsuvraliinIndex
            ].butarhaiBolgosonZadgai = butarhaiBolgosonZadgai;

            foundBaraa.baraaOrlogdokhTsuvral[
              tsuvraliinIndex
            ].baraaOrlogdohTooHemjee =
              (foundBaraa.baraaOrlogdokhTsuvral[tsuvraliinIndex]
                .khairtsagBodooguiToo || 0) + butarhaiBolgosonZadgai;
          } else {
            foundBaraa.baraaOrlogdokhTsuvral[tsuvraliinIndex][talbar] = value;
          }
        }
      }

      updatedSongogdsonBaraanuud.forEach((baraa) => {
        const sumBaraaOrlogdohTooHemjee = baraa?.baraaOrlogdokhTsuvral?.reduce(
          (total, tsuvral) => total + tsuvral?.baraaOrlogdohTooHemjee,
          0
        );

        if (baraa._id === baraaniiId) {
          baraa.baraaOrlogohNiitToo = sumBaraaOrlogdohTooHemjee;
        }
      });

      return updatedSongogdsonBaraanuud;
    });
  }

  function onFinish(data) {
    setLoading(true);
    if (!!khariltsagchiinNer) {
      if (!!params) {
        const baraanuud = songogdsonBaraanuud.map((baraa) => {
          return {
            too:
              baraa.tsuvraliinDugaartaiEsekh ||
              baraa.ognooniiMedeelelBurtgekhEsekh
                ? parseFloat(
                    baraa.baraaOrlogdokhTsuvral
                      .reduce(
                        (acc, tsuvral) => acc + tsuvral.baraaOrlogdohTooHemjee,
                        0
                      )
                      .toFixed(2)
                  )
                : baraa.baraaOrlogohNiitToo,

            ner: baraa.ner,
            shirkheglekhEsekh: baraa.shirkheglekhEsekh,
            tsuvraliinDugaartaiEsekh: baraa.tsuvraliinDugaartaiEsekh,
            barCode: baraa.barCode,
            ognooniiMedeelelBurtgekhEsekh: baraa.ognooniiMedeelelBurtgekhEsekh,
            code: baraa.code,
            zarakhUne: baraa.baraaOrlogodohZarakhUne,
            urtugUne: baraa.baraaOrlogodohUrtugUne,
            hairtsagToo: baraa.butarhaiBodooguiToo,
            zadgaiUldegdel: baraa.khairtsagBodooguiToo,
            _id: baraa._id,
            tsuvral:
              baraa.tsuvraliinDugaartaiEsekh ||
              baraa.ognooniiMedeelelBurtgekhEsekh
                ? baraa.baraaOrlogdokhTsuvral.map((el) => ({
                    dugaar: el.dugaar,
                    duusakhOgnoo: el.duusakhOgnoo,
                    hairtsagToo: el.khairtsagBodooguiToo,
                    too: parseFloat(el.baraaOrlogdohTooHemjee.toFixed(2)),
                    zadgaiUldegdel: el.zadgaiUldegdel,
                  }))
                : undefined,
          };
        });

        var niitDun = 0;
        var warnMessage = "";
        for (const mur of baraanuud) {
          if (mur.urtugUne === 0) warnMessage += "Нэгж өртөг үнэ оруулна уу! ";
          if (mur.zarakhUne === 0) warnMessage += "Зарах үнэ оруулна уу! ";
          if (mur.urtugUne > mur.zarakhUne)
            warnMessage += "Нэгж өртөг нь худалдааны үнээсээ их байна! ";
          if (
            mur.tsuvraliinDugaartaiEsekh === true ||
            mur.ognooniiMedeelelBurtgekhEsekh === true
          ) {
            mur.too = mur.tsuvral.reduce((a, b) => a + b.too, 0);
          }
          niitDun = mur.urtugUne * mur.too + niitDun;
        }
        if (!!warnMessage) {
          AnkhaaruulgaAlert(warnMessage);
          setLoading(false);
          return;
        }

        const yavuulahData = {
          _id: params,
          baraanuud,
          niitDun,
          khelber: khelber,
          ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
          butsaaltiinTuluv: "Бараа сонгох",
          salbariinId: salbariinId,
          baiguullagiinId: baiguullagiinId,
          khariltsagchiinId: khariltsagchiinId,
          shaltgaan: "Засвар",
          khariltsagchiinNer: khariltsagchiinNer,
          zasakhEsekh: true,
        };

        posUilchilgee(token)
          .post("/orlogButsaaltKhiiye", yavuulahData)
          .then((khariu) => {
            if (khariu.data === "Amjilttai") {
              AmjilttaiAlert("Амжилттай");
              form.resetFields();
              setSongogdsonBaraanuud([]);
              setLoading(false);
              router.push(`/khyanalt/jagsaalt/baraaOrlogdojAvsanTuukh`);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setLoading(false);
          });
      } else {
        const baraanuud = songogdsonBaraanuud.map((baraa) => {
          return {
            too:
              baraa.tsuvraliinDugaartaiEsekh ||
              baraa.ognooniiMedeelelBurtgekhEsekh
                ? parseFloat(
                    baraa.baraaOrlogdokhTsuvral
                      .reduce(
                        (acc, tsuvral) => acc + tsuvral.baraaOrlogdohTooHemjee,
                        0
                      )
                      .toFixed(2)
                  )
                : baraa.baraaOrlogohNiitToo,

            ner: baraa.ner,
            shirkheglekhEsekh: baraa.shirkheglekhEsekh,
            tsuvraliinDugaartaiEsekh: baraa.tsuvraliinDugaartaiEsekh,
            barCode: baraa.barCode,
            ognooniiMedeelelBurtgekhEsekh: baraa.ognooniiMedeelelBurtgekhEsekh,
            code: baraa.code,
            negKhairtsaganDahiShirhegiinToo:
              baraa.negKhairtsaganDahiShirhegiinToo
                ? baraa.negKhairtsaganDahiShirhegiinToo
                : undefined,

            zarakhUne: baraa.baraaOrlogodohZarakhUne,
            urtugUne: baraa.baraaOrlogodohUrtugUne,
            hairtsagToo: baraa.butarhaiBodooguiToo,
            zadgaiUldegdel: baraa.khairtsagBodooguiToo,
            _id: baraa._id,
            tsuvral:
              baraa.tsuvraliinDugaartaiEsekh ||
              baraa.ognooniiMedeelelBurtgekhEsekh
                ? baraa.baraaOrlogdokhTsuvral.map((el) => ({
                    dugaar: el.dugaar,
                    duusakhOgnoo: el.duusakhOgnoo,
                    hairtsagToo: el.khairtsagBodooguiToo,
                    too: parseFloat(el.baraaOrlogdohTooHemjee.toFixed(2)),
                    zadgaiUldegdel: el.zadgaiUldegdel,
                  }))
                : undefined,
          };
        });
        var niitDun = 0;
        var warnMessage = "";
        for (const mur of baraanuud) {
          if (mur.urtugUne === 0) warnMessage += "Нэгж өртөг үнэ оруулна уу! ";
          if (mur.zarakhUne === 0) warnMessage += "Зарах үнэ оруулна уу! ";
          if (mur.urtugUne > mur.zarakhUne)
            warnMessage += "Нэгж өртөг нь худалдааны үнээсээ их байна! ";
          niitDun = parseFloat((mur.urtugUne * mur.too + niitDun).toFixed(2));
        }
        if (!!warnMessage) {
          AnkhaaruulgaAlert(warnMessage);
          setLoading(false);
          return;
        }

        const yavuulahData = {
          ajiltan: { id: ajiltan?._id, ner: ajiltan?.ner },
          baiguullagiinId,
          salbariinId,
          baiguullagiinId: salbariinId,
          khariltsagchiinId,
          khariltsagchiinNer,
          khelber,
          baraanuud,
          niitDun,
        };

        posUilchilgee(token)
          .post("/baraaOrlogodyo", yavuulahData)
          .then((khariu) => {
            if (khariu.data === "Amjilttai") {
              AmjilttaiAlert("Амжилттай орлогдлоо");
              form.resetFields();
              setSongogdsonBaraanuud([]);
              setLoading(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setLoading(false);
          });
      }
    } else {
      AnkhaaruulgaAlert("Нийлүүлэгч сонгоогүй байна!");
      setLoading(false);
    }
  }

  function baraaUstgah(baraaniiId, index) {
    if (baraaniiId === undefined && index !== undefined) {
      setSongogdsonBaraanuud((prevSongogdsonBaraanuud) => {
        if (index >= 0 && index < prevSongogdsonBaraanuud?.length) {
          const updatedSongogdsonBaraanuud = [...prevSongogdsonBaraanuud];
          updatedSongogdsonBaraanuud.splice(index, 1);
          return updatedSongogdsonBaraanuud;
        }

        return prevSongogdsonBaraanuud;
      });
    } else {
      setSongogdsonBaraanuud((prevSongogdsonBaraanuud) => {
        const updatedSongogdsonBaraanuud = prevSongogdsonBaraanuud.filter(
          (baraa) => baraa._id !== baraaniiId
        );

        return updatedSongogdsonBaraanuud;
      });
    }
  }

  function tsuvralKhasiy(baraaniiID, tsuvralIndex) {
    const updatedBaanuud = [...songogdsonBaraanuud];

    const foundIndex = updatedBaanuud.findIndex(
      (baraa) => baraa._id === baraaniiID
    );

    if (foundIndex !== -1) {
      const foundBaraa = { ...updatedBaanuud[foundIndex] };

      if (foundBaraa.baraaOrlogdokhTsuvral) {
        if (
          tsuvralIndex >= 0 &&
          tsuvralIndex < foundBaraa.baraaOrlogdokhTsuvral.length
        ) {
          const updatedTsuvralArray = [...foundBaraa.baraaOrlogdokhTsuvral];
          updatedTsuvralArray.splice(tsuvralIndex, 1);
          foundBaraa.baraaOrlogdokhTsuvral = updatedTsuvralArray;
          updatedBaanuud[foundIndex] = foundBaraa;
          setSongogdsonBaraanuud(updatedBaanuud);
        }
      }
    }
  }

  function tsuvralNemekh(baraaniiID) {
    setSongogdsonBaraanuud((prevSongogdsonBaraanuud) => {
      const updatedSongogdsonBaraanuud = [...prevSongogdsonBaraanuud];

      const foundBaraaIndex = updatedSongogdsonBaraanuud.findIndex(
        (baraa) => baraa._id === baraaniiID
      );

      if (foundBaraaIndex !== -1) {
        const foundBaraa = updatedSongogdsonBaraanuud[foundBaraaIndex];

        if (!foundBaraa.baraaOrlogdokhTsuvral) {
          foundBaraa.baraaOrlogdokhTsuvral = [];
        }

        foundBaraa.baraaOrlogdokhTsuvral.push({});

        updatedSongogdsonBaraanuud[foundBaraaIndex] = foundBaraa;
      }

      return updatedSongogdsonBaraanuud;
    });
  }

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <Admin
      khuudasniiNer={"baraaOrlogokh"}
      className={"p-4"}
      title={<div className="dark:text-gray-300">Бараа орлогодох</div>}
    >
      <div className="col-span-12 h-full gap-4">
        <div className="flex !w-[100%] gap-2">
          <Form
            className={"flex w-full flex-col gap-5"}
            form={form}
            onFinish={onFinish}
            // initialValues={{ baraanuud: [{}] }}
          >
            <div className="h-[80vh] px-2">
              <Form.List
                name={`baraanuud`}
                className={"flex w-full flex-wrap "}
              >
                {(fields, { add, remove }) => (
                  <>
                    <div className="flex h-[40px] w-full gap-2 ">
                      <div className="flex w-[250px] gap-2 ">
                        <div className="mt-2 dark:text-gray-200">
                          <MdOutlineArrowBack
                            onClick={goBack}
                            className="cursor-pointer text-xl"
                          />
                        </div>
                        <Form.Item className="w-[100%]">
                          <Select
                            bordered={false}
                            value={khariltsagchiinId}
                            onChange={(v) => {
                              setKhariltsagchiinId(v);
                              const khariltsagch = data?.jagsaalt.find(
                                (mur) => mur._id === v
                              );

                              if (khariltsagch) {
                                setKhariltsagchNer(khariltsagch.ner);
                              }
                            }}
                            placeholder="Нийлүүлэгч сонгох"
                            className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
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
                          >
                            {data?.jagsaalt?.map((mur) => {
                              return (
                                <Select.Option key={mur?._id}>
                                  <div
                                    className={`flex justify-start dark:bg-gray-800 dark:text-gray-200`}
                                  >
                                    <div className="font-bold">{mur?.ner}</div>
                                    {"---"}
                                    {mur?.register}
                                  </div>
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="w-[250px]">
                        <Form.Item className="w-full">
                          <Select
                            value={khelber}
                            onChange={(v) => setKhelber(v)}
                            bordered={false}
                            placeholder="Хэлбэр сонгох"
                            className="w-full overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                          >
                            <Select.Option key="zeel">
                              <div
                                className={`flex justify-start dark:bg-gray-800 dark:text-gray-200 `}
                              >
                                Зээл
                              </div>
                            </Select.Option>
                            <Select.Option key="belen">
                              <div className={`flex justify-start `}>Бэлэн</div>
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <Button
                        className="dark:border-2 dark:border-[#4FD1C5] dark:bg-gray-900 dark:text-gray-300"
                        onClick={() => {
                          add(), baraaNemekh();
                        }}
                      >
                        Бараа нэмэх
                      </Button>
                      <div>
                        <BaraaBurtgekh mutate={baraaMutate} />
                      </div>
                      <div>
                        <KhariltsagchNemekhModal mutate={khariltsagchMutate} />
                      </div>
                    </div>
                    <div className="flex max-h-[70vh] flex-wrap gap-2 overflow-y-auto py-2 pl-2 ">
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div
                          className={`relative flex  w-[32%] flex-col gap-5 rounded-lg p-2 ring-2 ring-blue-500 ring-opacity-50`}
                        >
                          <div className="absolute right-1 top-3">
                            <CloseCircleTwoTone
                              onClick={() => {
                                remove(index);
                                baraaUstgah(
                                  songogdsonBaraanuud[index]?._id,
                                  index
                                );
                              }}
                              className="cursor-pointer"
                              twoToneColor="#eb2f96"
                              style={{ fontSize: "20px" }}
                            />
                          </div>
                          <div className="flex h-[40px] w-[90%] ">
                            <div className="flex items-center justify-center rounded-full bg-[#62acb6] px-4 text-xl text-white">
                              {index + 1}
                            </div>
                            {!!songogdsonBaraanuud[index]?._id && (
                              <div className="w-[100%] px-4">
                                <Popover
                                  placement="top"
                                  content={
                                    <div>{songogdsonBaraanuud[index]?.id}</div>
                                  }
                                  trigger="click"
                                >
                                  <div className="cursor-pointer truncate">
                                    <div className="truncate">
                                      {songogdsonBaraanuud[index]?.id}
                                    </div>
                                  </div>
                                </Popover>
                                <div
                                  className=" z-50 flex flex-row overflow-hidden whitespace-nowrap font-bold  text-gray-600 "
                                  style={{ textOverflow: "ellipsis" }}
                                >
                                  <Popover
                                    placement="top"
                                    content={
                                      <div>
                                        {songogdsonBaraanuud[index]?.ner}
                                      </div>
                                    }
                                  >
                                    <div className="flex cursor-pointer gap-2 truncate dark:text-gray-200">
                                      <div>
                                        {songogdsonBaraanuud[index]?.code
                                          ? songogdsonBaraanuud[index]?.code
                                          : ""}
                                      </div>
                                      -
                                      <div className="truncate dark:text-gray-200">
                                        {songogdsonBaraanuud[index]?.ner}
                                      </div>
                                    </div>
                                  </Popover>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex text-xs font-bold text-yellow-600">
                                    Үлдэгдэл:{" "}
                                    {songogdsonBaraanuud[index]?.uldegdel
                                      ? songogdsonBaraanuud[index]?.uldegdel
                                      : 0}
                                  </div>

                                  {songogdsonBaraanuud[index]
                                    ?.shirkheglekhEsekh && (
                                    <div className="text-xs font-bold text-yellow-600">
                                      Нэг хайрцаг дахь ширхэг :
                                      {
                                        songogdsonBaraanuud[index]
                                          .negKhairtsaganDahiShirhegiinToo
                                      }
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex w-full items-center justify-center ">
                            <div className="flex !w-full flex-col gap-2">
                              <div className="flex w-full flex-col gap-2">
                                <div className="dark:text-gray-300">Бараа:</div>
                                <Form.Item
                                  className="!mb-0 w-full"
                                  labelCol={24}
                                  name={[name, "baraa"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Бараа сонгон уу",
                                    },
                                  ]}
                                >
                                  <Select
                                    // value={songogdsonBaraanuud[index].ner}
                                    bordered={false}
                                    onChange={(v) => {
                                      baraaSongokh(v, index, "shineBaraa");
                                    }}
                                    placeholder="Бараа сонгох"
                                    className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800"
                                    showSearch
                                    filterOption={(o) => o}
                                    allowClear={true}
                                    onClear={() => {
                                      setBaraaniiKhuudaslalt((e) => ({
                                        ...e,
                                        khuudasniiDugaar: 1,
                                        search: "",
                                      }));
                                    }}
                                    onSearch={(v) =>
                                      setBaraaniiKhuudaslalt((e) => ({
                                        ...e,
                                        khuudasniiDugaar: 1,
                                        search: v,
                                      }))
                                    }
                                  >
                                    {baraaGaralt?.jagsaalt?.map((mur) => {
                                      return (
                                        <Select.Option
                                          disabled={songogdsonBaraanuud.some(
                                            (e) => e._id === mur._id
                                          )}
                                          key={mur._id}
                                        >
                                          <div
                                            className={`flex w-[125px] justify-start`}
                                          >
                                            {mur.ner}
                                            {/* -{mur.code}-{mur.ner}-
                                              {mur.uldegdel ? mur.uldegdel : 0}-
                                              {mur.barCode ? mur.barCode : 0} */}
                                          </div>
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex w-full flex-col gap-2">
                                  <div className="dark:text-gray-300">
                                    Зарах үнэ:
                                  </div>

                                  <Form.Item
                                    name={[name, "baraaOrlogodohZarakhUne"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Зарах үнэ оруулна уу",
                                      },
                                    ]}
                                    className="!mb-0 w-full"
                                  >
                                    <InputNumber
                                      disabled={
                                        !songogdsonBaraanuud[index]?._id
                                      }
                                      onChange={(v) =>
                                        tsuvraliinGadnaUildelKhiiy(
                                          v,
                                          "baraaOrlogodohZarakhUne",
                                          songogdsonBaraanuud[index]._id,
                                          index
                                        )
                                      }
                                      value={
                                        !!songogdsonBaraanuud[index]?._id
                                          ? songogdsonBaraanuud[index]
                                              ?.baraaOrlogodohZarakhUne
                                          : 0
                                      }
                                      min={0}
                                      formatter={(value) =>
                                        `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ","
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Зарах үнэ"
                                    />
                                  </Form.Item>
                                </div>

                                <div className="flex w-full flex-col gap-2">
                                  <div className="dark:text-gray-300">
                                    Нэгж өртөг:
                                  </div>

                                  <Form.Item
                                    name={[name, "baraaOrlogodohUrtugUne"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Нэгж өртөг оруулна уу",
                                      },
                                    ]}
                                    className="!mb-0 w-full"
                                  >
                                    <InputNumber
                                      min={0}
                                      disabled={
                                        !songogdsonBaraanuud[index]?._id
                                      }
                                      onChange={(v) =>
                                        tsuvraliinGadnaUildelKhiiy(
                                          v,
                                          "baraaOrlogodohUrtugUne",
                                          songogdsonBaraanuud[index]._id,
                                          index
                                        )
                                      }
                                      value={
                                        !!songogdsonBaraanuud[index]?._id
                                          ? songogdsonBaraanuud[index]
                                              ?.baraaOrlogodohUrtugUne
                                          : 0
                                      }
                                      // value={songogdsonBaraanuud[
                                      //   index
                                      // ]?.baraaOrlogodohUrtugUne.toString()}

                                      formatter={(value) =>
                                        `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ","
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Нэгж өртөг"
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                              {songogdsonBaraanuud[index]
                                ?.ognooniiMedeelelBurtgekhEsekh === false &&
                                songogdsonBaraanuud[index]
                                  ?.tsuvraliinDugaartaiEsekh === false && (
                                  <>
                                    <div className="flex w-full items-start gap-2">
                                      <Form.Item
                                        className="!mb-0 w-full"
                                        name={[name, "baraaOrlogdohTooHemjee"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Тоо хэмжээ оруулна уу",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          min={0}
                                          onChange={(v) => {
                                            tsuvraliinGadnaUildelKhiiy(
                                              v,
                                              "baraaOrlogdohTooHemjee",
                                              songogdsonBaraanuud[index]._id,
                                              index
                                            );
                                          }}
                                          placeholder="Тоо хэмжээ"
                                        />
                                      </Form.Item>

                                      {songogdsonBaraanuud[index]
                                        ?.shirkheglekhEsekh === true && (
                                        <Form.Item
                                          name={[
                                            name,
                                            "baraaOrlogdohTooHemjeeZadgai",
                                          ]}
                                          style={{
                                            width: "100%",
                                            margin: 0,
                                          }}
                                        >
                                          <InputNumber
                                            min={0}
                                            placeholder={"Задгай1"}
                                            type="number"
                                            onChange={(v) => {
                                              tsuvraliinGadnaUildelKhiiy(
                                                v,
                                                "baraaOrlogdohTooHemjeeZadgai",
                                                songogdsonBaraanuud[index]?._id,
                                                index
                                              );

                                              form.setFieldValue(
                                                [
                                                  "baraanuud",
                                                  index,
                                                  "baraaOrlogdohTooHemjee",
                                                ],
                                                formatNumber(
                                                  (songogdsonBaraanuud[index]
                                                    ?.khairtsagBodooguiToo ||
                                                    0) +
                                                    parseFloat(v || 0) /
                                                      songogdsonBaraanuud[index]
                                                        ?.negKhairtsaganDahiShirhegiinToo,
                                                  2
                                                )
                                              );
                                            }}
                                            defaultValue={
                                              songogdsonBaraanuud[index]
                                                ?.baraaOrlogdohTooHemjeeZadgai
                                            }
                                          />
                                        </Form.Item>
                                      )}
                                    </div>
                                  </>
                                )}

                              {(songogdsonBaraanuud[index]
                                ?.ognooniiMedeelelBurtgekhEsekh === true ||
                                songogdsonBaraanuud[index]
                                  ?.tsuvraliinDugaartaiEsekh === true) && (
                                <Form.List name={[name, "tsuvral"]}>
                                  {(
                                    tsuvralFields = fields,
                                    { add: nemeh, remove: hasah }
                                  ) => (
                                    <>
                                      <div className=" absolute right-10 top-1 ">
                                        <Button
                                          type="primary"
                                          className="flex w-12 items-center justify-center  !rounded-full"
                                          onClick={() => {
                                            nemeh();
                                            tsuvralNemekh(
                                              songogdsonBaraanuud[index]._id
                                            );
                                          }}
                                        >
                                          <span className="flex h-5 w-5 items-center justify-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="feather feather-plus h-4 w-4"
                                            >
                                              <line
                                                x1="12"
                                                y1="5"
                                                x2="12"
                                                y2="19"
                                              ></line>
                                              <line
                                                x1="5"
                                                y1="12"
                                                x2="19"
                                                y2="12"
                                              ></line>
                                            </svg>
                                          </span>
                                        </Button>
                                      </div>
                                      <div className="max-h-[250px] overflow-y-auto">
                                        {tsuvralFields.map(
                                          (
                                            {
                                              key,
                                              name: tsuvralName,
                                              ...restField
                                            },
                                            i
                                          ) => (
                                            <div
                                              key={i}
                                              className="flex w-full items-center gap-1 text-sm"
                                            >
                                              {songogdsonBaraanuud[index]
                                                ?.tsuvraliinDugaartaiEsekh && (
                                                <Form.Item
                                                  {...restField}
                                                  className="!mb-0 w-full"
                                                  name={[
                                                    tsuvralName,
                                                    "tsuvraliinDugaar",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Цувралын дугаар оруулна уу",
                                                    },
                                                  ]}
                                                >
                                                  <AutoComplete
                                                    popupClassName="certain-category-search-dropdown"
                                                    onSelect={(value) =>
                                                      tsuvralDotorUildelKhiiy(
                                                        value,
                                                        "dugaar",
                                                        songogdsonBaraanuud[
                                                          index
                                                        ]?._id,
                                                        i
                                                      )
                                                    }
                                                    onChange={(value) =>
                                                      tsuvralDotorUildelKhiiy(
                                                        value,
                                                        "dugaar",
                                                        songogdsonBaraanuud[
                                                          index
                                                        ]?._id,
                                                        i
                                                      )
                                                    }
                                                    options={
                                                      songogdsonBaraanuud[index]
                                                        ?.ashiglakhUmnukhTsuvral
                                                    }
                                                    placeholder="Цувралын дугаар"
                                                    style={{
                                                      width: "100%",
                                                      height: "36px",  
                                                      borderColor: "#4FD1C5",
                                                      borderRadius: "9999px", 
                                                      borderWidth: 1,
                                                      padding: "0 12px", 
                                                    }}
                                                  />
                                                </Form.Item>
                                              )}

                                              <Form.Item
                                                className="!mb-2 w-full "
                                                name={[tsuvralName, `too`]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Тоо хэмжээ оруулна уу!",
                                                  },
                                                ]}
                                              >
                                                <InputNumber
                                                  min={0}
                                                  onChange={(v) => {
                                                    tsuvralDotorUildelKhiiy(
                                                      v,
                                                      "baraaOrlogdohTooHemjee",
                                                      songogdsonBaraanuud[index]
                                                        ?._id,
                                                      i
                                                    );
                                                    form.setFieldValue(
                                                      [
                                                        "baraanuud",
                                                        index,
                                                        "tsuvral",
                                                        i,
                                                        "niitUrtug",
                                                      ],
                                                      (v +
                                                        (songogdsonBaraanuud[
                                                          index
                                                        ].baraaOrlogdokhTsuvral[
                                                          i
                                                        ]
                                                          ?.butarhaiBolgosonZadgai ||
                                                          0)) *
                                                        songogdsonBaraanuud[
                                                          index
                                                        ].baraaOrlogodohUrtugUne
                                                    );
                                                  }}
                                                  placeholder="Тоо хэмжээ"
                                                />
                                              </Form.Item>
                                              {songogdsonBaraanuud[index]
                                                ?.shirkheglekhEsekh && (
                                                <Form.Item
                                                  name={[
                                                    tsuvralName,
                                                    `zadgaiUldegdel`,
                                                  ]}
                                                  className="!mb-2 w-full "
                                                >
                                                  <InputNumber
                                                    min={0}
                                                    onChange={(v) => {
                                                      tsuvralDotorUildelKhiiy(
                                                        v,
                                                        "zadgaiUldegdel",
                                                        songogdsonBaraanuud[
                                                          index
                                                        ]?._id,
                                                        i
                                                      );

                                                      form.setFieldValue(
                                                        [
                                                          "baraanuud",
                                                          index,
                                                          "tsuvral",
                                                          i,
                                                          "niitUrtug",
                                                        ],
                                                        songogdsonBaraanuud[
                                                          index
                                                        ].baraaOrlogdokhTsuvral[
                                                          i
                                                        ]
                                                          .baraaOrlogdohTooHemjee *
                                                          songogdsonBaraanuud[
                                                            index
                                                          ]
                                                            .baraaOrlogodohUrtugUne
                                                      );

                                                      form.setFieldValue(
                                                        [
                                                          "baraanuud",
                                                          index,
                                                          "tsuvral",
                                                          i,
                                                          "too",
                                                        ],
                                                        formatNumber(
                                                          (songogdsonBaraanuud[
                                                            index
                                                          ]
                                                            ?.baraaOrlogdokhTsuvral[
                                                            i
                                                          ]
                                                            ?.khairtsagBodooguiToo ||
                                                            0) +
                                                            parseFloat(v || 0) /
                                                              songogdsonBaraanuud[
                                                                index
                                                              ]
                                                                ?.negKhairtsaganDahiShirhegiinToo,
                                                          2
                                                        )
                                                      );
                                                    }}
                                                    placeholder={"Задгай"}
                                                    type="number"
                                                  />
                                                </Form.Item>
                                              )}

                                              {songogdsonBaraanuud[index]
                                                ?.ognooniiMedeelelBurtgekhEsekh && (
                                                <Form.Item
                                                  name={[
                                                    tsuvralName,
                                                    `duusakhOgnoo`,
                                                  ]}
                                                  {...restField}
                                                  className="!mb-2 w-full "
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Дуусах огноо оруулна уу.",
                                                    },
                                                  ]}
                                                >
                                                  <DatePicker
                                                    disabledDate={(current) => {
                                                      let customDate =
                                                        moment().format(
                                                          "YYYY-MM-DD"
                                                        );
                                                      var songogdsonOgnoonuud =
                                                        form.getFieldValue(
                                                          "tsuvral"
                                                        );
                                                      return (
                                                        (current &&
                                                          current <
                                                            moment(
                                                              customDate,
                                                              "YYYY-MM-DD"
                                                            )) ||
                                                        songogdsonOgnoonuud?.some(
                                                          (a) =>
                                                            a?.duusakhOgnoo &&
                                                            moment(
                                                              a?.duusakhOgnoo
                                                            ).format(
                                                              "YYYY-MM-DD"
                                                            ) ===
                                                              moment(
                                                                current
                                                              ).format(
                                                                "YYYY-MM-DD"
                                                              )
                                                        )
                                                      );
                                                    }}
                                                    onChange={(v) =>
                                                      tsuvralDotorUildelKhiiy(
                                                        v,
                                                        "duusakhOgnoo",
                                                        songogdsonBaraanuud[
                                                          index
                                                        ]?._id,
                                                        i
                                                      )
                                                    }
                                                    placeholder="Дуусах огноо"
                                                    style={{
                                                      width: "100%",
                                                      borderColor: "#4FD1C5",
                                                      borderRadius: "25px",
                                                      borderWidth: 1,
                                                    }}
                                                  />
                                                </Form.Item>
                                              )}

                                              {songogdsonBaraanuud[index]
                                                .baraaOrlogdokhTsuvral.length >
                                                1 && (
                                                <Button
                                                  type="danger"
                                                  className="flex h-full items-center justify-center  !rounded-full"
                                                  onClick={() => {
                                                    hasah(i);
                                                    tsuvralKhasiy(
                                                      songogdsonBaraanuud[index]
                                                        ._id,
                                                      i
                                                    );
                                                  }}
                                                >
                                                  <span className="flex items-center justify-center">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="20"
                                                      height="20"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      className="feather feather-plus h-4 w-4"
                                                    >
                                                      <line
                                                        x1="5"
                                                        y1="12"
                                                        x2="19"
                                                        y2="12"
                                                      ></line>
                                                    </svg>
                                                  </span>
                                                </Button>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                </Form.List>
                              )}
                            </div>
                          </div>
                          <div className="relative h-[20px] font-bold">
                            <div className="absolute bottom-0 right-1 dark:text-gray-300">
                              Нийт үнэ:{" "}
                              {formatNumber(
                                (songogdsonBaraanuud[index]
                                  ?.baraaOrlogohNiitToo || 0) *
                                  (songogdsonBaraanuud[index]
                                    ?.baraaOrlogodohUrtugUne || 0),
                                2
                              )}
                              ₮
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="relative flex min-h-[200px] w-[32%] cursor-pointer flex-col gap-5 rounded-lg border-2 border-dotted border-[#4fd1c5] p-2">
                        <div
                          onClick={() => {
                            add(), baraaNemekh();
                          }}
                          className="flex h-full w-full transform flex-col items-center justify-center text-[#4fd1c5] transition-transform duration-300 hover:scale-110"
                        >
                          <FiPlus className="text-[50px]" />
                          <div>Бараа нэмэх</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Form.List>
            </div>
            {songogdsonBaraanuud?.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="text-base font-[600] dark:text-gray-300">
                    Нийт тоо:{" "}
                    {formatNumber(
                      songogdsonBaraanuud.reduce(
                        (sum, item) => sum + (item?.baraaOrlogohNiitToo || 0),
                        0
                      ),
                      2
                    )}
                  </div>
                  <div className="text-base font-[600] dark:text-gray-300">
                    Нийт үнэ:
                    {formatNumber(
                      songogdsonBaraanuud.reduce(
                        (sum, item) =>
                          sum +
                          (item?.baraaOrlogodohUrtugUne || 0) *
                            (item?.baraaOrlogohNiitToo || 0),
                        0
                      ),
                      2
                    ) || 0}
                    ₮
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  <Button
                    loading={loading}
                    size="large"
                    type="primary"
                    onClick={() => !loading && form.submit()}
                  >
                    Хадгалах
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </Admin>
  );
};
export const getServerSideProps = shalgaltKhiikh;

export default index;
