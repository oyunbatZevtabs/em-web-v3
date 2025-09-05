import React, { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { handleClientScriptLoad } from "next/script";
import { Button, Modal } from "antd";
import { useAuth } from "services/auth";
import deleteMethod from "tools/function/crud/deleteMethod";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";

function UstgahdaaItgelteibainaModal({
  url,
  ustgahBaraaniiId,
  setUstgahBaraaniiId,
  mutate,
  baraaMutate,
  method,
}) {
  const { token } = useAuth();

  return (
    <Modal
      width={"438px"}
      okText="Бүртгэх"
      footer={false}
      header={false}
      cancelButtonProps={{ style: { display: "none" } }}
      title={
        <div className="text-center font-normal">
          Устгахдаа итгэлтэй байна уу?
        </div>
      }
      open={!!ustgahBaraaniiId}
      onCancel={() => setUstgahBaraaniiId()}>
      <div className="flex w-full justify-end gap-3">
        <Button type="default" onClick={() => setUstgahBaraaniiId()}>
          Үгүй
        </Button>
        <Button
          onClick={() => {
            deleteMethod(url, token, ustgahBaraaniiId).then(({ data }) => {
              if (data === "Amjilttai") {
                AmjilttaiAlert("Амжилттай устгагдлаа");
                setUstgahBaraaniiId();
                baraaMutate();
              }
            });
          }}
          type="primary">
          Тийм
        </Button>
      </div>
    </Modal>
  );
}
export default UstgahdaaItgelteibainaModal;
