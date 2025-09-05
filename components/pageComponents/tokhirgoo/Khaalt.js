import React, { useEffect, useState } from "react";
import { Button, Form, Switch, message } from "antd";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AldaaAlert from "components/alert/AldaaAlert";
import { Input, InputNumber } from "components/ant/AntdInput";
import { PercentageOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";

function Khaalt({ ajiltan, token, baiguullagiinId, baiguullagaMutate }) {
  const [form] = Form.useForm();
  const { baiguullaga } = useAuth();
  const [khaaltAshiglakhEsekh, setKhaaltAshiglakhEsekh] = useState(
    baiguullaga?.tokhirgoo?.khaaltAshiglakhEsekh || false
  );

  function khadgalakh() {
    const yavuulakhData = {
      tokhirgoo: {
        khaaltAshiglakhEsekh: khaaltAshiglakhEsekh,
      },
    };
    uilchilgee(token)
      .post("/tokhirgooOruulya", yavuulakhData)
      .then(({ data, status }) => {
        if (status === 200 && data === "Amjilttai") {
          baiguullagaMutate();
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
            Хаалт
          </h2>
        </div>
        <div className="flex w-full">
          <Form form={form} onFinish={khadgalakh} className="w-full">
            <div className="grid w-full grid-cols-12 gap-x-5">
              <div className="col-span-12 md:col-span-4">
                <div className="m-5 mt-5 dark:text-gray-300">
                  <Form.Item
                    style={{ width: "100%" }}
                    className="!mb-0"
                    label={
                      <div className="flex flex-wrap items-center gap-2 dark:text-gray-300">
                        <span>Хаалт ашиглах эсэх :</span>
                      </div>
                    }
                    name="KhaaltAshiglakhEsekh"
                    colon={false}
                  >
                    <Switch
                      checked={khaaltAshiglakhEsekh}
                      onChange={(v) => setKhaaltAshiglakhEsekh(v)}
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

export default Khaalt;
