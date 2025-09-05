import { Button, Input } from "antd";
import { Modal } from "components/ant/AntdModal";
import React, { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { InputNumber } from "../antdInput";
import moment from "moment";

function CartLoading({ cartAmjilttai, setCartAmjilttai }) {
  return (
    <>
      <Modal
        zIndex={9999}
        width={"538px"}
        okText={false}
        footer={
          <div className="flex w-full justify-end">
            <Button
              onClick={() => setCartAmjilttai(false)}
              style={{ width: "186px", height: "36px" }}
              type="primary">
              Цуцлах
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}
        title={false}
        open={cartAmjilttai}
        onCancel={() => setCartAmjilttai(false)}>
        <div className="flex flex-col items-center gap-2 dark:text-gray-300">
          Картаа уншуулна уу...
        </div>
      </Modal>
    </>
  );
}
export default CartLoading;
