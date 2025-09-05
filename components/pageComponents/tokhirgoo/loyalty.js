import React, { useEffect, useState } from "react";
import { Button, Form, Switch, message } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
// import posUilchilgee from "services/posUilchilgee";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import { Input, InputNumber } from "components/ant/AntdInput";
import { PercentageOutlined } from "@ant-design/icons";

function Loyalty({ ajiltan, token, baiguullagiinId }) {
  const [form] = Form.useForm();
  const [ashiglakhEsekh, setAshiglakhEsekh] = useState(false);

  useEffect(() => {
    uilchilgee(token)
      .post("/loyaltyErkhAvya", { baiguullagiinId: baiguullagiinId })
      .then(({ data }) => {
        form.setFieldsValue({
          ashiglakhEsekh: data?.tokhirgoo?.loyalty?.ashiglakhEsekh,
          khunglukhKhuvi: data?.tokhirgoo?.loyalty?.khunglukhKhuvi,
        });
        setAshiglakhEsekh(data?.tokhirgoo?.loyalty?.ashiglakhEsekh);
      })
      .catch((e) => aldaaBarigch(e));
  }, []);
  function khadgalakh(values) {
    const data = values;
    data.id = baiguullagiinId;
    uilchilgee(token)
      .post("/loyaltyErkhOruulyaa", data)
      .then(({ data, status }) => {
        if (status === 200 && data === "Amjilttai") {
          AmjilttaiAlert("Амжилттай хадгаллаа");
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-8">
      <div className="intro-y box lg:mt-5">
        <div className=" flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-50 ">
            Бонус
          </h2>
        </div>
        <div className="flex w-[100%] ">
          <Form form={form} onFinish={khadgalakh}>
            <div className="grid w-[100%] grid-cols-12 gap-x-5 ">
              <div className="col-span-6">
                <div className="ml-5 mt-3 dark:text-gray-300 ">
                  <Form.Item
                    labelCol={{ span: 15 }}
                    style={{ width: "100%" }}
                    labelAlign="left"
                    label={
                      <div className="dark:text-gray-300">
                        Бонус ашиглах эсэх
                      </div>
                    }
                    name={"ashiglakhEsekh"}
                  >
                    <Switch
                      checked={ashiglakhEsekh}
                      onChange={(v) => setAshiglakhEsekh(v)}
                    />
                  </Form.Item>
                </div>
                <div className="ml-5 ">
                  <Form.Item
                    labelAlign="left"
                    labelCol={{ span: 15 }}
                    style={{ width: "100%" }}
                    normalize={(input) => {
                      var too = input.replace(/[^0-9]/g, "").slice(0, 3);
                      if (Number(too) > 100) {
                        too = "100";
                      }
                      return too;
                    }}
                    label={
                      <div className="dark:text-gray-300">
                        Гүйлгээний дүнгээс цуглуулах онооны хувь
                      </div>
                    }
                    name={"khunglukhKhuvi"}
                  >
                    <Input
                      suffix={<PercentageOutlined />}
                      disabled={!ashiglakhEsekh}
                      style={{
                        height: "2rem",
                        borderColor: "#4FD1C5",
                        borderRadius: "25px",
                        borderWidth: 1,
                      }}
                      placeholder="Хөнгөлөх хувь"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            className="btn btn-primary m-4"
            onClick={() => form.submit()}
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Loyalty;
