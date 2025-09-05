import { Button, DatePicker, Form, Select, TimePicker, message } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import TooShirkhegInput, { Input } from "components/ant/AntdInput";
import moment from "moment";
import {
  PlusOutlined,
  DeleteOutlined,
  PieChartFilled,
} from "@ant-design/icons";
import useBaraa from "hooks/useBaraa";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function UramshuulalBurtgel({
  mutate,
  sungakhUramshuulal,
  setSungakhUramshuulal,
}) {
  const [form] = Form.useForm();

  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nukhtsulValidation, setNukhtsulValidation] = useState({});
  const [nukhtsulTooValidation, setNukhtsulTooValidation] = useState({});
  const [belegValidation, setBelegValidation] = useState({});
  const [belegTooValidation, setBelegTooValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const [ner, setNer] = useState("");
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [duusakTsag, setDuusakTsag] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const onChange = (time, timeString) => {
    setDuusakTsag(time);
  };

  const lastInputRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (token && !sungakhUramshuulal)
      posUilchilgee(token)
        .post("/servereesTsagAvyaa")
        .then(({ data }) => {
          if (!!data) {
            setDuusakTsag([
              moment(data).startOf("day"),
              moment(data).endOf("day"),
            ]);
            setOgnoo([moment(data).startOf("day"), moment(data).endOf("day")]);
          }
        });
  }, [isModalOpen, sungakhUramshuulal]);

  useEffect(() => {
    if (!!sungakhUramshuulal && !ner) {
      sungakhUramshuulal?.uramshuulaliinNukhtsul?.forEach(
        (a) => (a.code = a.baraaniiDotoodCode)
      );
      sungakhUramshuulal?.uramshuulaliinBeleg?.forEach(
        (a) => (a.code = a.baraaniiDotoodCode)
      );
      form.setFieldsValue(sungakhUramshuulal);
      setNer(sungakhUramshuulal.ner);
      setOgnoo([
        moment(sungakhUramshuulal.ekhlekhOgnoo),
        moment(sungakhUramshuulal.duusakhOgnoo),
      ]);
      setDuusakTsag([
        moment(sungakhUramshuulal?.ekhlekhTsag),
        moment(sungakhUramshuulal?.duusakTsag),
      ]);
      setIsModalOpen(true);
    }
  }, [sungakhUramshuulal, ner]);

  function nuhtsulBaraaniiToogNegeerNemiyaa(index) {
    const values = form.getFieldsValue(["uramshuulaliinNukhtsul"]);
    const updatedValues = [...values.uramshuulaliinNukhtsul];

    if (index !== -1 && index < updatedValues.length) {
      updatedValues[index].too += 1;
      form.setFieldsValue({
        uramshuulaliinNukhtsul: updatedValues,
      });
    }
  }

  function nuhtsulBaraaniiToogHasah(index) {
    const values = form.getFieldsValue(["uramshuulaliinNukhtsul"]);
    const updatedValues = [...values.uramshuulaliinNukhtsul];

    if (index !== -1 && updatedValues[index]?.too > 0) {
      updatedValues[index].too -= 1;
      form.setFieldsValue({
        uramshuulaliinNukhtsul: updatedValues,
      });
    }
  }

  function uramshuulalBaraaniiToogNegeerNemiyaa(index) {
    const values = form.getFieldsValue(["uramshuulaliinBeleg"]);
    const updatedValues = [...values.uramshuulaliinBeleg];

    if (index !== -1 && index < updatedValues.length) {
      updatedValues[index].too += 1;
      form.setFieldsValue({
        uramshuulaliinBeleg: updatedValues,
      });
    }
  }

  function uramshuulalBaraaniiToogHasah(index) {
    const values = form.getFieldsValue(["uramshuulaliinBeleg"]);
    const updatedValues = [...values.uramshuulaliinBeleg];

    if (index !== -1 && updatedValues[index].too > 0) {
      updatedValues[index].too -= 1;
      form.setFieldsValue({
        uramshuulaliinBeleg: updatedValues,
      });
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setSungakhUramshuulal();
    setNukhtsulValidation([]);
    setNukhtsulTooValidation([]);
    setBelegValidation([]);
    setBelegTooValidation([]);

    setNer("");
    form.setFieldsValue({
      uramshuulaliinBeleg: [],
    });
    form.setFieldsValue({
      uramshuulaliinNukhtsul: [],
    });
  };

  const onFinish = (values) => {
    setLoading(true);
    var khaikhBaraa = [];
    values.uramshuulaliinNukhtsul?.forEach((element) => {
      if (!khaikhBaraa.find((a) => a.code === element.code)) {
        khaikhBaraa.push(element.code);
      }
    });
    values.uramshuulaliinBeleg?.forEach((element) => {
      if (!khaikhBaraa.find((a) => a.code === element.code)) {
        khaikhBaraa.push(element.code);
      }
    });
    posUilchilgee(token)
      .get("/aguulakh", {
        params: {
          query: {
            baiguullagiinId: baiguullagiinId,
            salbariinId: salbariinId,
            code: { $in: khaikhBaraa },
          },
          khuudasniiKhemjee: 100,
          baiguullagiinId: baiguullagiinId,
        },
      })
      .then(({ data }) => {
        if (data?.jagsaalt) {
          var uramshuulaliinNukhtsul = values.uramshuulaliinNukhtsul.map(
            (item) => ({
              baraaniiDotoodCode: item.code,
              too: item.too,
              baraaniiNer: data?.jagsaalt.find((aa) => item.code === aa.code)
                ?.ner,
              barCode: data?.jagsaalt.find((aa) => item.code === aa.code)
                ?.barCode,
            })
          );
          var uramshuulaliinBeleg = values.uramshuulaliinBeleg.map((item) => ({
            baraaniiDotoodCode: item.code,
            too: item.too,
            baraaniiNer: data?.jagsaalt.find((aa) => item.code === aa.code)
              ?.ner,
            barCode: data?.jagsaalt.find((aa) => item.code === aa.code)
              ?.barCode,
          }));

          if (!ner.trim()) {
            AnkhaaruulgaAlert("Урамшууллын нэршил оруулна уу");
            setLoading(false);
            return;
          }
          var yavuulahData = {
            salbariinId: salbariinId,
            uramshuulaliinBeleg,
            uramshuulaliinNukhtsul,
            ner,
            ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            ekhlekhTsag: duusakTsag[0],
            duusakhTsag: duusakTsag[1],
          };
          if (!!sungakhUramshuulal?._id) {
            yavuulahData.id = sungakhUramshuulal._id;
          }
          const url = sungakhUramshuulal
            ? "/uramshuulalKhugtsaaSungyaa"
            : "/uramshuulalBurtgey";
          posUilchilgee(token)
            .post(url, yavuulahData)
            .then((khariu) => {
              if (khariu.data === "Amjilttai") {
                AmjilttaiAlert("Амжилттай");
                mutate();
                setIsModalOpen(false);
                setSungakhUramshuulal();
                setNukhtsulValidation([]);
                setNukhtsulTooValidation([]);
                setBelegValidation([]);
                setBelegTooValidation([]);
                setLoading(false);
                setNer("");
                form.setFieldsValue({
                  uramshuulaliinBeleg: [],
                });
                form.setFieldsValue({
                  uramshuulaliinNukhtsul: [],
                });
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
              setLoading(false);
            });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  };

  const validateForm = () => {
    const nukhtsulValues = form.getFieldsValue().uramshuulaliinNukhtsul;
    const belegValues = form.getFieldsValue().uramshuulaliinBeleg;

    if (nukhtsulValues?.length > 0 && belegValues.length > 0) {
      let hasErrors = false;
      const nukhtsulErrors = {};
      const nukhtsulTooErrors = {};
      const belegErrors = {};
      const belegTooErrors = {};
      form.getFieldsValue().uramshuulaliinNukhtsul.forEach((field, index) => {
        if (!field.code) {
          nukhtsulErrors[index] = true;
          hasErrors = true;
        }
        if (field.too === null || field.too === undefined || field.too <= 0) {
          nukhtsulTooErrors[index] = true;
          hasErrors = true;
        }
      });

      form.getFieldsValue().uramshuulaliinBeleg.forEach((field, index) => {
        if (!field.code) {
          belegErrors[index] = true;
          hasErrors = true;
        }
        if (field.too === null || field.too === undefined || field.too <= 0) {
          belegTooErrors[index] = true;
          hasErrors = true;
        }
      });

      setNukhtsulValidation(nukhtsulErrors);
      setNukhtsulTooValidation(nukhtsulTooErrors);
      setBelegValidation(belegErrors);
      setBelegTooValidation(belegTooErrors);

      return !hasErrors;
    } else {
      AnkhaaruulgaAlert("Мэдээлэл дутуу байна");
      setLoading(false);
    }
  };
  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId
  );
  return (
    <>
      <Button type="gol" onClick={openModal}>
        Урамшуулал нэмэх
      </Button>

      <Modal
        className={"paddingguiModal"}
        width={"1200px"}
        okText="Эхлүүлэх"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleCancel} style={{ width: "100px" }}>
              Гарах
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                if (validateForm()) {
                  form.submit();
                }
              }}
              style={{ width: "100px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Урамшуулал бүртгэл
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="w-full">
          <div className="flex h-[110px] w-full items-center justify-center gap-24 border-b-[1px] border-solid border-[#f0f0f0]">
            <div className="flex w-[25%] flex-col gap-2 text-center font-[500]">
              <div className="text-[#718096]">Нэршил оруулах</div>
              <Input
                disabled={!!sungakhUramshuulal}
                value={ner}
                onChange={(v) => setNer(v.target.value)}
                placeHolder={"Нэршил оруулах"}
              />
            </div>
            <div className="flex w-[25%] flex-col gap-2 text-center font-[500]">
              <div className="text-[#718096]">Дуусах хугацаа сонгох</div>
              <DatePicker.RangePicker
                locale={locale}
                value={ognoo}
                onChange={setOgnoo}
                className="!h-[36px] !rounded-md bg-white"
              />
            </div>
            <div className="flex w-[25%] flex-col gap-2 text-center font-[500]">
              <div className="text-[#718096]">Хүчинтэй хугацаа сонгох</div>
              <TimePicker.RangePicker
                format="HH:mm"
                placeholder={["Эхлэх цаг", "Дуусах цаг"]}
                className="!h-[36px] !rounded-md bg-white"
                onChange={onChange}
                value={duusakTsag}
              />
            </div>
          </div>
          <div className="flex w-full">
            <Form
              form={form}
              className="flex w-[50%] flex-col border-r-[1px] !p-5"
              name="uramshuulaliinNukhtsulForm"
              onFinish={onFinish}
              autoComplete="off">
              <div className="mb-9 text-center font-[700] text-[#718096]">
                Нөхцөл бүртгэх
              </div>
              <Form.List name="uramshuulaliinNukhtsul">
                {(fields, { add, remove }) => (
                  <>
                    <div className="max-h-[400px]  overflow-y-auto">
                      {fields.map(({ key, name, ...restField }, i) => {
                        const baraa = form.getFieldValue(
                          `uramshuulaliinNukhtsul`
                        );
                        return (
                          <div
                            key={name}
                            style={{
                              width: "100%",
                              marginBottom: 8,
                            }}>
                            <div className="gap-15 relative flex h-fit w-full items-center dark:text-gray-300">
                              <div className="flex w-full items-center gap-4">
                                <div className="font-semibold">{i + 1}</div>

                                <Form.Item
                                  className={`uramshuulalBurgelSelectSpace w-full ${
                                    nukhtsulValidation[name] ? "has-error" : ""
                                  }`}
                                  {...restField}
                                  name={[name, "code"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "",
                                    },
                                  ]}
                                  validateTrigger={["onChange", "onBlur"]}>
                                  <Select
                                    disabled={!!sungakhUramshuulal}
                                    bordered={false}
                                    placeholder="Бараа сонгох"
                                    className={`max-w-[387px] overflow-hidden rounded-[25px] border-[1px]  ${
                                      nukhtsulValidation[name]
                                        ? "border-red-500"
                                        : "border-[#4FD1C5]"
                                    } bg-white dark:text-gray-300`}
                                    showSearch
                                    onSearch={(search) => {
                                      setBaraaniiKhuudaslalt((a) => ({
                                        ...a,
                                        search,
                                      }));
                                    }}
                                    onChange={(value) => {
                                      setNukhtsulValidation((prev) => ({
                                        ...prev,
                                        [name]: !value,
                                      }));
                                      baraa[name] = {
                                        ...baraa[name],
                                        ["too"]: value ? 1 : 0,
                                        ["code"]: value ? value : undefined,
                                      };
                                      form.setFieldValue(
                                        "uramshuulaliinNukhtsul",
                                        baraa
                                      );
                                    }}
                                    filterOption={(o) => o}
                                    allowClear={true}>
                                    {baraaGaralt?.jagsaalt?.map((mur) => (
                                      <Select.Option
                                        disabled={baraa.some(
                                          (element) =>
                                            element?.code === mur?.code
                                        )}
                                        key={mur.code}>
                                        <div className={`flex justify-start dark:text-gray-200 dark:bg-gray-800`}>
                                          <div className="font-bold">
                                            {mur.code}
                                          </div>
                                          -{mur.code}-{mur.ner}-
                                          {mur.uldegdel ? mur.uldegdel : 0}-
                                          {mur.barCode ? mur.barCode : 0}
                                        </div>
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </div>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "",
                                  },
                                ]}
                                initialValue={0}
                                className="!mb-2 flex h-full flex-col items-center font-[500] leading-[34px]"
                                name={[name, "too"]}>
                                <div className="flex gap-2 ">
                                  <div className=" text-xl text-[#4FD1C5]">
                                    {sungakhUramshuulal ? (
                                      <PieChartFilled />
                                    ) : (
                                      <MinusCircleFilled
                                        onClick={() =>
                                          nuhtsulBaraaniiToogHasah(name)
                                        }
                                      />
                                    )}
                                  </div>

                                  <div className="flex items-center justify-center text-[20px] font-[600]">
                                    <TooShirkhegInput
                                      disabled={!!sungakhUramshuulal}
                                      value={baraa[name]?.too || 0}
                                      onChange={(value) => {
                                        setNukhtsulTooValidation((prev) => ({
                                          ...prev,
                                          [name]: value === null,
                                        }));
                                      }}
                                      style={{
                                        width: "40px",
                                      }}
                                      className={`antdInputTextCenter ${
                                        nukhtsulTooValidation[name]
                                          ? "!rounded-[25px] border-[1px] border-red-500"
                                          : ""
                                      } bg-white`}
                                      size="small"
                                      ref={lastInputRef}
                                      autoFocus
                                      bordered={
                                        nukhtsulTooValidation[name]
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                  <div className="text-xl text-[#4FD1C5]">
                                    {sungakhUramshuulal ? (
                                      <PieChartFilled />
                                    ) : (
                                      <PlusCircleFilled
                                        onClick={() =>
                                          nuhtsulBaraaniiToogNegeerNemiyaa(name)
                                        }
                                      />
                                    )}
                                  </div>
                                  {sungakhUramshuulal ? null : (
                                    <DeleteOutlined
                                      className="text-xl !text-red-500"
                                      onClick={() => {
                                        remove(name);
                                      }}
                                    />
                                  )}
                                </div>
                              </Form.Item>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {sungakhUramshuulal ? null : (
                      <Form.Item className="flex justify-center">
                        <Button
                          className=" !w-[147px]"
                          type="primary"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}>
                          Нөхцөл нэмэх
                        </Button>
                      </Form.Item>
                    )}
                  </>
                )}
              </Form.List>
            </Form>
            <Form
              form={form}
              className="flex w-[50%] flex-col border-r-[1px] !p-5"
              name="uramshuulaliinBelegForm"
              onFinish={onFinish}
              autoComplete="off">
              <div className="mb-9 text-center font-[700] text-[#718096]">
                Урамшуулал бүртгэх
              </div>
              <Form.List name="uramshuulaliinBeleg">
                {(fields, { add, remove }) => (
                  <>
                    <div className="max-h-[400px]  overflow-y-auto">
                      {fields.map(({ key, name, ...restField }, i) => {
                        const baraa = form.getFieldValue(`uramshuulaliinBeleg`);
                        return (
                          <div
                            key={name}
                            style={{
                              width: "100%",
                              marginBottom: 8,
                            }}>
                            <div className="gap-15 relative flex h-fit w-full items-center dark:text-gray-300">
                              <div className="flex w-full items-center gap-4">
                                <div className="font-semibold">{i + 1}</div>

                                <Form.Item
                                  className={`uramshuulalBurgelSelectSpace w-full ${
                                    belegValidation[name] ? "has-error" : ""
                                  }`}
                                  {...restField}
                                  name={[name, "code"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "",
                                    },
                                  ]}
                                  validateTrigger={["onChange", "onBlur"]}>
                                  <Select
                                    disabled={!!sungakhUramshuulal}
                                    bordered={false}
                                    placeholder="Бараа сонгох"
                                    className={`max-w-[387px] overflow-hidden rounded-[25px] border-[1px] ${
                                      belegValidation[name]
                                        ? "border-red-500"
                                        : "border-[#4FD1C5]"
                                    } bg-white`}
                                    showSearch
                                    filterOption={(o) => o}
                                    onSearch={(search) => {
                                      setBaraaniiKhuudaslalt((a) => ({
                                        ...a,
                                        search,
                                      }));
                                    }}
                                    allowClear={true}
                                    onChange={(value) => {
                                      setBelegValidation((prev) => ({
                                        ...prev,
                                        [name]: !value,
                                      }));
                                      baraa[name] = {
                                        ...baraa[name],
                                        ["too"]: value ? 1 : 0,
                                        ["code"]: value ? value : undefined,
                                      };
                                      form.setFieldValue(
                                        "uramshuulaliinBeleg",
                                        baraa
                                      );
                                    }}>
                                    {baraaGaralt?.jagsaalt?.map((mur) => {
                                      return (
                                        <Select.Option key={mur.code}>
                                          <div className={`flex justify-start`}>
                                            <div className="font-bold">
                                              {mur.code}
                                            </div>
                                            -{mur.code}-{mur.ner}-
                                            {mur.uldegdel ? mur.uldegdel : 0}-
                                            {mur.barCode ? mur.barCode : 0}
                                          </div>
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </div>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "",
                                  },
                                ]}
                                initialValue={0}
                                className="!mb-2 flex h-full flex-col items-center font-[500] leading-[34px]"
                                name={[name, "too"]}>
                                <div className="flex gap-2">
                                  <div className="cursor-not-allowed text-xl text-[#4FD1C5]">
                                    {sungakhUramshuulal ? (
                                      <PieChartFilled />
                                    ) : (
                                      <MinusCircleFilled
                                        onClick={() =>
                                          uramshuulalBaraaniiToogHasah(name)
                                        }
                                      />
                                    )}
                                  </div>

                                  <div className="flex items-center justify-center text-[20px] font-[600]">
                                    <TooShirkhegInput
                                      disabled={!!sungakhUramshuulal}
                                      value={baraa[name]?.too || 0}
                                      onChange={(value) => {
                                        setBelegTooValidation((prev) => ({
                                          ...prev,
                                          [name]: value === null,
                                        }));
                                      }}
                                      style={{
                                        width: "40px",
                                      }}
                                      className={`antdInputTextCenter ${
                                        belegTooValidation[name]
                                          ? "!rounded-[25px] border-[1px] border-red-500"
                                          : ""
                                      } bg-white`}
                                      size="small"
                                      ref={lastInputRef}
                                      autoFocus
                                      bordered={
                                        belegTooValidation[name] ? true : false
                                      }
                                    />
                                  </div>
                                  <div className="cursor-not-allowed text-xl text-[#4FD1C5]">
                                    {sungakhUramshuulal ? (
                                      <PieChartFilled />
                                    ) : (
                                      <PlusCircleFilled
                                        onClick={() =>
                                          uramshuulalBaraaniiToogNegeerNemiyaa(
                                            name
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                  {sungakhUramshuulal ? null : (
                                    <DeleteOutlined
                                      className="text-xl !text-red-500"
                                      onClick={() => {
                                        remove(name);
                                      }}
                                    />
                                  )}
                                </div>
                              </Form.Item>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {sungakhUramshuulal ? null : (
                      <Form.Item className="flex justify-center">
                        <Button
                          className=" !w-[147px]"
                          type="primary"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}>
                          Нөхцөл нэмэх
                        </Button>
                      </Form.Item>
                    )}
                  </>
                )}
              </Form.List>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UramshuulalBurtgel;
