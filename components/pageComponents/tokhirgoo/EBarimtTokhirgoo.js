import React, { useEffect, useState } from "react";
import { Button, Switch, notification, Input, Select } from "antd";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import uilchilgee from "services/uilchilgee";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function EBarimtTokhirgoo({
  baiguullaga,
  token,
  baiguullagaMutate,
  tokhirgooModalKhaayaa,
}) {
  const { t } = useTranslation();
  const duurguud = useJagsaalt("/tatvariinAlba");
  const [songogdsonDuureg, setSongogdsonDuureg] = useState();
  const [songogdsonDuuregKod, setSongogdsonDuuregKod] = useState();
  const [songogdsonHoroo, setSongogdsonHoroo] = useState();
  const [songogdsonHorooKod, setSongogdsonHorooKod] = useState();

  const [eBarimtTokhirgoo, setEbarimtTokhirgoo] = useState({
    eBarimtAshiglakhEsekh:
      baiguullaga?.tokhirgoo?.eBarimtAshiglakhEsekh || false,
    eBarimtAutomataarTatvarluuIlgeekh:
      baiguullaga?.tokhirgoo?.eBarimtAutomataarTatvarluuIlgeekh || false,
    eBarimtShine: baiguullaga?.tokhirgoo?.eBarimtShine || false,
    nuatTulukhEsekh: baiguullaga?.tokhirgoo?.nuatTulukhEsekh || false,
    merchantTin: baiguullaga?.tokhirgoo?.merchantTin || undefined,
    districtCode: baiguullaga?.tokhirgoo?.districtCode || undefined,
  });

  useEffect(() => {
    if (baiguullaga && duurguud.jagsaalt) {
      setSongogdsonDuuregKod(
        baiguullaga?.tokhirgoo?.districtCode?.substring(0, 2)
      );
      setSongogdsonDuureg(
        duurguud?.jagsaalt?.find(
          (e) => e.kod === baiguullaga?.tokhirgoo?.districtCode?.substring(0, 2)
        )
      );
      setSongogdsonHorooKod(baiguullaga?.tokhirgoo?.districtCode?.substring(2));
    }
  }, [baiguullaga, duurguud.jagsaalt]);

  const baiguullagaEbarimtTokhirgooZasya = () => {
    if (!baiguullaga) return AnkhaaruulgaAlert("Та дахин оролдоно уу.");
    if (!eBarimtTokhirgoo)
      return AnkhaaruulgaAlert("Тохиргоо өөрчлөгдөөгүй байна.");
    if (eBarimtTokhirgoo?.eBarimtShine) {
      if (
        !eBarimtTokhirgoo.merchantTin ||
        eBarimtTokhirgoo.merchantTin == undefined
      )
        return AnkhaaruulgaAlert("ТИН дугаар сонгоогүй байна.");
      if (
        !eBarimtTokhirgoo.districtCode ||
        eBarimtTokhirgoo.districtCode == undefined
      )
        return AnkhaaruulgaAlert("Дүүрэг, хороо сонгоогүй байна.");
    }

    const yavuulakhData = {
      tokhirgoo: {
        baiguullagiinId: baiguullaga?._id,
        eBarimtAshiglakhEsekh: eBarimtTokhirgoo.eBarimtAshiglakhEsekh,
        eBarimtAutomataarTatvarluuIlgeekh:
          eBarimtTokhirgoo.eBarimtAutomataarTatvarluuIlgeekh,
        eBarimtShine: eBarimtTokhirgoo.eBarimtShine,
        nuatTulukhEsekh:
          eBarimtTokhirgoo.eBarimtShine === false
            ? false
            : eBarimtTokhirgoo.nuatTulukhEsekh,
        merchantTin: eBarimtTokhirgoo.eBarimtShine
          ? eBarimtTokhirgoo.merchantTin
          : undefined,
        districtCode: eBarimtTokhirgoo.eBarimtShine
          ? eBarimtTokhirgoo.districtCode
          : undefined,
      },
    };
    uilchilgee(token)
      .post("/ebarimtTokhirgooOruulyaa", yavuulakhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай хадгаллаа");
          baiguullagaMutate();
          tokhirgooModalKhaayaa();
        }
      });
  };

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-50 ">
            И-Баримт тохиргоо
          </h2>
        </div>
        <div className="flex w-[100%]">
          <div className="grid w-full grid-cols-2 gap-2">
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="font-medium">{t("И-Баримт 3.0 эсэх")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={eBarimtTokhirgoo.eBarimtShine}
                    onChange={(v) =>
                      setEbarimtTokhirgoo((a) => ({
                        ...(a || {}),
                        eBarimtShine: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {eBarimtTokhirgoo?.eBarimtShine && (
              <div className="box col-span-1 w-full">
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-teal-500 pl-4">
                    <div className="font-medium">НӨАТ төлөх эсэх</div>
                    <div className="text-gray-600"></div>
                  </div>
                  <div className="ml-auto">
                    <Switch
                      defaultChecked={baiguullaga?.tokhirgoo?.nuatTulukhEsekh}
                      onChange={(v) =>
                        setEbarimtTokhirgoo((a) => ({
                          ...(a || {}),
                          nuatTulukhEsekh: v,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {eBarimtTokhirgoo?.eBarimtShine && (
              <div className="box">
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-teal-500 pl-4">
                    <div className="font-medium">
                      И-Баримт татварт автоматаар илгээх эсэх
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Switch
                      defaultChecked={
                        baiguullaga?.tokhirgoo
                          ?.eBarimtAutomataarTatvarluuIlgeekh
                      }
                      onChange={(v) =>
                        setEbarimtTokhirgoo((a) => ({
                          ...(a || {}),
                          eBarimtAutomataarTatvarluuIlgeekh: v,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {eBarimtTokhirgoo?.eBarimtShine && (
              <div>
                <div className="box">
                  <div className="flex items-center p-5">
                    <div className="border-l-2 border-teal-500 pl-4">
                      <div className="font-medium">{t("ТИН дугаар")}</div>
                      <div className="text-gray-600"></div>
                    </div>
                    <div className="ml-auto">
                      <Input
                        value={eBarimtTokhirgoo?.merchantTin}
                        onChange={({ target }) =>
                          setEbarimtTokhirgoo((a) => ({
                            ...(a || {}),
                            merchantTin: target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {eBarimtTokhirgoo?.eBarimtShine && (
              <div>
                <div className="box">
                  <div className="flex items-center p-5">
                    <div className="border-l-2 border-teal-500 pl-4">
                      <div className="font-medium">{t("Дүүрэг")}</div>
                      <div className="text-gray-600"></div>
                    </div>
                    <div className="ml-auto border border-teal-500">
                      <Select
                        className="min-w-[150px]"
                        value={songogdsonDuuregKod}
                        onChange={(v) => {
                          console.log(v, "vvv");
                          setSongogdsonDuureg(
                            duurguud?.jagsaalt?.find((e) => e.kod === v)
                          );
                          setSongogdsonDuuregKod(v);
                          setSongogdsonHoroo();
                          setSongogdsonHorooKod();
                          setEbarimtTokhirgoo((a) => ({
                            ...(a || {}),
                            districtCode: undefined,
                          }));
                        }}
                      >
                        {duurguud.jagsaalt.map((duureg) => {
                          return (
                            <Select.Option value={duureg?.kod}>
                              {duureg?.ner}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <div className="flex items-center p-5">
                    <div className="border-l-2 border-teal-500 pl-4">
                      <div className="font-medium">{t("Хороо")}</div>
                      <div className="text-gray-600"></div>
                    </div>
                    <div className="ml-auto border border-teal-500">
                      <Select
                        className="min-w-[150px]"
                        value={songogdsonHorooKod}
                        onChange={(v) => {
                          setSongogdsonHoroo(
                            songogdsonDuureg?.ded?.find((e) => e.kod === v)
                          );
                          setSongogdsonHorooKod(v);
                          setEbarimtTokhirgoo((a) => ({
                            ...(a || {}),
                            districtCode: songogdsonDuureg.kod + v,
                          }));
                        }}
                      >
                        {songogdsonDuureg?.ded.map((duureg) => {
                          return (
                            <Select.Option value={duureg?.kod}>
                              {duureg?.ner}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={baiguullagaEbarimtTokhirgooZasya}
            type="primary"
            className="btn btn-primary mt-4"
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EBarimtTokhirgoo;
