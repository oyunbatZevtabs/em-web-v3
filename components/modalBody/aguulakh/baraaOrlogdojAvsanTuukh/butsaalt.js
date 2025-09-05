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
import { Input, InputNumber } from "../../antdInput";
import AsuulgaModal from "../../asuulgaModal";
import { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";
const order = { createdAt: -1 };
const searchKeys = ["ner", "ovog", "utas", "mail", "register"];
function Butsaalt({ mutate, zasakhData, setZasakhData }) {
  const { token, ajiltan, baiguullagiinId, salbariinId } = useAuth();

  const [form] = Form.useForm();

  const queryBaraa = useMemo(() => {
    return {
      code: { $in: zasakhData?.baraanuud?.map((a) => a.code) },
    };
  }, [zasakhData]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    zasakhData && token,
    baiguullagiinId,
    undefined,
    queryBaraa
  );
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
    setZasakhData(false);
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
    } else setZasakhData(false);
  }

  function modalNeekhFunction() {
    baraaMutate();
    setZasakhData(true);
  }
  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
      turul: "Нийлүүлэгч",
    }),
    [baiguullagiinId]
  );
  const { data, setKhuudaslalt, onSearch } = posUseJagsaalt(
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

  useEffect(() => {
    if (!!zasakhData) {
      var zasakhUgugdul = _.cloneDeep(zasakhData);
      setKhariltsagchiinId(zasakhUgugdul?.khariltsagchiinId);
      setSelectedMurNer(zasakhUgugdul?.khariltsagchiinNer);
      setSongogdsonBaraanuud(zasakhUgugdul?.baraanuud);
      zasakhUgugdul?.baraanuud?.forEach((a) => {
        if (!!a.tsuvral && a.tsuvral?.length > 0) {
          for (const tsuvral of a.tsuvral) {
            if (!!tsuvral.duusakhOgnoo) {
              tsuvral.duusakhOgnoo = moment(tsuvral.duusakhOgnoo);
            }
          }
        }
        form.setFieldValue(`${a._id}`, a.tsuvral);
      });
      form.setFieldsValue({
        ...zasakhUgugdul,
        baraanuud: zasakhUgugdul?.baraanuud?.map((a) => a.code),
      });
    }
  }, [zasakhData]);

  function songogdsonBaraanuudRuuNiitTooNemekhFunction(
    code,
    value,
    turul,
    tsuvraltaiEsekh,
    index
  ) {
    const updatedBaraanuud = songogdsonBaraanuud.map((e) => {
      if (!tsuvraltaiEsekh) {
        if (e?.code === code) {
          if (turul === "engiinBaraa" || turul === "mushgultteiBaraa") {
            e.too = parseFloat(value);
            if (turul === "mushgultteiBaraa") {
              form.setFieldValue([e?._id, "too"], e.too);
            }
          }
        }
      } else if (e._id === code) {
        var tsuvral = form.getFieldValue(code);
        var too = tsuvral?.reduce((a, b) => a + b.too, 0);
        e.too = parseFloat(too);
      }
      return e;
    });
    setSongogdsonBaraanuud(updatedBaraanuud);
  }
  const onFinish = (formData) => {
    // setKhadgalakhDarsanEsekh(true);
    setLoading(true);
    const baraanuud = songogdsonBaraanuud.map((item) => ({
      urtugUne: parseFloat(item?.urtugUne),
      ner: item?.ner,
      barCode: item?.barCode,
      code: item?.code,
      too: item?.too,
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
      _id: zasakhData._id,
      baraanuud,
      niitDun,
      khelber: formData?.khelber,
      ajiltan: { id: ajiltan._id, ner: ajiltan.ner },
      butsaaltiinTuluv: "Бараа сонгох",
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
      khariltsagchiinId: khariltsagchiinId,
      shaltgaan: "Засвар",
      khariltsagchiinNer: selectedMurNer,
      zasakhEsekh: true,
    };
    posUilchilgee(token)
      .post("/orlogButsaaltKhiiye", yavuulahData)
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай");
          mutate();
          form.resetFields();
          setSongogdsonBaraanuud([]);
          baraaMutate();
          setZasakhData();
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
    songogdson.forEach(
      (a) => (
        (a.tooShirkheg = !!a.tooShirkheg ? a.tooShirkheg : 1),
        (a.une = !!a.turSanakhUne ? a.turSanakhUne : 0),
        a.tsuvraliinDugaartaiEsekh == false,
        a.shirkhgeerOrlogodohEsekh == false,
        (a.urtugUne = a.urtugUne)
      )
    );
    setSongogdsonBaraanuud([...songogdson]);
  }

  function urtugUneNemya(v, i) {
    songogdsonBaraanuud[i].urtugUne = v;
    setSongogdsonBaraanuud([...songogdsonBaraanuud]);
  }

  return (
    <div>
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
          <Button
            type="primary"
            onClick={() => loading === false && form.submit()}
          >
            Хадгалах
          </Button>,
        ]}
        width={"1024px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-bold">
            Бараа орлогодох
          </div>
        }
        open={!!zasakhData}
        onCancel={handleCancel}
      >
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc( 100vh - 18rem )" }}
        >
          <Form
            labelCol={{ span: 4 }}
            form={form}
            onFinish={onFinish}
            name="control-ref"
            className="space-y-4"
          >
            <Form.Item
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
                className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300"
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
                      <div className={`flex justify-start dark:text-gray-300 `}>
                        <div className="font-bold dark:text-gray-300">
                          {mur.ner}
                        </div>
                        {"---"}
                        {mur.register}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {
              <Form.Item autoComplete={false} label="Хэлбэр" name="khelber">
                <Select
                  bordered={false}
                  placeholder="Хэлбэр сонгох"
                  className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300"
                >
                  <Select.Option key="zeel">
                    <div className={`flex justify-start dark:text-gray-300`}>
                      Зээл
                    </div>
                  </Select.Option>
                  <Select.Option key="belen">
                    <div className={`flex justify-start dark:text-gray-300 `}>
                      Бэлэн
                    </div>
                  </Select.Option>
                </Select>
              </Form.Item>
            }
            <Form.Item
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
                    <Select.Option key={mur.code}>
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
              <div
                className="w-full space-y-3 p-1 sm:overflow-y-auto"
                style={{ maxHeight: "calc( 100vh - 50vh)" }}
              >
                {songogdsonBaraanuud?.map((mur, index) => {
                  return (
                    <div
                      key={mur?._id + mur?.ner}
                      className={`relative ml-20 flex h-[80%] flex-col gap-4 rounded-lg p-2 ring-2 ring-blue-500 ring-opacity-50`}
                    >
                      <div className="flex h-[80%] justify-between">
                        <div className="flex w-[100%] gap-5">
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
                        <div className="flex w-[700px] flex-col items-center justify-center gap-2">
                          {!mur?.tsuvraliinDugaartaiEsekh && (
                            <div className=" flex w-full items-center justify-center gap-2">
                              <div className="flex w-full flex-col items-start justify-center">
                                <div>Нэгж өртөг:</div>
                                <InputNumber
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
                                  value={mur?.urtugUne}
                                  onChange={(v) => urtugUneNemya(v, index)}
                                />
                              </div>
                              {mur?.tsuvraliinDugaartaiEsekh !== true && (
                                <div className="flex w-full flex-col items-start justify-center">
                                  <div>Тоо хэмжээ:</div>
                                  <div className=" flex w-[100%] items-center justify-center gap-2">
                                    <InputNumber
                                      placeholder={"Тоо ширхэг"}
                                      autoComplete="off"
                                      value={mur?.too}
                                      size="small"
                                      type="number"
                                      onChange={(v) =>
                                        songogdsonBaraanuudRuuNiitTooNemekhFunction(
                                          mur.code,
                                          v,
                                          !mur?.ognooniiMedeelelBurtgekhEsekh
                                            ? "engiinBaraa"
                                            : "mushgultteiBaraa"
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
                                    mur?.too && mur?.urtugUne
                                      ? mur?.too * mur?.urtugUne
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
                                      <Input disabled value={mur.too} />
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
                            <Form.List name={`${mur._id}`}>
                              {(fields, { add, remove }) => {
                                return (
                                  <>
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
                                        {fields.map(
                                          ({ key, name, ...restField }) => {
                                            return (
                                              <div className="flex h-fit w-full gap-1">
                                                <div className="flex w-full flex-col">
                                                  <div className="relative flex w-full gap-5">
                                                    <div className="flex w-full flex-col items-start justify-center gap-2">
                                                      <div>Нэгж өртөг:</div>
                                                      <Form.Item className="w-full">
                                                        <InputNumber
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
                                                            borderRadius:
                                                              "25px",
                                                            borderWidth: 1,
                                                          }}
                                                          placeholder="Нэгж өртөг"
                                                          value={mur.urtugUne}
                                                          onChange={(v) =>
                                                            urtugUneNemya(
                                                              v,
                                                              index
                                                            )
                                                          }
                                                        />
                                                      </Form.Item>
                                                    </div>
                                                    {mur?.shirkheglekhEsekh ===
                                                      true && (
                                                      <div className="flex w-full flex-col items-start justify-center">
                                                        <div>Задгай:</div>
                                                        <div className=" flex w-[100%] items-center justify-center gap-2">
                                                          <InputNumber
                                                            // max={
                                                            //   mur.negKhairtsaganDahiShirhegiinToo *
                                                            //   mur.uldegdel
                                                            // }
                                                            placeholder={
                                                              "Задгай"
                                                            }
                                                            autoComplete="off"
                                                            value={
                                                              mur?.zadgaiOrlogdojAvakh
                                                            }
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
                                                    <div className="flex w-full flex-col items-start justify-center gap-2">
                                                      <div>
                                                        Цувралын дугаар:
                                                      </div>
                                                      <Form.Item
                                                        className="w-full"
                                                        {...restField}
                                                        name={[name, "dugaar"]}
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
                                                            borderRadius:
                                                              "25px",
                                                            borderWidth: 1,
                                                          }}
                                                        />
                                                      </Form.Item>
                                                    </div>
                                                    <div className="flex w-full flex-col items-start justify-center gap-2">
                                                      <div>Тоо хэмжээ:</div>
                                                      <Form.Item
                                                        className="w-full"
                                                        {...restField}
                                                        name={[name, "too"]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Үлдэгдэл оруулна уу.",
                                                          },
                                                        ]}
                                                      >
                                                        <InputNumber
                                                          onChange={(v) =>
                                                            songogdsonBaraanuudRuuNiitTooNemekhFunction(
                                                              mur._id,
                                                              v,
                                                              undefined,
                                                              true,
                                                              key
                                                            )
                                                          }
                                                          placeholder={
                                                            "Тоо хэмжээ"
                                                          }
                                                        />
                                                      </Form.Item>
                                                    </div>
                                                    {mur.ognooniiMedeelelBurtgekhEsekh ===
                                                      true && (
                                                      <div className="flex w-full flex-col items-start justify-center gap-2">
                                                        <div>Дуусах огноо:</div>
                                                        <Form.Item
                                                          {...restField}
                                                          name={[
                                                            name,
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
                                                            remove(name)
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
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </>
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
                      (sum, item) => sum + (item?.too || 0),
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
                          sum + (item?.urtugUne || 0) * (item?.too || 0),
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
export default Butsaalt;
