import Admin from "components/Admin";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";

import { DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import {
  Badge,
  Button,
  Form,
  Image,
  Select,
  message,
  InputNumber,
  Input,
  notification,
  Skeleton,
} from "antd";
import { useLavlakh } from "components/FormLavlakh";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import formatNumber from "tools/function/formatNumber";
import useData from "hooks/useData";
import createMethod from "tools/function/crud/createMethod";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const order = { createdAt: -1 };

const ner = ["khNer"];
const searchKeys = ["khariltsagchiinNer"];

function Zakhialga({ token }) {
  const [tuluv, setTuluv] = useState(0);
  const [form] = Form.useForm();
  const [zakhialga, setZakhialga] = useState();
  const [niitUneHadgalii, setNiitUneHadgalii] = useState();
  const [buttonDisable, setButtonDisable] = useState(false);
  const { baiguullagiinId } = useAuth();
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    if (tuluv !== 0) {
      return { emiinSangiinId: baiguullagiinId, tuluv };
    } else {
      return { tuluv };
    }

    // return { tuluv };
  }, [tuluv, baiguullagiinId]);

  const jor = useJagsaalt(
    "/zakhialga",
    query,
    order,
    undefined,
    searchKeys,
    undefined,
    undefined
  );

  const [khuseltDelgerenguiHaryaa, setKhuseltDelgerenguiHaryaa] = useState();

  useEffect(() => {
    socket().on("zakhialga", () => {
      jor.mutate();
      toololt.mutate();
    });
    return () => {
      socket().off("zakhialga");
    };
  }, []);

  const toololt = useData(token, "/zakhialgiinTooAvya");

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

  const { lavlakhGaralt, setLavlakhKhuudaslalt } = useLavlakh(
    "em",
    token,
    undefined,
    ner
  );

  async function negSanalAvahFunction(emiinsangiinId, songojAvsanSanal) {
    setLoading(true);
    var query = {
      zakhialgiinId: songojAvsanSanal,
    };
    if (emiinsangiinId) {
      query = {
        $and: [
          { zakhialgiinId: songojAvsanSanal },
          { emiinSangiinId: emiinsangiinId },
        ],
      };
    }
    form.resetFields();
    await uilchilgee(token)
      .get("/emiinSanal", {
        params: {
          query,
        },
      })
      .then((data) => {
        const jagsaaltData = data?.data?.jagsaalt?.[0];

        if (jagsaaltData) {
          form.setFieldsValue(jagsaaltData);
          niitDunBodohFunction();
        }
      })
      .catch(aldaaBarigch);
    setLoading(false);
  }

  function onFinish() {
    setButtonDisable(true);
    const data = form.getFieldsValue();
    const yavuulakhData = {
      zakhialgiinId: zakhialga._id,
      ...zakhialga,
      ...data,
      niitUne: niitUneHadgalii,
      emiinSangiinId: baiguullagiinId,
    };
    const { _id, ...yavuulakhDataIdgui } = yavuulakhData;

    if (
      yavuulakhDataIdgui.emuud !== undefined &&
      yavuulakhDataIdgui?.emuud?.length !== 0
    ) {
      createMethod("emiinSanalKhadgalya", token, yavuulakhDataIdgui).then(
        ({ data }) => {
          if (data === "Amjilttai") {
            setButtonDisable(false);
            form.resetFields();
            setZakhialga(null);
            form.setFieldsValue({});
            jor.mutate();
            toololt.mutate();
            AmjilttaiAlert("Амжилттай хадгаллаа");
          }
        }
      );
    } else {
      setButtonDisable(false);
      AldaaAlert("Эм оруулаагүй байна.");
    }
  }

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      !!jor.data
    ) {
      jor.next();
    }
  }

  function niitDunBodohFunction() {
    var niitdun = form
      .getFieldValue("emuud")
      ?.reduce((a, b) => a + (b?.niitUne || 0), 0);

    setNiitUneHadgalii(niitdun);
  }

  const handleTooShirkhegChange = (_newValue, index) => {
    const uneFieldValue = form.getFieldValue(["emuud", index, "une"]);
    const tooShirkhegFieldValue = form.getFieldValue([
      "emuud",
      index,
      "tooShirkheg",
    ]);
    form.setFieldValue(
      ["emuud", index, "niitUne"],
      (tooShirkhegFieldValue || 0) * (uneFieldValue || 0)
    );
    niitDunBodohFunction();
  };

  // animation
  const willChange = useWillChange();

  const show = {
    opacity: 1,
    display: "block",
  };

  const hide = {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  };

  return (
    <Admin
      title={"Захиалга"}
      onSearch={jor?.onSearch}
      khuudasniiNer={"zakhialga"}
      className="px-2 pt-5"
    >
      <div className=" col-span-5 flex flex-col gap-3 xl:col-span-4">
        <div className="grid h-fit grid-cols-3 items-center justify-center gap-3 rounded-[25px] bg-[#4FD1C5] p-1 ">
          <Badge count={toololt.data?.find((a) => a._id === 0)?.too}>
            <div
              className={`text-bold h-[41px] cursor-pointer rounded-[25px] text-[15px] ${
                tuluv === 0
                  ? "bg-white text-black dark:bg-gray-900 dark:text-gray-50"
                  : "text-white"
              } flex items-center justify-center text-center`}
              onClick={() => {
                setTuluv(0);
                form.resetFields();
                jor.refresh();
                setNiitUneHadgalii();
                setZakhialga();
                setKhuseltDelgerenguiHaryaa();
              }}
            >
              Хүсэлт
            </div>
          </Badge>
          <Badge count={toololt.data?.find((a) => a._id === 1)?.too}>
            <div
              className={`text-bold h-[41px] cursor-pointer rounded-[25px] text-[15px]  ${
                tuluv === 1
                  ? "bg-white text-black dark:bg-gray-900 dark:text-gray-50"
                  : "text-white"
              } flex items-center justify-center text-center `}
              onClick={() => {
                setTuluv(1);
                form.resetFields();
                jor.refresh();
                setNiitUneHadgalii();
                setZakhialga();
                setKhuseltDelgerenguiHaryaa();
              }}
            >
              Санал
            </div>
          </Badge>
          <Badge count={toololt.data?.find((a) => a._id === 2)?.too}>
            <div
              className={`text-bold h-[41px] cursor-pointer rounded-[25px] text-[15px]  ${
                tuluv === 2
                  ? "bg-white text-black dark:bg-gray-900 dark:text-gray-50"
                  : "text-white"
              } flex items-center justify-center text-center `}
              onClick={() => {
                setTuluv(2);
                form.resetFields();
                jor.refresh();
                setZakhialga();
                setKhuseltDelgerenguiHaryaa();
              }}
            >
              Төлсөн
            </div>
          </Badge>
        </div>
        <Skeleton loading={jor.isValidating} active borderRadius={10} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: "linear",
          }}
          className="h-[85vh] w-full space-y-4 overflow-y-auto pr-2"
          onScroll={onScroll}
        >
          {jor?.jagsaalt.map((mur, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              className="relative w-full cursor-pointer items-start rounded-md bg-white drop-shadow-sm"
              key={mur._id}
              onClick={(e) => {
                setKhuseltDelgerenguiHaryaa((prevState) => {
                  return prevState === mur._id ? null : mur._id;
                });
                khuseltDelgerenguiHaryaa === mur._id
                  ? setZakhialga()
                  : setZakhialga(mur);
                form.resetFields();
                form.setFieldsValue(mur);
                (mur.tuluv === 1 || mur.tuluv === 2) &&
                  khuseltDelgerenguiHaryaa !== mur._id &&
                  negSanalAvahFunction(undefined, mur._id);
                niitDunBodohFunction();
              }}
              style={{ willChange }}
              animate={{
                height:
                  khuseltDelgerenguiHaryaa === mur._id ? "663px" : "143px",
                opacity: 1,
              }}
            >
              <motion.div
                animate={{
                  height:
                    khuseltDelgerenguiHaryaa === mur._id ? "663px" : "143px",
                  opacity: 1,

                  flexDirection:
                    khuseltDelgerenguiHaryaa === mur._id
                      ? "column-reverse"
                      : "row",
                }}
                transition={{ ease: "linear" }}
                className="flex w-full items-center justify-between gap-2 p-2 "
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  layout
                  initial={false}
                  animate={{
                    height: "90%",
                    width: "90%",
                  }}
                  className={`${
                    khuseltDelgerenguiHaryaa !== mur._id && "max-w-[116px]"
                  } h-[90%] w-[90%] flex-none items-center justify-center overflow-hidden rounded-[20px]`}
                >
                  <Image
                    preview={{
                      mask: (
                        <div className="flex items-center justify-center gap-1 ">
                          <AiOutlineEye />
                          <div>Харах</div>
                        </div>
                      ),
                    }}
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                    src={`/api/file?path=jor/${mur?.zurgiinId}`}
                  />
                </motion.div>

                <motion.div
                  layout
                  animate={{
                    width: "100%",
                  }}
                  className=" right-0 flex items-center justify-center gap-3"
                >
                  <motion.div
                    className={`delgerenguiMedeelelDelgekh flex overflow-hidden ${
                      khuseltDelgerenguiHaryaa === mur._id
                        ? ""
                        : "delay-75 duration-300"
                    }`}
                    animate={{
                      width:
                        khuseltDelgerenguiHaryaa === mur._id ? "0%" : "100%",
                      opacity: khuseltDelgerenguiHaryaa === mur._id ? "0" : "1",
                    }}
                    layout
                    data-isOpen={khuseltDelgerenguiHaryaa === mur._id}
                  >
                    <motion.div className="flex flex-col">
                      <motion.div>{mur.khariltsagchiinNer}</motion.div>
                      <motion.div
                        data-isOpen={khuseltDelgerenguiHaryaa === mur._id}
                        className="delgerenguiMedeelelOgnoo w-full text-xs text-gray-500"
                      >
                        {moment(mur.createdAt).format("YYYY-MM-DD HH:mm")}
                      </motion.div>
                    </motion.div>
                    <motion.div
                      style={{ willChange }}
                      animate={{
                        rotate: khuseltDelgerenguiHaryaa === mur._id ? 180 : 0,
                      }}
                      transition={{ type: "spring" }}
                      className="ml-auto"
                    >
                      <DownOutlined className="text-lg font-medium" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className={`delgerenguiMedeelelDelgekh flex flex-col items-center justify-center overflow-hidden ${
                      khuseltDelgerenguiHaryaa === mur._id
                        ? "delay-75 duration-300"
                        : ""
                    }`}
                    layout
                    animate={{
                      width:
                        khuseltDelgerenguiHaryaa === mur._id ? "100%" : "0%",
                      opacity: khuseltDelgerenguiHaryaa === mur._id ? "1" : "0",
                    }}
                    data-isOpen={khuseltDelgerenguiHaryaa === mur._id}
                  >
                    <motion.div className="w-fit">
                      {mur.khariltsagchiinNer}
                    </motion.div>
                    <motion.div
                      data-isOpen={khuseltDelgerenguiHaryaa === mur._id}
                      className="delgerenguiMedeelelOgnoo w-full text-xs text-gray-500"
                    >
                      {moment(mur.createdAt).format("YYYY-MM-DD HH:mm")}
                    </motion.div>
                    <motion.div
                      style={{ willChange }}
                      animate={{
                        rotate: khuseltDelgerenguiHaryaa === mur._id ? 180 : 0,
                      }}
                      transition={{ type: "spring" }}
                      className="ml-auto"
                    >
                      <DownOutlined className="text-lg font-medium" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Skeleton
        loading={loading}
        className="col-span-7 h-[300px] xl:col-span-8"
        active
        borderRadius={10}
        size="default"
        height={300}
        block={false}
      />

      <motion.div
        animate={!!zakhialga ? show : hide}
        style={{ willChange }}
        className={`box relative col-span-7 px-3 xl:col-span-8 ${
          !!zakhialga ? "block" : "hidden"
        } `}
      >
        <Form
          disabled={tuluv !== 0}
          scrollToFirstError={{
            behavior: "smooth",
            block: "center",
            inline: "center",
          }}
          form={form}
          {...formItemLayout}
          onFinish={onFinish}
        >
          <Form.List name="emuud">
            {(fields, { add, remove }) => {
              return (
                <div className="space-y-4 pb-4">
                  {tuluv === 2 ? null : tuluv === 1 ? null : (
                    <div className="lg:flex lg:items-center lg:justify-between lg:gap-4">
                      <Form.Item
                        noStyle
                        className="mt-2 w-full"
                        wrapperCol={{ offset: 14 }}
                      >
                        <div className="mt-2 flex w-[100%] items-center justify-end">
                          <Button
                            style={{ height: "36px" }}
                            className="margin-0 w-full lg:w-[144px]"
                            type="primary"
                            onClick={() => add()}
                          >
                            Эм нэмэх
                          </Button>
                        </div>
                      </Form.Item>
                    </div>
                  )}
                  <div className="m-5 flex max-h-[50vh] flex-col gap-4 overflow-auto p-2 ">
                    <AnimatePresence mode={"popLayout"}>
                      {fields
                        .reverse()
                        .map(({ key, name, ...restField }, index) => (
                          <motion.div
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "tween" }}
                            key={key}
                            className="grid min-h-[113px] grid-flow-col grid-cols-12 grid-rows-2 justify-between gap-2 overflow-auto rounded-lg bg-white px-2 py-4 drop-shadow-lg"
                          >
                            <div className="col-span-2 row-span-2 flex rounded-[15px] border-[1px] border-[#4FD1C5] text-2xl">
                              <div></div>
                            </div>
                            <Form.Item
                              {...restField}
                              name={[name, "em"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: 0 }}
                              className="col-span-4"
                              rules={[
                                {
                                  required: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Select
                                bordered={false}
                                showSearch
                                size="large"
                                style={{
                                  width: "100%",
                                  borderRadius: "10px",
                                }}
                                loading={!lavlakhGaralt}
                                onSearch={(search) =>
                                  setLavlakhKhuudaslalt((a) => ({
                                    ...a,
                                    search,
                                  }))
                                }
                                placeholder={"Эм сонгоно уу"}
                                filterOption={false}
                                className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                                onSelect={(v, data) => {
                                  handleEmSelect(v, data, index);
                                }}
                              >
                                {lavlakhGaralt?.jagsaalt?.map((a) => (
                                  <Select.Option key={a._id} value={a._id}>
                                    {a.khNer}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              hidden
                              style={{ marginBottom: 0 }}
                              name={[name, "emiinNer"]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              hidden
                              style={{ marginBottom: 0 }}
                              name={[name, "emiinSanId"]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              hidden
                              style={{ marginBottom: 0 }}
                              name={[name, "emiinSanNer"]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "tun"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: "0px" }}
                              className="col-span-4"
                              rules={[
                                {
                                  required: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Input
                                autoComplete="off"
                                placeholder="Тун"
                                className="col-span-4 "
                                style={{
                                  borderRadius: "10px",
                                  borderColor: "#4FD1C5",
                                  borderWidth: 1,
                                }}
                                size="large"
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              normalize={(input) => {
                                const too = input.replace(/[^0-9]/g, "");
                                return `${too}`;
                              }}
                              name={[name, "tooShirkheg"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: "0px" }}
                              className="col-span-3"
                              rules={[
                                {
                                  required: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                style={{
                                  width: "100%",
                                  borderColor: "#4FD1C5",
                                  borderRadius: "10px",
                                  borderWidth: 1,
                                }}
                                className="col-span-3"
                                min={1}
                                placeholder="Ширхэг"
                                onChange={(v) =>
                                  handleTooShirkhegChange(v, index)
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "khonog"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: "0px" }}
                              className="col-span-3"
                              normalize={(input) => {
                                const too = input.replace(/[^0-9]/g, "");
                                return `${too}`;
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                style={{
                                  width: "100%",
                                  borderColor: "#4FD1C5",
                                  borderRadius: "10px",
                                  borderWidth: 1,
                                }}
                                className="col-span-3"
                                min={1}
                                placeholder="Хоног"
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "une"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: "0px" }}
                              className="col-span-2"
                              normalize={(input) => {
                                const too = input.replace(/[^0-9]/g, "");
                                return `${too}`;
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                style={{
                                  width: "100%",
                                  borderColor: "#4FD1C5",
                                  borderWidth: 1,
                                  borderRadius: "10px",
                                }}
                                className="col-span-2"
                                placeholder="Үнэ"
                                min={0}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                onChange={(v) =>
                                  handleTooShirkhegChange(v, index)
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "niitUne"]}
                              label={false}
                              wrapperCol={24}
                              labelCol={0}
                              style={{ width: "100%", marginBottom: "0px" }}
                              className="col-span-2"
                              dependencies={[name, "tooShirkheg", "une"]}
                            >
                              <InputNumber
                                size="large"
                                style={{
                                  width: "100%",
                                  borderColor: "#4FD1C5",
                                  borderWidth: 1,
                                  borderRadius: "10px",
                                }}
                                className="col-span-2"
                                min={0}
                                placeholder="Нийт үнэ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                disabled
                              />
                            </Form.Item>
                            {tuluv === 2 ? null : tuluv === 1 ? null : (
                              <div className="col-span-1 row-span-2 flex  justify-center text-2xl ">
                                <div className="col-span-1 flex cursor-pointer items-center justify-center">
                                  <div className="rounded-full border-2 border-[#FF0000] bg-red-100 p-2">
                                    <DeleteOutlined
                                      onClick={() => {
                                        remove(name), niitDunBodohFunction();
                                      }}
                                      style={{ color: "#FF0000" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            }}
          </Form.List>
          <Form.Item name="tailbar" wrapperCol={{ span: 24 }}>
            <Input.TextArea
              autoSize={{ minRows: 5 }}
              className="!rounded-md"
              placeholder="Тайлбар"
            />
          </Form.Item>
          <div className="h-[157px] rounded-[25px] border-2 border-dashed p-8">
            <Form.Item name="_id" hidden />
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="flex w-full">
                <div className="ml-auto flex w-full flex-row justify-between text-xl font-medium text-gray-700">
                  <div>Нийт дүн:</div>
                  <div transition={{ type: "tween" }}>
                    {formatNumber(niitUneHadgalii, 2)}₮
                  </div>
                </div>
              </div>
            </Form.Item>
            {tuluv === 2 ? null : tuluv === 1 ? null : (
              <Form.Item noStyle className="w-full" wrapperCol={{ offset: 14 }}>
                <div className="w-full lg:flex lg:items-end lg:justify-end">
                  <Button
                    className="w-[100%] !rounded-[10px] lg:w-[200px]"
                    disabled={buttonDisable}
                    type="primary"
                    htmlType="submit"
                  >
                    Хадгалах
                  </Button>
                </div>
              </Form.Item>
            )}
          </div>
        </Form>
      </motion.div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zakhialga;
