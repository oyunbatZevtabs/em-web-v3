import { Button, DatePicker, Form, Space } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import formatNumber from "tools/function/formatNumber";
import { CiEdit } from "react-icons/ci";
import TooShirkhegInput, { Input } from "components/ant/AntdInput";
import moment from "moment";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function MushgiltOruulakhModal({
  baraaniiUndesehTsuvraluud,
  setBaraaniiUndesehTsuvraluud,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  const [form] = Form.useForm();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    var hadgalakhTsuvral = values.tsuvral.map((e) => {
      e.duusakhOgnoo = moment(e.duusakhOgnoo);
      e.huleejAvsanOgnoo = !!e.huleejAvsanOgnoo
        ? e.huleejAvsanOgnoo
        : moment().format();
      e.etssiinUldegdel = !!e.etssiinUldegdel ? e.etssiinUldegdel : 0;
      e.ekhniiUldegdel = !!e.ekhniiUldegdel ? e.ekhniiUldegdel : 0;
      return e;
    });
    setBaraaniiUndesehTsuvraluud(hadgalakhTsuvral);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={openModal}>Огноо нэмэх</Button>

      <Modal
        width={"538px"}
        okText="Эхлүүлэх"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleCancel} style={{ width: "100px" }}>
              Гарах
            </Button>
            <Button
              onClick={form.submit}
              style={{ width: "100px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Огноо оруулах
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div>
          <Form
            initialValues={{
              tsuvral: baraaniiUndesehTsuvraluud.map((item) => ({
                ...item,
                duusakhOgnoo: moment(item.duusakhOgnoo),
              })),
            }}
            name="tsuvralHasajNemekh"
            onFinish={onFinish}
            form={form}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off">
            <Form.List name="tsuvral">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 8,
                      }}
                      align="baseline">
                      <Form.Item
                        style={{
                          width: "189px",
                        }}
                        name={[name, "duusakhOgnoo"]}
                        rules={[
                          {
                            required: true,
                            message: "Дуусах огноо оруулаагүй байна.",
                          },
                        ]}>
                        <DatePicker
                          placeholder="Дуусах огноо"
                          format={"YYYY/MM/DD"}
                          disabledDate={(current) => {
                            let customDate = moment().format("YYYY-MM-DD");
                            var songogdsonOgnoonuud =
                              form.getFieldValue("tsuvral");
                            return (
                              (current &&
                                current < moment(customDate, "YYYY-MM-DD")) ||
                              songogdsonOgnoonuud?.some(
                                (a) =>
                                  a?.duusakhOgnoo &&
                                  moment(a?.duusakhOgnoo).format(
                                    "YYYY-MM-DD"
                                  ) === moment(current).format("YYYY-MM-DD")
                              )
                            );
                          }}
                          style={{
                            width: "100%",
                            borderColor: "#4FD1C5",
                            borderRadius: "25px",
                            borderWidth: 1,
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "toolsonToo"]}
                        rules={[
                          {
                            required: true,
                            message: "Тоо ширхэг оруулаагүй байна.",
                          },
                        ]}>
                        <TooShirkhegInput placeholder="Тоо ширхэг" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}>
                      Огноо нэмэх
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default MushgiltOruulakhModal;
