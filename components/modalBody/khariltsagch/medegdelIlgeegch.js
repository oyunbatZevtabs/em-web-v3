import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function MedegdelIlgeegch({ data, destroy, token, baiguullaga }, ref) {
  const [songogdsonTurul, setSongogdsonTurul] = useState("email");
  const [form] = Form.useForm();
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  const onFinish = (formData) => {
    var yavuulakhData = {
      khariltsagch: formData.khariltsagch,
      text: formData.text,
    };
    if (songogdsonTurul === "email") {
      yavuulakhData.subject = formData.subject;
      posUilchilgee(token)
        .post("/mailOlnoorIlgeeye", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай илгээгдлээ");
            destroy();
          }
        })
        .catch((err) => aldaaBarigch(err));
    }
    if (songogdsonTurul === "sms") {
      posUilchilgee(token)
        .post("/smsOlnoorIlgeeye", yavuulakhData)
        .then(() => {
        
          AmjilttaiAlert("Амжилттай илгээгдлээ");
          destroy();
        })
        .catch((err) => aldaaBarigch(err));
    }
  };

  if (
    !baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhKey &&
    !baiguullaga?.tokhirgoo?.email?.mailNevtrekhNer
  ) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="text-yellow-500">
          <WarningOutlined />
        </div>
        <div>Мэдэгдэл тохиргоо хийгдээгүй байна!</div>
      </div>
    );
  }

  return (
    <Form
      labelCol={{ span: 5 }}
      form={form}
      onFinish={onFinish}
      autoComplete={"off"}
    >
      <Form.Item
        rules={[
          {
            required: true,
            message: "Илгээх төрөл сонгоно уу",
          },
        ]}
        label={"Илгээх төрөл"}
        name={"turul"}
      >
        <Select
          placeholder={"Мэдэгдэл илгээх төрөл сонгоно уу..."}
          className="rounded-lg border"
          value={songogdsonTurul}
          onChange={(v) => setSongogdsonTurul(v)}
        >
          {baiguullaga?.tokhirgoo?.SMS?.msgIlgeekhKey && (
            <Select.Option
              className={
                "dark:hover:!bg-gray-600 dark:focus:!bg-gray-600 dark:active:!bg-gray-600 dark:text-gray-300"
              }
              value={"sms"}
            >
              SMS
            </Select.Option>
          )}
          {baiguullaga?.tokhirgoo?.email?.mailNevtrekhNer && (
            <Select.Option
              className={
                "dark:hover:!bg-gray-600 dark:focus:!bg-gray-600 dark:active:!bg-gray-600 dark:text-gray-300"
              }
              value={"email"}
            >
              EMAIL
            </Select.Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: "Харилцагч сонгоно уу",
          },
        ]}
        label={"Харилцагч"}
        name={"khariltsagch"}
      >
        <Select
          placeholder={"Харилцагч сонгоно уу..."}
          className="rounded-lg border"
          mode="multiple"
          allowClear={true}
        >
          {data?.map((mur, index) => {
            return (
              <Select.Option key={index} value={mur._id} className="dark:text-gray-300 dark:hover:!bg-gray-600">
                {mur.ner}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      {songogdsonTurul === "email" && (
        <Form.Item
          rules={[
            {
              required: true, 
              message: "Гарчиг оруулна уу",
            },
          ]}
          label={"Гарчиг"}
          name={"subject"}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Явуулах утга оруулна уу",
          },
        ]}
        label={"Тайлбар"}
        name={"text"}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(MedegdelIlgeegch);
