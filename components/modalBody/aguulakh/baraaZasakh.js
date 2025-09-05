import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import { FormOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import { useAuth } from "services/auth";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import moment from "moment";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function BaraaZasakh({ baraaData, setModalBaraaZasakhModalData, mutate }) {
  const [form] = Form.useForm();
  const [noatBodokhEsekh, setNoatBodokhEsekh] = useState(
    baraaData?.noatBodohEsekh
  );
  const [orjIrsenBaraaData, setOrjIrsenBaraaData] = useState({});
  const [tsuwraliinDugaarBurtgeh, setTsuwraliinDugaarBurtgeh] = useState(
    baraaData?.tsuvraliinDugaartaiEsekh
  );

  const [ognooBurtgekhEsekh, setOgnooBurtgekhEsekh] = useState(
    baraaData?.ognooniiMedeelelBurtgekhEsekh
  );
  const orluulakhOnChange = (checked) => {
    setEmdOrluulakh(checked);
  };
  const [khariltsakhEsekh, setKhariltsakhEsekh] = useState(
    baraaData?.shirkheglekhEsekh
  );

  const [idevkhteiEsekh, setidevkhteiEsekh] = useState(
    baraaData?.idevkhteiEsekh
  );

  const [zurgiinIdAvi, setZurgiinIdAvi] = useState();

  const { ajiltan, token, baiguullagiinId } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [emdOrluulakh, setEmdOrluulakh] = useState(false);
  useEffect(() => {
    setNoatBodokhEsekh(baraaData?.noatBodohEsekh);
    setTsuwraliinDugaarBurtgeh(baraaData?.tsuvraliinDugaartaiEsekh);
    setOgnooBurtgekhEsekh(baraaData?.ognooniiMedeelelBurtgekhEsekh);
  }, [baraaData]);

  function handleCancel() {
    setOpenModal(false);
  }

  const khariltsakhOnChange = (checked) => {
    setKhariltsakhEsekh(checked);
  };

  const dateFormat = "YYYY/MM/DD";

  const query = useMemo(() => {
    var qeury = {
      baiguullagiinId: baiguullagiinId,
    };
    return qeury;
  }, [baiguullagiinId]);

  const { jagsaalt, data, setKhuudaslalt } = posUseJagsaalt(
    "BaraaniiAngilal",
    query,
    undefined,
    undefined,
    undefined,
    undefined,
    true
  );

  const onFinish = (formData) => {
    const yavuulahData = {
      ...baraaData,
      ...formData,
      niitUne: parseInt(formData.une),
      baiguullagiinId: baiguullagiinId,
      tsuvraliinDugaartaiEsekh: tsuwraliinDugaarBurtgeh,
      zurgiinId: zurgiinIdAvi,
      ognooniiMedeelelBurtgekhEsekh: ognooBurtgekhEsekh,
      shirkheglekhEsekh: khariltsakhEsekh,
      noatBodohEsekh: noatBodokhEsekh,
      idevkhteiEsekh: idevkhteiEsekh,
      ajiltan: {
        id: ajiltan._id,
        ner: ajiltan.ner,
        baiguullagiinId: baiguullagiinId,
      },
    };

    posUilchilgee(token)
      .put("/baraaZasyaa/" + baraaData?._id, yavuulahData)
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          handleCancel();
          mutate();
          AmjilttaiAlert("Амжилттай");
        }
      })
      .catch((e) => aldaaBarigch(e));
  };

  function modalNeegdekhFunction() {
    const momentKhiisenOgnoonuud = baraaData?.tsuvral?.map((item) => ({
      ...item,
      huleejAvsanOgnoo: item?.huleejAvsanOgnoo
        ? moment(item?.huleejAvsanOgnoo)
        : null,
      uildverlesenOgnoo: item?.uildverlesenOgnoo
        ? moment(item?.uildverlesenOgnoo)
        : null,
      duusakhOgnoo: item?.duusakhOgnoo ? moment(item?.duusakhOgnoo) : null,
    }));
    setOrjIrsenBaraaData({
      ner: baraaData?.ner,
      une: baraaData?.niitUne,
      barCode: baraaData?.barCode,
      boginoNer: baraaData?.boginoNer,
      uldegdel: baraaData?.uldegdel,
      khemjikhNegj: baraaData?.khemjikhNegj,
      angilal: baraaData?.angilal,
      urtugUne: baraaData?.urtugUne,
      code: baraaData?.code,
      tsuvral: momentKhiisenOgnoonuud,
      negKhairtsaganDahiShirhegiinToo:
        baraaData.negKhairtsaganDahiShirhegiinToo,
    });
    setOpenModal(true);
  }

  return (
    <div>
      <a
        onClick={modalNeegdekhFunction}
        className="ant-dropdown-link flex w-full cursor-pointer items-center  justify-between  rounded-lg p-2 hover:bg-green-100"
      >
        <FormOutlined style={{ fontSize: "18px", color: "#4fc1d5" }} />
        <label className="cursor-pointer text-[#4fc1d5]">Засах</label>
      </a>
      <Modal
        footer={[
          <Button onClick={() => form.submit()} type="primary">
            Хадгалах
          </Button>,
        ]}
        width={"735px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="font- text-center text-[20px] ">Бараа Засах</div>
        }
        open={openModal}
        onCancel={handleCancel}
      >
        <Form
          initialValues={orjIrsenBaraaData}
          scrollToFirstError={{
            behavior: "smooth",
            block: "center",
            inline: "center",
          }}
          form={form}
          onFinish={onFinish}
        >
          <div className="flex h-[150px] items-center justify-center gap-2">
            <div className="flex h-[150px] w-[95%] flex-col items-center justify-center gap-2 dark:text-gray-300">
              <div className="flex w-full justify-end gap-2">
                <div>НӨАТ бодох эсэх</div>
                <Switch disabled checked={noatBodokhEsekh} />
              </div>
              <div className="flex w-full justify-end gap-2">
                <div>Цувралын дугаартай эсэх</div>
                <Switch disabled checked={tsuwraliinDugaarBurtgeh} />
              </div>
              <div className="flex w-full justify-end gap-2 ">
                <div>Идэвхтэй эсэх</div>
                <Switch
                  defaultChecked={idevkhteiEsekh}
                  onChange={setidevkhteiEsekh}
                />
              </div>
              <div className="flex w-full justify-end gap-2">
                <div>Огноо бүртгэх эсэх</div>
                <Switch disabled checked={ognooBurtgekhEsekh} />
              </div>
              <div className="flex w-full justify-end gap-2">
                <div>Хайрцаглах эсэх</div>
                <Switch
                  defaultChecked={khariltsakhEsekh}
                  onChange={khariltsakhOnChange}
                />
              </div>
              <div className="flex w-full justify-end gap-2 ">
                <div>Орлуулах эсэх</div>
                <Switch
                  defaultChecked={emdOrluulakh}
                  onChange={orluulakhOnChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Нэр оруулна уу",
                },
              ]}
              name={"ner"}
              label={"Барааны нэр"}
            >
              <Input
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Нэр"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              label={<div className="dark:text-gray-300">Богино нэр</div>}
              name={"boginoNer"}
            >
              <Input
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Богино нэр"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Дотоод код оруулна уу",
                },
              ]}
              name={"code"}
              label={"Дотоод код"}
            >
              <Input
                disabled
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Нэр"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              label={<div className="dark:text-gray-300">Бар код</div>}
              name={"barCode"}
            >
              <Input
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Бар код"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Худалдах үнэ оруулна уу",
                },
              ]}
              name={"une"}
              normalize={(input) => {
                const too = input.replace(/[^0-9,.]/g, "");
                return too;
              }}
              label={"Худалдах үнэ"}
            >
              <Input
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Худалдах үнэ"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              label={"Нэгж өртөг"}
              rules={[
                {
                  required: true,
                  message: "Нэгж өртөг оруулна уу",
                },
              ]}
              name={"urtugUne"}
            >
              <InputNumber
                autoComplete="off"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Нэгж өртөг"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Хэмжих нэгж оруулна уу",
                },
              ]}
              label={"Хэмжих нэгж"}
              name={"khemjikhNegj"}
            >
              <Select
                autoComplete="off"
                className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                bordered={false}
                placeholder="Хэмжих нэгж"
                allowClear
                options={[
                  {
                    value: "Кг",
                    label: "Кг",
                  },
                  {
                    value: "Ширхэг",
                    label: "Ширхэг",
                  },
                  {
                    value: "Литр",
                    label: "Литр",
                  },
                  {
                    value: "Грамм",
                    label: "Грамм",
                  },
                  {
                    value: "Мл",
                    label: "Мл",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Ангилал сонгоогүй байна",
                },
              ]}
              label={"Ангилал"}
              name={"angilal"}
            >
              <Select
                autoComplete="off"
                className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                bordered={false}
                placeholder="Ангилал"
                allowClear
              >
                {jagsaalt.map((option) => (
                  <Option key={option._id} value={option.angilal}>
                    {option.angilal}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {ognooBurtgekhEsekh === false &&
              tsuwraliinDugaarBurtgeh === false && (
                <Form.Item
                  style={{ width: "48%" }}
                  labelCol={{ span: 24 }}
                  label={"Үлдэгдэл"}
                  name={"uldegdel"}
                >
                  <InputNumber
                    disabled
                    autoComplete="off"
                    style={{
                      width: "100%",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder="Үлдэгдэл"
                  />
                </Form.Item>
              )}

            {tsuwraliinDugaarBurtgeh === true &&
              ognooBurtgekhEsekh === true && (
                <div className="w-[98%]">
                  <Form.List name="tsuvral">
                    {(fields, { add, remove }) => (
                      <div className="flex flex-col gap-4">
                        <div className="max-h-[150px] overflow-y-auto">
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              className={`mt-8 flex h-fit ${
                                ognooBurtgekhEsekh
                                  ? "items-center"
                                  : "items-baseline"
                              } !m-0  justify-center gap-1`}
                            >
                              <div className="flex w-full flex-col">
                                <div className="flex w-full gap-4">
                                  <Form.Item
                                    style={{ width: "100%" }}
                                    {...restField}
                                    name={[name, "dugaar"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Цувралын дугаар оруулна уу",
                                      },
                                    ]}
                                  >
                                    <Input
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Цувралын дугаар"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    style={{ width: "100%", margin: 0 }}
                                    {...restField}
                                    name={[name, "duusakhOgnoo"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Дуусах огноо оруулна уу",
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      format={dateFormat}
                                      placeholder="Дуусах огноо"
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
                                    style={{ width: "100%" }}
                                    name={[name, "uldegdel"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Үлдэгдэл оруулна уу",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      disabled
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Үлдэгдэл"
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Form.List>
                </div>
              )}

            {tsuwraliinDugaarBurtgeh === false && ognooBurtgekhEsekh && (
              <div className="w-full">
                <Form.List name="tsuvral">
                  {(fields, { add, remove }) => (
                    <div className="flex flex-col gap-3">
                      <div className="max-h-[150px] overflow-y-auto">
                        {fields.map(({ key, name, ...restField }) => (
                          <div
                            className={`mt-3 flex h-fit ${
                              ognooBurtgekhEsekh
                                ? "items-center"
                                : "items-baseline"
                            }  justify-center gap-1`}
                          >
                            <div className="flex w-full flex-col gap-5">
                              <div className="flex w-full gap-2">
                                <Form.Item
                                  {...restField}
                                  style={{ width: "100%" }}
                                  name={[name, "uldegdel"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Үлдэгдэл оруулна уу",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    disabled
                                    style={{
                                      width: "100%",
                                      borderColor: "#4FD1C5",
                                      borderRadius: "25px",
                                      borderWidth: 1,
                                    }}
                                    placeholder="Үлдэгдэл"
                                  />
                                </Form.Item>
                                {ognooBurtgekhEsekh && (
                                  <Form.Item
                                    style={{ width: "100%", margin: 0 }}
                                    {...restField}
                                    name={[name, "duusakhOgnoo"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Дуусах огноо оруулна уу",
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      format={dateFormat}
                                      placeholder="Дуусах огноо"
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                    />
                                  </Form.Item>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            )}

            {khariltsakhEsekh && (
              <Form.Item
                style={{ width: "48%" }}
                labelCol={{ span: 24 }}
                // rules={[
                //   {
                //     required: true,
                //     message: "Хайрцаг дахь тоо оруулаагүй байна",
                //   },
                // ]}
                label={
                  <div className="dark:text-gray-300">Хайрцаг дахь тоо</div>
                }
                name={"negKhairtsaganDahiShirhegiinToo"}
              >
                <InputNumber
                  autoComplete="off"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  style={{
                    width: "100%",
                    borderColor: "#4FD1C5",
                    borderRadius: "25px",
                    borderWidth: 1,
                  }}
                  placeholder="Хайрцаг дахь тоо"
                />
              </Form.Item>
            )}

            {tsuwraliinDugaarBurtgeh === true &&
              ognooBurtgekhEsekh === false && (
                <div className="w-full">
                  <Form.List name="tsuvral">
                    {(fields, { add, remove }) => (
                      <>
                        <div className="flex max-h-[150px] flex-col gap-5 overflow-y-auto">
                          {fields.map(({ key, name, ...restField }) => (
                            <div className="flex w-full place-items-baseline gap-2">
                              <div className="flex w-full flex-col gap-2">
                                <div className="flex items-baseline justify-center gap-2">
                                  <Form.Item
                                    style={{ width: "100%", margin: 0 }}
                                    {...restField}
                                    name={[name, "dugaar"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Цувралын дугаар оруулна уу",
                                      },
                                    ]}
                                  >
                                    <Input
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Цувралын дугаар"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    style={{ width: "100%" }}
                                    labelCol={{ span: 24 }}
                                    name={[name, "uldegdel"]}
                                  >
                                    <InputNumber
                                      disabled
                                      autoComplete="off"
                                      style={{
                                        width: "100%",
                                        borderColor: "#4FD1C5",
                                        borderRadius: "25px",
                                        borderWidth: 1,
                                      }}
                                      placeholder="Үлдэгдэл"
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                              {!baraaData.uldegdel && (
                                <div>
                                  <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {/* {!baraaData.uldegdel && (
                          <div className='flex w-full items-center justify-center'>
                            <Form.Item className='w-[50%]'>
                              <Button
                                type='dashed'
                                className='h-9'
                                onClick={() => {
                                  add();
                                }}
                                block>
                                Цуврал оруулах
                              </Button>
                            </Form.Item>
                          </div>
                        )} */}
                      </>
                    )}
                  </Form.List>
                </div>
              )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
export default BaraaZasakh;
