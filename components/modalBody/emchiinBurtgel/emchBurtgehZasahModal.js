import { Button, Form, Input, Select, notification } from "antd";
import { Modal } from "components/ant/AntdModal";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useLayoutEffect, useState } from "react";
import { useAuth } from "services/auth";
import AsuulgaModal from "../asuulgaModal";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { Type } from "react-swipeable-list";
import { DatePicker, Space } from "antd";
import {
  EditOutlined,
  FormOutlined,
  RobotOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function EmchBurtgehZasahModal({ data, mutate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { token, baiguullagiinId, baiguullaga } = useAuth();
  const [neelttei, setNeelttei] = useState(false);
  const [zasajBuiEsekh, setZasajBuiEsekh] = useState(false);

  useLayoutEffect(() => {
    if (data) {
      setZasajBuiEsekh(true);
      form.setFieldValue("ovog", data?.ovog);
      form.setFieldValue("ner", data?.ner);
      form.setFieldValue("utas", data?.utas);
      form.setFieldValue("register", data?.register);
      form.setFieldValue("mail", data?.mail);
      form.setFieldValue("khayag", data?.khayag);
      form.setFieldValue("burtgeliinDugaar", data?.burtgeliinDugaar);
      form.setFieldValue("ajildOrsonOgnoo", moment(data?.ajildOrsonOgnoo));
    }
  }, [data]);

  const tiim = () => {
    setIsModalOpen(false);
    setNeelttei(false);
    if (!zasajBuiEsekh) {
      form.resetFields();
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
      !!shalgakhData.nuutsUg ||
      !!shalgakhData.ajildOrsonOgnoo
    ) {
      setNeelttei(true);
    } else {
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const {
    data: emiinSanData,
    jagsaalt: emiinSanJagsaalt,
    setKhuudaslalt: setEmiinSanKhuudaslalt,
    refresh,
    next: emNext,
  } = useJagsaalt("/emiinsan");

  function emchBurtgeye() {
    const ywuulakhEmchiinMedeelel = form.getFieldsValue();
    ywuulakhEmchiinMedeelel.emiinSanId = baiguullagiinId;
    if (zasajBuiEsekh) {
      uilchilgee(token)
        .put(`/emZuich/${data?._id}`, ywuulakhEmchiinMedeelel)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай хадгалагдлаа");
            // mutate();
            setIsModalOpen(false);
          }
        })
        .catch((err) => aldaaBarigch(err));
    } else {
      ywuulakhEmchiinMedeelel.tsonkhniiTokhirgoo = {
        posSystem: true,
        UilchluulegchPos: true,
      }; //default aar pos tsonkhtoi burtgey
      uilchilgee(token)
        .post("/emZuich", ywuulakhEmchiinMedeelel)
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

  return (
    <div>
      {zasajBuiEsekh ? (
        <div
          onClick={showModal}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors duration-500 hover:bg-teal-200">
          <FormOutlined style={{ color: "#4fc1d5" }} />
          <div className="text-[#4fc1d5]">Засах</div>
        </div>
      ) : (
        <Button
          onClick={showModal}
          style={{ height: "36px", width: "152px" }}
          type="primary">
          Хэрэглэгч бүртгэх
        </Button>
      )}
      <Modal
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center">
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>
      <Modal
        className="flex items-center justify-center"
        //okText="Бүртгэх"
        footer={[
          <Button
            // style={{ width: "11rem", height: "2.5rem" }}
            className=" mr-7 shadow-xl"
            onClick={() => form.submit()}
            type="primary">
            Хадгалах
          </Button>,
        ]}
        //cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="text-center">Хэрэглэгч бүртгэх</div>}
        open={isModalOpen}
        // onOk={() => form.submit()}
        onCancel={handleCancel}>
        <Form
          autoComplete="off"
          labelAlign="right"
          form={form}
          onFinish={emchBurtgeye}
          // initialValues={data}
        >
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-between px-8 ">
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
                    .filter((a) => /[А-Яа-яөӨүҮA-z]/.test(a))
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
                labelCol={{ span: 24 }}
                style={{ width: "45%" }}
                rules={[
                  {
                    required: true,
                    message: "* Регистр оруулна уу!",
                  },
                  {
                    min: 10,
                    message: "* Регистр дутуу байна!",
                  },
                ]}
                normalize={(input) => {
                  const too = input.replace(/[^0-9]/g, "").slice(0, 8);
                  const useg = Array.from(input)
                    .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
                    .slice(0, 2)
                    .join("");
                  return `${useg}${too}`.toUpperCase();
                }}
                label={"Регистрийн дугаар"}
                name={"register"}>
                <Input
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

              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
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
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Бүртгэлийн дугаар оруулна уу!",
                  },
                ]}
                label={"Дугаар"}
                name={"burtgeliinDugaar"}>
                <Input
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Бүртгэлийн дугаар"
                />
              </Form.Item>
              <Form.Item
                style={{ width: "45%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Нууц үг оруулна уу!",
                  },
                ]}
                label={"Нууц үг"}
                name={"nuutsUg"}>
                <Input.Password
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Нууц үг"
                />
              </Form.Item>
              <Form.Item
                style={{ width: "45%", height: "100%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Салбарын эрх оруулна уу!",
                  },
                ]}
                label={"Салбарын эрх"}
                name={"salbaruud"}>
                <Select
                  style={{
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "50px",
                    overflow: "hidden",
                    borderWidth: 1,
                  }}
                  placeholder={"Салбарын эрх"}
                  mode="multiple">
                  {baiguullaga?.salbaruud?.map((mur) => (
                    <Select.Option key={mur._id}>{mur.ner}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: "45%", height: "100%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "* Ажилд орсон огноо оруулна уу!",
                  },
                ]}
                label={" Ажилд орсон огноо"}
                name={"ajildOrsonOgnoo"}>
                <DatePicker
                  style={{
                    width: "100%",
                    height: "2rem",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Ажилд орсон огноо"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
export default EmchBurtgehZasahModal;
