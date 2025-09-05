import { Button, DatePicker, Select, Switch } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import { TextArea } from "components/ant/AntdInput";
import { Modal } from "components/ant/AntdModal";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Input } from "../antdInput";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import posUilchilgee, { aldaaBarigch } from "services/posUilchilgee";
import { useAuth } from "services/auth";
import useBaraa from "hooks/useBaraa";
import posUseJagsaalt from "hooks/posUseJagsaalt";

const order = { createdAt: -1 };
const searchKeys = ["angilal"];

function ToollogoEkhluulekhModal({
  salbariinId,
  baiguullagiinId,
  ekhelsenToollogoMutate,
  loading,
  setLoading,
}) {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ner, setNer] = useState("");
  const [khuleegdejBaina, setKhuleegdejBaina] = useState(false);
  const [turul, setTurul] = useState("Бүх бараа");
  const [songosonBaraa, setSongosonBaraa] = useState([]);
  const [songosonAngilal, setSongosonAngilal] = useState([]);
  const [uldegdelguiBaraaToolokh, setUldegdelguiBaraaToolokh] = useState(true);
  const [
    toolsonDeerUldegdelKharuulakhEsekh,
    setToolsonDeerUldegdelKharuulakhEsekh,
  ] = useState(true);

  function onChangeUldegdelguiBaraaToolokh(checked) {
    setUldegdelguiBaraaToolokh(checked);
  }

  function onChangeToolsonDeerUldegdelKharuulakh(checked) {
    setToolsonDeerUldegdelKharuulakhEsekh(checked);
  }

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
    searchKeys,
    undefined,
    true
  );

  const onChange = (value) => {
    setSongosonAngilal([]);
    setSongosonBaraa([]);
    setTurul(value);
  };

  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setSongosonAngilal([]);
    setSongosonBaraa([]);
    setTurul("Бүх бараа");
    setIsModalOpen(false);
  };

  const baraaQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
      salbariinId: salbariinId,
    };

    return query;
  }, [baiguullagiinId]);

  const { baraaGaralt, baraaMutate, setBaraaniiKhuudaslalt } = useBaraa(
    token,
    baiguullagiinId,
    undefined,
    baraaQuery,
    order
  );
  function onFinish() {
    if (!ner || ner.length <= 0) {
      return AnkhaaruulgaAlert("Нэр оруулаагүй байна");
    }
    setLoading(true);
    // setKhuleegdejBaina(true);
    var yavuulahData = {
      duusakhOgnoo: moment(ognoo[1]).format("YYYY.MM.DD 23:59:59"),
      ekhlekhOgnoo: moment(ognoo[0]).format("YYYY.MM.DD 00:00:00"),
      salbariinId: salbariinId,
      baiguullagiinId: baiguullagiinId,
      uldegdelteiBaraaToolohEsekh: uldegdelguiBaraaToolokh,
      toogKharuulakhEsekh: toolsonDeerUldegdelKharuulakhEsekh,
      turul,
      ner,
    };
    if (turul === "Бараа сонгох") {
      yavuulahData.baraanuud = songosonBaraa;
    } else if (turul === "Ангилал") {
      yavuulahData.angilaluud = songosonAngilal;
    }

    posUilchilgee(token)
      .post("/toololtEkhleye", yavuulahData, {
        timeout: 60 * 10 * 1000,
      })
      .then(({ data }) => {
        if (data.length > 0) {
          setLoading(false);
          ekhelsenToollogoMutate();
          setKhuleegdejBaina(false);
          setIsModalOpen(false);
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
        setLoading(false);
      });
  }

  return (
    <>
      <Button onClick={openModal} type="primary">
        Тооллого эхлүүлэх
      </Button>
      <Modal
        width={"738px"}
        okText="Эхлүүлэх"
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleCancel} style={{ width: "100px" }}>
              Гарах
            </Button>
            <Button
              onClick={() => khuleegdejBaina === false && onFinish()}
              style={{ width: "100px" }}
              type="primary">
              Эхлүүлэх
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="text-center text-[20px] font-semibold">
            Тооллого эхлүүлэх
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}>
        <div className="flex flex-col gap-2 dark:text-gray-300">
          <div className="flex w-full justify-end gap-2 ">
            <div>Үлдэгдэлгүй бараа тоолох</div>
            <Switch
              defaultChecked={uldegdelguiBaraaToolokh}
              onChange={onChangeUldegdelguiBaraaToolokh}
            />
          </div>
          <div className="flex w-full justify-end gap-2">
            <div>Тоолсон дээр үлдэгдэл харуулах эсэх</div>
            <Switch
              defaultChecked={toolsonDeerUldegdelKharuulakhEsekh}
              onChange={onChangeToolsonDeerUldegdelKharuulakh}
            />
          </div>
          <div className="flex w-full gap-2">
            <DatePicker.RangePicker
              locale={locale}
              value={ognoo}
              onChange={setOgnoo}
              className="!h-[36px] w-[50%] !rounded-md bg-white dark:text-gray-300"
            />
            <Select
              showSearch
              placeholder="Төрөл сонгох"
              value={turul}
              bordered={false}
              optionFilterProp="children"
              className="!h-[36px] w-[50%]  rounded-md border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300"
              onChange={onChange}
              options={[
                {
                  value: "Ангилал",
                  label: <div className="dark:text-gray-300">Ангилал</div>,
                },
                {
                  value: "Бараа сонгох",
                  label: <div className="dark:text-gray-300">Бараа сонгох</div>,
                },
                {
                  value: "Бүх бараа",
                  label: <div className="dark:text-gray-300">Бүх бараа</div>,
                },
              ]}
            />
          </div>
          {turul === "Бараа сонгох" && (
            <Select
              showSearch
              bordered={false}
              placeholder="Бараа сонгох"
              className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300 "
              allowClear
              mode="multiple"
              value={songosonBaraa}
              filterOption={(o) => o}
              onClear={() => {
                setBaraaniiKhuudaslalt({
                  khuudasniiDugaar: 1,
                  khuudasniiKhemjee: 50,
                  search: "",
                  jagsaalt: [],
                });
              }}
              onChange={(v) => {
                setSongosonBaraa(v);
                v === undefined &&
                  setBaraaniiKhuudaslalt((a) => ({ ...a, search: "" }));
              }}
              onSearch={(search) => {
                setBaraaniiKhuudaslalt((a) => ({ ...a, search }));
              }}
              // onSelect={() => {
              //   setTailanKhuudaslalt({
              //     khuudasniiDugaar: 1,
              //     khuudasniiKhemjee: 20,
              //   });
              // }}
            >
              {baraaGaralt?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur?.code} value={mur?.code}>
                    <div className="flex w-full justify-between dark:text-gray-300">
                      <div
                        className="flex w-1/2 flex-row truncate text-gray-600  dark:text-gray-300"
                        style={{ textOverflow: "ellipsis" }}>
                        {mur?.ner}
                      </div>
                      <div className="flex w-1/2 justify-end truncate font-semibold">
                        {mur?.id}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          )}
          {turul === "Ангилал" && (
            <Select
              showSearch
              value={songosonAngilal}
              className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white dark:text-gray-300"
              bordered={false}
              placeholder="Ангилал сонгох"
              onSearch={(search) => {
                setKhuudaslalt((a) => ({ ...a, search }));
              }}
              onChange={(v) => {
                setSongosonAngilal(v);
                v === undefined &&
                  setKhuudaslalt((a) => ({ ...a, search: "" }));
              }}
              mode="multiple"
              allowClear>
              {jagsaalt.map((option) => (
                <Option key={option._id} value={option.angilal}>
                  {option.angilal}
                </Option>
              ))}
            </Select>
          )}
          <Input
            onChange={(v) => setNer(v?.target?.value)}
            placeHolder={"Нэр"}
          />
        </div>
      </Modal>
    </>
  );
}

export default ToollogoEkhluulekhModal;
