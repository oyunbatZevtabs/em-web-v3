import { Button, DatePicker, Form, Popover, Select } from "antd";
import {
  CloseCircleTwoTone,
  InboxOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import posUilchilgee from "services/posUilchilgee";
import { useAuth } from "services/auth";
import useBaraa from "hooks/useBaraa";
import { Input, InputNumber } from "../antdInput";
import AsuulgaModal from "../asuulgaModal";
import { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import formatNumber from "tools/function/formatNumber";
import BaraaBurtgekh from "./baraaBurtgekh";
import KhariltsagchNemekhModal from "../khariltsagch/khariltsagchNemekhModal";
const order = { createdAt: -1 };
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];
function BaraaOrlogodoh({ mutate, aguulakhToololtMutate }) {
  const { token, ajiltan, baiguullagiinId, salbariinId } = useAuth();

  const [form] = Form.useForm();

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songogdsonBaraanuud, setSongogdsonBaraanuud] = useState([]);
  const [neelttei, setNeelttei] = useState(false);
  const [tsuvraliinMedeelel, setTsuvraliinMedeelel] = useState();
  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [selectedMurNer, setSelectedMurNer] = useState();
  const [khadgalakhDarsanEsekh, setKhadgalakhDarsanEsekh] = useState(false);
  const [loading, setLoading] = useState(false);

  const ugui = () => {
    setNeelttei(false);
  };

  const tiim = () => {
    setIsModalOpen(false);
    setSongogdsonBaraanuud([]);
    setNeelttei(false);
    form.resetFields();
  };

  function handleCancel() {
    const formData = form.getFieldsValue();
    let utgataiEsekh = [];
    Object.values(formData).forEach((a) => {
      if (a && !Array.isArray(a)) {
        utgataiEsekh.push(a);
      } else if (a?.length > 0) {
        utgataiEsekh.push(a);
      }
    });

    if (utgataiEsekh.length > 0) {
      setNeelttei(true);
    } else setIsModalOpen(false);
  }

  useEffect(() => {
    if (!!tsuvraliinMedeelel) {
      var data = form.getFieldsValue();
      var { baraanuud, khariltsagchiinId, ...uldsen } = data;
      songogdsonBaraanuud.forEach((mur) => {
        var shineNiitToo = uldsen[`${mur._id}`];
        if (!!shineNiitToo && mur.tsuvraliinDugaartaiEsekh) {
          mur.niitToo = shineNiitToo?.reduce((a, b) => a + (b?.too || 0), 0);
        }
      });

      setSongogdsonBaraanuud([...songogdsonBaraanuud]);
    }
  }, [tsuvraliinMedeelel]);

  function modalNeekhFunction() {
    baraaMutate();
    setIsModalOpen(true);
  }
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
    khariltsagchMutate = mutate,
  } = posUseJagsaalt(
    "/khariltsagch",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  function ustgakh(id) {
    const index = songogdsonBaraanuud.findIndex((a) => a?._id === id);

    if (index !== -1) {
      songogdsonBaraanuud.splice(index, 1);
      form.setFieldsValue({
        baraanuud: songogdsonBaraanuud.map((x) => x?._id),
      });
      setSongogdsonBaraanuud([...songogdsonBaraanuud]);
    }
  }

  function songogdsonTsuvraltaiBaraanuudRuuNiitTooNemekhFunction(
    code,
    value,
    turul,
    khuuchinModal,
    index,
    zadgaiUldegdel
  ) {
    const defaultToo = form.getFieldValue([
      mur?._id,
      field.name,
      "garaasOruulsanToo",
    ]);
    const newValue = !!v
      ? parseFloat(defaultToo || 0) +
        parseFloat(v || 0) /
          parseFloat(mur.negKhairtsaganDahiShirhegiinToo || 0)
      : parseFloat(formatNumber(defaultToo || 0, 2));
    form.setFieldValue(
      [mur?._id, field.name, "too"],
      parseFloat(formatNumber(newValue, 2))
    );

    const updatedBaraanuud = songogdsonBaraanuud.map((e) => {
      if (!khuuchinModal) {
        if (e?.code === code) {
          if (turul === "engiinBaraa" || turul === "mushgultteiBaraa") {
            e.niitToo = parseFloat(value);
            e.zadgaiUldegdelBodsonToo = parseFloat(value);
            if (turul === "mushgultteiBaraa") {
              form.setFieldValue([e?._id, "too"], e.niitToo);
            }
          }
        }
      } else {
        if (e?._id === code) {
          e.niitToo = parseFloat(e?.niitToo || 0) + parseFloat(value);
        }
      }
      return e;
    });
    setSongogdsonBaraanuud(updatedBaraanuud);
  }

  function songogdsonBaraanuudRuuNiitTooNemekhFunction(
    code,
    value,
    turul,
    khuuchinModal,
    index,
    zadgaiUldegdel
  ) {
    const updatedBaraanuud = songogdsonBaraanuud.map((e) => {
      if (!khuuchinModal) {
        if (e?.code === code) {
          if (turul === "engiinBaraa" || turul === "mushgultteiBaraa") {
            e.niitToo = parseFloat(value);
            e.zadgaiUldegdelBodsonToo = parseFloat(value);
            if (turul === "mushgultteiBaraa") {
              form.setFieldValue([e?._id, "too"], e.niitToo);
            }
          }
        }
      } else {
        if (e?._id === code) {
          e.niitToo = parseFloat(e?.niitToo || 0) + parseFloat(value);
        }
      }
      return e;
    });
    setSongogdsonBaraanuud(updatedBaraanuud);
  }

  const onFinish = (formData) => {
    setLoading(true);
    const baraanuud = songogdsonBaraanuud.map((item) => ({
      urtugUne: parseFloat(item?.baraaOrlogodohUrtugUne),
      zarakhUne: item?.zarakhUne,
      ner: item?.ner,
      barCode: item?.barCode,
      code: item?.code,
      too: item.shirkheglekhEsekh
        ? item.zadgaiUldegdelBodsonToo
        : item?.niitToo,
      tsuvral:
        !item?.tsuvraliinDugaartaiEsekh && item?.ognooniiMedeelelBurtgekhEsekh
          ? [formData[`${item._id}`]]
          : formData[`${item._id}`],
      ognooniiMedeelelBurtgekhEsekh: item?.ognooniiMedeelelBurtgekhEsekh,
      tsuvraliinDugaartaiEsekh: item?.tsuvraliinDugaartaiEsekh,
      shirkhgeerOrlogodohEsekh: item?.shirkhgeerOrlogodohEsekh,
    }));
    var niitDun = 0;
    for (const mur of baraanuud) {
      if (
        mur.tsuvraliinDugaartaiEsekh === true ||
        mur.ognooniiMedeelelBurtgekhEsekh === true
      ) {
        mur.too = mur.tsuvral.reduce((a, b) => a + b.too, 0);
      }
      niitDun = mur.urtugUne * mur.too + niitDun;
    }
    const yavuulahData = {
      baraanuud,
      khelber: formData?.khelber,
      niitDun,
      ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
      ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
      khariltsagchiinId: khariltsagchiinId,
      khariltsagchiinNer: selectedMurNer,
    };

    posUilchilgee(token)
      .post("/baraaOrlogodyo", yavuulahData)
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай орлогдлоо");
          mutate();
          form.resetFields();
          setSongogdsonBaraanuud([]);
          baraaMutate();
          aguulakhToololtMutate();
          setIsModalOpen(false);
          setLoading(false);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  };

  function onChangeButeegdekhuun(v) {
    const niitBut = [
      ...songogdsonBaraanuud,
      ..._.cloneDeep(
        baraaGaralt?.jagsaalt.filter(
          (z) => !songogdsonBaraanuud.find((k) => k?._id === z?._id)
        )
      ),
    ];
    const songogdson = niitBut.filter((x) => v.find((a) => a === x?._id));

    songogdson.forEach((a) => {
      if (v[v.length - 1] === a?._id) {
        (a.tooShirkheg = !!a.tooShirkheg ? a.tooShirkheg : 1),
          (a.une = !!a.turSanakhUne ? a.turSanakhUne : 0),
          (a.zadgaiUldegdelBodsonToo = !!a.shirkheglekhEsekh && 0),
          a.tsuvraliinDugaartaiEsekh == false,
          a.shirkhgeerOrlogodohEsekh == false,
          (a.baraaOrlogodohUrtugUne = a.urtugUne);
      }
    });
    // songogdson.forEach(
    //   (a) => (
    //   )
    // );

    setSongogdsonBaraanuud([...songogdson]);
  }

  function urtugUneNemya(v, id) {
    for (const mur of songogdsonBaraanuud) {
      if (mur._id === id) {
        mur.baraaOrlogodohUrtugUne = v;
      }
    }

    setSongogdsonBaraanuud([...songogdsonBaraanuud]);
  }

  function zarakhUneUurchlii(v, i) {
    songogdsonBaraanuud[i].niitUne = v;
    songogdsonBaraanuud[i].zarakhUne = v;
    setSongogdsonBaraanuud([...songogdsonBaraanuud]);
  }

  function tsuvralguiBaraaZadgaigaarOrlogdii(v, mur, index) {
    var khiikhToo =
      parseFloat(v) / parseFloat(mur.negKhairtsaganDahiShirhegiinToo);
    songogdsonBaraanuud[index].zadgaiUldegdelBodsonToo = (
      (parseFloat(songogdsonBaraanuud[index].niitToo) || 0) + (khiikhToo || 0)
    ).toFixed(2);
    songogdsonBaraanuud[index].zadgaiOrlogdojAvakh = v;

    setSongogdsonBaraanuud([...songogdsonBaraanuud]);
  }

  return (
    <div>
      <div>
        <Button onClick={modalNeekhFunction} type="gol">
          <InboxOutlined className="text-sm" />
          Орлого
        </Button>
      </div>

      <Modal
        zIndex={9999}
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center"
      >
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>

      <Modal
        destroyOnClose={true}
        footer={[
          <div className="flex justify-end gap-2">
            <Button
              type="primary"
              onClick={() => loading === false && form.submit()}
            >
              Хадгалах
            </Button>
          </div>,
        ]}
        width={"1024px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div>Бараа орлогодох</div>}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div
          // className="overflow-y-auto"
          style={{ maxHeight: "calc( 100vh - 18rem )" }}
        >
          <Form
            scrollToFirstError={{
              behavior: "smooth",
              block: "center",
              inline: "center",
            }}
            labelCol={{ span: 4 }}
            form={form}
            onFinish={onFinish}
            onValuesChange={(e, value) => {
              var { baraanuud, ...uldsen } = value;
              setTsuvraliinMedeelel(uldsen);
            }}
            name="control-ref"
            className="space-y-4"
          >
            <div className="flex w-full gap-2">
              <Form.Item
                className="w-full"
                autoComplete={false}
                label="Нийлүүлэгч"
                name="khariltsagchiinId"
                rules={[
                  {
                    required: true,
                    message: "Нийлүүлэгч сонгоно уу!",
                  },
                ]}
              >
                <Select
                  bordered={false}
                  onChange={(v) => {
                    setKhariltsagchiinId(v);
                    const selectedMur = data?.jagsaalt.find(
                      (mur) => mur._id === v
                    );

                    if (selectedMur) {
                      setSelectedMurNer(selectedMur.ner);
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
                      <Select.Option key={mur._id}>
                        <div className={`flex justify-start `}>
                          <div className="font-bold">{mur.ner}</div>
                          {"---"}
                          {mur.register}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <div>
                <KhariltsagchNemekhModal
                  mutate={khariltsagchMutate}
                  ashiglajBaigaGazar="baraaOrlogodohModal"
                />
              </div>
            </div>
            {
              <Form.Item
                autoComplete={false}
                label="Хэлбэр"
                name="khelber"
                // rules={[
                //   {
                //     required: true,
                //     message: "Бас төлбөрийн хэлбэр сонгоно уу!",
                //   },
                // ]}
              >
                <Select
                  bordered={false}
                  placeholder="Хэлбэр сонгох"
                  className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                >
                  <Select.Option key="zeel">
                    <div className={`flex justify-start `}>Зээл</div>
                  </Select.Option>
                  <Select.Option key="belen">
                    <div className={`flex justify-start `}>Бэлэн</div>
                  </Select.Option>
                </Select>
              </Form.Item>
            }
            <div className="flex gap-2">
              <Form.Item
                className="w-full"
                autoComplete={false}
                label="Бараа"
                name="baraanuud"
                rules={[
                  {
                    required: songogdsonBaraanuud.length > 0 ? false : true,
                    message: "Бараа сонгоно уу!",
                  },
                ]}
              >
                <Select
                  bordered={false}
                  onChange={(v) => onChangeButeegdekhuun(v)}
                  placeholder="Бараа сонгох"
                  className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  mode="multiple"
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
                      <Select.Option key={mur._id}>
                        <div className={`flex justify-start`}>
                          <div className="font-bold">{mur.id}</div>-{mur.code}-
                          {mur.ner}-{mur.uldegdel ? mur.uldegdel : 0}-
                          {mur.barCode ? mur.barCode : 0}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <div>
                <BaraaBurtgekh
                  mutate={baraaMutate}
                  ashiglajBaigaGazar={"baraaOrlogodohModal"}
                />
              </div>
            </div>
            <div>
              <div
                className="!max-h-[550px] w-full space-y-3 p-1 sm:overflow-y-auto"
                style={{ maxHeight: "calc( 100vh - 10rem)" }}
              >
                {songogdsonBaraanuud?.map((mur, index) => {
                  return (
                    <div
                      key={mur?._id + mur?.ner}
                      className={`relative ml-20 flex flex-col gap-4 rounded-lg p-2 ring-2 ring-blue-500 ring-opacity-50`}
                    >
                      <div className="flex  justify-between">
                        <div className="flex  w-[100%] gap-5">
                          <div className="flex w-[90%]">
                            <div className="flex items-center justify-center text-xl">
                              {index + 1}
                            </div>
                            <div className="w-[100%] px-4">
                              <Popover
                                placement="top"
                                content={<div>{mur?.id}</div>}
                                trigger="click"
                              >
                                <div className="cursor-pointer truncate">
                                  <div className="truncate">{mur?.id}</div>
                                </div>
                              </Popover>
                              <div
                                className=" z-50 flex flex-row overflow-hidden whitespace-nowrap font-bold  text-gray-600 "
                                style={{ textOverflow: "ellipsis" }}
                              >
                                <Popover
                                  placement="top"
                                  content={<div>{mur?.ner}</div>}
                                >
                                  <div className="flex cursor-pointer gap-2 truncate">
                                    <div>{mur?.code ? mur?.code : ""}</div>-
                                    <div className="truncate">{mur?.ner}</div>
                                  </div>
                                </Popover>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex text-xs font-bold text-yellow-600">
                                  Үлдэгдэл: {mur?.uldegdel ? mur?.uldegdel : 0}
                                </div>
                                {/* {mur.khadgalakhDarsanEsekh && (
                                  <div className='text-xs font-bold text-yellow-600'>
                                    Нэг хайрцаг дахь ширхэг :
                                    {mur.negKhairtsaganDahiShirhegiinToo}
                                  </div>
                                )} */}
                                {mur.shirkheglekhEsekh && (
                                  <div className="text-xs font-bold text-yellow-600">
                                    Нэг хайрцаг дахь ширхэг :
                                    {mur.negKhairtsaganDahiShirhegiinToo}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-end">
                            <CloseCircleTwoTone
                              onClick={() => ustgakh(mur?._id)}
                              className="cursor-pointer"
                              twoToneColor="#eb2f96"
                              style={{ fontSize: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex w-full flex-col items-center justify-center">
                          <div>Зарах үнэ:</div>
                          <InputNumber
                            min={0}
                            autoComplete="off"
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            style={{
                              width: "80%",
                              borderColor: "#4FD1C5",
                              borderRadius: "25px",
                              borderWidth: 1,
                            }}
                            value={mur?.niitUne}
                            placeholder="Зарах үнэ"
                            onChange={(v) => zarakhUneUurchlii(v, index)}
                          />
                        </div>
                        <div className="flex w-[700px] flex-col items-center justify-center gap-2">
                          {!mur?.tsuvraliinDugaartaiEsekh && (
                            <div className=" flex w-full items-center justify-center gap-2">
                              <div className="flex w-full flex-col items-start justify-center">
                                <div>Нэгж өртөг:</div>
                                <InputNumber
                                  min={0}
                                  autoComplete="off"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, "")
                                  }
                                  style={{
                                    width: "100%",
                                    borderColor: "#4FD1C5",
                                    borderRadius: "25px",
                                    borderWidth: 1,
                                  }}
                                  placeholder="Нэгж өртөг"
                                  value={mur?.baraaOrlogodohUrtugUne}
                                  onChange={(v) => urtugUneNemya(v, index)}
                                />
                              </div>
                              {mur?.tsuvraliinDugaartaiEsekh !== true && (
                                <div className="flex w-full flex-col items-start justify-center">
                                  <div>Тоо хэмжээ:</div>
                                  <div className=" flex w-[100%] items-center justify-center gap-2">
                                    <InputNumber
                                      // formatter={(value) =>
                                      //   `${value}`.replace(
                                      //     /\B(?=(\d{3})+(?!\d))/g,
                                      //     ","
                                      //   )
                                      // }
                                      onKeyPress={(event) => {
                                        if (!/[0-9,.]/.test(event.key)) {
                                          event.preventDefault();
                                        } else if (event.key === ",") {
                                          event.preventDefault();
                                          const currentValue =
                                            event.target.value || "";
                                          event.target.value =
                                            currentValue + ".";
                                        }
                                      }}
                                      placeholder={"Тоо ширхэг"}
                                      autoComplete="off"
                                      value={
                                        mur.shirkheglekhEsekh
                                          ? mur?.zadgaiUldegdelBodsonToo
                                          : mur.niitToo
                                      }
                                      size="small"
                                      // type='number'
                                      onChange={(v) =>
                                        songogdsonBaraanuudRuuNiitTooNemekhFunction(
                                          mur.code,
                                          v,
                                          !mur?.ognooniiMedeelelBurtgekhEsekh
                                            ? "engiinBaraa"
                                            : "mushgultteiBaraa",
                                          undefined,
                                          undefined
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}

                              {mur?.shirkheglekhEsekh === true && (
                                <div className="flex w-full flex-col items-start justify-center">
                                  <div>Задгай:</div>
                                  <div className=" flex w-[100%] items-center justify-center gap-2">
                                    <InputNumber
                                      // max={
                                      //   mur.negKhairtsaganDahiShirhegiinToo *
                                      //   mur.uldegdel
                                      // }
                                      placeholder={"Задгай"}
                                      autoComplete="off"
                                      value={mur?.zadgaiOrlogdojAvakh}
                                      size="small"
                                      type="number"
                                      onChange={(v) =>
                                        tsuvralguiBaraaZadgaigaarOrlogdii(
                                          v,
                                          mur,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex w-full flex-col items-start justify-center">
                                <div>Нийт өртөг:</div>
                                <Input
                                  disabled
                                  autoComplete="off"
                                  style={{
                                    width: "100%",
                                    borderColor: "#4FD1C5",
                                    borderRadius: "25px",
                                    borderWidth: 1,
                                  }}
                                  value={
                                    mur?.shirkheglekhEsekh &&
                                    mur?.niitToo &&
                                    mur?.baraaOrlogodohUrtugUne
                                      ? mur?.niitToo *
                                        mur?.baraaOrlogodohUrtugUne
                                      : 0
                                  }
                                  placeholder="Нийт үнэ"
                                  onChange={(v) => urtugUneNemya(v, index)}
                                />
                              </div>
                              {mur.ognooniiMedeelelBurtgekhEsekh &&
                                mur.tsuvraliinDugaartaiEsekh === false && (
                                  <div className="flex w-full flex-col items-start justify-center">
                                    <div>Дуусах огноо:</div>
                                    <Form.Item
                                      style={{
                                        width: "100%",
                                        margin: 0,
                                      }}
                                      name={[mur._id, "duusakhOgnoo"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Дуусах огноо оруулна уу.",
                                        },
                                      ]}
                                    >
                                      <DatePicker
                                        placeholder="Дуусах огноо"
                                        style={{
                                          width: "100%",
                                          borderColor: "#4FD1C5",
                                          borderRadius: "25px",
                                          borderWidth: 1,
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item hidden name={[mur._id, "too"]}>
                                      <Input disabled value={mur.niitToo} />
                                    </Form.Item>
                                    <Form.Item
                                      hidden
                                      initialValue={"Default"}
                                      name={[mur._id, "dugaar"]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </div>
                                )}
                            </div>
                          )}
                          {mur?.tsuvraliinDugaartaiEsekh && (
                            <Form.List initialValue={[1]} name={`${mur._id}`}>
                              {(fields, { add, remove }) => {
                                return (
                                  <React.Fragment key={fields.key}>
                                    <div className="absolute right-12 top-2 ">
                                      <Button
                                        type="primary"
                                        className="flex w-12 items-center justify-center  !rounded-full"
                                        onClick={() => add()}
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
                                    <div className="flex w-full flex-col items-center gap-3">
                                      <div className="max-h-[450px] w-[700px] overflow-auto">
                                        {fields.map((field, i) => {
                                          return (
                                            <div
                                              key={field.key}
                                              className="flex h-fit w-full gap-1"
                                            >
                                              <div className="flex w-full flex-col">
                                                <div className="relative flex w-full gap-5">
                                                  <div className="flex w-full flex-col items-start justify-center gap-2">
                                                    <div>Нэгж өртөг:</div>
                                                    <Form.Item className="w-full">
                                                      <InputNumber
                                                        min={0}
                                                        autoComplete="off"
                                                        formatter={(value) =>
                                                          `${value}`.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )
                                                        }
                                                        parser={(value) =>
                                                          value.replace(
                                                            /\$\s?|(,*)/g,
                                                            ""
                                                          )
                                                        }
                                                        style={{
                                                          width: "100%",
                                                          borderColor:
                                                            "#4FD1C5",
                                                          borderRadius: "25px",
                                                          borderWidth: 1,
                                                        }}
                                                        placeholder="Нэгж өртөг"
                                                        value={
                                                          mur.baraaOrlogodohUrtugUne
                                                        }
                                                        onChange={(v) =>
                                                          urtugUneNemya(
                                                            v,
                                                            mur._id
                                                          )
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </div>
                                                  <div className="flex w-full flex-col items-start justify-center gap-2">
                                                    <div>Цувралын дугаар:</div>
                                                    <Form.Item
                                                      className="w-full"
                                                      name={[
                                                        field.name,
                                                        "dugaar",
                                                      ]}
                                                      fieldKey={[
                                                        field.fieldKey,
                                                        "dugaar",
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            "Цуврал оруулна уу.",
                                                        },
                                                      ]}
                                                    >
                                                      <Input
                                                        placeholder="Цувралын дугаар"
                                                        autoComplete={false}
                                                        style={{
                                                          width: "100%",
                                                          borderColor:
                                                            "#4FD1C5",
                                                          borderRadius: "25px",
                                                          borderWidth: 1,
                                                        }}
                                                      />
                                                    </Form.Item>
                                                  </div>
                                                  <div className="flex w-full flex-col items-start justify-center gap-2">
                                                    <div>Тоо хэмжээ:</div>
                                                    <Form.Item
                                                      hidden
                                                      name={[
                                                        field.name,
                                                        "garaasOruulsanToo",
                                                      ]}
                                                    />
                                                    <Form.Item
                                                      className="w-full"
                                                      name={[field.name, "too"]}
                                                      fieldKey={[
                                                        field.fieldKey,
                                                        "too",
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            "Үлдэгдэл оруулна уу.",
                                                        },
                                                      ]}
                                                    >
                                                      <InputNumber
                                                        formatter={(value) =>
                                                          `${value}`.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )
                                                        }
                                                        onKeyPress={(event) => {
                                                          if (
                                                            !/[0-9,.]/.test(
                                                              event.key
                                                            )
                                                          ) {
                                                            event.preventDefault();
                                                          } else if (
                                                            event.key === ","
                                                          ) {
                                                            event.preventDefault();
                                                            const currentValue =
                                                              event.target
                                                                .value || "";
                                                            event.target.value =
                                                              currentValue +
                                                              ".";
                                                          }
                                                        }}
                                                        onBlur={(v) =>
                                                          form.setFieldValue(
                                                            [
                                                              mur?._id,
                                                              field.name,
                                                              "garaasOruulsanToo",
                                                            ],
                                                            !!v.target.value
                                                              ? parseInt(
                                                                  v.target.value
                                                                )
                                                              : 0
                                                          )
                                                        }
                                                        onChange={(v) => {
                                                          songogdsonBaraanuudRuuNiitTooNemekhFunction(
                                                            mur._id,
                                                            v,
                                                            undefined,
                                                            true,
                                                            field.fieldKey
                                                          );
                                                        }}
                                                        placeholder={
                                                          "Тоо хэмжээ"
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </div>
                                                  {mur.shirkheglekhEsekh && (
                                                    <div className="flex w-full flex-col items-start justify-center gap-2">
                                                      <div>Задгай:</div>
                                                      <Form.Item
                                                        className="w-full"
                                                        name={[
                                                          field.name,
                                                          "zadgaiUldegdel",
                                                        ]}
                                                        fieldKey={[
                                                          field.fieldKey,
                                                          "zadgaiUldegdel",
                                                        ]}
                                                      >
                                                        <InputNumber
                                                          onChange={(v) => {
                                                            const defaultToo =
                                                              form.getFieldValue(
                                                                [
                                                                  mur?._id,
                                                                  field.name,
                                                                  "garaasOruulsanToo",
                                                                ]
                                                              );
                                                            const newValue = !!v
                                                              ? parseFloat(
                                                                  defaultToo ||
                                                                    0
                                                                ) +
                                                                parseFloat(
                                                                  v || 0
                                                                ) /
                                                                  parseFloat(
                                                                    mur.negKhairtsaganDahiShirhegiinToo ||
                                                                      0
                                                                  )
                                                              : parseFloat(
                                                                  formatNumber(
                                                                    defaultToo ||
                                                                      0,
                                                                    2
                                                                  )
                                                                );
                                                            form.setFieldValue(
                                                              [
                                                                mur?._id,
                                                                field.name,
                                                                "too",
                                                              ],
                                                              parseFloat(
                                                                formatNumber(
                                                                  newValue,
                                                                  2
                                                                )
                                                              )
                                                            );
                                                          }}
                                                          placeholder={"Задгай"}
                                                          autoComplete="off"
                                                          value={
                                                            mur?.zadgaiOrlogdojAvakh
                                                          }
                                                          size="small"
                                                          type="number"
                                                        />
                                                      </Form.Item>
                                                    </div>
                                                  )}
                                                  {mur.ognooniiMedeelelBurtgekhEsekh ===
                                                    true && (
                                                    <div className="flex w-full flex-col items-start justify-center gap-2">
                                                      <div>Дуусах огноо:</div>
                                                      <Form.Item
                                                        name={[
                                                          field.name,
                                                          "duusakhOgnoo",
                                                        ]}
                                                        fieldKey={[
                                                          field.fieldKey,
                                                          "duusakhOgnoo",
                                                        ]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Дуусах огноо оруулна уу.",
                                                          },
                                                        ]}
                                                      >
                                                        <DatePicker
                                                          placeholder="Дуусах огноо"
                                                          style={{
                                                            width: "100%",
                                                            borderColor:
                                                              "#4FD1C5",
                                                            borderRadius:
                                                              "25px",
                                                            borderWidth: 1,
                                                          }}
                                                        />
                                                      </Form.Item>
                                                    </div>
                                                  )}
                                                  {fields.length > 1 && (
                                                    <Form.Item className="flex items-end justify-center">
                                                      <Button
                                                        type="danger"
                                                        className="flex h-full w-full items-center justify-center  !rounded-full"
                                                        onClick={() =>
                                                          remove(field.name)
                                                        }
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
                                                              x1="5"
                                                              y1="12"
                                                              x2="19"
                                                              y2="12"
                                                            ></line>
                                                          </svg>
                                                        </span>
                                                      </Button>
                                                    </Form.Item>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              }}
                            </Form.List>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="ml-20 flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <div className="text-base font-[600]">Нийт тоо:&nbsp;</div>
                  <div className="text-base font-[600]">
                    {songogdsonBaraanuud.reduce(
                      (sum, item) => sum + (item?.niitToo || 0),
                      0
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-start">
                  <div className="text-base font-[600]">Нийт үнэ:&nbsp;</div>
                  <div className="text-base font-[600]">
                    {formatNumber(
                      songogdsonBaraanuud.reduce(
                        (sum, item) =>
                          sum +
                          (item?.baraaOrlogodohUrtugUne || 0) *
                            (item?.niitToo || 0),
                        0
                      )
                    )}
                    {"₮"}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
export default BaraaOrlogodoh;
