import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "components/ant/AntdButton";
import { Form, Switch, Card, Select, TreeSelect } from "antd";
import TooShirkhegInput, { Input, InputNumber } from "components/ant/AntdInput";
import useJagsaalt from "hooks/posUseJagsaalt";
import { useAuth } from "services/auth";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import useTogtmol from "hooks/togtmol";
import { EditOutlined } from "@ant-design/icons";
import dansniiTurul from "./dansniiTurul.json";
const searchKeys = ["kharagdakhUtga", "utga"];

function DansNemekhModal({ mutate, turul, zasahData }) {
  const { ajiltan, baiguullagiinId, baiguullaga, token, salbariinId } =
    useAuth();
  const [form] = Form.useForm();
  const [dansniiDugaarNemekhModal, setDansniiDugaarNemekModal] =
    useState(false);
  const [buleg, setBuleg] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryDansniiBuleg = useMemo(
    () => ({
      baiguullagiinId: baiguullagiinId,
    }),
    [baiguullagiinId]
  );

  const { data: dansniiBulegData, mutate: dansniiBulegMutate } = useJagsaalt(
    "/dansniiBuleg",
    queryDansniiBuleg
  );

  function bulegConvert(data) {
    return data.map((item) => ({
      value: item.ner,
      title: item.ner,
      key: item._id,
      disabled: item.dedBuleg.length > 0,
      children: item.dedBuleg.length > 0 ? bulegConvert(item.dedBuleg) : null,
    }));
  }
  useEffect(() => {
    if (!!dansniiBulegData) {
      var result = dansniiBulegData.jagsaalt.map((item) => ({
        value: item.ner,
        title: item.ner,
        key: item._id,
        disabled: item.dedBuleg.length > 0,
        children: item.dedBuleg.length > 0 ? bulegConvert(item.dedBuleg) : null,
      }));
      setBuleg(result);
    }
  }, [dansniiBulegData]);

  useEffect(() => {
    if (!!dansniiDugaarNemekhModal) {
      dansniiBulegMutate();
    }
  }, [dansniiDugaarNemekhModal]);

  const query = useMemo(
    () => ({
      turul: "Valyut",
    }),
    [dansniiDugaarNemekhModal]
  );

  const { togtmolGaralt: valyut, setTogtmolKhuudaslalt } = useTogtmol(
    token,
    query,
    undefined,
    searchKeys
  );

  function onFinish(data) {
    setLoading(true);
    const yavuulahData = {
      ...data,
      baiguullagiinId,
      burtgesenAjiltaniiNer: ajiltan?.ner,
      burtgesenAjiltan: ajiltan?._id,
      uldegdelTugrug: data?.uldegdel,
    };

    if (turul === "zasah") {
      posUilchilgee(token)
        .put(`/jurnalDans/${zasahData?._id}`, yavuulahData)
        .then((khariu) => {
          if (khariu.data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай засагдлаа.");
            mutate();
            setDansniiDugaarNemekModal(false);
            form.resetFields();
            setLoading(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setLoading(false);
        });
    } else {
      posUilchilgee(token)
        .post("/jurnalDansKhadgalya", yavuulahData)
        .then((khariu) => {
          if (khariu.data === "Amjilttai") {
            AmjilttaiAlert("Амжилттай бүртгэгдлээ.");
            mutate();
            setDansniiDugaarNemekModal(false);
            form.resetFields();
            setLoading(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setLoading(false);
        });
    }
    setLoading(false);
  }

  function handleCancel() {
    setDansniiDugaarNemekModal(false);
    form.resetFields();
  }
  return (
    <div>
      {turul === "zasah" ? (
        <a
          onClick={() => setDansniiDugaarNemekModal(true)}
          className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
          <EditOutlined style={{ fontSize: "18px" }} />
          <label>Засах</label>
        </a>
      ) : (
        <Button
          type={"primary"}
          className={"!text-[12px]"}
          onClick={() => setDansniiDugaarNemekModal(true)}>
          Нэмэх
        </Button>
      )}
      <Modal
        onCancel={handleCancel}
        zIndex={99}
        width={"1024px"}
        style={{ top: 0 }}
        okText="Бүртгэх"
        footer={
          <div>
            <Button
              loading={loading}
              onClick={() => loading === false && form.submit()}
              type={"primary"}>
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-bold ">Данс нэмэх</div>
        }
        open={dansniiDugaarNemekhModal}>
        <div className="h-[790px] w-full overflow-y-auto p-11 py-0">
          <div className="w-full">
            <Form
              // autoComplete={false}
              initialValues={zasahData}
              className="flex w-full flex-col items-center"
              form={form}
              onFinish={onFinish}>
              <div className="w-[90%]">
                <div className="flex justify-end">
                  <Form.Item
                    initialValue={zasahData?.uldegdelShalgakh}
                    style={{
                      width: "45%",
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                      margin: "0px",
                    }}
                    name={"uldegdelShalgakh"}
                    labelAlign="right"
                    label="Үлдэгдэл шалгах">
                    <Switch defaultChecked={zasahData?.uldegdelShalgakh} />
                  </Form.Item>
                </div>
                <div className="flex justify-between dark:text-gray-200">
                  <Form.Item
                    style={{ width: "45%" }}
                    rules={[
                      {
                        required: true,
                        message: "Дансны код бичнэ уу!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value.toString().length >= 2) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Дансны кодны урт 1-ээс их байх ёстой!")
                          );
                        },
                      }),
                    ]}
                    name={"code"}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    label="Дансны код">
                    <InputNumber placeholder="Дансны код" />
                  </Form.Item>
                  <Form.Item
                    style={{ width: "45%" }}
                    rules={[
                      {
                        required: true,
                        message: "Дансны нэр бичнэ уу!",
                      },
                    ]}
                    name={"ner"}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    label="Дансны нэр">
                    <Input placeholder="Дансны нэр" />
                  </Form.Item>
                </div>
                <div className="flex justify-between">
                  <Form.Item
                    style={{ width: "45%" }}
                    rules={[
                      {
                        required: true,
                        message: "Дансны бүлэг сонгоно уу!",
                      },
                    ]}
                    labelCol={{ span: 24 }}
                    name={"buleg"}
                    labelAlign="left"
                    label="Дансны бүлэг">
                    <TreeSelect
                      placeholder="Дансны бүлэг"
                      treeData={buleg}
                      className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                      treeDefaultExpandAll
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ width: "45%" }}
                    rules={[
                      {
                        required: true,
                        message: "Валют сонгоно уу!",
                      },
                    ]}
                    labelCol={{ span: 24 }}
                    name={"valyut"}
                    labelAlign="left"
                    label="Валют">
                    <Select
                      bordered={false}
                      placeholder="Валют"
                      className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                      showSearch
                      filterOption={(o) => o}
                      allowClear={true}
                      onSearch={(v) =>
                        setTogtmolKhuudaslalt((e) => ({
                          ...e,
                          khuudasniiDugaar: 1,
                          search: v,
                        }))
                      }>
                      {valyut?.jagsaalt?.map((mur) => {
                        return (
                          <Select.Option key={mur.utgaa}>
                            <div className={`flex justify-start `}>
                              {mur.utgaa}
                            </div>
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className="flex justify-between">
                  <Form.Item
                    style={{ width: "45%" }}
                    rules={[
                      {
                        required: true,
                        message: "Салбар сонгоно уу!",
                      },
                    ]}
                    allowClear
                    name={"salbariinId"}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    label="Салбар">
                    <Select
                      className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                      placeholder={"Салбар"}>
                      {baiguullaga?.salbaruud?.map((mur) => (
                        <Select.Option key={mur._id}>{mur.ner}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    style={{ width: "45%" }}
                    allowClear
                    name={"uldegdel"}
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    label="Эхний үлдэгдэл">
                    <InputNumber
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Эхний үлдэгдэл"
                    />
                  </Form.Item>
                </div>
              </div>
              <Card
                className=" w-full dark:bg-gray-800 dark:text-gray-200"
                bodyStyle={{
                  padding: "20px 0px 0px 0px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Тохиргоо"
                bordered={false}>
                <div className="w-[90%]">
                  <div className="flex justify-between dark:text-gray-200">
                    <Form.Item
                      style={{ width: "45%" }}
                      name={"tuslakh"}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="Туслах журнал">
                      <Select
                        className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:bg-gray-200"
                        placeholder={"Туслах журнал"}>
                        <Select.Option key="Касс">Касс</Select.Option>
                        <Select.Option key="Харилцах">Харилцах</Select.Option>
                        <Select.Option key="Өглөг">Өглөг</Select.Option>
                        <Select.Option key="Авлага">Авлага</Select.Option>
                        <Select.Option key="Бараа материал">
                          Бараа материал
                        </Select.Option>
                        <Select.Option key="Үндсэн хөрөнгө">
                          Үндсэн хөрөнгө
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      style={{ width: "45%" }}
                      name={"dansniiTurul"}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="Дансны төрөл">
                      <Select
                        showSearch
                        className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                        placeholder={"Дансны төрөл"}>
                        {dansniiTurul.turul.map((e) => {
                          return (
                            <Select.Option key={e?.key}>
                              {e?.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="flex justify-between">
                    <Form.Item
                      style={{ width: "45%" }}
                      rules={[
                        {
                          required: true,
                          message: "Дансны шинж сонгоно уу!",
                        },
                      ]}
                      name={"shinjChanar"}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="Дансны шинж">
                      <Select
                        className="overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                        placeholder={"Дансны шинж"}>
                        <Select.Option key="Актив">Актив</Select.Option>
                        <Select.Option key="Пассив">Пассив</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "45%" }}
                      name={["uzuulelt", "sankhuuBaidal"]}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="Санхүү байдлын тайлан">
                      <Input placeholder="Санхүү байдлын тайлан" />
                    </Form.Item>
                  </div>
                  <div className="flex justify-between">
                    <Form.Item
                      style={{ width: "45%" }}
                      name={["uzuulelt", "orlogo"]}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="Орлогын дэлгэрэнгүй тайлан">
                      <Input placeholder="Орлогын дэлгэрэнгүй тайлан" />
                    </Form.Item>
                    <Form.Item
                      style={{ width: "45%" }}
                      name={["uzuulelt", "aanoat"]}
                      labelAlign="left"
                      labelCol={{ span: 24 }}
                      label="ААНОАТ-н тайлан">
                      <Input placeholder="ААНОАТ-н тайлан" />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default DansNemekhModal;
