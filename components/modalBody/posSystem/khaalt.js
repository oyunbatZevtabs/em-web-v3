import { Button } from "antd";
import { Modal } from "components/ant/AntdModal";
import { Form } from "antd";
import {
  ActionContent,
  ItemColumnCentered,
} from "components/swipeableItem/styledComponents";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SwipeAction } from "react-swipeable-list";
import { ImPriceTags } from "react-icons/im";
import { DatePicker } from "components/ant/AntdDatePicker";
import { Input, InputNumber, TextArea } from "../antdInput";
import moment from "moment";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import formatNumber from "tools/function/formatNumber";
import KhaaltTuukh from "./khaaltiinTuukh";
import useKhaaltTuukh from "hooks/useKhaaltTuukh";
import useOrder from "tools/function/useOrder";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";

function Khaalt({
  isModalOpen,
  setIsModalOpen,
  setKhaalModal,
  baiguullagiinId,
  salbariinId,
  ajiltan,
  token,
  suuliinKhaaltOgnooAvyaMutate,
  suuliinKhaaltOgnooData,
  servereesAvsanUnuuduriinTsag,
}) {
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [niitDun, setNiitDun] = useState(0);

  const [form] = Form.useForm();

  const initialValues = {
    ognoo: moment(),
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        var tukhainFocustaiElement = document.activeElement;
        for (let i = 1; i <= 9; i++) {
          let tukhainLoopElement = document.getElementById(`input${i}`);
          if (tukhainFocustaiElement === tukhainLoopElement) {
            document.getElementById(`input${i + 1}`)?.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const onFinish = (data) => {
    const mungunTemdegtTusBurObject = data.mungunTemdegt.flatMap((item) =>
      Object.entries(item).map(([temdegt, too]) => ({
        temdegt: temdegt,
        too: parseInt(too),
      }))
    );

    const yavuulakhData = data;
    yavuulakhData.mungunTemdegt = mungunTemdegtTusBurObject;
    yavuulakhData.burtgesenAjiltan = ajiltan._id;
    yavuulakhData.burtgesenAjiltaniiNer = ajiltan.ner;
    yavuulakhData.baiguullagiinId = baiguullagiinId;
    yavuulakhData.salbariinId = salbariinId;
    yavuulakhData.niitDun = niitDun;
    yavuulakhData.turul = "pos";
    yavuulakhData.ognoo = moment(yavuulakhData.ognoo).startOf("day");

    const suuliinKhaaltOgnooMoment =
      suuliinKhaaltOgnooData &&
      moment(suuliinKhaaltOgnooData?.ognoo).startOf("day");
    const haalttaiUdur = moment(yavuulakhData.ognoo).startOf("day");

    if (haalttaiUdur.isSameOrBefore(suuliinKhaaltOgnooMoment)) {
      AnkhaaruulgaAlert("Хаалт хийсэн өдөр байна.");
    } else {
      posUilchilgee(token)
        .post("/khaalt", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            suuliinKhaaltOgnooAvyaMutate();
            khaaltTuukhiinMutate();
            AmjilttaiAlert("Амжилттай касс хаагдлаа.");
            setNiitDun();
            form.resetFields();
            setIsModalOpen(false);
          }
        })
        .catch((err) => aldaaBarigch(err));
    }
  };

  const khaaltQuery = useMemo(() => {
    let result = { salbariinId: salbariinId };

    return result;
  }, [salbariinId, isModalOpen]);

  const { khaaltTuukhiinGaralt, setKhuudaslalt, khaaltTuukhiinMutate } =
    useKhaaltTuukh(isModalOpen && token, 100, khaaltQuery, order);

  function handleCancel() {
    setIsModalOpen(false);
    setNiitDun();
    form.resetFields();
  }

  return (
    <>
      <div
        style={{ backgroundColor: "rgba(79, 209, 197, 0.2)" }}
        className={` flex  h-[45px] w-[120px] cursor-pointer items-center justify-center gap-1 rounded-[15px] border border-teal-400 px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 dark:text-gray-300 `}
        onClick={() => {
          setIsModalOpen(true);
        }}>
        <div className="truncate text-center font-medium">Хаалт [F8]</div>
      </div>
      <Modal
        width={"338px"}
        okText="Бүртгэх"
        footer={
          <div className="flex w-full justify-evenly">
            <Button
              onClick={() => handleCancel()}
              size="small"
              style={{ width: "156px" }}
              type="danger">
              Цуцлах [ESC]
            </Button>
            <Button
              size="small"
              onClick={() => form.submit()}
              style={{ width: "156px" }}
              type="primary">
              Хадгалах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">Хаалт</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex w-full flex-col  pb-0 ">
          <Form
            initialValues={initialValues}
            onValuesChange={(changedValues, allValues) => {
              let totalSum = 0;
              allValues?.mungunTemdegt?.forEach((item) => {
                Object.entries(item).forEach(([key, value]) => {
                  totalSum += parseInt(key || 0) * parseInt(value || 0);
                });
              });

              setNiitDun(totalSum);
            }}
            form={form}
            onFinish={onFinish}
            className="flex flex-col gap-2 dark:text-gray-300">
            <div className="flex ">
              <div className="flex w-full justify-between ">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Огноо оруулна уу",
                    },
                  ]}
                  className="!m-0"
                  name="ognoo">
                  <DatePicker
                    style={{
                      height: "28px",
                      width: "100%",
                      borderColor: "#4FD1C5",
                      borderRadius: "25px",
                      borderWidth: 1,
                    }}
                    placeholder={"Огноо"}
                    disabledDate={(current) => {
                      if (
                        suuliinKhaaltOgnooData &&
                        servereesAvsanUnuuduriinTsag
                      ) {
                        const suuliinKhaaltOgnooMoment = moment(
                          suuliinKhaaltOgnooData.ognoo
                        );
                        const servereesAvsanUnuuduriinTsagMoment = moment(
                          servereesAvsanUnuuduriinTsag
                        );

                        return (
                          current.isBefore(suuliinKhaaltOgnooMoment, "day") ||
                          current.isAfter(
                            servereesAvsanUnuuduriinTsagMoment,
                            "day"
                          )
                        );
                      }
                      return false;
                    }}
                  />
                </Form.Item>
              </div>
              <div className="">
                <KhaaltTuukh
                  suuliinKhaaltOgnooData={suuliinKhaaltOgnooData}
                  suuliinKhaaltOgnooAvyaMutate={suuliinKhaaltOgnooAvyaMutate}
                  tuukh={khaaltTuukhiinGaralt}
                  token={token}
                  khaaltTuukhiinMutate={khaaltTuukhiinMutate}
                  onChangeTable={onChangeTable}
                />
              </div>
            </div>

            <Form.List initialValue={[{}]} name="mungunTemdegt">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(
                      ({ key, name, fieldKey, ...restField }, index) => (
                        <div className="flex w-full flex-col gap-2">
                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              20,000₮
                            </div>

                            <div className="h-[30px] w-[50%]">
                              <Form.Item
                                key={"1"}
                                name={[name, "20000"]}
                                className="!m-0">
                                <InputNumber
                                  key={"1"}
                                  size="small"
                                  id={`input1`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              10,000₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                name={[name, "10000"]}>
                                <InputNumber
                                  key={"2"}
                                  size={"small"}
                                  id={`input2`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              5,000₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                name={[name, "5000"]}
                                key={key}>
                                <InputNumber
                                  key={"3"}
                                  size={"small"}
                                  id={`input3`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              1,000₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                name={[name, "1000"]}
                                key={key}>
                                <InputNumber
                                  key={"4"}
                                  size={"small"}
                                  id={`input4`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              500₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                {...restField}
                                name={[name, "500"]}
                                key={key}>
                                <InputNumber
                                  key={"5"}
                                  size={"small"}
                                  id={`input5`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              100₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                {...restField}
                                name={[name, "100"]}
                                key={key}>
                                <InputNumber
                                  key={"6"}
                                  size={"small"}
                                  id={`input6`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              50₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                {...restField}
                                name={[name, "50"]}
                                key={key}>
                                <InputNumber
                                  key={"7"}
                                  size={"small"}
                                  id={`input7`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              20₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                {...restField}
                                name={[name, "20"]}
                                key={key}>
                                <InputNumber
                                  key={"8"}
                                  size={"small"}
                                  id={`input8`}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <div className="flex w-[100%] items-baseline gap-3">
                            <div className="flex h-[30px] w-[50%] items-center justify-center rounded-xl border-[1px] border-green-400">
                              10₮
                            </div>

                            <div className="w-[50%] ">
                              <Form.Item
                                className="!m-0"
                                {...restField}
                                name={[name, "10"]}
                                key={key}>
                                <InputNumber
                                  key={"9"}
                                  size={"small"}
                                  id={`input9`}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </>
                );
              }}
            </Form.List>
            <div className="w-[]">
              <Form.Item name="tailbar" className="!m-0">
                <TextArea size={"small"} placeHolder="Тайлбар" />
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="dark:text-gray-300">
          Нийт дүн: {formatNumber(niitDun, 2)}₮
        </div>
      </Modal>
    </>
  );
}
export default Khaalt;
