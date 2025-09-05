//#region import
import { Form, Select, DatePicker, message, notification, Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CloseCircleTwoTone,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import locale from "antd/lib/date-picker/locale/mn_MN";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";
import useBaraa from "hooks/useBaraa";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import { useRouter } from "next/router";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useMemo } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { Input, TextArea } from "components/ant/AntdInput";
import posUilchilgee from "services/posUilchilgee";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import TsuvralSongoltModal from "components/modalBody/hudulguunModal/TsuvralSongokh";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { Popover } from "components/ant/AntdPopover";
import posUseJagsaalt from "hooks/posUseJagsaalt";
// import { modal } from "components/ant/Modal";
// import KhudulguunUstgakh from "components/customComponents/aguulakh/KhudulguunUstgakh";
//#endregion

// const { confirm } = Modal;

function HudulguunPage() {
  const router = useRouter();
  const { baiguullaga, salbariinId, ajiltan, baiguullagiinId, token } =
    useAuth();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef();
  const [tailbar, setTailbar] = useState("");
  const [uurchlugdsunOchikhSalbar, setUurchlugdsunOchikhSalbar] =
    useState(null);

  const [zakhialga, setZakhialga] = useState({});
  // const { turul = "Khudulguun" } = router.query;

  const { turul, params } = router.query;

  useEffect(() => {
    if (!!params && !!token) {
      posUilchilgee(token)
        .get(`/orlogoZarlagiinTuukh/${params}`, {
          params: {
            query: {
              baiguullagiinId: baiguullagiinId,
              turul: { $in: "khudulguun" },
            },
          },
        })
        .then(({ data }) => {
          setZakhialga({ baraanuud: data?.baraanuud });
          form.setFieldValue("shiidsenOgnoo", moment(data.ognoo));
          form.setFieldValue(
            "salbariinId",
            baiguullaga?.salbaruud.find(
              (e) => e._id === data.orlogdsonSalbariinId
            ).ner
          );

          form.setFieldValue("tailbar", data.tailbar);
        });
    } else if (!params) {
      form.resetFields();
      setZakhialga({});
    }
  }, [params, baiguullagiinId, token, baiguullaga]);

  const queryBaraa = useMemo(() => {
    return {
      code: { $ne: 0 },
      uldegdel: { $nin: 0 },
    };
  }, []);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt, jagsaalt } =
    useBaraa(token, baiguullagiinId, undefined, queryBaraa);

  function khaaya() {
    // router.back();
    setZakhialga({});
  }

  function onChangeZakhialga(zakhialgiinId, e) {
    if (zakhialgiinId && baraaGaralt?.jagsaalt) {
      if (!!zakhialga?.baraanuud?.find((a) => a?._id === e.value)) {
        setBaraaniiKhuudaslalt((kh) => ({ ...kh, search: "" }));
        AnkhaaruulgaAlert("Сонгогдсон бараа байна!");
        return;
      }

      const songosonBaraa = jagsaalt?.find((a) => a._id === zakhialgiinId);
      var baraanuudiinJagsaalt = zakhialga?.baraanuud || [];
      baraanuudiinJagsaalt.push(songosonBaraa);
      baraanuudiinJagsaalt?.forEach((x) =>
        !x?.tooKhemjee ? (x.tooKhemjee = 0) : (x.tooKhemjee = x.tooKhemjee)
      );
      setZakhialga((y) => ({ ...y, baraanuud: baraanuudiinJagsaalt }));
      setBaraaniiKhuudaslalt((kh) => ({ ...kh, search: "" }));
    }
    setBaraaniiKhuudaslalt((kh) => ({ ...kh, search: "" }));
  }

  function ustgakh(id, i) {
    if (!!zakhialga.baraanuud) {
      const index = zakhialga.baraanuud.findIndex((a) => a._id === id);
      if (index !== -1) {
        var zakhilagiinJagsaalt = zakhialga.baraanuud;
        zakhilagiinJagsaalt.splice(index, 1);
        setZakhialga((y) => ({ ...y, baraanuud: zakhilagiinJagsaalt }));
      }
    }
  }

  function tooUurchilyu(v, i, mur) {
    const { baraanuud } = zakhialga;
    baraanuud[i].too = +v < 0 ? 0 : +v;
    baraanuud[i].orlogdohNiitUne = +v < 0 ? 0 : +v * mur?.urtugUne;
    setZakhialga((y) => ({ ...y, baraanuud }));
  }

  useEffect(() => {
    setZakhialga({});
  }, [salbariinId]);

  function khadgalya() {
    try {
      form.submit();
      let yavuulakhData = null;
      setLoading(true);

      if (!!zakhialga?.baraanuud && zakhialga?.baraanuud.length > 0) {
        yavuulakhData = {
          ajiltan,
          baiguullagiinId,
          turul: "khudulguun",
          tailbar: zakhialga.tailbar,
          niitDun: zakhialga.baraanuud.reduce(
            (sum, item) => sum + (item?.orlogdohNiitUne || 0),
            0
          ),
          ognoo: moment(zakhialga.shiidsenOgnoo).format("YYYY-MM-DD"),
          zarlagdsanSalbariinId: salbariinId,
          orlogdsonSalbariinId: uurchlugdsunOchikhSalbar,
        };
        yavuulakhData.baraanuud = zakhialga.baraanuud.map((a) => ({
          barCode: a.barCode,
          code: a.code,
          ner: a.ner,
          ognooniiMedeelelBurtgekhEsekh: a.ognooniiMedeelelBurtgekhEsekh,
          shirkheglekhEsekh: a.shirkheglekhEsekh,
          too: a.too,
          tsuvral: a.tsuvral
            .map((e) => {
              const { uldegdel, ...uldegdelguiTsuvral } = e;
              return uldegdelguiTsuvral;
            })
            .filter((e) => e.hudulguunTsuvralToo !== undefined),
          tsuvraliinDugaartaiEsekh: a.tsuvraliinDugaartaiEsekh,
          urtugUne: a.urtugUne,
          zarakhUne: a.zarakhUne,
          niitUne: a.orlogdohNiitUne,
          _id: a._id,
        }));

        if (tailbar.length > 0) {
          if (!!zakhialga.salbariinId) {
            posUilchilgee(token)
              .post("khudulguunKhiie", yavuulakhData)
              .then(({ data, status }) => {
                if (status === 200 && data.includes("Amjilttai")) {
                  AmjilttaiAlert("Амжилттай хадгаллаа");
                  router.back();
                }
              })
              .catch((e) => {
                aldaaBarigch(e);
                setLoading(false);
              });
          } else {
            setLoading(false);
            AnkhaaruulgaAlert("Cалбар сонгоно уу!");
          }
        } else {
          setLoading(false);
          AnkhaaruulgaAlert("Тайлбар оруулна уу!");
        }
      } else {
        setLoading(false);
        AnkhaaruulgaAlert("Бараа сонгоогүй байна.");
      }
    } catch (error) {
      setLoading(false);
      console.trace("error", error);
    }
  }

  return (
    <Admin
      title={"Хөдөлгөөн"}
      khuudasniiNer="hudulguun"
      className="relative grid grid-cols-12 gap-6 p-5 "
    >
      <div className="col-span-12 flex flex-col xl:col-span-9">
        <Select
          disabled={turul === "delgerengui"}
          bordered={false}
          showSearch
          placeholder="Бараа сонгох"
          className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
          size="large"
          value={null}
          filterOption={(o) => o}
          onSearch={(search) =>
            setBaraaniiKhuudaslalt((a) => ({ ...a, search }))
          }
          onChange={(v, e) => {
            onChangeZakhialga(v, e);
          }}
        >
          {jagsaalt?.map((mur) => {
            const songogdsonEsekh = zakhialga?.baraanuud?.some(
              (e) => e?._id === mur._id
            );
            return (
              <Select.Option
                disabled={songogdsonEsekh}
                key={mur.id}
                value={mur._id}
              >
                <div className="flex justify-start dark:bg-gray-800 dark:text-gray-200">
                  <div className=" ">
                    <div
                      className={`flex flex-row overflow-hidden whitespace-nowrap font-bold ${
                        songogdsonEsekh === false &&
                        "text-gray-600 dark:text-gray-300"
                      } `}
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {mur.code}
                    </div>
                  </div>
                  -
                  <div className=" ">
                    <div
                      className={`flex flex-row overflow-hidden whitespace-nowrap ${
                        songogdsonEsekh === false &&
                        "text-gray-600  dark:text-gray-300"
                      }`}
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {mur.ner}
                    </div>
                  </div>
                  - {formatNumber(mur.niitUne) + "₮"} -
                  <div
                    className={`${
                      songogdsonEsekh === false && "link-style"
                    } font-medium`}
                  >
                    Үлдэгдэл:
                    {mur?.uldegdel}
                  </div>
                </div>
              </Select.Option>
            );
          })}
        </Select>
        <div
          className="w-full space-y-2 overflow-x-hidden overflow-y-scroll p-2 "
          style={{ maxHeight: "calc(100vh - 15rem)" }}
        >
          {zakhialga.baraanuud?.map((mur, index) => {
            return (
              <div>
                <div
                  key={index}
                  className={`relative hidden items-start gap-2 rounded-lg shadow-xl  ring-2 sm:grid sm:grid-cols-12 sm:items-center md:h-20 md:flex-row ${
                    mur.too > 0 ? "ring-blue-600" : "ring-red-600"
                  }  ring-opacity-50`}
                >
                  <div className=" col-span-7 flex w-full flex-col justify-start space-x-3 overflow-hidden sm:grid sm:grid-cols-12 md:flex-row ">
                    <div className="col-span-4 flex items-center gap-4 space-y-1 p-2 md:flex-row ">
                      <Popover content={<div>{mur.ner}</div>} title={false}>
                        <div
                          className="flex flex-row overflow-hidden whitespace-nowrap font-bold  text-gray-600 dark:text-gray-300"
                          style={{ textOverflow: "ellipsis" }}
                        >
                          {mur.ner}
                        </div>
                      </Popover>
                      <div
                        className="flex  flex-row overflow-hidden whitespace-nowrap text-gray-600  dark:text-gray-300"
                        style={{ textOverflow: "ellipsis" }}
                      >
                        {mur.baraaniiKod || mur.id}
                      </div>
                    </div>
                    <div className=" col-span-8 grid h-full w-full grid-cols-12 items-center  ">
                      <div
                        className={
                          "col-span-4 flex w-full items-center space-x-1 space-y-1 text-base font-bold text-gray-600 dark:text-gray-400 md:block"
                        }
                      >
                        <div className="text-center text-sm text-gray-400">
                          Үлдэгдэл
                        </div>
                        <div className="text-center">
                          {formatNumber(mur?.uldegdel, 2)}
                        </div>
                      </div>
                      <div
                        className={`col-span-8 flex w-full items-center space-x-1 space-y-1 text-base font-bold text-gray-600 dark:text-gray-400 md:block`}
                      >
                        <div className=" text-center text-sm text-gray-400">
                          Нэгж үнэ
                        </div>
                        <div className="text-center">
                          {formatNumber(mur?.urtugUne, 2)}
                          {"₮"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {mur?.tsuvraliinDugaartaiEsekh ||
                  mur.ognooniiMedeelelBurtgekhEsekh ? (
                    <div className={`col-span-2 flex items-center p-2 `}>
                      <TsuvralSongoltModal
                        turul={turul}
                        baraaniiData={mur}
                        setZakhialga={setZakhialga}
                        zakhialgaBaraanuud={zakhialga.baraanuud}
                      />
                    </div>
                  ) : (
                    <div className={`col-span-2 flex items-center p-2 `}>
                      <input
                        disabled={turul === "delgerengui"}
                        autoComplete="off"
                        type="number"
                        className={`${
                          turul === "delgerengui" && "cursor-not-allowed"
                        } form-control w-12 text-center text-lg focus:outline-none focus:ring-2 dark:text-gray-300 ${
                          mur.too > 0
                            ? "focus:ring-blue-600"
                            : "focus:ring-red-600"
                        } focus:ring-opacity-50`}
                        placeholder="Тоо хэмжээ"
                        value={+zakhialga?.baraanuud[index]?.too}
                        onChange={({ target }) =>
                          tooUurchilyu(
                            +mur.uldegdel < target.value
                              ? +mur.uldegdel
                              : target.value,
                            index,
                            mur
                          )
                        }
                        min={0}
                      />
                    </div>
                  )}
                  <div className="col-span-3 flex flex-col gap-4 sm:grid sm:grid-cols-12">
                    <div className="col-span-6 flex items-center space-x-1 text-base font-bold text-gray-600 dark:text-gray-400 md:block">
                      <div className="text-center text-sm text-gray-400">
                        Нийт үнэ
                      </div>
                      <div className="text-center">
                        {formatNumber(
                          (+mur?.urtugUne || 0) * (+mur?.too || 0),
                          2
                        )}
                        ₮
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "absolute right-1 ml-5 flex justify-center pb-4 sm:pb-0"
                    }
                  >
                    <CloseCircleTwoTone
                      onClick={() => ustgakh(mur._id, index)}
                      className="cursor-pointer"
                      twoToneColor="#eb2f96"
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`grid grid-cols-12 p-2 text-xl ${
            zakhialga?.baraanuud?.length > 0 ? "block" : "hidden"
          }`}
        >
          <div className="col-span-2 ml-5 font-bold ">Нийт явсан :</div>
          <div className="col-span-4  "></div>

          <div className="col-span-2 flex justify-center font-extrabold">
            {formatNumber(
              zakhialga?.baraanuud?.reduce((a, b) => a + (+b?.too || 0), 0),
              2
            )}
            ш
          </div>
          <div className="col-span-4 grid grid-cols-12 font-extrabold">
            <div className="col-span-6"></div>
            <div className="col-span-6 flex justify-end">
              {formatNumber(
                zakhialga?.baraanuud?.reduce(
                  (a, b) => a + (b?.urtugUne || 0) * (b.too || 0),
                  0
                ),
                2
              )}
              ₮
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 bg-white p-6 dark:bg-gray-700 xl:col-span-3">
        <Form
          labelCol={{
            lg: { span: 8 },
            sm: { span: 2 },
          }}
          wrapperCol={{
            xl: { span: 16 },
            md: { span: 12 },
          }}
          ref={formRef}
          form={form}
          onValuesChange={(v) => {
            setZakhialga((z) => ({ ...z, ...v }));
          }}
        >
          <Form.Item
            initialValue={moment()}
            name="shiidsenOgnoo"
            label="Огноо"
            rules={[
              {
                required: true,
                message: "Захиалгын огноо заавал оруулна уу!",
              },
            ]}
          >
            <DatePicker
              disabled={turul === "delgerengui"}
              clearIcon
              disabledDate={(current) => {
                return current && current < moment().subtract(1, "day");
              }}
              locale={locale}
              className="w-full !rounded-[25px]"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            name="salbariinId"
            label="Салбар"
            rules={[
              {
                required: true,
                message: "Салбар сонгоно уу!",
              },
            ]}
          >
            <Select
              disabled={turul === "delgerengui"}
              placeholder={"Салбар"}
              bordered={false}
              className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white "
              showSearch
              value={uurchlugdsunOchikhSalbar}
              onChange={(e, v) => {
                setUurchlugdsunOchikhSalbar(e);
              }}
              filterOption={(o) => o}
            >
              {baiguullaga?.salbaruud
                ?.filter((v) => v._id !== salbariinId)
                ?.map((mur) => (
                  <Select.Option key={mur._id} value={mur._id}>
                    {mur.ner}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="center-label"
            rules={[
              {
                required: true,
                message: "Тайлбар бичнэ үү!",
              },
            ]}
            label="Тайлбар"
            name="tailbar"
          >
            <TextArea
              disabled={turul === "delgerengui"}
              // value={tailbar}
              onChange={(e) => {
                setTailbar(e.target.value);
              }}
              className="center-placeholder"
              placeholder={"Тайлбар"}
            />
          </Form.Item>
        </Form>
        <div className="flex flex-row items-center  justify-end gap-4">
          <Button
            size="large"
            onClick={turul === "delgerengui" ? router.back : khaaya}
          >
            <div> {turul === "delgerengui" ? "Буцах" : "Цуцлах"} </div>
          </Button>
          {turul === "delgerengui" ? (
            ""
          ) : (
            <Button
              size="large"
              type="primary"
              onClick={() => {
                if (loading === false) {
                  if (zakhialga?.baraanuud?.some((e) => e?.too === undefined)) {
                    zakhialga.baraanuud.forEach((e) => {
                      if (e?.too === undefined) {
                        AnkhaaruulgaAlert(`${e.ner} Барааны тоо оруулна уу.`);
                      }
                    });
                  } else {
                    khadgalya();
                  }
                }
              }}
            >
              Хадгалах
            </Button>
          )}
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default HudulguunPage;
