import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { Form, DatePicker, Select, message, Button } from "antd";
import _ from "lodash";
import local from "antd/lib/date-picker/locale/mn_MN";
import { useState } from "react";
import useKhariltsagch from "hooks/useKhariltsagch";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { Modal } from "components/ant/AntdModal";
import TooShirkhegInput, {
  InputNumber,
  TextArea,
} from "components/ant/AntdInput";
import AsuulgaModal from "../asuulgaModal";
import formatNumber from "tools/function/formatNumber";
import posUilchilgee from "services/posUilchilgee";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
import { useReactToPrint } from "react-to-print";
import moment from "moment";

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];

const AvlagaKhaakhModal = ({ turul, token, mutate }) => {
  const [form] = Form.useForm();
  const { salbariinId } = useAuth();
  const [turulAvlag, setTurulAvlag] = useState();
  const [songogdsonNer, setSongogdsonNer] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [neelttei, setNeelttei] = useState(false);
  const printRef = useRef(null);
  const [khevlekhData, setKhevlekhData] = useState();

  const { baiguullaga, baiguullagiinId, ajiltan } = useAuth();

  useEffect(() => {
    const zarlagaValue = form.getFieldValue("zarlaga");

    if (
      typeof zarlagaValue !== "undefined" &&
      zarlagaValue !== null &&
      !isNaN(zarlagaValue)
    ) {
      setKhevlekhData({
        ...khevlekhData,
        zarlaga: songogdsonNer?.avlagaUldegdel,
      });

      form.setFieldValue("zarlaga", songogdsonNer?.avlagaUldegdel);
    }
  }, [songogdsonNer]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const tiim = () => {
    setModalOpen(false);
    setNeelttei(false);
    setSongogdsonNer();
    form.resetFields();
  };

  const khariltsagchQuery = useMemo(
    () => ({
      avlagaUldegdel: { $gt: 0 },
    }),
    [modalOpen]
  );

  const ugui = () => {
    setNeelttei(false);
  };

  function handleCancel() {
    let values = form.getFieldsValue();
    let { turul, ...turulguiValues } = values;

    if (turulguiValues && typeof turulguiValues === "object") {
      if (Object.values(turulguiValues).some((value) => value !== undefined)) {
        setNeelttei(true);
      } else {
        setModalOpen(false);
      }
    }
  }

  const { khariltsagchiinGaralt, setKhuudaslalt } = useKhariltsagch(
    token,
    100,
    khariltsagchQuery,
    undefined,
    searchKeys
  );

  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt } = useAjiltniiJagsaalt(
    turulAvlag === "Ажилтан" && token
  );

  function avlagaKhadgalyaa(formdata) {
    if (!songogdsonNer?.avlagaUldegdel) {
      return AnkhaaruulgaAlert("Авлага үүсээгүй байна");
    }
    const ilgeekhData = _.cloneDeep(formdata);
    ilgeekhData.salbariinId = salbariinId;
    ilgeekhData.khariltsagchiinNer = songogdsonNer?.ner;
    posUilchilgee(token)
      .post("/avlagaGuilgeeKhadgalya", ilgeekhData)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setSongogdsonNer();
          mutate();
          setModalOpen(false);
          setTurulAvlag();
          form.resetFields();
          AmjilttaiAlert("Амжилттай хадгалагдлаа");
        }
      })
      .catch(aldaaBarigch);
  }

  const handleValuesChange = (changedValues, allValues) => {
    setKhevlekhData(allValues);
  };

  return (
    <div>
      <Button
        className="w-full sm:w-32"
        onClick={() => setModalOpen(true)}
        type="primary">
        Хаах
      </Button>

      <Modal
        footer={false}
        onCancel={() => setNeelttei(false)}
        open={neelttei}
        className="flex min-w-[60%] items-center justify-center">
        <div>
          <AsuulgaModal ugui={ugui} tiim={tiim} type="ankhaar" />
        </div>
      </Modal>

      <Modal
        footer={[
          <div>
            <Button onClick={handleCancel}>Хаах</Button>
            <Button onClick={handlePrint}>Хэвлэх</Button>
            <Button onClick={() => form.submit()} type="primary">
              Хадгалах
            </Button>
          </div>,
        ]}
        width={"635px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={
          <div className="font- text-center text-[20px] ">Авлага хаах</div>
        }
        open={modalOpen}
        onCancel={handleCancel}>
        <div>
          <Form
            onValuesChange={handleValuesChange}
            initialValues={{
              turul: "Харилцагч",
            }}
            onFinish={avlagaKhadgalyaa}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            form={form}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Төрөл сонгоно уу!",
                },
              ]}
              label="Төрөл"
              name={"turul"}>
              <Select
                bordered={false}
                className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                placeholder="Сонгох"
                onChange={(v) => {
                  setTurulAvlag(v);
                  setSongogdsonNer();
                  form.setFieldValue("khariltsagchiinId", undefined);
                  form.setFieldValue("ajiltniiId", undefined);
                }}>
                {/* <Select.Option key={"Ажилтан"}>Ажилтан</Select.Option> */}
                <Select.Option key={"Харилцагч"}>Харилцагч</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Харилцагч сонгоно уу!",
                },
              ]}
              label="Харилцагч"
              name={"khariltsagchiinId"}>
              <Select
                bordered={false}
                className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                showSearch
                filterOption={false}
                onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
                onChange={(v) => {
                  var ajiltan = khariltsagchiinGaralt?.jagsaalt?.find(
                    (a) => a._id === v
                  );
                  setSongogdsonNer(ajiltan);
                }}
                placeholder="Сонгох">
                {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
                  <Select.Option key={data?._id} className="dark:text-gray-300">{data?.ner} </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* {turulAvlag === "Харилцагч" ? (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Харилцагч сонгоно уу!",
                  },
                ]}
                label="Харилцагч"
                name={"khariltsagchiinId"}>
                <Select
                  bordered={false}
                  className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  filterOption={false}
                  onSearch={(search) =>
                    setKhuudaslalt((a) => ({ ...a, search }))
                  }
                  onChange={(v) => {
                    var ajiltan = khariltsagchiinGaralt?.jagsaalt?.find(
                      (a) => a._id === v
                    );
                    setSongogdsonNer(ajiltan);
                  }}
                  placeholder="Сонгох">
                  {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
                    <Select.Option key={data?._id}>{data?.ner}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : turulAvlag === "Ажилтан" ? (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Ажилтан сонгоно уу!",
                  },
                ]}
                label="Ажилтан"
                name={"ajiltniiId"}>
                <Select
                  bordered={false}
                  className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  filterOption={false}
                  onSearch={(search) =>
                    setAjiltniiKhuudaslalt((a) => ({ ...a, search }))
                  }
                  onChange={(v) => {
                    var ajiltan = ajilchdiinGaralt?.jagsaalt?.find(
                      (a) => a._id === v
                    );
                    setSongogdsonNer(ajiltan);
                  }}
                  placeholder="Сонгох">
                  {ajilchdiinGaralt?.jagsaalt?.map((data, index) => (
                    <Select.Option key={data?._id}>{data?.ner}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item label="Ажилтан/Харилцагч">
                <Select
                  bordered={false}
                  className="rounded-[25px] border-[1px] bg-white"
                  disabled
                  placeholder="Төрөл сонгоно уу!">
                  <Select.Option key={"Харилцагч"}>Харилцагч</Select.Option>
                </Select>
              </Form.Item>
            )} */}
            {songogdsonNer && (
              <div className="-mt-2 flex gap-3 border-t py-2 pl-16 font-medium dark:text-gray-300">
                Авлагын үлдэгдэл:{" "}
                <div>
                  {formatNumber(songogdsonNer?.avlagaUldegdel, 2) || 0}₮
                </div>
              </div>
            )}

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Хаах дүн оруулна уу!",
                },
              ]}
              label="Хаах дүн"
              name={"zarlaga"}>
              <TooShirkhegInput
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // value={uglug}
                onDoubleClick={() => {
                  setKhevlekhData({
                    ...khevlekhData,
                    zarlaga: songogdsonNer?.avlagaUldegdel,
                  });
                  form.setFieldValue("zarlaga", songogdsonNer?.avlagaUldegdel);
                }}
                max={songogdsonNer?.avlagaUldegdel}
                placeholder="Дүн оруулна уу"
                min={0}
              />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Тайлбар бичнэ үү!",
                },
              ]}
              label="Тайлбар"
              name={"tailbar"}>
              <TextArea placeholder="Тайлбар бичих..." />
            </Form.Item>
          </Form>
        </div>

        <div className="hidden">
          <div className="m-5" ref={printRef}>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex w-full justify-center">
                <div className="font-semibold">Авлагын баримт</div>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border bg-gray-300 text-black">
                  <td className="border text-center text-mashJijigiinJijig">
                    Огноо
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Харилцагч
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Тайлбар
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Хаасан дүн
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    Төлсөн огноо
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border text-center text-mashJijigiinJijig">
                    {moment(songogdsonNer?.createdAt).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </td>
                  <td className="border text-mashJijigiinJijig">
                    {songogdsonNer?.ner}
                  </td>
                  <td className="border text-mashJijigiinJijig">
                    {khevlekhData?.tailbar}
                  </td>
                  <td className="border text-end text-mashJijigiinJijig">
                    {formatNumber(khevlekhData?.zarlaga, 2)}
                  </td>
                  <td className="border text-center text-mashJijigiinJijig">
                    {moment().format("YYYY-MM-DD HH:mm")}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="ml-4 mt-4 flex items-center justify-center">
              <tfoot>
                <tr>
                  <td colSpan="3"></td>
                  <td colSpan="3" className="text-center">
                    Хаасан ажилтан:
                  </td>
                  <td> .........................</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AvlagaKhaakhModal;
