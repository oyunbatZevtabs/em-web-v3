import { Button, Form, Input, Select, Switch, notification } from "antd";
import { Modal } from "components/ant/AntdModal";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "services/auth";
import AsuulgaModal from "../asuulgaModal";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { Type } from "react-swipeable-list";
import { DatePicker, Space } from "antd";
import {
  EditOutlined,
  FormOutlined,
  PercentageOutlined,
  RobotOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import posUilchilgee, { posUrl } from "services/posUilchilgee";
import axios from "axios";
import formatNumber from "tools/function/formatNumber";

function KhariltsagchNemekhModal({
  data,
  mutate,
  toololtMutate,
  ashiglajBaigaGazar,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [neelttei, setNeelttei] = useState(false);
  const [zasajBuiEsekh, setZasajBuiEsekh] = useState(false);
  const [turul, setTurul] = useState("ААН");
  const [register, setRegister] = useState("");
  const [khunglukhEsekh, setKhunglukhEsekh] = useState(false);
  const [khunglukhTurul, setKhunglukhTurul] = useState();

  useLayoutEffect(() => {
    if (data) {
      setZasajBuiEsekh(true);
      form.setFieldValue("ovog", data?.ovog);
      form.setFieldValue("ner", data?.ner);
      form.setFieldValue("utas", data?.utas);
      form.setFieldValue("register", data?.register);
      form.setFieldValue("mail", data?.mail);
      form.setFieldValue("khayag", data?.khayag);
      form.setFieldValue("turul", data?.turul);
      form.setFieldValue("zakhirliinNer", data?.zakhirliinNer);
      form.setFieldValue("zakhirliinOvog", data?.zakhirliinOvog);
      form.setFieldValue("khunglukhTurul", data?.khunglukhTurul);
      form.setFieldValue("khunglukhDun", data?.khunglukhDun);
      form.setFieldValue("khunglukhKhuvi", data?.khunglukhKhuvi);
      setKhunglukhTurul(data?.khunglukhTurul);
      setKhunglukhEsekh(data?.khunglukhEsekh);
      form.setFieldValue("khariltsagchiinTurul", data?.khariltsagchiinTurul);
    } else {
      form.setFieldValue("khunglukhTurul", "Мөнгөн дүн");
      setKhunglukhTurul("Мөнгөн дүн");
    }
  }, [data]);

  useEffect(() => {
    form.setFieldValue("khariltsagchiinTurul", turul);
  }, [turul]);

  const tiim = () => {
    setIsModalOpen(false);
    setNeelttei(false);
    if (!zasajBuiEsekh) {
      form.resetFields();
      setTurul();
    }
  };

  const ugui = () => {
    setNeelttei(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    const shalgakhData = form.getFieldsValue();
    if (
      !!shalgakhData.ovog ||
      !!shalgakhData.ner ||
      !!shalgakhData.utas ||
      !!shalgakhData.register ||
      !!shalgakhData.mail ||
      !!shalgakhData.emiinSanId ||
      !!shalgakhData.khayag ||
      !!shalgakhData.burtgeliinDugaar ||
      !!shalgakhData.zakhirliinOvog ||
      !!shalgakhData.zakhirliinOvog ||
      !!turul
    ) {
      setNeelttei(true);
    } else {
      setIsModalOpen(false);
      // form.resetFields();
    }
  };

  // const handleCancel =()=>{
  //   AsuulgaModal(neelttei(true));
  //   form.resetFields();
  // };

  const {
    data: emiinSanData,
    jagsaalt: emiinSanJagsaalt,
    setKhuudaslalt: setEmiinSanKhuudaslalt,
    refresh,
    next: emNext,
  } = useJagsaalt("/emiinsan");

  function khariltsagchBurtgeye() {
    const ywuulakhEmchiinMedeelel = form.getFieldsValue();
    ywuulakhEmchiinMedeelel.baiguullagiinId = baiguullagiinId;
    ywuulakhEmchiinMedeelel.salbariinId = salbariinId;
    ywuulakhEmchiinMedeelel.khunglukhEsekh = khunglukhEsekh;
    ywuulakhEmchiinMedeelel.khunglukhTurul = khunglukhTurul;

    if (typeof ywuulakhEmchiinMedeelel.khunglukhDun === "number") {
      ywuulakhEmchiinMedeelel.khunglukhDun =
        ywuulakhEmchiinMedeelel.khunglukhDun.toString();
    }

    if (typeof ywuulakhEmchiinMedeelel.khunglukhDun === "string") {
      ywuulakhEmchiinMedeelel.khunglukhDun =
        ywuulakhEmchiinMedeelel.khunglukhDun.replace(/,/g, "");
    }

    ywuulakhEmchiinMedeelel.khunglukhDun = Number(
      ywuulakhEmchiinMedeelel.khunglukhDun || 0
    );
    ywuulakhEmchiinMedeelel.khunglukhKhuvi = Number(
      ywuulakhEmchiinMedeelel.khunglukhKhuvi || 0
    );
    if (zasajBuiEsekh) {
      posUilchilgee(token)
        .put(`/khariltsagch/${data?._id}`, ywuulakhEmchiinMedeelel)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            mutate();
            if (toololtMutate) {
              toololtMutate();
            }
            setIsModalOpen(false);
          }
        })
        .catch((err) => aldaaBarigch(err));
    } else {
      ywuulakhEmchiinMedeelel.tsonkhniiTokhirgoo = { posSystem: true };
      posUilchilgee(token)
        .post("/khariltsagchBurtgeye", ywuulakhEmchiinMedeelel)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            form.resetFields();
            mutate();
            setIsModalOpen(false);
          }
        })
        .catch((err) => aldaaBarigch(err));
    }
  }
  let timeoutId;

  const handleChange = ({ target }) => {
    const register = target.value;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      registerShalgaya(register);
    }, 1000);
  };

  useEffect(() => {
    if (register?.target?.value?.length === 7 && turul === "ААН") {
      setTimeout(() => {
        axios
          .get(`${posUrl}/tatvaraasBaiguullagaAvya/${register.target.value}`)
          .then(({ data }) => {
            if (data?.found === true) {
              form.setFieldsValue({
                ner: data?.name,
              });
            }
          });
      }, "500");
    }
  }, [register, turul]);

  function registerShalgaya(register) {
    if (
      (register?.length === 7 && turul === "ААН") ||
      (register?.length === 10 && turul === "Иргэн")
    ) {
    }
  }

  return (
    <div
      className={`${
        ashiglajBaigaGazar === "baraaOrlogodohModal" ? "mr-2" : ""
      }`}>
      {zasajBuiEsekh ? (
        <div
          onClick={showModal}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors duration-500 hover:bg-teal-200">
          <FormOutlined style={{ color: "#4fc1d5" }} />
          <div className="text-[#4fc1d5]">Засах</div>
        </div>
      ) : ashiglajBaigaGazar === "khunglultModal" ||
        ashiglajBaigaGazar === "zeelModal" ? (
        <Button onClick={showModal} type="gol">
          <PlusOutlined />
        </Button>
      ) : (
        <Button
          onClick={showModal}
          style={{ height: "36px", width: "152px" }}
          type="primary">
          Харилцагч нэмэх
        </Button>
      )}
      <Modal
        // title={false}
        // huduldugModal={false}
        zIndex={1011}
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center">
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>
      <Modal
        zIndex={1011}
        className="flex items-center justify-center"
        footer={[
          <Button
            className=" mr-7 shadow-xl"
            onClick={() => form.submit()}
            type="primary">
            Хадгалах
          </Button>,
        ]}
        title={<div className="text-center">Харилцагч бүртгэх</div>}
        open={isModalOpen}
        onCancel={handleCancel}>
        <Form
          autoComplete="off"
          labelAlign="right"
          form={form}
          onFinish={khariltsagchBurtgeye}>
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-between px-8 dark:text-gray-400">
              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Төрөл сонгоно уу!",
                  },
                ]}
                label={"Төрөл"}
                name={"turul"}>
                <Select
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "50px",
                    overflow: "hidden",
                    borderWidth: 1,
                  }}
                  placeholder="Төрөл">
                  <Select.Option value={"Худалдан авагч"}>
                    Худалдан авагч
                  </Select.Option>
                  <Select.Option value={"Нийлүүлэгч"}>Нийлүүлэгч</Select.Option>
                  <Select.Option value={"Ажилтан"}>Ажилтан</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Харилцагчийн төрөл сонгоно уу!",
                  },
                ]}
                label={"Харилцагчийн төрөл"}
                name={"khariltsagchiinTurul"}>
                <Select
                  style={{
                    height: "100%",
                    borderColor: "#4FD1C5",
                    borderRadius: "50px",
                    overflow: "hidden",
                    borderWidth: 1,
                  }}
                  placeholder="Харилцагчийн төрөл"
                  onChange={(v) => {
                    setTurul(v), form.setFieldsValue({ register: undefined });
                  }}>
                  <Select.Option key={"ААН"} value={"ААН"}>
                    ААН
                  </Select.Option>
                  <Select.Option key={"Иргэн"} value={"Иргэн"}>
                    Иргэн
                  </Select.Option>
                </Select>
              </Form.Item>
              {turul === "Иргэн" && (
                <Form.Item
                  style={{ width: "45%" }}
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "* Овог нэр оруулна уу!",
                    },
                  ]}
                  label={"Овог"}
                  normalize={(input) => {
                    const useg = Array.from(input)
                      .filter((a) => /[А-Яа-яөӨүҮA-z]/.test(a))
                      .join("");
                    return useg;
                  }}
                  name={"ovog"}>
                  <Input
                    style={{
                      height: "2rem",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Овог"
                  />
                </Form.Item>
              )}

              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Нэр оруулна уу!",
                  },
                ]}
                name={"ner"}
                normalize={(input) => {
                  const useg = Array.from(input)
                    .filter((a) => /[А-Яа-яөӨүҮA-z ]/.test(a))
                    .join("");
                  return useg;
                }}
                label={"Нэр"}>
                <Input
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Нэр"
                />
              </Form.Item>

              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                // rules={[
                //   {
                //     required: true,
                //     message: "* Утас оруулна уу!",
                //   },
                // ]}
                label={<div className="dark:text-gray-300">Утас</div>}
                name={"utas"}>
                <Input
                  maxLength={8}
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Утас"
                />
              </Form.Item>

              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                label={<div className="dark:text-gray-300">И-Мэйл</div>}
                name={"mail"}>
                <Input
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="И-Мэйл"
                />
              </Form.Item>
              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                // rules={[
                //   {
                //     required: true,
                //     message: "* Хаяг оруулна уу!",
                //   },
                // ]}
                label={<div className="dark:text-gray-300">Хаяг</div>}
                name={"khayag"}>
                <Input
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Хаяг"
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                style={{ width: !turul || turul === "ААН" ? "100%" : "45%" }}
                // rules={[
                //   {
                //     required: true,
                //     message: "* Регистр оруулна уу!",
                //   },
                // ]}
                normalize={(input) => {
                  if (turul === "ААН") {
                    const too = input.replace(/[^0-9]/g, "").slice(0, 7);
                    return too;
                  } else {
                    const too = input.replace(/[^0-9]/g, "").slice(0, 8);
                    const useg = Array.from(input)
                      .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
                      .slice(0, 2)
                      .join("");
                    return `${useg}${too}`.toUpperCase();
                  }
                }}
                label={
                  <div className="dark:text-gray-300">Регистрийн дугаар</div>
                }
                name={"register"}>
                <Input
                  onChange={setRegister}
                  maxLength={10}
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Регистрийн дугаар"
                />
              </Form.Item>
              <div className="flex w-full justify-end gap-2">
                <div className="dark:text-gray-300">Хөнгөлөх эсэх</div>
                <Switch checked={khunglukhEsekh} onChange={setKhunglukhEsekh} />
              </div>
              <Form.Item
                labelCol={{ span: 24 }}
                style={{ width: "45%" }}
                label={<div className="dark:text-gray-300">Хөнгөлөх Төрөл</div>}
                name={"khunglukhTurul"}>
                <Select
                  onChange={(v) => {
                    setKhunglukhTurul(v);
                    form.setFieldValue("khunglukhDun", undefined);
                    form.setFieldValue("khunglukhKhuvi", undefined);
                  }}
                  disabled={!khunglukhEsekh}
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "50px",
                    overflow: "hidden",
                    borderWidth: 1,
                  }}
                  placeholder="Хөнгөлөх Төрөл">
                  <Select.Option value={"Мөнгөн дүн"}>Мөнгөн дүн</Select.Option>
                  <Select.Option value={"Хувь"}>Хувь</Select.Option>
                </Select>
              </Form.Item>
              {khunglukhTurul === "Мөнгөн дүн" ? (
                <Form.Item
                  labelCol={{ span: 24 }}
                  style={{ width: "45%" }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "* Регистр оруулна уу!",
                  //   },
                  // ]}
                  normalize={(input) => {
                    const too = input.replace(/[^0-9]/g, "");
                    return too ? formatNumber(too) : undefined;
                  }}
                  label={<div className="dark:text-gray-300">Хөнгөлөх дүн</div>}
                  name={"khunglukhDun"}>
                  <Input
                    disabled={!khunglukhEsekh}
                    suffix={"₮"}
                    style={{
                      height: "2rem",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Хөнгөлөх дүн"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  labelCol={{ span: 24 }}
                  style={{ width: "45%" }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "* Регистр оруулна уу!",
                  //   },
                  // ]}
                  normalize={(input) => {
                    var too = input.replace(/[^0-9]/g, "").slice(0, 3);
                    if (Number(too) > 100) {
                      too = "100";
                    }
                    return too;
                  }}
                  label={"Хөнгөлөх хувь"}
                  name={"khunglukhKhuvi"}>
                  <Input
                    suffix={<PercentageOutlined />}
                    disabled={!khunglukhEsekh}
                    style={{
                      height: "2rem",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Хөнгөлөх хувь"
                  />
                </Form.Item>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
export default KhariltsagchNemekhModal;
