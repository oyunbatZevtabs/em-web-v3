//#region import
import {
  Form,
  Select,
  DatePicker,
  message,
  notification,
  Button,
  Space,
  Switch,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CloseCircleTwoTone,
  MinusCircleOutlined,
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
import { Input, TextArea, InputNumber } from "components/ant/AntdInput";
import posUilchilgee from "services/posUilchilgee";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import TsuvralSongoltModal from "components/modalBody/hudulguunModal/TsuvralSongokh";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import { Popover } from "components/ant/AntdPopover";
import TsuvralYanzlakhModal from "components/modalBody/zarlaga/TsuvralYanzlakhModal";

import posUseJagsaalt from "hooks/posUseJagsaalt";

const searchKeys = ["ner", "register"];

function Zarlaga() {
  const router = useRouter();
  const { baiguullaga, salbariinId, ajiltan, baiguullagiinId, token } =
    useAuth();
  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [khariltsagchiinNer, setKhariltsagchNer] = useState();
  const [zarlagiinTurul, setZarlagiinTurul] = useState();
  const [khuleegdejBaina, setKhuleegdejBaina] = useState(false);
  const [servereesAvsanUnuuduriinTsag, setServereesAvsanUnuuduriinTsag] =
    useState();
  const [form] = Form.useForm();
  const formRef = useRef();

  useEffect(() => {
    if (!!token) {
      posUilchilgee(token)
        .post("/servereesTsagAvyaa")
        .then(({ data }) => {
          if (!!data) {
            setServereesAvsanUnuuduriinTsag(moment(data).format("YYYY-MM-DD"));
          }
        });
    }
  }, [token]);

  const [zakhialga, setZakhialga] = useState({});
  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

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
    let turKhadgalakh = v;
    const { baraanuud } = zakhialga;
    if (turKhadgalakh.length === 0) {
      turKhadgalakh = 1;
    }
    baraanuud[i].too = +v < 0 ? 0 : +v;
    baraanuud[i].orlogdohNiitUne = +v < 0 ? 0 : +v * mur?.urtugUne;
    setZakhialga((y) => ({ ...y, baraanuud }));
  }

  useEffect(() => {
    setZakhialga({});
  }, [salbariinId]);

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

  const { data, onSearch } = posUseJagsaalt(
    "/khariltsagch",
    query,
    undefined,
    undefined,
    searchKeys
  );

  function handleTooKhemjeeUurchlult(too, index) {
    const tukhainUldegdel = form.getFieldValue([
      "baraanuud",
      index,
      "uldegdel",
    ]);
    const tukhainUrtug = form.getFieldValue(["baraanuud", index, "urtugUne"]);
    if (too > 0) {
      if (tukhainUldegdel < too) {
        form.setFieldValue(["baraanuud", index, "too"], tukhainUldegdel);
        form.setFieldValue(
          ["baraanuud", index, "niitUne"],
          tukhainUldegdel * tukhainUrtug
        );
        return AnkhaaruulgaAlert("Үлдэгдэл хүрэлцэхгүй байна");
      }
      form.setFieldValue(["baraanuud", index, "niitUne"], tukhainUrtug * too);
    } else {
      form.setFieldValue(["baraanuud", index, "niitUne"], undefined);
    }
  }

  async function khadgalakh(formData) {
    var filterBaraa = zakhialga?.baraanuud
      ?.filter((e) => e?.too === undefined)
      .map((b) => b.ner);
    if (filterBaraa?.length > 0) {
      AnkhaaruulgaAlert(`${filterBaraa} барааны тоо оруулна уу.`);
      return;
    }
    setKhuleegdejBaina(true);
    // const baraanuud = await form.getFieldValue("baraanuud");
    const niitDun = zakhialga?.baraanuud?.reduce(
      (sav, mur) => sav + mur?.niitUne,
      0
    );
    if (!!zakhialga?.baraanuud && zakhialga?.baraanuud.length > 0) {
      let yavuulakhData = {
        ajiltan: { id: ajiltan?._id, ner: ajiltan?.ner },
        baiguullagiinId: baiguullagiinId,
        salbariinId: salbariinId,
        khariltsagchiinId: khariltsagchiinId,
        khariltsagchiinNer: khariltsagchiinNer,
        // baraanuud: formData?.baraanuud,

        // niitDun: zakhialga.baraanuud.reduce(
        //   (sum, item) => sum + (item.orlogdohNiitUne || 0),
        //   0
        // ),

        niitDun: niitDun,
        turul: formData?.turul,
        tailbar: formData?.tailbar,
        ognoo: moment(formData?.ognoo),
      };
      yavuulakhData.baraanuud = zakhialga?.baraanuud?.map((a) => ({
        barCode: a.barCode,
        code: a.code,
        ner: a.ner,
        ognooniiMedeelelBurtgekhEsekh: a.ognooniiMedeelelBurtgekhEsekh,
        shirkheglekhEsekh: a.shirkheglekhEsekh,
        too: a.too,
        tsuvral: a.tsuvral.map((e) => {
          const { uldegdel, ...uldegdelguiTsuvral } = e;
          return uldegdelguiTsuvral;
        }),
        // .filter((e) => e.hudulguunTsuvralToo !== undefined),
        tsuvraliinDugaartaiEsekh: a.tsuvraliinDugaartaiEsekh,
        urtugUne: a.urtugUne,
        zarakhUne: a.zarakhUne,
        niitUne: a.orlogdohNiitUne,
        _id: a._id,
      }));

      await posUilchilgee(token)
        .post("/baraaniiGuilgeeKhiie", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            form.resetFields();
            baraaMutate();
            setKhuleegdejBaina(false);
            setZakhialga({});
          }
        })
        .catch((err) => {
          aldaaBarigch(err);
          setKhuleegdejBaina(false);
        });
    } else {
      AnkhaaruulgaAlert("Бараа сонгоогүй байна");
    }
  }

  const queryBaraa = useMemo(() => {
    return {
      code: { $ne: 0 },
      uldegdel: { $nin: 0 },
    };
  }, []);

  const hugatsaaNiDuussanBaraanuudQuery = useMemo(() => {
    if (zarlagiinTurul === "act") {
      let query = {
        "tsuvral.duusakhOgnoo": { $lt: servereesAvsanUnuuduriinTsag },
      };
      return query;
    }
  }, [zarlagiinTurul, servereesAvsanUnuuduriinTsag]);

  const { baraaGaralt: hugatsaaniDuussanBaraanuud } = useBaraa(
    zarlagiinTurul === "act" && token,
    baiguullagiinId,
    undefined,
    hugatsaaNiDuussanBaraanuudQuery
  );

  useEffect(() => {
    if (hugatsaaniDuussanBaraanuud?.jagsaalt.length > 0) {
      setZakhialga({
        baraanuud: hugatsaaniDuussanBaraanuud?.jagsaalt,
      });
    }
  }, [hugatsaaniDuussanBaraanuud]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt, jagsaalt } =
    useBaraa(token, baiguullagiinId, undefined, queryBaraa);

  return (
    <Admin
      title={"Зарлага"}
      khuudasniiNer="zarlaga"
      className="relative grid grid-cols-12 gap-2 p-5 "
    >
      <div className="col-span-12 flex h-full flex-col xl:col-span-9">
        <Select
          bordered={false}
          placeholder="Бараа сонгох"
          className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
          showSearch
          size="large"
          value={null}
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
                      <div className="col-span-4 flex w-full items-center space-x-1 space-y-1 text-base font-bold text-gray-600 dark:text-gray-400 md:block">
                        <div className="text-center text-sm text-gray-400">
                          Дотоод код
                        </div>
                        <div className="text-center">{mur.code || mur.id}</div>
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
                        className={`col-span-8  flex
                          
                          w-full items-center space-x-1 space-y-1 text-base font-bold text-gray-600 dark:text-gray-400 md:block`}
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
                        min={1}
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
      </div>

      <div className="col-span-12 bg-white p-6 dark:bg-gray-700 xl:col-span-3">
        <Form
          labelCol={{
            lg: { span: 8 },
            sm: { span: 2 },
          }}
          wrapperCol={{
            xl: { span: 24 },
            md: { span: 18 },
          }}
          layout="vertical"
          onFinish={khadgalakh}
          form={form}
        >
          <Form.Item
            initialValue={moment()}
            name={"ognoo"}
            label="Огноо"
            rules={[
              {
                required: true,
                message: "Огноо сонгоно уу",
              },
            ]}
          >
            <DatePicker
              clearIcon
              locale={locale}
              className="w-full !rounded-[25px]"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Төрөл сонгоно уу",
              },
            ]}
            name={"turul"}
            label="Төрөл"
          >
            <Select
              onChange={(v) => setZarlagiinTurul(v)}
              className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800"
              placeholder="Төрөл сонгоно уу..."
            >
              <Select.Option value={"act"}>Акт</Select.Option>
              <Select.Option value={"busadZarlaga"}>
                Бусад зарлага
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Харилцагч сонгоно уу",
              },
            ]}
            name={"khariltsagch"}
            label="Харилцагч"
            // className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
          >
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
              placeholder="Харилцагч сонгох"
              className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onSearch={onSearch}
            >
              {data?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?._id}>
                    <div className={`flex justify-start dark:bg-gray-800 dark:text-gray-200 `}>
                      <div className="font-bold">{mur?.ner}</div>
                      {"---"}
                      {mur?.register}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="tailbar"
            label="Тайлбар"
            rules={[
              {
                required: true,
                message: "Тайлбар оруулна уу!",
              },
            ]}
          >
            <TextArea
              autoComplete="off"
              autoSize={{
                minRows: 1,
                maxRows: 6,
              }}
              className="min-w-full break-words rounded-md border border-gray-600 p-2 focus:border-gray-400 focus:outline-none"
              placeholder="Тайлбар оруулна уу..."
            />
          </Form.Item>
        </Form>
        <div className="flex flex-row items-center  justify-end gap-4">
          <Button
            onClick={() => khuleegdejBaina === false && form.submit()}
            style={{ width: "100px" }}
            type="primary"
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zarlaga;
