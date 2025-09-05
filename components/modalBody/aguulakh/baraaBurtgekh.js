import {
  Button,
  DatePicker,
  Form,
  Image,
  Select,
  Space,
  Switch,
  Upload,
  message,
} from "antd";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Modal } from "components/ant/AntdModal";
import React, { useMemo, useState } from "react";
import posUilchilgee, { aldaaBarigch, posUrl } from "services/posUilchilgee";
import { useAuth } from "services/auth";
import axios from "axios";
import posUseJagsaalt from "hooks/posUseJagsaalt";
import confirm from "antd/lib/modal/confirm";
import AsuulgaModal from "../asuulgaModal";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import moment from "moment";
import { Input, InputNumber } from "../antdInput";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    AldaaAlert("Та зөвхөн JPG/PNG файлыг байршуулах боломжтой!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    AldaaAlert("Зургийн хэмжээ 2MB-аас бага байх ёстой!");
  }
  return isJpgOrPng && isLt2M;
};

function BaraaBurtgekh({ mutate, aguulakhToololtMutate, ashiglajBaigaGazar }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [noatBodokhEsekh, setNoatBodokhEsekh] = useState(true);
  const [shirkhegleh, setShirkhegleh] = useState(false);
  const [tsuwraliinDugaarBurtgeh, setTsuwraliinDugaarBurtgeh] = useState(true);
  const [ognooBurtgekhEsekh, setOgnooBurtgekhEsekh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [umKhiisenEsekh, setUmKhiisenEsekh] = useState(false);
  const [neelttei, setNeelttei] = useState(false);
  const { ajiltan, token, baiguullagiinId, salbariinId } = useAuth();
  const [zurag, setZurag] = useState("");
  const [khariltsakhEsekh, setKhariltsakhEsekh] = useState(false);
  const [emdOrluulakh, setEmdOrluulakh] = useState(false);
  const [tsahimJordOrluulak, setTsahimJordOrluulak] = useState(false);
  const [idevkhteiEsekh, setidevkhteiEsekh] = useState(true);

  // const [angilalAsuukh, setAngilalAsuukh] = useState(false);

  const tiim = () => {
    setIsModalOpen(false);
    setNeelttei(false);
    form.resetFields();
  };
  const ugui = () => {
    setNeelttei(false);
    form.resetFields();
    setImageUrl();
    setIsModalOpen(false);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setImageUrl(newFileList);

    newFileList.forEach((file) => {
      if (file.status === "done") {
        setZurag(file.response);
      }
    });
  };

  function handleCancel() {
    const formData = form.getFieldsValue();
    let bgaEsekh = [];

    Object.values(formData).forEach((a) => {
      if (a !== undefined && !Array.isArray) {
        bgaEsekh.push(a);
      } else if (a?.length > 0) {
        Object.values(a).forEach((b) => {
          if (b !== undefined) {
            bgaEsekh.push(b);
          }
        });
      }
    });
    if (bgaEsekh.length > 0) {
      setNeelttei(true);
    } else {
      setImageUrl();
      setIsModalOpen(false);
      form.resetFields();
    }
  }

  const query = useMemo(() => {
    var qeury = {
      baiguullagiinId: baiguullagiinId,
    };
    return qeury;
  }, [baiguullagiinId]);

  const { jagsaalt, data, setKhuudaslalt } = posUseJagsaalt(
    isModalOpen === true && "BaraaniiAngilal",
    query,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    true
  );

  const tsuwralOnChange = (checked) => {
    setTsuwraliinDugaarBurtgeh(checked);
  };

  const ognooOnChange = (checked) => {
    setOgnooBurtgekhEsekh(checked);
  };

  const noatBodokhOnChange = (checked) => {
    setNoatBodokhEsekh(checked);
  };

  const khariltsakhOnChange = (checked) => {
    setKhariltsakhEsekh(checked);
  };

  const orluulakhOnChange = (checked) => {
    setEmdOrluulakh(checked);
  };

  const idevkhteiEsekhOnChange = (checked) => {
    setidevkhteiEsekh(checked);
  };

  const handleZuragKharakh = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setZuragKharakh(file.url || file.preview);
    setZuragOngoikh(true);
    setZuragGarchig(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onFinish = (formData) => {
    setLoading(true);
    const yavuulahData = {
      ...formData,
      niitUne: parseFloat(formData.une || 0),
      urtugUne: parseFloat(formData.urtugUne || 0),
      baiguullagiinId: baiguullagiinId,
      tsuvraliinDugaartaiEsekh: tsuwraliinDugaarBurtgeh,
      shirkheglekhEsekh: khariltsakhEsekh,
      emdOrluulakh: emdOrluulakh,
      idevkhteiEsekh: idevkhteiEsekh,
      zurgiinId: zurag,
      ognooniiMedeelelBurtgekhEsekh: ognooBurtgekhEsekh,
      noatBodohEsekh: noatBodokhEsekh,
      salbariinId: salbariinId,
      ajiltan: {
        id: ajiltan._id,
        ner: ajiltan.ner,
        baiguullagiinId: baiguullagiinId,
        salbariinId: salbariinId,
      },
    };
    if (yavuulahData.urtugUne >= yavuulahData.une) {
      AnkhaaruulgaAlert("Нэгж өртөг нь худалдааны үнээсээ их байна!");
      setLoading(false);
      return;
    }
    posUilchilgee(token)
      .post("/baraaBurtgeye", yavuulahData)
      .then((khariu) => {
        if (khariu.data === "Amjilttai") {
          if (!!zurag) {
            posUilchilgee(token).post("/confirmFile", {
              filename: zurag,
              path: "baraa",
            });
          }
          form.resetFields();
          AmjilttaiAlert("Амжилттай бүртгэгдлээ");
          if (aguulakhToololtMutate) {
            aguulakhToololtMutate();
            setLoading(false);
          }
          mutate();
          setImageUrl();
          // setIsModalOpen(false);
          form.resetFields();
          setLoading(false);
        }
      })
      .catch((e) => aldaaBarigch(e));
    setLoading(false);
  };

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <PlusOutlined style={{ fontSize: "40px", color: "#4FD1C5" }} />
      )}
      <div
        style={{
          marginTop: 8,
          color: "#4FD1C5",
        }}
      >
        Зураг оруулах
      </div>
    </div>
  );

  return (
    <div
      className={`${
        ashiglajBaigaGazar === "baraaOrlogodohModal" ? "mr-2" : ""
      }`}
    >
      {ashiglajBaigaGazar === "baraaOrlogodohModal" ? (
        <Button onClick={() => setIsModalOpen(true)} type="gol">
          <PlusOutlined />
        </Button>
      ) : (
        <Button onClick={() => setIsModalOpen(true)} type="gol">
          <PlusOutlined /> Бүртгэх
        </Button>
      )}

      <Modal
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
        footer={[
          <Button onClick={() => !loading === form.submit()} type="primary">
            Хадгалах
          </Button>,
        ]}
        width={"735px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="font- text-center text-[20px] ">Бараа бүртгэх</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          scrollToFirstError={{
            behavior: "smooth",
            block: "center",
            inline: "center",
          }}
          onValuesChange={() => setUmKhiisenEsekh(true)}
          form={form}
          onFinish={onFinish}
        >
          <div className="flex h-[150px] items-center justify-center gap-2">
            <Upload
              className="flex h-[113px] w-[115px] items-center justify-center border-[2px] border-dashed border-[#4FD1C5]"
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={beforeUpload}
              // data={{ turul: "aguulakh", baiguullagiinId: baiguullagiinId }}
              // headers={{ Authorization: `bearer ${token}` }}
              action={`${posUrl}/upload`}
              method="POST"
              // customRequest={({ file, onSuccess, onError }) => {
              //   uploadImage(file)
              //     .then(() => {
              //       onSuccess();
              //     })
              //     .catch((error) => {
              //       onError(error);
              //     });
              // }}
              onPreview={handleZuragKharakh}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  // src={`${posUrl}/temp/${zurag}`}
                  src={`${posUrl}/file?path=tmp/${zurag}`}
                  alt="image"
                  style={{
                    objectfit: "",
                    height: "104px",
                    width: "115px",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            {/* <Upload
              className='flex h-[113px] w-[115px] items-center justify-center border-[2px] border-dashed border-[#4FD1C5]'
              name='image'
              listType='picture-circle'
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess, onError }) => {
                uploadImage(file)
                  .then(() => {
                    onSuccess();
                  })
                  .catch((error) => {
                    onError(error);
                  });
              }}
              onChange={handleChange}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt='image'
                  style={{
                    objectfit: "",
                    height: "104px",
                    width: "115px",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload> */}
            <div className="flex h-[150px] w-[60%] flex-col items-end justify-center gap-2">
              <div className="flex w-[50%] flex-col justify-end gap-2 dark:text-gray-300">
                <div className="flex w-full justify-end gap-2 ">
                  <div className="w-full">НӨАТ эсэх</div>
                  <Switch
                    defaultChecked={noatBodokhEsekh}
                    onChange={noatBodokhOnChange}
                  />
                </div>
                <div className="flex w-full justify-end gap-2">
                  <div className="w-full">Цуврал ашиглах эсэх</div>
                  <Switch
                    defaultChecked={tsuwraliinDugaarBurtgeh}
                    onChange={tsuwralOnChange}
                  />
                </div>
                <div className="flex w-full justify-end gap-2 ">
                  <div className="w-full">Идэвхитэй эсэх</div>
                  <Switch
                    defaultChecked={idevkhteiEsekh}
                    onChange={idevkhteiEsekhOnChange}
                  />
                </div>
                <div className="flex w-full justify-end gap-2">
                  <div className="w-full">Мөшгөлт ашиглах эсэх</div>
                  <Switch
                    defaultChecked={ognooBurtgekhEsekh}
                    onChange={ognooOnChange}
                  />
                </div>
                <div className="flex w-full justify-end gap-2 ">
                  <div className="w-full">Хайрцаглах эсэх</div>
                  <Switch
                    defaultChecked={khariltsakhEsekh}
                    onChange={khariltsakhOnChange}
                  />
                </div>
                <div className="flex w-full justify-end gap-2 ">
                  <div className="w-full">Орлуулах эсэх</div>
                  <Switch
                    defaultChecked={emdOrluulakh}
                    onChange={orluulakhOnChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-5">
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
              label={<div className="dark:text-gray-300">Барааны нэр</div>}
            >
              <Input autoComplete="off" placeholder="Барааны нэр" />
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
              label={<div className="dark:text-gray-300">Дотоод код</div>}
            >
              <Input
                autoComplete="off"
                style={{
                  width: "100%",
                  borderColor: "#4FD1C5",
                  borderRadius: "25px",
                  borderWidth: 1,
                }}
                placeholder="Дотоод код"
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
              name={"une"}
              label={<div className="dark:text-gray-300">Худалдах үнэ</div>}
            >
              <InputNumber
                autoComplete="off"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/[^0-9]/g, "")}
                placeholder="Худалдах үнэ"
              />
            </Form.Item>

            <Form.Item
              style={{ width: "48%" }}
              labelCol={{ span: 24 }}
              label={<div className="dark:text-gray-300">Нэгж өртөг</div>}
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
              label={<div className="dark:text-gray-300">Хэмжих нэгж</div>}
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
              label={<div className="dark:text-gray-300">Ангилал</div>}
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

            {khariltsakhEsekh && (
              <Form.Item
                style={{ width: "48%" }}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Хайрцаг дахь тоо оруулаагүй байна",
                  },
                ]}
                label={"Хайрцаг дахь тоо"}
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

            {ognooBurtgekhEsekh === false &&
              tsuwraliinDugaarBurtgeh === false && (
                <Form.Item
                  style={{ width: "48%" }}
                  labelCol={{ span: 24 }}
                  label={"Үлдэгдэл"}
                  name={"uldegdel"}
                >
                  <InputNumber
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

            {shirkhegleh === false && tsuwraliinDugaarBurtgeh === true && (
              <div className="w-[98%]">
                <Form.List name="tsuvral">
                  {(fields, { add, remove }) => (
                    <div className="flex flex-col gap-3">
                      <div
                        style={{ scrollBehavior: "smooth" }}
                        id="scrolldohDiv1"
                        className="max-h-[150px] overflow-y-auto"
                      >
                        {fields.map(({ key, name, ...restField }) => (
                          <div
                            className={`flex h-fit items-baseline justify-center gap-1`}
                          >
                            <div className="flex w-full flex-col">
                              <div className="flex w-full gap-2">
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
                                    style={{ width: "90%", margin: 0 }}
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
                                      placeholder="Дуусах огноо"
                                      disabledDate={(current) => {
                                        let customDate =
                                          moment().format("YYYY-MM-DD");
                                        var songogdsonOgnoonuud =
                                          form.getFieldValue("tsuvral");
                                        return (
                                          (current &&
                                            current <
                                              moment(
                                                customDate,
                                                "YYYY-MM-DD"
                                              )) ||
                                          songogdsonOgnoonuud?.some(
                                            (a) =>
                                              a?.duusakhOgnoo &&
                                              moment(a?.duusakhOgnoo).format(
                                                "YYYY-MM-DD"
                                              ) ===
                                                moment(current).format(
                                                  "YYYY-MM-DD"
                                                )
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
                                )}
                              </div>
                            </div>
                            <div>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex w-[100%] items-center justify-center">
                        <Form.Item className="w-[50%]">
                          <Button
                            type="dashed"
                            className="h-9"
                            onClick={() => {
                              add();
                              const element =
                                document.getElementById("scrolldohDiv1");
                              element.scrollTop = element.scrollHeight;
                            }}
                            block
                          >
                            Цуврал оруулах
                          </Button>
                        </Form.Item>
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
                      <div
                        style={{ scrollBehavior: "smooth" }}
                        id="scrolldohDiv2"
                        className="max-h-[150px] overflow-y-auto"
                      >
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
                                    disabledDate={(current) => {
                                      let customDate =
                                        moment().format("YYYY-MM-DD");
                                      var songogdsonOgnoonuud =
                                        form.getFieldValue("tsuvral");
                                      return (
                                        (current &&
                                          current <
                                            moment(customDate, "YYYY-MM-DD")) ||
                                        songogdsonOgnoonuud?.some(
                                          (a) =>
                                            a?.duusakhOgnoo &&
                                            moment(a?.duusakhOgnoo).format(
                                              "YYYY-MM-DD"
                                            ) ===
                                              moment(current).format(
                                                "YYYY-MM-DD"
                                              )
                                        )
                                      );
                                    }}
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
                            <div>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                            const element =
                              document.getElementById("scrolldohDiv2");
                            element.scrollTop = element.scrollHeight;
                          }}
                          block
                        >
                          Огноо нэмэх
                        </Button>
                      </Form.Item>
                    </div>
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
export default BaraaBurtgekh;
