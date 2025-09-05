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

function Khymdral({ mutate, sungakhUramshuulal, setSungakhUramshuulal }) {
  const [form] = Form.useForm();

  const { token, baiguullagiinId, salbariinId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ner, setNer] = useState("");
  const [songojAvsanBaraa, setSongojAvsanBaraa] = useState();
  const [turul, setTurul] = useState("dun");

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

  const handleCancel = () => {
    setTurul();
    setIsModalOpen(false);
    setSungakhUramshuulal();
    setNer("");
  };

  function khunglukhTurul(e) {
    setTurul(e);
  }

  function baraaSongokh(e) {
    setSongojAvsanBaraa(e);
  }

  const validateForm = () => {
    const belegValues = form.getFieldsValue().uramshuulaliinBeleg;

    if (nukhtsulValues?.length > 0 && belegValues.length > 0) {
      let hasErrors = false;
      const belegErrors = {};
      const belegTooErrors = {};

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
        Хямдрал нэмэх
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
            Хямдрал бүртгэл
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className=" w-full">
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
          <div className=" flex w-full justify-end gap-4 pt-5">
            <div className="flex w-[49%] flex-col gap-2 ">
              <div className="ml-9 flex w-full items-center gap-3">
                <div className="w-[105px]">Бараа сонгох: </div>
                <Select
                  bordered={false}
                  placeholder="Бараа сонгох"
                  className="w-[250px] overflow-hidden rounded-[25px]  border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  onChange={(v) => baraaSongokh(v)}
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
                  }>
                  {baraaGaralt?.jagsaalt?.map((mur) => {
                    return (
                      <Select.Option key={mur._id}>
                        <div className={`flex justify-start`}>
                          <div className="font-bold">{mur.id}</div>-{mur.code}-
                          {mur.ner}-{mur.uldegdel ? mur.uldegdel : 0}-
                          {mur.barCode ? mur.barCode : 0}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="ml-9 flex w-full items-center gap-3">
                <div className="w-[105px]">Хөнгөлөх төрөл: </div>
                <Select
                  value={turul}
                  options={[
                    {
                      value: "huwi",
                      label: "Хувь",
                    },
                    {
                      value: "dun",
                      label: "Дүн",
                    },
                  ]}
                  bordered={false}
                  placeholder="Хөнгөлөх төрөл"
                  className="w-[250px] overflow-hidden rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  onChange={(e) => khunglukhTurul(e)}
                  onSearch={(v) =>
                    setBaraaniiKhuudaslalt((e) => ({
                      ...e,
                      khuudasniiDugaar: 1,
                      search: v,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex w-[49%] flex-col gap-2">
              {turul === "dun" ? (
                <div className="flex w-full items-center justify-start gap-3">
                  <div className="w-[100px]">Хөнгөлөх дүн: </div>
                  <Input
                    className={"!w-[250px]"}
                    placeHolder={"Хөнгөлөх дүн"}
                  />
                </div>
              ) : turul === "huwi" ? (
                <div className="flex w-full items-center justify-start gap-3">
                  <div className="w-[100px]">Хөнгөлөх хувь: </div>
                  <Input
                    className={"!w-[250px]"}
                    placeHolder={"Хөнгөлөх хувь"}
                  />
                </div>
              ) : (
                ""
              )}
              <div></div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Khymdral;
