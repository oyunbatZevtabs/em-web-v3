import { Button, Input, Form, Select } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useMemo, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { InputNumber } from "../antdInput";
import moment from "moment";
import useKhariltsagch from "hooks/useKhariltsagch";
import KhariltsagchNemekhModal from "../khariltsagch/khariltsagchNemekhModal";
import { PlusOutlined } from "@ant-design/icons";
import { startCase } from "lodash";

const searchKeys = ["ner", "ovog", "utas", "mail", "register"];
const order = { createdAt: -1 };

function ZeelModal({
  turulruuKhiikhDun,
  setTurulruuKhiikhDun,
  setTurul,
  turul,
  baiguullagiinId,
  setZeelModalOpen,
  zeelModalOpen,
  token,
}) {
  const [songogdsonNer, setSongogdsonNer] = useState();

  const [form] = Form.useForm();
  const khariltsagchQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullagiinId,
    };
    return query;
  }, [baiguullagiinId]);

  function handleCancel() {
    const updatedTurul = turul.map((item, index) => {
      if (index === 3) {
        const { id, ...updatedItem } = item;
        return { ...updatedItem, une: "" };
      }
      return item;
    });

    setTurul(updatedTurul);

    setZeelModalOpen(false);
    form.resetFields();
  }

  function avlagaKhadgalyaa(formdata) {
    setTurul((prevTurul) => [
      ...prevTurul.slice(0, 3),
      { ...prevTurul[3], khariltsagchiinId: formdata.khariltsagchiinId },
      ...prevTurul.slice(4),
    ]);
    setZeelModalOpen(false);
    form.resetFields();
  }

  const {
    khariltsagchiinGaralt,
    setKhuudaslalt,
    onSearch,
    khariltsagchMutate,
  } = useKhariltsagch(
    zeelModalOpen === true && token,
    100,
    khariltsagchQuery,
    order,
    searchKeys
  );

  return (
    <>
      <Modal
        zIndex={100}
        footer={[
          <div>
            <Button onClick={() => handleCancel(false)}>Хаах</Button>
            <Button onClick={() => form.submit()} type="primary">
              Хадгалах
            </Button>
          </div>,
        ]}
        width={"735px"}
        okText="Бүртгэх"
        cancelButtonProps={{ style: { display: "none" } }}
        title={<div className="font- text-center text-[20px]">Зээл</div>}
        open={zeelModalOpen}
        onCancel={handleCancel}
      >
        <div className="flex justify-center gap-2">
          <div className="w-[100%] ">
            <Form
              onFinish={avlagaKhadgalyaa}
              style={{
                justifyContent: "end",
                alignItems: "end",
                display: "flex",
                width: "100%",
              }}
              initialValues={{ turul: "Харилцагч" }}
              form={form}
            >
              <Form.Item
                style={{
                  width: "50%",
                }}
                rules={[
                  {
                    required: true,
                    message: "Харилцагч сонгоно уу!",
                  },
                ]}
                label="Харилцагч"
                name={"khariltsagchiinId"}
              >
                <Select
                  bordered={false}
                  className="rounded-[25px] border-[1px] border-[#4FD1C5] bg-white"
                  showSearch
                  filterOption={false}
                  onSearch={(v) =>
                    setKhuudaslalt((e) => ({
                      ...e,
                      khuudasniiDugaar: 1,
                      search: v,
                    }))
                  }
                  onChange={(v) => {
                    var ajiltan = khariltsagchiinGaralt?.jagsaalt?.find(
                      (a) => a._id === v
                    );
                    setSongogdsonNer(ajiltan);
                  }}
                  placeholder="Сонгох"
                >
                  {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
                    <Select.Option key={data?._id}>{data?.ner}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
          <div className="w-[40%]">
            <KhariltsagchNemekhModal
              mutate={khariltsagchMutate}
              ashiglajBaigaGazar={"zeelModal"}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
export default ZeelModal;
