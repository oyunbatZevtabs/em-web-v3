import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Table,
} from "antd";
import shalgaltKhiikh from "services/shalgaltKhiikh";

import React, { useState } from "react";

import {
  EyeOutlined,
  FileSearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useJagsaalt from "hooks/useJagsaalt";
import moment from "moment";
import FormLavlakh from "components/FormLavlakh";
import createMethod from "tools/function/crud/createMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Admin from "components/Admin";
import TextArea from "antd/lib/input/TextArea";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
const formItemLayout = {
  wrapperCol: {
    span: 24,
  },
};
const order = { createdAt: -1 };
function ButeegdekhuunBurtgel({ token }) {
  const { jagsaalt, onSearch, data, setKhuudaslalt, mutate } = useJagsaalt(
    "/jor",
    undefined,
    order
  );
  const [form] = Form.useForm();
  const [emKharakh, setEmKharakh] = useState(false);
  const [towchTuluv, setTowchTuluv] = useState(false);
  const [songosonEm, setSongosonEm] = useState();

  function handleEmSelect(_v, data, index) {
    form.setFieldValue(["emuud", index, "tun"], null);
    form.setFieldValue(["emuud", index, "tooShirkheg"], null);
    form.setFieldValue(["emuud", index, "khonog"], null);
    form.setFieldValue(["emuud", index, "une"], null);
    form.setFieldValue(["emuud", index, "niitUne"], null);
    form.setFieldValue(["emuud", index, "emiinSanId"], null);
    form.setFieldValue(["emuud", index, "emiinSanNer"], null);
    form.setFieldValue(["emuud", index, "emiinNer"], data?.children);
  }

  function regsitereerKhaikh(v) {
    if (v.length === 10) {
      uilchilgee(token)
        .get("/khariltsagch", {
          params: { query: { register: { $regex: v, $options: "i" } } },
        })
        .then(({ data }) => {
          if (!!data && !!data?.jagsaalt[0]?.ner) {
            form.setFieldValue("khariltsagchiinNer", data?.jagsaalt[0].ner);
          }
        });
    } else form.setFieldValue("khariltsagchiinNer", undefined);
  }

  function onFinish(params) {
    params.emuud.length === 0
      ? AldaaAlert("Эм оруулаагүй байна.")
      : createMethod("jorKhadgalya", token, params)
          .then(({ data }) => {
            setTowchTuluv(true);
            if (data === "Amjilttai") {
              form.resetFields();
              mutate();
              AmjilttaiAlert("Амжилттай хадгаллаа");
              setTowchTuluv(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setTowchTuluv(false);
          });
  }

  return (
    <Admin
      title="Эмчийн Үзлэг"
      khuudasniiNer="jor"
      className="gird grid-cols-12 p-0 md:p-4"
      onSearch={(search) =>
        onSearch((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div
        className="col-span-12 xl:col-span-5 2xl:col-span-7"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <Form form={form} {...formItemLayout} onFinish={onFinish} className="">
          <div className="box mb-7 p-10">
            <Form.Item name="_id" hidden />
            <div className="flex gap-5">
              <div className="w-1/2 gap-5">
                <Form.Item
                  name="khariltsagchiinId"
                  required
                  rules={[
                    {
                      required: true,
                      len: 10,
                      pattern: new RegExp("([аА-яЯ|өӨ|үҮ]{2})(\\d{8})"),
                      message: "Регистр бүртгэнэ үү!",
                    },
                  ]}
                >
                  <Input
                    className="uppercase"
                    disabled={emKharakh}
                    placeholder="Регистр"
                    onChange={(e) => regsitereerKhaikh(e.target.value)}
                    prefix={<FileSearchOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name="khariltsagchiinNer"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Нэр оруулна уу!",
                    },
                  ]}
                >
                  <Input
                    disabled={emKharakh}
                    placeholder="Нэр"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </div>
              <Form.Item
                className="w-1/2"
                name="onosh"
                required
                rules={[
                  {
                    required: true,
                    message: "Онош оруулна уу!",
                  },
                ]}
              >
                <TextArea
                  style={{ height: "90px" }}
                  disabled={emKharakh}
                  placeholder="Онош"
                />
              </Form.Item>
            </div>
          </div>
          <div className="box px-10 pt-5">
            <Form.List name="emuud">
              {(fields, { add, remove }) => (
                <div className="">
                  <div className="flex h-[53px] items-center justify-between ">
                    <div className="">Нийт эмийн тоо: {fields.length}</div>
                    <Form.Item
                      style={{ margin: 0 }}
                      className=" flex items-center justify-center "
                    >
                      <Button
                        style={{ width: "145px" }}
                        type="primary"
                        className={`${emKharakh && "invisible"}`}
                        onClick={add}
                        icon={<PlusOutlined />}
                      >
                        Эм нэмэх
                      </Button>
                    </Form.Item>
                  </div>
                  <div
                    className={`grid gap-6 overflow-y-auto  2xl:grid-cols-2  ${
                      fields.length === 0 ? "" : "p-5 pb-10"
                    }`}
                    style={{ maxHeight: "calc(100vh - 29.6rem)" }}
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className=" relative rounded-lg border px-6  pt-12 shadow-xl"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "em"]}
                          rules={[
                            {
                              required: true,
                              message: "Эм оруулна уу",
                            },
                          ]}
                        >
                          <FormLavlakh
                            lavlakh="em"
                            style={{ width: "100%" }}
                            shuukhTalbaruud={["khNer"]}
                            token={token}
                            valKey="_id"
                            placeholder={"Эм"}
                            setSongosonEm={setSongosonEm}
                            infoKey="khNer"
                            onSelect={handleEmSelect}
                            disabled={emKharakh}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "tun"]}
                          rules={[
                            {
                              required: true,
                              message: "Тун оруулна уу",
                            },
                          ]}
                        >
                          <Input placeholder="Тун" disabled={emKharakh} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "khonog"]}
                          rules={[
                            {
                              required: true,
                              message: "Хоног оруулна уу",
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Хоног"
                            disabled={emKharakh}
                            min={1}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "davtamj"]}
                          rules={[
                            {
                              required: true,
                              message: "Давтамж оруулна уу",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            style={{ width: "100%" }}
                            placeholder="Давтамж"
                            disabled={emKharakh}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "tooShirkheg"]}
                          rules={[
                            {
                              required: true,
                              message: "Тоо ширхэг оруулна уу",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            style={{ width: "100%" }}
                            placeholder="Тоо ширхэг"
                            disabled={emKharakh}
                          />
                        </Form.Item>

                        <div className="absolute left-0 right-5 top-3 flex w-full justify-between px-5">
                          <p className="text-xl ">Эм №{name + 1}</p>
                          <MinusCircleOutlined
                            className={` hover:text-red-500  ${
                              emKharakh && "invisible"
                            } text-2xl transition-colors `}
                            onClick={() => emKharakh === false && remove(name)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className=" flex h-[50px] items-center justify-end">
                    {/* <Form.Item noStyle className='w-full'>
                      <Button
                        className={`${emKharakh && "invisible"}`}
                        style={{ width: "100%" }}
                        type='dashed'
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}>
                        Эм нэмэх
                      </Button>
                    </Form.Item> */}

                    <Button
                      className="pt-10 2xl:w-2/12"
                      loading={towchTuluv}
                      type="primary"
                      onClick={() => {
                        if (emKharakh === true) {
                          form.resetFields();
                          setEmKharakh(false);
                        } else form.submit();
                      }}
                    >
                      {emKharakh ? "Хаах" : "Хадгалах"}
                    </Button>
                  </div>
                </div>
              )}
            </Form.List>
          </div>
        </Form>
      </div>
      <div
        className="box col-span-12 p-5 xl:col-span-7 2xl:col-span-5"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <h1 className="text-lg font-medium ">Түүх</h1>
        <Table
          bordered
          tableLayout={jagsaalt?.length > 0 ? "auto" : "fixed"}
          rowKey={(row) => row._id}
          scroll={{ y: "calc(100vh - 18rem)" }}
          locale={{ emptyText: "Мэдээлэл олдсонгүй" }}
          dataSource={jagsaalt}
          pagination={{
            current: Number(data?.khuudasniiDugaar),
            pageSize: Number(data?.khuudasniiKhemjee),
            total: Number(data?.niitMur),
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          columns={[
            {
              title: "№",
              key: "index",
              align: "center",
              render: (text, record, index) =>
                (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
                (data?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            { title: "Нэр", dataIndex: "khariltsagchiinNer", ellipsis: true },
            {
              title: "Регистр",
              width: "8rem",
              dataIndex: "khariltsagchiinId",
              ellipsis: true,
            },
            { title: "Эмчийн нэр", dataIndex: "emchiinNer", ellipsis: true },
            {
              title: "Бүртгэсэн огноо",
              dataIndex: "burtgesenOgnoo",
              width: "10rem",
              ellipsis: true,
              render(burtgesenOgnoo) {
                return moment(burtgesenOgnoo).format("YYYY-MM-DD hh:mm");
              },
            },
            {
              ellipsis: true,
              width: "3rem",
              align: "left",
              render(mur) {
                return (
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setEmKharakh(true);
                      form.setFieldsValue(mur);
                    }}
                  ></Button>
                );
              },
            },
          ]}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ButeegdekhuunBurtgel;
