import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Select, Space, Switch } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { TextArea, Input, InputNumber } from "components/ant/AntdInput";
import { Modal } from "components/ant/AntdModal";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import useBaraa from "hooks/useBaraa";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import TsuvralYanzlakhModal from "./TsuvralYanzlakhModal";

const searchKeys = ["ner", "register"];

function ZarlagaKhiikhModal({ tuukhMutate }) {
  const [form] = Form.useForm();
  const { token, baiguullagiinId, ajiltan, salbariinId } = useAuth();
  const [khuleegdejBaina, setKhuleegdejBaina] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { baraaGaralt, setBaraaniiKhuudaslalt, baraaMutate } = useBaraa(token);
  const [khariltsagchiinId, setKhariltsagchiinId] = useState();
  const [khariltsagchiinNer, setKhariltsagchNer] = useState();

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  const { data, onSearch } = posUseJagsaalt(
    "/khariltsagch",
    query,
    undefined,
    undefined,
    searchKeys
  );
  const shalgakhArray = Form.useWatch("baraanuud", form);
  function onFinish() {
    form.submit();
  }

  function handleCancel() {
    setIsModalOpen(false);
    form.resetFields();
  }

  function openModal() {
    setIsModalOpen(true);
  }

  useEffect(() => {
    if (!!form) {
      form.setFieldValue("ognoo", moment().startOf("day"));
    }
  }, [isModalOpen]);

  async function khadgalakh(formData) {
    setKhuleegdejBaina(true);
    const baraanuud = await form.getFieldValue("baraanuud");
    const niitDun = baraanuud?.reduce((sav, mur) => sav + mur?.niitUne, 0);
    let yavuulakhData = {
      ajiltan: { id: ajiltan?._id, ner: ajiltan?.ner },
      baiguullagiinId: baiguullagiinId,
      salbariinId: salbariinId,
      khariltsagchiinId: khariltsagchiinId,
      khariltsagchiinNer: khariltsagchiinNer,
      baraanuud: formData?.baraanuud,
      niitDun: niitDun,
      turul: formData?.turul,
      tailbar: formData?.tailbar,
      ognoo: moment(formData?.ognoo),
    };
    await posUilchilgee(token)
      .post("/baraaniiGuilgeeKhiie", yavuulakhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай хадгалагдлаа");
          form.resetFields();
          baraaMutate();
          tuukhMutate();
          setKhuleegdejBaina(false);
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
        setKhuleegdejBaina(false);
      });
  }

  function tsuvralYanzliy(baraaArray) {
    if (!baraaArray || !Array.isArray(baraaArray)) {
      return [];
    }
    const shineArray = baraaArray.map((mur) => {
      let niitKhasakhToo = mur?.too;
      if (mur && Array.isArray(mur.tsuvral) && mur.tsuvral.length > 0) {
        return {
          ...mur,
          tsuvral: mur.tsuvral.map((item) => {
            let tavikhToo = 0;
            if (niitKhasakhToo > item?.uldegdel) {
              tavikhToo = item?.uldegdel;
              niitKhasakhToo = niitKhasakhToo - tavikhToo;
            } else {
              tavikhToo = niitKhasakhToo;
            }
            return {
              ...item,
              too: tavikhToo,
            };
          }),
        };
      }
      return mur;
    });
    return shineArray;
  }

  function handleBaraaSongolt(value, index) {
    if (value) {
      form.setFieldValue(["baraanuud", index, "code"], value?.code);
      form.setFieldValue(["baraanuud", index, "uldegdel"], value?.uldegdel);
      form.setFieldValue(["baraanuud", index, "urtugUne"], value?.urtugUne);
      form.setFieldValue(
        ["baraanuud", index, "shirkheglekhEsekh"],
        value?.shirkheglekhEsekh
      );
      form.setFieldValue(
        ["baraanuud", index, "tsuvraliinDugaartaiEsekh"],
        value?.tsuvraliinDugaartaiEsekh
      );
      form.setFieldValue(
        ["baraanuud", index, "ognooniiMedeelelBurtgekhEsekh"],
        value?.ognooniiMedeelelBurtgekhEsekh
      );
      form.setFieldValue(["baraanuud", index, "zarakhUne"], value?.zarakhUne);
      form.setFieldValue(["baraanuud", index, "ner"], value?.ner);
      form.setFieldValue(["baraanuud", index, "too"], undefined);
      form.setFieldValue(["baraanuud", index, "niitUne"], undefined);
      if (value?.tsuvral?.length > 0) {
        form.setFieldValue(["baraanuud", index, "tsuvral"], value?.tsuvral);
      }
    } else {
      form.setFieldValue(["baraanuud", index, "code"], undefined);
      form.setFieldValue(["baraanuud", index, "uldegdel"], undefined);
      form.setFieldValue(["baraanuud", index, "urtugUne"], undefined);
      form.setFieldValue(["baraanuud", index, "shirkheglekhEsekh"], undefined);
      form.setFieldValue(
        ["baraanuud", index, "tsuvraliinDugaartaiEsekh"],
        undefined
      );
      form.setFieldValue(
        ["baraanuud", index, "ognooniiMedeelelBurtgekhEsekh"],
        undefined
      );
      form.setFieldValue(["baraanuud", index, "zarakhUne"], undefined);
      form.setFieldValue(["baraanuud", index, "ner"], undefined);
      form.setFieldValue(["baraanuud", index, "too"], undefined);
      form.setFieldValue(["baraanuud", index, "niitUne"], undefined);
      form.setFieldValue(["baraanuud", index, "tsuvral"], undefined);
    }
  }

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

  return (
    <>
      <Button onClick={openModal} type="primary">
        Бүртгэх
      </Button>
      <Modal
        width={"1050px"}
        okText="Хадгалах"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleCancel} style={{ width: "100px" }}>
              Гарах
            </Button>
            <Button
              onClick={() => khuleegdejBaina === false && onFinish()}
              style={{ width: "100px" }}
              type="primary"
            >
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Зарлага</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          className="grid w-full grid-cols-3"
          layout="vertical"
          onFinish={khadgalakh}
          form={form}
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "Төрөл сонгоно уу",
              },
            ]}
            name={"turul"}
            className="col-span-1 flex w-full"
          >
            <Select
              className="!min-h-[34px] !w-36 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200"
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
            className="col-span-1 flex w-full"
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
              className="!min-h-[34px] !w-48 rounded-md border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-800 dark:text-gray-200"
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onSearch={onSearch}
            >
              {data?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?._id}>
                    <div className={`flex justify-start `}>
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
            rules={[
              {
                required: true,
                message: "Огноо сонгоно уу",
              },
            ]}
            name={"ognoo"}
            className="col-span-1 flex w-full"
          >
            <DatePicker className="!rounded-md" locale={locale} />
          </Form.Item>
          <Form.List
            initialValue={[1]}
            className="flex-col bg-blue-500"
            name="baraanuud"
          >
            {(fields, { add, remove }) => {
              return (
                <>
                  <div
                    className="col-span-3 overflow-y-auto"
                    style={{ maxHeight: "45vh" }}
                  >
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Space
                        key={key}
                        style={{ display: "flex" }}
                        align="center"
                      >
                        <span className="mr-3">{index + 1}</span>
                        <Form.Item
                          {...restField}
                          name={[name, "_id"]}
                          label="Бараа материал"
                          rules={[
                            {
                              required: true,
                              message: "Бараа сонгоно уу!",
                            },
                          ]}
                        >
                          <Select
                            bordered={false}
                            placeholder="Бараа сонгох"
                            className="w-[125px] max-w-[125px] rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                            showSearch
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
                            onChange={(v) => {
                              const songogdsonMur = baraaGaralt?.jagsaalt?.find(
                                (mur) => mur._id === v
                              );
                              handleBaraaSongolt(songogdsonMur, index);
                            }}
                          >
                            {baraaGaralt?.jagsaalt?.map((mur) => {
                              const songogdsonEsekh = shalgakhArray?.some(
                                (e, i) => i !== index && e?._id === mur._id
                              );
                              return (
                                <Select.Option
                                  disabled={songogdsonEsekh}
                                  value={mur._id}
                                >
                                  <div
                                    className={`flex w-[125px] justify-start`}
                                  >
                                    {mur.ner}
                                  </div>
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item {...restField} hidden name={[name, "ner"]}>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          hidden
                          name={[name, "shirkheglekhEsekh"]}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          hidden
                          name={[name, "tsuvraliinDugaartaiEsekh"]}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          hidden
                          name={[name, "ognooniiMedeelelBurtgekhEsekh"]}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          hidden
                          name={[name, "tsuvral"]}
                        />
                        <Form.Item
                          {...restField}
                          hidden
                          name={[name, "zarakhUne"]}
                        >
                          <InputNumber />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "code"]}
                          label="Дотоод код"
                          className="hidden min-w-[100px] xl:block"
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "uldegdel"]}
                          label="Үлдэгдэл"
                        >
                          <InputNumber
                            style={{
                              width: "8rem",
                              borderRadius: "25px",
                              borderColor: "rgba(79,209,197,1)",
                            }}
                            autoComplete="off"
                            disabled
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "urtugUne"]}
                          label="Нэгж өртөг"
                        >
                          <InputNumber
                            style={{
                              width: "8rem",
                              borderRadius: "25px",
                              borderColor: "rgba(79,209,197,1)",
                            }}
                            className={
                              "rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                            }
                            autoComplete="off"
                            disabled
                            // formatter={(value) =>
                            //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            // }
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                        {form.getFieldValue(["baraanuud", index, "tsuvral"]) ? (
                          <Form.Item label="Тоо хэмжээ" name={"too"}>
                            <div className="flex h-8 w-[8rem] items-center justify-center">
                              <TsuvralYanzlakhModal
                                data={form.getFieldValue(["baraanuud", index])}
                                form={form}
                                index={index}
                                onSave={(tukhainToo) => {
                                  handleTooKhemjeeUurchlult(tukhainToo, index);
                                }}
                              />
                            </div>
                          </Form.Item>
                        ) : (
                          <Form.Item
                            {...restField}
                            name={[name, "too"]}
                            label="Тоо хэмжээ"
                            rules={[
                              {
                                required: true,
                                message: "Тоо хэмжээ оруулна уу!",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{
                                width: "8rem",
                                borderRadius: "25px",
                                borderColor: "rgba(79,209,197,1)",
                              }}
                              disabled={
                                form.getFieldValue([
                                  "baraanuud",
                                  index,
                                  "tsuvral",
                                ])?.length > 0
                              }
                              min={0}
                              onChange={(v) =>
                                handleTooKhemjeeUurchlult(v, index)
                              }
                              autoComplete="off"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) =>
                                value.replace(/\$\s?|(,*)/g, "")
                              }
                            />
                          </Form.Item>
                        )}
                        <Form.Item
                          {...restField}
                          name={[name, "niitUne"]}
                          label="Нийт үнэ"
                        >
                          <InputNumber
                            style={{
                              width: "8rem",
                              borderRadius: "25px",
                              borderColor: "rgba(79,209,197,1)",
                            }}
                            disabled
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      </Space>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-between">
                    <div className="ml-7 flex items-end">
                      <Form.Item className="w-[120px]">
                        <Button
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => add()}
                        >
                          <PlusOutlined style={{ fontSize: "14px" }} />
                          <span className="ml-2" style={{ marginTop: 1 }}>
                            Бараа нэмэх
                          </span>
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </>
              );
            }}
          </Form.List>
          <Form.Item
            name="tailbar"
            className="col-span-3"
            style={{
              width: "40%",
            }}
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
      </Modal>
    </>
  );
}

export default ZarlagaKhiikhModal;
